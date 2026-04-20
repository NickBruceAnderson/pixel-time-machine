// ─── TUNABLES ────────────────────────────────────────────────────────────────
// Every magic number lives here. Tweak freely.

const CANVAS_WIDTH        = 800;   // game canvas width in pixels
const CANVAS_HEIGHT       = 600;   // game canvas height in pixels

const PADDLE_WIDTH        = 12;    // paddle thickness in pixels
const PADDLE_HEIGHT       = 80;    // paddle height in pixels
const PADDLE_SPEED        = 320;   // paddle movement speed in pixels per second
const PADDLE_OFFSET       = 40;    // distance from screen edge to paddle center

const BALL_SIZE           = 12;    // ball width and height in pixels
const BALL_SPEED_START    = 260;   // initial ball speed in pixels per second
const BALL_SPEED_INCREASE = 20;    // speed added to ball on each paddle hit
const BALL_SPEED_CAP      = 520;   // ball will never exceed this speed

const SERVE_ANGLE_MAX     = 30;    // max degrees from horizontal on serve (keeps it fair)
const DEFLECT_ANGLE_MAX   = 60;    // max degrees from horizontal when deflecting off a paddle

const SCORE_TO_WIN        = 7;     // first player to reach this score wins

const DIVIDER_DASH_HEIGHT = 18;    // height of each dash in the center dividing line
const DIVIDER_DASH_GAP    = 30;    // spacing between dashes (center to center)
const DIVIDER_WIDTH       = 4;     // width of the center dividing line in pixels

const SCORE_FONT_SIZE     = '48px';  // size of the score numbers
const MESSAGE_FONT_SIZE   = '28px';  // size of win/restart message
// ─────────────────────────────────────────────────────────────────────────────

class PongScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PongScene' });
    }

    create() {
        this.scoreLeft = 0;
        this.scoreRight = 0;
        this.gameOver = false;

        // Center dividing line — rendered as dashes
        for (let y = 0; y < CANVAS_HEIGHT; y += DIVIDER_DASH_GAP) {
            this.add.rectangle(
                CANVAS_WIDTH / 2,
                y + DIVIDER_DASH_HEIGHT / 2,
                DIVIDER_WIDTH,
                DIVIDER_DASH_HEIGHT,
                0x444444
            );
        }

        // Left paddle — controlled by W / S
        this.paddleLeft = this.add.rectangle(
            PADDLE_OFFSET,
            CANVAS_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            0xffffff
        );

        // Right paddle — controlled by Up / Down arrows
        this.paddleRight = this.add.rectangle(
            CANVAS_WIDTH - PADDLE_OFFSET,
            CANVAS_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            0xffffff
        );

        // Ball
        this.ball = this.add.rectangle(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2,
            BALL_SIZE,
            BALL_SIZE,
            0xffffff
        );

        this.ballVX = 0;
        this.ballVY = 0;
        this.ballSpeed = BALL_SPEED_START;

        // Score displays — left and right of center line
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

        // Win / restart message, shown only at game over
        this.messageText = this.add.text(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 + 60,
            '',
            { fontSize: MESSAGE_FONT_SIZE, fill: '#ffffff', fontFamily: 'monospace', align: 'center' }
        ).setOrigin(0.5, 0.5);

        // Keyboard bindings
        this.keys = this.input.keyboard.addKeys({
            w:     Phaser.Input.Keyboard.KeyCodes.W,
            s:     Phaser.Input.Keyboard.KeyCodes.S,
            up:    Phaser.Input.Keyboard.KeyCodes.UP,
            down:  Phaser.Input.Keyboard.KeyCodes.DOWN,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.launchBall();
    }

    launchBall() {
        this.ball.x = CANVAS_WIDTH / 2;
        this.ball.y = CANVAS_HEIGHT / 2;
        this.ballSpeed = BALL_SPEED_START;

        // Serve at a random shallow angle toward a random side
        const angleDeg = Phaser.Math.Between(-SERVE_ANGLE_MAX, SERVE_ANGLE_MAX);
        const angleRad = Phaser.Math.DegToRad(angleDeg);
        const direction = Math.random() < 0.5 ? 1 : -1;
        this.ballVX = Math.cos(angleRad) * this.ballSpeed * direction;
        this.ballVY = Math.sin(angleRad) * this.ballSpeed;
    }

    update(time, delta) {
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                this.scene.restart();
            }
            return;
        }

        const dt = delta / 1000; // milliseconds → seconds for pixels-per-second math

        // ── Paddle movement ──────────────────────────────────────────────────
        const topLimit    = PADDLE_HEIGHT / 2;
        const bottomLimit = CANVAS_HEIGHT - PADDLE_HEIGHT / 2;

        if (this.keys.w.isDown) {
            this.paddleLeft.y = Math.max(topLimit, this.paddleLeft.y - PADDLE_SPEED * dt);
        }
        if (this.keys.s.isDown) {
            this.paddleLeft.y = Math.min(bottomLimit, this.paddleLeft.y + PADDLE_SPEED * dt);
        }
        if (this.keys.up.isDown) {
            this.paddleRight.y = Math.max(topLimit, this.paddleRight.y - PADDLE_SPEED * dt);
        }
        if (this.keys.down.isDown) {
            this.paddleRight.y = Math.min(bottomLimit, this.paddleRight.y + PADDLE_SPEED * dt);
        }

        // ── Ball movement ────────────────────────────────────────────────────
        this.ball.x += this.ballVX * dt;
        this.ball.y += this.ballVY * dt;

        // ── Top / bottom wall bounce ─────────────────────────────────────────
        const half = BALL_SIZE / 2;
        if (this.ball.y - half <= 0) {
            this.ball.y = half;
            this.ballVY = Math.abs(this.ballVY);   // force downward
        } else if (this.ball.y + half >= CANVAS_HEIGHT) {
            this.ball.y = CANVAS_HEIGHT - half;
            this.ballVY = -Math.abs(this.ballVY);  // force upward
        }

        // ── Paddle collision ─────────────────────────────────────────────────
        // +1 = deflect ball to the right, -1 = deflect ball to the left
        this.checkPaddleCollision(this.paddleLeft,   1);
        this.checkPaddleCollision(this.paddleRight, -1);

        // ── Scoring ──────────────────────────────────────────────────────────
        if (this.ball.x < 0) {
            this.scoreRight += 1;
            this.scoreRightText.setText(this.scoreRight);
            if (!this.checkWin()) this.launchBall();
        } else if (this.ball.x > CANVAS_WIDTH) {
            this.scoreLeft += 1;
            this.scoreLeftText.setText(this.scoreLeft);
            if (!this.checkWin()) this.launchBall();
        }
    }

    checkPaddleCollision(paddle, deflectDir) {
        const half = BALL_SIZE / 2;
        const halfPW = PADDLE_WIDTH / 2;
        const halfPH = PADDLE_HEIGHT / 2;

        const overlapping =
            this.ball.x - half < paddle.x + halfPW &&
            this.ball.x + half > paddle.x - halfPW &&
            this.ball.y - half < paddle.y + halfPH &&
            this.ball.y + half > paddle.y - halfPH;

        if (!overlapping) return;

        // Ignore if ball is already moving away from this paddle
        if (deflectDir === 1  && this.ballVX > 0) return;
        if (deflectDir === -1 && this.ballVX < 0) return;

        // Speed up on each hit, up to the cap
        this.ballSpeed = Math.min(this.ballSpeed + BALL_SPEED_INCREASE, BALL_SPEED_CAP);

        // Angle depends on where ball strikes the paddle face (-1 = top, 0 = center, 1 = bottom)
        const hitOffset  = (this.ball.y - paddle.y) / halfPH;
        const angleDeg   = hitOffset * DEFLECT_ANGLE_MAX;
        const angleRad   = Phaser.Math.DegToRad(angleDeg);

        this.ballVX = Math.cos(angleRad) * this.ballSpeed * deflectDir;
        this.ballVY = Math.sin(angleRad) * this.ballSpeed;

        // Push ball clear of the paddle to prevent a second hit on the next frame
        if (deflectDir === 1) {
            this.ball.x = paddle.x + halfPW + half + 1;
        } else {
            this.ball.x = paddle.x - halfPW - half - 1;
        }
    }

    checkWin() {
        if (this.scoreLeft >= SCORE_TO_WIN) {
            this.endGame('Left player wins!');
            return true;
        }
        if (this.scoreRight >= SCORE_TO_WIN) {
            this.endGame('Right player wins!');
            return true;
        }
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
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#000000',
    scene: PongScene,
};

new Phaser.Game(config);
