import { Server, Room, WebSocketTransport, createEndpoint, createRouter } from 'colyseus';
import express from 'express';
import { readFile } from 'fs/promises';
import { createServer } from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const PORT = Number(process.env.PORT) || 2567;
const ROOM_NAME = 'pong';
const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = join(__dirname, '../..');

const CANVAS_WIDTH = 800;
const PLAY_TOP = 20;
const PLAY_HEIGHT = 600;
const PLAY_BOTTOM = PLAY_TOP + PLAY_HEIGHT - 30;

const PADDLE_WIDTH = 6;
const PADDLE_HEIGHT = 60;
const PADDLE_SPEED = 500;
const PADDLE_OFFSET = 40;
const PADDLE_GROW_PX = 20;
const PADDLE_SHRINK_PX = 20;
const PADDLE_MIN_HEIGHT = 10;
const PADDLE_MAX_HEIGHT = 200;

const BALL_SIZE = 6;
const BALL_BASE_SPEED = 200;
const BALL_SPEED_INCREASE = 20;
const BALL_SPEED_CAP = 400;
const BALL_SMASH_TINT = '#ff2200';
const BALL_NORMAL_TINT = '#ffffff';
const SERVE_ANGLE_MAX = 30;
const DEFLECT_ANGLE_MAX = 60;
const SMASH_WINDOW_MS = 300;
const SMASH_SPEED_MULT = 1.5;

const MANA_FILL_TIME_MS = 10000;
const MANA_MAX = 100;
const MANA_COST = 50;
const MANA_SMASH_BONUS = 0.1;
const BURST_COST = 100;
const BURST_SPEED_MULT = 2.0;
const BURST_TINT = '#ffff00';
const COMBO_TIMEOUT_MS = 600;

const SCORE_TO_WIN = 7;
const READY_START_DELAY_MS = 300;
const NET_TICK_RATE = 120;
const NET_STATE_SEND_RATE = 120;

class PongRoom extends Room {
    maxClients = 2;

