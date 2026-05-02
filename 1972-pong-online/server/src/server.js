import { Server, Room } from 'colyseus';

const PORT = 2567;
const ROOM_NAME = 'pong';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 900;
const PLAY_TOP = 10;
const PLAY_HEIGHT = 600;
const PLAY_BOTTOM = PLAY_TOP + PLAY_HEIGHT;

const PADDLE_WIDTH = 6;
const PADDLE_HEIGHT = 60;
const PADDLE_SPEED = 500;
const PADDLE_OFFSET = 40;

const BALL_SIZE = 6;
const BALL_SPEED = 200;
const BALL_SPEED_INCREASE = 20;
const BALL_SPEED_CAP = 400;
const DEFLECT_ANGLE_MAX = 60;
const TICK_RATE = 60;
const STATE_SEND_RATE = 30;
const SCORE_TO_WIN = 7;

const ROOM_STATUS_X = CANVAS_WIDTH / 2;
const ROOM_STATUS_Y = PLAY_BOTTOM + 110;

class PongRoom extends Room {
    maxClients = 2;

    onCreate() {
        this.clientsByPlayer = new Map();
        this.inputs = {
            left: 0,
            right: 0,
        };
        this.gameState = this.createInitialState();

        this.onMessage('input', (client, message) => {
            const playerNumber = this.clientsByPlayer.get(client.sessionId);
            if (playerNumber === 1) this.inputs.left = this.normalizeInput(message.dir);
            if (playerNumber === 2) this.inputs.right = this.normalizeInput(message.dir);
        });

        this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / TICK_RATE);
        this.clock.setInterval(() => this.broadcastState(), 1000 / STATE_SEND_RATE);
    }

    onJoin(client) {
        const playerNumber = this.assignPlayerNumber();
        this.clientsByPlayer.set(client.sessionId, playerNumber);
        client.send('assignment', { playerNumber });
        this.broadcastState();
    }

    onLeave(client) {
        const playerNumber = this.clientsByPlayer.get(client.sessionId);
        if (playerNumber === 1) this.inputs.left = 0;
        if (playerNumber === 2) this.inputs.right = 0;
        this.clientsByPlayer.delete(client.sessionId);
        this.broadcastState();
    }

    assignPlayerNumber() {
        const assigned = new Set(this.clientsByPlayer.values());
        return assigned.has(1) ? 2 : 1;
    }

    createInitialState() {
        return {
            paddles: {
                left: { y: PLAY_TOP + PLAY_HEIGHT / 2 },
                right: { y: PLAY_TOP + PLAY_HEIGHT / 2 },
            },
            ball: {
                x: CANVAS_WIDTH / 2,
                y: PLAY_TOP + PLAY_HEIGHT / 2,
                vx: BALL_SPEED,
                vy: 0,
                speed: BALL_SPEED,
            },
            score: {
                left: 0,
                right: 0,
            },
            gameOver: false,
            winner: '',
        };
    }

    normalizeInput(value) {
        if (value < 0) return -1;
        if (value > 0) return 1;
        return 0;
    }

    update(deltaTime) {
        if (this.gameState.gameOver) return;

        const dt = deltaTime / 1000;
        this.movePaddles(dt);
        this.moveBall(dt);
        this.checkWallBounce();
        this.checkPaddleCollision('left');
        this.checkPaddleCollision('right');
        this.checkScore();
    }

    movePaddles(dt) {
        const half = PADDLE_HEIGHT / 2;
        this.gameState.paddles.left.y = this.clamp(
            this.gameState.paddles.left.y + this.inputs.left * PADDLE_SPEED * dt,
            PLAY_TOP + half,
            PLAY_BOTTOM - half
        );
        this.gameState.paddles.right.y = this.clamp(
            this.gameState.paddles.right.y + this.inputs.right * PADDLE_SPEED * dt,
            PLAY_TOP + half,
            PLAY_BOTTOM - half
        );
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

    checkPaddleCollision(side) {
        const paddle = this.gameState.paddles[side];
        const isLeft = side === 'left';
        const deflectDir = isLeft ? 1 : -1;
        const halfBall = BALL_SIZE / 2;
        const halfPaddleWidth = PADDLE_WIDTH / 2;
        const halfPaddleHeight = PADDLE_HEIGHT / 2;
        const paddleX = isLeft ? PADDLE_OFFSET : CANVAS_WIDTH - PADDLE_OFFSET;

        if (deflectDir === 1 && this.gameState.ball.vx > 0) return;
        if (deflectDir === -1 && this.gameState.ball.vx < 0) return;

        const overlapping =
            this.gameState.ball.x - halfBall < paddleX + halfPaddleWidth &&
            this.gameState.ball.x + halfBall > paddleX - halfPaddleWidth &&
            this.gameState.ball.y - halfBall < paddle.y + halfPaddleHeight &&
            this.gameState.ball.y + halfBall > paddle.y - halfPaddleHeight;

        if (!overlapping) return;

        this.gameState.ball.speed = Math.min(this.gameState.ball.speed + BALL_SPEED_INCREASE, BALL_SPEED_CAP);

        const hitOffset = (this.gameState.ball.y - paddle.y) / halfPaddleHeight;
        const angleRad = this.degreesToRadians(hitOffset * DEFLECT_ANGLE_MAX);
        this.gameState.ball.vx = Math.cos(angleRad) * this.gameState.ball.speed * deflectDir;
        this.gameState.ball.vy = Math.sin(angleRad) * this.gameState.ball.speed;
        this.gameState.ball.x = isLeft
            ? paddleX + halfPaddleWidth + halfBall + 1
            : paddleX - halfPaddleWidth - halfBall - 1;
    }

    checkScore() {
        if (this.gameState.ball.x < 0) {
            this.gameState.score.right += 1;
            this.afterScore();
        } else if (this.gameState.ball.x > CANVAS_WIDTH) {
            this.gameState.score.left += 1;
            this.afterScore();
        }
    }

    afterScore() {
        if (this.gameState.score.left >= SCORE_TO_WIN) {
            this.gameState.gameOver = true;
            this.gameState.winner = 'Player 1';
            return;
        }
        if (this.gameState.score.right >= SCORE_TO_WIN) {
            this.gameState.gameOver = true;
            this.gameState.winner = 'Player 2';
            return;
        }
        this.resetBall();
    }

    resetBall() {
        const direction = Math.random() < 0.5 ? 1 : -1;
        const angleRad = this.degreesToRadians(this.randomBetween(-30, 30));
        this.gameState.ball.x = CANVAS_WIDTH / 2;
        this.gameState.ball.y = PLAY_TOP + PLAY_HEIGHT / 2;
        this.gameState.ball.speed = BALL_SPEED;
        this.gameState.ball.vx = Math.cos(angleRad) * this.gameState.ball.speed * direction;
        this.gameState.ball.vy = Math.sin(angleRad) * this.gameState.ball.speed;
    }

    broadcastState() {
        this.broadcast('state', {
            roomId: this.roomId,
            players: { connected: this.clientsByPlayer.size },
            paddles: {
                left: { y: this.round(this.gameState.paddles.left.y) },
                right: { y: this.round(this.gameState.paddles.right.y) },
            },
            ball: {
                x: this.round(this.gameState.ball.x),
                y: this.round(this.gameState.ball.y),
            },
            score: {
                left: this.gameState.score.left,
                right: this.gameState.score.right,
            },
            gameOver: this.gameState.gameOver,
            winner: this.gameState.winner,
            roomStatus: {
                x: ROOM_STATUS_X,
                y: ROOM_STATUS_Y,
            },
        });
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

const gameServer = new Server();
gameServer.define(ROOM_NAME, PongRoom);
gameServer.listen(PORT);

console.log(`Colyseus Pong server listening on ws://localhost:${PORT}`);
