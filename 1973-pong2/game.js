/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────

const CANVAS_WIDTH        = 800;   // game canvas width in pixels
const CANVAS_HEIGHT       = 600;   // game canvas height in pixels

const PADDLE_WIDTH        = 6;     // paddle thickness in pixels
const PADDLE_HEIGHT       = 60;    // starting paddle height in pixels
const PADDLE_SPEED        = 500;   // paddle movement speed in pixels per second
const PADDLE_OFFSET       = 40;    // distance from screen edge to paddle center
const PADDLE_GROW_PX      = 10;    // pixels added to paddle on SURGE
const PADDLE_SHRINK_PX    = 10;    // pixels removed from opponent paddle on WITHER
const PADDLE_MIN_HEIGHT   = 20;    // paddle can never shrink below this (pixels)

const BALL_SIZE           = 6;     // ball width and height in pixels
const BALL_SPEED_START    = 200;   // initial ball speed in pixels per second
const BALL_SPEED_INCREASE = 20;    // speed added on each paddle hit
const BALL_SPEED_CAP      = 400;   // ball will never exceed this speed
const BALL_SMASH_TINT     = 0xff2200;  // ball color after a smash hit
const BALL_NORMAL_TINT    = 0xffffff;  // default ball color

const SERVE_ANGLE_MAX     = 30;    // max degrees from horizontal on serve
const DEFLECT_ANGLE_MAX   = 60;    // max degrees from horizontal on paddle deflect

const SCORE_TO_WIN        = 7;     // first to this score wins

const DIVIDER_DASH_HEIGHT = 18;    // height of each center-line dash in pixels
const DIVIDER_DASH_GAP    = 30;    // center-to-center spacing between dashes
const DIVIDER_WIDTH       = 4;     // width of center line in pixels

const SCORE_FONT_SIZE     = '48px';
const MESSAGE_FONT_SIZE   = '28px';

const SMASH_WINDOW_MS     = 300;   // ms after smash key press that a smash can land
const SMASH_SPEED_MULT    = 1.5;   // speed multiplier on a successful smash

const MANA_FILL_TIME_MS   = 10000; // ms to fill mana bar from 0 to MANA_MAX
const MANA_MAX            = 100;   // maximum mana value
const MANA_HALF           = 50;    // bar color threshold; equals MANA_COST by design
const MANA_COST           = 50;    // mana spent on SURGE or WITHER
const MANA_SMASH_BONUS    = 0.10;  // fraction of MANA_MAX granted on a successful smash
const MANA_BAR_WIDTH      = 60;    // mana bar width in pixels
const MANA_BAR_HEIGHT     = 8;     // mana bar height in pixels
const MANA_BAR_MARGIN     = 20;    // distance from screen edges to HUD group
const MANA_COLOR_LOW      = 0x3355ff;  // bar color below MANA_HALF
const MANA_COLOR_HIGH     = 0x00ccff;  // bar color at or above MANA_HALF

const COMBO_TIMEOUT_MS    = 600;   // combo buffer clears if idle longer than this

const BLITZ_COST          = 100;   // mana cost for BLITZ stratagem
const BLITZ_SPEED_MULT    = 2.0;   // ball speed multiplier while BLITZ is active
const BLITZ_TINT          = 0xffff00;  // ball color while BLITZ is active

const HUD_LEGEND_FONT_SIZE = 8;        // legend text size in pixels
const HUD_LEGEND_COLOR     = '#aaaaaa'; // legend text color
const HUD_LEGEND_LINE_GAP  = 2;        // pixels between legend lines
const HUD_LEGEND_BAR_GAP   = 4;        // pixels between mana bar bottom and legend top

// ─────────────────────────────────────────────────────────────────────────────

class PongScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PongScene' });
    }

    create() {
        this.scoreLeft  = 0;
        this.scoreRight = 0;
        this.gameOver   = false;

        // ── Center divider ────────────────────────────────────────────────────
        for (let y = 0; y < CANVAS_HEIGHT; y += DIVIDER_DASH_GAP) {
            this.add.rectangle(
                CANVAS_WIDTH / 2,
                y + DIVIDER_DASH_HEIGHT / 2,
                DIVIDER_WIDTH,
                DIVIDER_DASH_HEIGHT,
                0x444444
            );
        }

        // ── Paddles ───────────────────────────────────────────────────────────
        this.paddleLeft = this.add.rectangle(
            PADDLE_OFFSET,
            CANVAS_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            0xffffff
        );
        this.paddleRight = this.add.rectangle(
            CANVAS_WIDTH - PADDLE_OFFSET,
            CANVAS_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            0xffffff
        );

        // Live paddle heights — modified by SURGE and WITHER
        this.paddleLeftHeight  = PADDLE_HEIGHT;
        this.paddleRightHeight = PADDLE_HEIGHT;

        // ── Ball ──────────────────────────────────────────────────────────────
        this.ball = this.add.rectangle(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2,
            BALL_SIZE,
            BALL_SIZE,
            BALL_NORMAL_TINT
        );

        this.ballVX    = 0;
        this.ballVY    = 0;
        this.ballSpeed = BALL_SPEED_START;

        // ── Blitz / tint state ────────────────────────────────────────────────
        this.blitzActive          = false;
        this.ballSpeedBeforeBlitz = BALL_SPEED_START;
        this.smashTintActive      = false;

        // ── Scores ────────────────────────────────────────────────────────────
        this.scoreLeftText = this.add.text(
            CANVAS_WIDTH / 2 - 80, 40,
            '0',
            { fontSize: SCORE_FONT_SIZE, fill: '#ffffff', fontFamily: 'monospace' }
        ).setOrigin(0.5, 0);

        this.scoreRightText = this.add.text(
            CANVAS_WIDTH / 2 + 80, 40,
            '0',
            { fontSize: SCORE_FONT_SIZE, fill: '#ffffff', fontFamily: 'monospace' }
        ).setOrigin(0.5, 0);

        this.messageText = this.add.text(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 + 60,
            '',
            { fontSize: MESSAGE_FONT_SIZE, fill: '#ffffff', fontFamily: 'monospace', align: 'center' }
        ).setOrigin(0.5, 0.5);

        // ── Keyboard bindings ─────────────────────────────────────────────────
        this.keys = this.input.keyboard.addKeys({
            w:     Phaser.Input.Keyboard.KeyCodes.W,
            s:     Phaser.Input.Keyboard.KeyCodes.S,
            d:     Phaser.Input.Keyboard.KeyCodes.D,       // left player smash
            up:    Phaser.Input.Keyboard.KeyCodes.UP,
            down:  Phaser.Input.Keyboard.KeyCodes.DOWN,
            left:  Phaser.Input.Keyboard.KeyCodes.LEFT,    // right player smash
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.smashLeftAt  = -Infinity;
        this.smashRightAt = -Infinity;

        // ── Mana ──────────────────────────────────────────────────────────────
        this.manaLeft  = 0;
        this.manaRight = 0;

        // ── Combo buffers ─────────────────────────────────────────────────────
        // Left player: arrow keys. Right player: WASD.
        // Keys intentionally cross-map to opponent movement — by design.
        this.comboBufferLeft  = [];
        this.comboBufferRight = [];
        this.comboTimerLeft   = 0;
        this.comboTimerRight  = 0;

        this.input.keyboard.on('keydown-LEFT',  () => this.pushCombo('left',  'LEFT'));
        this.input.keyboard.on('keydown-UP',    () => this.pushCombo('left',  'UP'));
        this.input.keyboard.on('keydown-RIGHT', () => this.pushCombo('left',  'RIGHT'));
        this.input.keyboard.on('keydown-DOWN',  () => this.pushCombo('left',  'DOWN'));

        this.input.keyboard.on('keydown-A', () => this.pushCombo('right', 'LEFT'));
        this.input.keyboard.on('keydown-W', () => this.pushCombo('right', 'UP'));
        this.input.keyboard.on('keydown-D', () => this.pushCombo('right', 'RIGHT'));
        this.input.keyboard.on('keydown-S', () => this.pushCombo('right', 'DOWN'));

        // ── HUD layout ────────────────────────────────────────────────────────
        // Bar + gap + legend all fit above MANA_BAR_MARGIN from the bottom edge.
        const legendTotalH = 3 * HUD_LEGEND_FONT_SIZE + 2 * HUD_LEGEND_LINE_GAP;
        this._legendY = CANVAS_HEIGHT - MANA_BAR_MARGIN - legendTotalH;
        this._barTopY = this._legendY - HUD_LEGEND_BAR_GAP - MANA_BAR_HEIGHT;

        this.manaGraphics = this.add.graphics().setDepth(10);

        const legendStyle = {
            fontSize:    HUD_LEGEND_FONT_SIZE + 'px',
            fill:        HUD_LEGEND_COLOR,
            fontFamily:  'monospace',
            lineSpacing: HUD_LEGEND_LINE_GAP,
        };

        // Unicode: ← ← ↑ ↑ → → ↓ ↓
        this.add.text(
            MANA_BAR_MARGIN,
            this._legendY,
            'SURGE   ← ↑ ← ↓ \nWITHER  → ↑ → ↓\nBLITZ   → → → → ',
            legendStyle
        ).setDepth(10).setOrigin(0, 0);

        this.add.text(
            CANVAS_WIDTH - MANA_BAR_MARGIN,
            this._legendY,
            'SURGE   → ↑ → ↓ \nWITHER  ← ↑ ← ↓\nBLITZ   ← ← ← ← ',
            legendStyle
        ).setDepth(10).setOrigin(1, 0);

        this.launchBall();
    }

    // ── Combo system ──────────────────────────────────────────────────────────

    pushCombo(player, dir) {
        const buf = player === 'left' ? this.comboBufferLeft : this.comboBufferRight;
        buf.push(dir);
        if (buf.length > 4) buf.shift();

        if (player === 'left') this.comboTimerLeft  = this.time.now;
        else                   this.comboTimerRight = this.time.now;

        this.checkCombo(player);
    }

    checkCombo(player) {
        const buf  = player === 'left' ? this.comboBufferLeft  : this.comboBufferRight;
        const mana = player === 'left' ? this.manaLeft         : this.manaRight;

        const combos = player === 'left' ? [
            { name: 'SURGE',  seq: ['LEFT',  'UP', 'LEFT',  'DOWN'],        cost: MANA_COST  },
            { name: 'WITHER', seq: ['RIGHT', 'UP', 'RIGHT', 'DOWN'],        cost: MANA_COST  },
            { name: 'BLITZ',  seq: ['RIGHT', 'RIGHT', 'RIGHT', 'RIGHT'],    cost: BLITZ_COST },
        ] : [
            { name: 'SURGE',  seq: ['RIGHT', 'UP', 'RIGHT', 'DOWN'],        cost: MANA_COST  },
            { name: 'WITHER', seq: ['LEFT',  'UP', 'LEFT',  'DOWN'],        cost: MANA_COST  },
            { name: 'BLITZ',  seq: ['LEFT',  'LEFT',  'LEFT',  'LEFT'],     cost: BLITZ_COST },
        ];

        for (const combo of combos) {
            if (buf.length < combo.seq.length) continue;
            const tail = buf.slice(-combo.seq.length);
            if (tail.every((v, i) => v === combo.seq[i]) && mana >= combo.cost) {
                this.executeStratagem(player, combo.name, combo.cost);
                buf.length = 0;
                return;
            }
        }
    }

    executeStratagem(player, name, cost) {
        if (player === 'left') this.manaLeft  = Math.max(0, this.manaLeft  - cost);
        else                   this.manaRight = Math.max(0, this.manaRight - cost);

        if (name === 'SURGE') {
            if (player === 'left') {
                this.paddleLeftHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleLeftHeight + PADDLE_GROW_PX);
                this.paddleLeft.height = this.paddleLeftHeight;
            } else {
                this.paddleRightHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleRightHeight + PADDLE_GROW_PX);
                this.paddleRight.height = this.paddleRightHeight;
            }
        } else if (name === 'WITHER') {
            if (player === 'left') {
                this.paddleRightHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleRightHeight - PADDLE_SHRINK_PX);
                this.paddleRight.height = this.paddleRightHeight;
            } else {
                this.paddleLeftHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleLeftHeight - PADDLE_SHRINK_PX);
                this.paddleLeft.height = this.paddleLeftHeight;
            }
        } else if (name === 'BLITZ') {
            this.ballSpeedBeforeBlitz = this.ballSpeed;
            this.ballSpeed *= BLITZ_SPEED_MULT;
            this.ballVX    *= BLITZ_SPEED_MULT;
            this.ballVY    *= BLITZ_SPEED_MULT;
            this.blitzActive = true;
            if (!this.smashTintActive) {
                this.ball.fillColor = BLITZ_TINT;
            }
        }
    }

    // ── Mana bar rendering ────────────────────────────────────────────────────

    drawManaBars() {
        const g      = this.manaGraphics;
        const barY   = this._barTopY;
        const leftX  = MANA_BAR_MARGIN;
        const rightX = CANVAS_WIDTH - MANA_BAR_MARGIN - MANA_BAR_WIDTH;
        g.clear();

        // Left bar
        g.fillStyle(0x111111, 1);
        g.fillRect(leftX, barY, MANA_BAR_WIDTH, MANA_BAR_HEIGHT);
        g.fillStyle(this.manaLeft >= MANA_HALF ? MANA_COLOR_HIGH : MANA_COLOR_LOW, 1);
        g.fillRect(leftX, barY, (this.manaLeft / MANA_MAX) * MANA_BAR_WIDTH, MANA_BAR_HEIGHT);
        g.fillStyle(0xffffff, 0.5);
        g.fillRect(leftX + MANA_BAR_WIDTH / 2, barY, 1, MANA_BAR_HEIGHT);

        // Right bar
        g.fillStyle(0x111111, 1);
        g.fillRect(rightX, barY, MANA_BAR_WIDTH, MANA_BAR_HEIGHT);
        g.fillStyle(this.manaRight >= MANA_HALF ? MANA_COLOR_HIGH : MANA_COLOR_LOW, 1);
        g.fillRect(rightX, barY, (this.manaRight / MANA_MAX) * MANA_BAR_WIDTH, MANA_BAR_HEIGHT);
        g.fillStyle(0xffffff, 0.5);
        g.fillRect(rightX + MANA_BAR_WIDTH / 2, barY, 1, MANA_BAR_HEIGHT);
    }

    // ── Ball reset ────────────────────────────────────────────────────────────

    launchBall() {
        this.ball.x    = CANVAS_WIDTH  / 2;
        this.ball.y    = CANVAS_HEIGHT / 2;
        this.ballSpeed = BALL_SPEED_START;

        this.blitzActive     = false;
        this.smashTintActive = false;
        this.ball.fillColor  = BALL_NORMAL_TINT;

        const angleDeg  = Phaser.Math.Between(-SERVE_ANGLE_MAX, SERVE_ANGLE_MAX);
        const angleRad  = Phaser.Math.DegToRad(angleDeg);
        const direction = Math.random() < 0.5 ? 1 : -1;
        this.ballVX = Math.cos(angleRad) * this.ballSpeed * direction;
        this.ballVY = Math.sin(angleRad) * this.ballSpeed;
    }

    // ── Main loop ─────────────────────────────────────────────────────────────

    update(time, delta) {
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.space)) this.scene.restart();
            return;
        }

        const dt = delta / 1000;

        // Expire stale combo buffers
        if (this.comboBufferLeft.length  > 0 && time - this.comboTimerLeft  > COMBO_TIMEOUT_MS) {
            this.comboBufferLeft.length  = 0;
        }
        if (this.comboBufferRight.length > 0 && time - this.comboTimerRight > COMBO_TIMEOUT_MS) {
            this.comboBufferRight.length = 0;
        }

        // Smash timestamps
        if (Phaser.Input.Keyboard.JustDown(this.keys.d))    this.smashLeftAt  = time;
        if (Phaser.Input.Keyboard.JustDown(this.keys.left)) this.smashRightAt = time;

        // Paddle movement — limits use live heights
        const topL    = this.paddleLeftHeight  / 2;
        const botL    = CANVAS_HEIGHT - this.paddleLeftHeight  / 2;
        const topR    = this.paddleRightHeight / 2;
        const botR    = CANVAS_HEIGHT - this.paddleRightHeight / 2;

        if (this.keys.w.isDown)    this.paddleLeft.y  = Math.max(topL, this.paddleLeft.y  - PADDLE_SPEED * dt);
        if (this.keys.s.isDown)    this.paddleLeft.y  = Math.min(botL, this.paddleLeft.y  + PADDLE_SPEED * dt);
        if (this.keys.up.isDown)   this.paddleRight.y = Math.max(topR, this.paddleRight.y - PADDLE_SPEED * dt);
        if (this.keys.down.isDown) this.paddleRight.y = Math.min(botR, this.paddleRight.y + PADDLE_SPEED * dt);

        // Mana accrual
        const manaPerMs = MANA_MAX / MANA_FILL_TIME_MS;
        this.manaLeft   = Math.min(MANA_MAX, this.manaLeft  + manaPerMs * delta);
        this.manaRight  = Math.min(MANA_MAX, this.manaRight + manaPerMs * delta);

        // Ball movement
        this.ball.x += this.ballVX * dt;
        this.ball.y += this.ballVY * dt;

        // Wall bounce
        const half = BALL_SIZE / 2;
        if (this.ball.y - half <= 0) {
            this.ball.y = half;
            this.ballVY = Math.abs(this.ballVY);
        } else if (this.ball.y + half >= CANVAS_HEIGHT) {
            this.ball.y = CANVAS_HEIGHT - half;
            this.ballVY = -Math.abs(this.ballVY);
        }

        // Paddle collisions
        this.checkPaddleCollision(this.paddleLeft,   1, this.smashLeftAt,  time);
        this.checkPaddleCollision(this.paddleRight, -1, this.smashRightAt, time);

        // Scoring
        if (this.ball.x < 0) {
            this.scoreRight += 1;
            this.scoreRightText.setText(this.scoreRight);
            if (!this.checkWin()) this.launchBall();
        } else if (this.ball.x > CANVAS_WIDTH) {
            this.scoreLeft += 1;
            this.scoreLeftText.setText(this.scoreLeft);
            if (!this.checkWin()) this.launchBall();
        }

        this.drawManaBars();
    }

    checkPaddleCollision(paddle, deflectDir, smashAt, currentTime) {
        const half   = BALL_SIZE / 2;
        const halfPW = PADDLE_WIDTH / 2;
        const halfPH = paddle.height / 2;   // live height, not the constant

        const overlapping =
            this.ball.x - half < paddle.x + halfPW &&
            this.ball.x + half > paddle.x - halfPW &&
            this.ball.y - half < paddle.y + halfPH &&
            this.ball.y + half > paddle.y - halfPH;

        if (!overlapping) return;
        if (deflectDir ===  1 && this.ballVX > 0) return;
        if (deflectDir === -1 && this.ballVX < 0) return;

        // Restore BLITZ speed before applying normal hit math
        if (this.blitzActive) {
            this.ballSpeed   = this.ballSpeedBeforeBlitz;
            this.blitzActive = false;
            if (!this.smashTintActive) this.ball.fillColor = BALL_NORMAL_TINT;
        }

        this.ballSpeed = Math.min(this.ballSpeed + BALL_SPEED_INCREASE, BALL_SPEED_CAP);

        const wasSmash = currentTime - smashAt <= SMASH_WINDOW_MS;
        if (wasSmash) {
            this.ballSpeed *= SMASH_SPEED_MULT;
            if (deflectDir === 1) {
                this.manaLeft    = Math.min(MANA_MAX, this.manaLeft  + MANA_MAX * MANA_SMASH_BONUS);
                this.smashLeftAt = -Infinity;
            } else {
                this.manaRight    = Math.min(MANA_MAX, this.manaRight + MANA_MAX * MANA_SMASH_BONUS);
                this.smashRightAt = -Infinity;
            }
            this.smashTintActive = true;
            this.ball.fillColor  = BALL_SMASH_TINT;
        } else if (this.smashTintActive) {
            this.smashTintActive = false;
            this.ball.fillColor  = BALL_NORMAL_TINT;
        }

        const hitOffset = (this.ball.y - paddle.y) / halfPH;
        const angleDeg  = hitOffset * DEFLECT_ANGLE_MAX;
        const angleRad  = Phaser.Math.DegToRad(angleDeg);

        this.ballVX = Math.cos(angleRad) * this.ballSpeed * deflectDir;
        this.ballVY = Math.sin(angleRad) * this.ballSpeed;

        if (deflectDir === 1) {
            this.ball.x = paddle.x + halfPW + half + 1;
        } else {
            this.ball.x = paddle.x - halfPW - half - 1;
        }
    }

    checkWin() {
        if (this.scoreLeft  >= SCORE_TO_WIN) { this.endGame('Left player wins!');  return true; }
        if (this.scoreRight >= SCORE_TO_WIN) { this.endGame('Right player wins!'); return true; }
        return false;
    }

    endGame(message) {
        this.gameOver = true;
        this.ballVX = 0;
        this.ballVY = 0;
        this.messageText.setText(message + '\n\nPress SPACE to play again');
    }
}

const config = {
    type:            Phaser.AUTO,
    width:           CANVAS_WIDTH,
    height:          CANVAS_HEIGHT,
    backgroundColor: '#000000',
    scene:           PongScene,
};

new Phaser.Game(config);