    onCreate() {
        this.clientsByPlayer = new Map();
        this.inputs = { left: 0, right: 0 };
        this.comboBufferLeft = [];
        this.comboBufferRight = [];
        this.comboTimerLeft = 0;
        this.comboTimerRight = 0;
        this.smashLeftAt = -Infinity;
        this.smashRightAt = -Infinity;
        this.readyStartQueued = false;
        this.gameState = this.createInitialState();

        this.onMessage('input', (client, message) => {
            const side = this.getClientSide(client);
            if (side) this.inputs[side] = this.normalizeInput(message.dir);
        });
        this.onMessage('ready', (client) => this.handleReady(client));
        this.onMessage('combo', (client, message) => this.handleCombo(client, message.dir));
        this.onMessage('smash', (client) => this.handleSmash(client));
        this.onMessage('ping', (client, message) => {
            client.send('pong', { sentAt: message.sentAt });
        });

        this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / NET_TICK_RATE);
        this.clock.setInterval(() => this.broadcastState(), 1000 / NET_STATE_SEND_RATE);
    }

    onJoin(client) {
        const playerNumber = this.assignPlayerNumber();
        this.clientsByPlayer.set(client.sessionId, playerNumber);
        client.send('assignment', { playerNumber });
        this.broadcastState();
    }

    onLeave(client) {
        const side = this.getClientSide(client);
        if (side) this.inputs[side] = 0;
        this.clientsByPlayer.delete(client.sessionId);
        this.broadcastState();
    }

    assignPlayerNumber() {
        const assigned = new Set(this.clientsByPlayer.values());
        return assigned.has(1) ? 2 : 1;
    }

    getClientSide(client) {
        const playerNumber = this.clientsByPlayer.get(client.sessionId);
        if (playerNumber === 1) return 'left';
        if (playerNumber === 2) return 'right';
        return null;
    }

    createInitialState() {
        return {
            paddles: {
                left: { y: PLAY_TOP + PLAY_HEIGHT / 2, height: PADDLE_HEIGHT },
                right: { y: PLAY_TOP + PLAY_HEIGHT / 2, height: PADDLE_HEIGHT },
            },
            ball: {
                x: CANVAS_WIDTH / 2,
                y: PLAY_TOP + PLAY_HEIGHT / 2,
                vx: 0,
                vy: 0,
                speed: BALL_BASE_SPEED,
                tint: BALL_NORMAL_TINT,
            },
            mana: { left: 0, right: 0 },
            score: { left: 0, right: 0 },
            ready: { left: false, right: false },
            matchStarted: false,
            gameOver: false,
            message: '',
            burstActive: false,
            smashTintActive: false,
        };
    }

    handleReady(client) {
        if (this.gameState.matchStarted || this.gameState.gameOver) return;

        const side = this.getClientSide(client);
        if (!side) return;

        this.gameState.ready[side] = true;
        if (this.gameState.ready.left && this.gameState.ready.right && !this.readyStartQueued) {
            this.readyStartQueued = true;
            this.clock.setTimeout(() => {
                this.gameState.matchStarted = true;
                this.launchBall();
            }, READY_START_DELAY_MS);
        }
    }

    handleSmash(client) {
        const side = this.getClientSide(client);
        if (!side || !this.gameState.matchStarted || this.gameState.gameOver) return;

        if (side === 'left') this.smashLeftAt = this.clock.currentTime;
        else this.smashRightAt = this.clock.currentTime;
    }

    handleCombo(client, dir) {
        const side = this.getClientSide(client);
        if (!side || !this.gameState.matchStarted || this.gameState.gameOver) return;

        const buf = side === 'left' ? this.comboBufferLeft : this.comboBufferRight;
        buf.push(dir);
        if (buf.length > 4) buf.shift();

        if (side === 'left') this.comboTimerLeft = this.clock.currentTime;
        else this.comboTimerRight = this.clock.currentTime;

        this.checkCombo(side);
    }

    checkCombo(side) {
        const buf = side === 'left' ? this.comboBufferLeft : this.comboBufferRight;
        const combos = this.getCombos(side);
        const matchingCombos = combos.filter((combo) => buf.every((v, i) => v === combo.seq[i]));
        if (matchingCombos.length === 0) {
            buf.length = 0;
            return;
        }

        const exactCombo = matchingCombos.find((combo) => buf.length === combo.seq.length);
        if (!exactCombo) return;

        const mana = this.gameState.mana[side];
        if (mana >= exactCombo.cost) {
            this.executeStratagem(side, exactCombo.name, exactCombo.cost);
        }
        buf.length = 0;
    }

    getCombos(side) {
        return side === 'left' ? [
            { name: 'GROW ', seq: ['LEFT', 'UP', 'LEFT', 'DOWN'], cost: MANA_COST },
            { name: 'SHRINK', seq: ['RIGHT', 'UP', 'RIGHT', 'DOWN'], cost: MANA_COST },
            { name: 'BURST', seq: ['RIGHT', 'RIGHT', 'RIGHT', 'RIGHT'], cost: BURST_COST },
        ] : [
            { name: 'GROW ', seq: ['RIGHT', 'UP', 'RIGHT', 'DOWN'], cost: MANA_COST },
            { name: 'SHRINK', seq: ['LEFT', 'UP', 'LEFT', 'DOWN'], cost: MANA_COST },
            { name: 'BURST', seq: ['LEFT', 'LEFT', 'LEFT', 'LEFT'], cost: BURST_COST },
        ];
    }

    executeStratagem(side, name, cost) {
        this.gameState.mana[side] = Math.max(0, this.gameState.mana[side] - cost);

        if (name === 'GROW ') {
            const paddle = this.gameState.paddles[side];
            paddle.height = Math.min(PADDLE_MAX_HEIGHT, paddle.height + PADDLE_GROW_PX);
            this.clampPaddle(side);
        } else if (name === 'SHRINK') {
            const target = side === 'left' ? 'right' : 'left';
            const paddle = this.gameState.paddles[target];
            paddle.height = Math.max(PADDLE_MIN_HEIGHT, paddle.height - PADDLE_SHRINK_PX);
            this.clampPaddle(target);
        } else if (name === 'BURST') {
            this.gameState.ball.speed *= BURST_SPEED_MULT;
            this.gameState.ball.vx *= BURST_SPEED_MULT;
            this.gameState.ball.vy *= BURST_SPEED_MULT;
            this.gameState.burstActive = true;
            if (!this.gameState.smashTintActive) this.gameState.ball.tint = BURST_TINT;
        }
    }

    update(deltaTime) {
        if (this.gameState.gameOver || !this.gameState.matchStarted) return;

        const dt = deltaTime / 1000;
        this.expireCombos();
        this.movePaddles(dt);
        this.accrueMana(deltaTime);
        const prevBallX = this.gameState.ball.x;
        const prevBallY = this.gameState.ball.y;
        this.moveBall(dt);
        this.checkWallBounce();
        this.checkPaddleCollision('left', prevBallX, prevBallY);
        this.checkPaddleCollision('right', prevBallX, prevBallY);
        this.checkScore();
    }

    expireCombos() {
        const now = this.clock.currentTime;
        if (this.comboBufferLeft.length > 0 && now - this.comboTimerLeft > COMBO_TIMEOUT_MS) this.comboBufferLeft.length = 0;
        if (this.comboBufferRight.length > 0 && now - this.comboTimerRight > COMBO_TIMEOUT_MS) this.comboBufferRight.length = 0;
    }

    movePaddles(dt) {
        this.gameState.paddles.left.y += this.inputs.left * PADDLE_SPEED * dt;
        this.gameState.paddles.right.y += this.inputs.right * PADDLE_SPEED * dt;
        this.clampPaddle('left');
        this.clampPaddle('right');
    }

    clampPaddle(side) {
        const paddle = this.gameState.paddles[side];
        const half = paddle.height / 2;
        paddle.y = this.clamp(paddle.y, PLAY_TOP + half, PLAY_BOTTOM - half);
    }

    accrueMana(deltaTime) {
        const manaPerMs = MANA_MAX / MANA_FILL_TIME_MS;
        this.gameState.mana.left = Math.min(MANA_MAX, this.gameState.mana.left + manaPerMs * deltaTime);
        this.gameState.mana.right = Math.min(MANA_MAX, this.gameState.mana.right + manaPerMs * deltaTime);
    }

    moveBall(dt) {
        this.gameState.ball.x += this.gameState.ball.vx * dt;
        this.gameState.ball.y += this.gameState.ball.vy * dt;
    }

    checkWallBounce() {
        const half = BALL_SIZE / 2;
        if (this.gameState.ball.y - half <= PLAY_TOP) {
            this.gameState.ball.y = PLAY_TOP + half;
            this.gameState.ball.vy = Math.abs(this.gameState.ball.vy);
        } else if (this.gameState.ball.y + half >= PLAY_BOTTOM) {
            this.gameState.ball.y = PLAY_BOTTOM - half;
            this.gameState.ball.vy = -Math.abs(this.gameState.ball.vy);
        }
    }

    checkPaddleCollision(side, prevBallX, prevBallY) {
        const paddle = this.gameState.paddles[side];
        const ball = this.gameState.ball;
        const isLeft = side === 'left';
        const deflectDir = isLeft ? 1 : -1;
        const half = BALL_SIZE / 2;
        const halfPW = PADDLE_WIDTH / 2;
        const halfPH = paddle.height / 2;
        const paddleX = isLeft ? PADDLE_OFFSET : CANVAS_WIDTH - PADDLE_OFFSET;

        if (deflectDir === 1 && ball.vx > 0) return;
        if (deflectDir === -1 && ball.vx < 0) return;

        const overlapping =
            ball.x - half < paddleX + halfPW &&
            ball.x + half > paddleX - halfPW &&
            ball.y - half < paddle.y + halfPH &&
            ball.y + half > paddle.y - halfPH;

        const faceX = paddleX + deflectDir * halfPW;
        const prevEdgeX = prevBallX - deflectDir * half;
        const currEdgeX = ball.x - deflectDir * half;
        const crossedFace = deflectDir === 1
            ? prevEdgeX >= faceX && currEdgeX <= faceX
            : prevEdgeX <= faceX && currEdgeX >= faceX;

        let sweptY = ball.y;
        if (crossedFace && currEdgeX !== prevEdgeX) {
            const t = (faceX - prevEdgeX) / (currEdgeX - prevEdgeX);
            sweptY = prevBallY + (ball.y - prevBallY) * t;
        }

        const sweptOverlapsY = sweptY + half >= paddle.y - halfPH && sweptY - half <= paddle.y + halfPH;
        if (!overlapping && !(crossedFace && sweptOverlapsY)) return;
        if (!overlapping) ball.y = sweptY;

        ball.speed = Math.min(ball.speed + BALL_SPEED_INCREASE, BALL_SPEED_CAP);

        const wasSmash = this.clock.currentTime - (isLeft ? this.smashLeftAt : this.smashRightAt) <= SMASH_WINDOW_MS;
        if (wasSmash) {
            ball.speed *= SMASH_SPEED_MULT;
            this.gameState.mana[side] = Math.min(MANA_MAX, this.gameState.mana[side] + MANA_MAX * MANA_SMASH_BONUS);
            if (isLeft) this.smashLeftAt = -Infinity;
            else this.smashRightAt = -Infinity;
            this.gameState.smashTintActive = true;
            ball.tint = BALL_SMASH_TINT;
        } else if (this.gameState.smashTintActive) {
            this.gameState.smashTintActive = false;
            ball.tint = this.gameState.burstActive ? BURST_TINT : BALL_NORMAL_TINT;
        }

        const hitOffset = (ball.y - paddle.y) / halfPH;
        const angleRad = this.degreesToRadians(hitOffset * DEFLECT_ANGLE_MAX);
        ball.vx = Math.cos(angleRad) * ball.speed * deflectDir;
        ball.vy = Math.sin(angleRad) * ball.speed;
        ball.x = isLeft
            ? paddleX + halfPW + half + 1
            : paddleX - halfPW - half - 1;
    }

    checkScore() {
        if (this.gameState.ball.x < 0) {
            this.gameState.score.right += 1;
            if (!this.checkWin()) this.launchBall();
        } else if (this.gameState.ball.x > CANVAS_WIDTH) {
            this.gameState.score.left += 1;
            if (!this.checkWin()) this.launchBall();
        }
    }

    checkWin() {
        if (this.gameState.score.left >= SCORE_TO_WIN) {
            this.endGame('Left player wins!');
            return true;
        }
        if (this.gameState.score.right >= SCORE_TO_WIN) {
            this.endGame('Right player wins!');
            return true;
        }
        return false;
    }

    endGame(message) {
        this.gameState.gameOver = true;
        this.gameState.ball.vx = 0;
        this.gameState.ball.vy = 0;
        this.gameState.message = message + '\n\nRefresh to play again';
    }

    launchBall() {
        this.gameState.paddles.left.height = PADDLE_HEIGHT;
        this.gameState.paddles.right.height = PADDLE_HEIGHT;
        this.clampPaddle('left');
        this.clampPaddle('right');
        this.gameState.ball.x = CANVAS_WIDTH / 2;
        this.gameState.ball.y = PLAY_TOP + PLAY_HEIGHT / 2;
        this.gameState.ball.speed = BALL_BASE_SPEED;
        this.gameState.burstActive = false;
        this.gameState.smashTintActive = false;
        this.gameState.ball.tint = BALL_NORMAL_TINT;

        const angleRad = this.degreesToRadians(this.randomBetween(-SERVE_ANGLE_MAX, SERVE_ANGLE_MAX));
        const direction = Math.random() < 0.5 ? 1 : -1;
        this.gameState.ball.vx = Math.cos(angleRad) * this.gameState.ball.speed * direction;
        this.gameState.ball.vy = Math.sin(angleRad) * this.gameState.ball.speed;
    }

    broadcastState() {
        this.broadcast('state', {
            roomId: this.roomId,
            players: { connected: this.clientsByPlayer.size },
            paddles: {
                left: { y: this.round(this.gameState.paddles.left.y), height: this.gameState.paddles.left.height },
                right: { y: this.round(this.gameState.paddles.right.y), height: this.gameState.paddles.right.height },
            },
            ball: {
                x: this.round(this.gameState.ball.x),
                y: this.round(this.gameState.ball.y),
                tint: this.gameState.ball.tint,
            },
            mana: {
                left: this.round(this.gameState.mana.left),
                right: this.round(this.gameState.mana.right),
            },
            score: this.gameState.score,
            ready: this.gameState.ready,
            matchStarted: this.gameState.matchStarted,
            gameOver: this.gameState.gameOver,
            message: this.gameState.message,
        });
    }

    normalizeInput(value) {
        if (value < 0) return -1;
        if (value > 0) return 1;
        return 0;
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    round(value) {
        return Math.round(value * 100) / 100;
    }
}

const httpServer = createServer();

const gameServer = new Server({
    transport: new WebSocketTransport({ server: httpServer }),
    express: (app) => {
        app.get('/', (req, res) => {
            res.sendFile(join(CLIENT_DIR, 'index.html'));
        });
        app.use(express.static(CLIENT_DIR));
    },
});
gameServer.define(ROOM_NAME, PongRoom);
gameServer.router = createRouter({
    root: createEndpoint('/', { method: 'GET' }, async () => {
        const html = await readFile(join(CLIENT_DIR, 'index.html'), 'utf8');
        return new Response(html, {
            headers: { 'content-type': 'text/html; charset=utf-8' },
        });
    }),
});
gameServer.listen(PORT);

console.log(`1972 Pong server listening on port ${PORT}`);
