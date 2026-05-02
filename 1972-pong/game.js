/// <reference types="phaser" />

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 900;
const BACKGROUND_COLOR = '#000000';
const PLAY_HEIGHT = 600;
const UI_ZONE_TOP = 600;

const PADDLE_WIDTH = 6;
const PADDLE_HEIGHT = 60;
const PADDLE_SPEED = 500;
const PADDLE_OFFSET = 40;
const PADDLE_GROW_PX = 20;
const PADDLE_SHRINK_PX = 20;
const PADDLE_MIN_HEIGHT = 10;
const PADDLE_MAX_HEIGHT = 200;
const PADDLE_DEFAULT_COLOR = '#ffffff';
const PADDLE_GROW_FLASH_COLOR = '#0088ff';
const PADDLE_SHRINK_FLASH_COLOR = '#ff2200';
const PADDLE_FLASH_DURATION_MS = 200;

const BALL_SIZE = 6;
const BALL_BASE_SPEED = 200;
const BALL_SPEED_INCREASE = 20;
const BALL_SPEED_CAP = 400;
const MAX_DELTA_SECONDS = 1 / 60;
const BALL_SMASH_TINT = '#ff2200';
const BALL_NORMAL_TINT = '#ffffff';

const SERVE_ANGLE_MAX = 30;
const DEFLECT_ANGLE_MAX = 60;

const SCORE_TO_WIN = 7;

const DIVIDER_DASH_HEIGHT = 18;
const DIVIDER_DASH_GAP = 30;
const DIVIDER_WIDTH = 4;
const DIVIDER_DASH_COLOR = '#444444';
const ZONE_SEPARATOR_COLOR = '#333333';

const SCORE_FONT_SIZE = '48px';
const SCORE_COLOR = '#ffffff';
const MESSAGE_FONT_SIZE = '28px';
const MESSAGE_COLOR = '#ffffff';

const SMASH_WINDOW_MS = 300;
const SMASH_SPEED_MULT = 1.5;

const MANA_FILL_TIME_MS = 10000;
const MANA_MAX = 100;
const MANA_HALF = 50;
const MANA_COST = 50;
const MANA_SMASH_BONUS = 0.1;
const MANA_BAR_WIDTH = 180;
const MANA_BAR_HEIGHT = 24;
const MANA_BAR_MARGIN = 20;
const MANA_BAR_BACK_COLOR = '#111111';
const MANA_BAR_MID_COLOR = '#ffffff';
const MANA_COLOR_LOW = '#3355ff';
const MANA_COLOR_HIGH = '#00ccff';

const COMBO_TIMEOUT_MS = 600;

const BURST_COST = 100;
const BURST_SPEED_MULT = 2.0;
const BURST_TINT = '#ffff00';

const HUD_LEGEND_FONT_SIZE = 24;
const HUD_LEGEND_COLOR = '#aaaaaa';
const HUD_LEGEND_LINE_GAP = 6;
const HUD_LEGEND_BAR_GAP = 12;

const MANA_PIP_WIDTH = 8;
const MANA_PIP_HEIGHT = 6;
const MANA_PIP_GAP = 2;
const MANA_PIP_COLOR = '#00ccff';
const MANA_PIP_MARGIN = 4;

const COMBO_ARROW_HIT_COLOR = '#3355ff';

const FOOTER_FONT_SIZE = 11;
const FOOTER_COLOR = '#888888';
const FOOTER_Y_OFFSET = 90;

const phaserColor = (cssHex) => Phaser.Display.Color.HexStringToColor(cssHex).color;

class PongScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PongScene' });
    }

    create() {
        this.scoreLeft  = 0;
        this.scoreRight = 0;
        this.gameOver   = false;

        // ── Center divider (play zone only) ───────────────────────────────────
        for (let y = 0; y < PLAY_HEIGHT; y += DIVIDER_DASH_GAP) {
            this.add.rectangle(
                CANVAS_WIDTH / 2,
                y + DIVIDER_DASH_HEIGHT / 2,
                DIVIDER_WIDTH,
                DIVIDER_DASH_HEIGHT,
                phaserColor(DIVIDER_DASH_COLOR)
            );
        }

        // Play zone / UI zone separator
        this.add.rectangle(CANVAS_WIDTH / 2, PLAY_HEIGHT, CANVAS_WIDTH, 1, phaserColor(ZONE_SEPARATOR_COLOR)).setAlpha(0.6);

        // UI zone / footer separator
        const footerTop = CANVAS_HEIGHT - 100;
        this.add.rectangle(CANVAS_WIDTH / 2, footerTop, CANVAS_WIDTH, 1, phaserColor(ZONE_SEPARATOR_COLOR)).setAlpha(0.6).setDepth(10);

        // Centered instruction text
        this.add.text(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - FOOTER_Y_OFFSET,
            'Pong — but your mana bar unlocks combos. GROW your paddle, SHRINK theirs, or BURST the ball to double speed.\nPress into the ball to SMASH it for bonus power and a mana boost!',
            { fontSize: FOOTER_FONT_SIZE + 'px', fill: FOOTER_COLOR, fontFamily: 'monospace' }
        ).setDepth(10).setOrigin(0.5, 0);

        // ── Paddles ───────────────────────────────────────────────────────────
        this.paddleLeft = this.add.rectangle(
            PADDLE_OFFSET,
            PLAY_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            phaserColor(PADDLE_DEFAULT_COLOR)
        );
        this.paddleRight = this.add.rectangle(
            CANVAS_WIDTH - PADDLE_OFFSET,
            PLAY_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            phaserColor(PADDLE_DEFAULT_COLOR)
        );

        // Live paddle heights — modified by GROW  and SHRINK
        this.paddleLeftHeight  = PADDLE_HEIGHT;
        this.paddleRightHeight = PADDLE_HEIGHT;

        // ── Ball ──────────────────────────────────────────────────────────────
        this.ball = this.add.rectangle(
            CANVAS_WIDTH / 2,
            PLAY_HEIGHT  / 2,
            BALL_SIZE,
            BALL_SIZE,
            phaserColor(BALL_NORMAL_TINT)
        );

        this.ballVX    = 0;
        this.ballVY    = 0;
        this.ballSpeed = BALL_BASE_SPEED;

        // ── BURST / tint state ────────────────────────────────────────────────
        this.BURSTActive     = false;
        this.smashTintActive = false;

        // ── Scores (UI zone) ──────────────────────────────────────────────────
        this.scoreLeftText = this.add.text(
            CANVAS_WIDTH / 2 - 80, UI_ZONE_TOP + 20,
            '0',
            { fontSize: SCORE_FONT_SIZE, fill: SCORE_COLOR, fontFamily: 'monospace' }
        ).setOrigin(0.5, 0);

        this.scoreRightText = this.add.text(
            CANVAS_WIDTH / 2 + 80, UI_ZONE_TOP + 20,
            '0',
            { fontSize: SCORE_FONT_SIZE, fill: SCORE_COLOR, fontFamily: 'monospace' }
        ).setOrigin(0.5, 0);

        this.messageText = this.add.text(
            CANVAS_WIDTH / 2,
            PLAY_HEIGHT  / 2 + 60,
            '',
            { fontSize: MESSAGE_FONT_SIZE, fill: MESSAGE_COLOR, fontFamily: 'monospace', align: 'center' }
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
        // Left player: WASD (A=LEFT, W=UP, D=RIGHT, S=DOWN)
        // Right player: arrow keys (←=LEFT, ↑=UP, →=RIGHT, ↓=DOWN)
        this.comboBufferLeft  = [];
        this.comboBufferRight = [];
        this.comboTimerLeft   = 0;
        this.comboTimerRight  = 0;

        this.input.keyboard.on('keydown-A', () => this.pushCombo('left',  'LEFT'));
        this.input.keyboard.on('keydown-W', () => this.pushCombo('left',  'UP'));
        this.input.keyboard.on('keydown-D', () => this.pushCombo('left',  'RIGHT'));
        this.input.keyboard.on('keydown-S', () => this.pushCombo('left',  'DOWN'));

        this.input.keyboard.on('keydown-LEFT',  () => this.pushCombo('right', 'LEFT'));
        this.input.keyboard.on('keydown-UP',    () => this.pushCombo('right', 'UP'));
        this.input.keyboard.on('keydown-RIGHT', () => this.pushCombo('right', 'RIGHT'));
        this.input.keyboard.on('keydown-DOWN',  () => this.pushCombo('right', 'DOWN'));

        // ── HUD layout ────────────────────────────────────────────────────────
        this._barTopY = UI_ZONE_TOP + 20;
        this._legendY = this._barTopY + MANA_BAR_HEIGHT + HUD_LEGEND_BAR_GAP;

        this.manaGraphics = this.add.graphics().setDepth(10);

        // Measure name column width and single arrow glyph width
        const tmpStyle  = { fontSize: HUD_LEGEND_FONT_SIZE + 'px', fontFamily: 'monospace' };
        const tmpNameT  = this.add.text(-9999, -9999, 'SHRINK', tmpStyle);
        const tmpArrowT = this.add.text(-9999, -9999, '→', tmpStyle);
        const nameColW   = tmpNameT.width + 16;   // name width + gap before first arrow
        const arrowCellW = tmpArrowT.width + 10;  // arrow glyph width + inter-arrow gap
        this._manaBarWidth = Math.max(nameColW + 4 * arrowCellW, MANA_BAR_WIDTH);
        tmpNameT.destroy();
        tmpArrowT.destroy();

        const lineH = HUD_LEGEND_FONT_SIZE + HUD_LEGEND_LINE_GAP;
        const legendStyle = { fontSize: HUD_LEGEND_FONT_SIZE + 'px', fill: HUD_LEGEND_COLOR, fontFamily: 'monospace' };

        const leftStrats = [
            { name: 'GROW',   arrows: ['←', '↑', '←', '↓'], pips: 1 },
            { name: 'SHRINK', arrows: ['→', '↑', '→', '↓'], pips: 1 },
            { name: 'BURST',  arrows: ['→', '→', '→', '→'], pips: 2 },
        ];
        const rightStrats = [
            { name: 'GROW',   arrows: ['→', '↑', '→', '↓'], pips: 1 },
            { name: 'SHRINK', arrows: ['←', '↑', '←', '↓'], pips: 1 },
            { name: 'BURST',  arrows: ['←', '←', '←', '←'], pips: 2 },
        ];

        const pipG    = this.add.graphics().setDepth(10);
        const pipMidY = HUD_LEGEND_FONT_SIZE / 2 - MANA_PIP_HEIGHT / 2;
        pipG.fillStyle(phaserColor(MANA_PIP_COLOR), 1);

        // ── Left player legend ────────────────────────────────────────────────
        this.arrowTextsLeft = [];
        for (let row = 0; row < leftStrats.length; row++) {
            const strat = leftStrats[row];
            const rowY  = this._legendY + row * lineH;

            this.add.text(MANA_BAR_MARGIN, rowY, strat.name, legendStyle).setDepth(10).setOrigin(0, 0);

            this.arrowTextsLeft[row] = [];
            for (let col = 0; col < 4; col++) {
                const x = MANA_BAR_MARGIN + nameColW + col * arrowCellW;
                this.arrowTextsLeft[row][col] = this.add.text(x, rowY, strat.arrows[col], legendStyle).setDepth(10).setOrigin(0, 0);
            }

            const pipX = MANA_BAR_MARGIN + nameColW + 4 * arrowCellW + MANA_PIP_MARGIN;
            for (let p = 0; p < strat.pips; p++) {
                pipG.fillRect(pipX + p * (MANA_PIP_WIDTH + MANA_PIP_GAP), rowY + pipMidY, MANA_PIP_WIDTH, MANA_PIP_HEIGHT);
            }
        }

        // ── Right player legend ───────────────────────────────────────────────
        this.arrowTextsRight = [];
        for (let row = 0; row < rightStrats.length; row++) {
            const strat = rightStrats[row];
            const rowY  = this._legendY + row * lineH;

            this.add.text(CANVAS_WIDTH - MANA_BAR_MARGIN, rowY, strat.name, legendStyle).setDepth(10).setOrigin(1, 0);

            this.arrowTextsRight[row] = [];
            for (let col = 0; col < 4; col++) {
                const x = CANVAS_WIDTH - MANA_BAR_MARGIN - nameColW - (4 - col) * arrowCellW;
                this.arrowTextsRight[row][col] = this.add.text(x, rowY, strat.arrows[col], legendStyle).setDepth(10).setOrigin(0, 0);
            }

            const pipBlockW = strat.pips * MANA_PIP_WIDTH + (strat.pips - 1) * MANA_PIP_GAP;
            const pipX = CANVAS_WIDTH - MANA_BAR_MARGIN - nameColW - 4 * arrowCellW - MANA_PIP_MARGIN - pipBlockW;
            for (let p = 0; p < strat.pips; p++) {
                pipG.fillRect(pipX + p * (MANA_PIP_WIDTH + MANA_PIP_GAP), rowY + pipMidY, MANA_PIP_WIDTH, MANA_PIP_HEIGHT);
            }
        }

        this.refreshComboHud('left');
        this.refreshComboHud('right');

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

        const combos = this.getCombos(player);

        const matchingCombos = combos.filter(combo =>
            buf.every((v, i) => v === combo.seq[i])
        );

        if (matchingCombos.length === 0) {
            buf.length = 0;
            this.setComboFeedback(player, 'fail');
            return;
        }

        const exactCombo = matchingCombos.find(combo => buf.length === combo.seq.length);
        if (!exactCombo) {
            this.setComboFeedback(player, 'input');
            return;
        }

        if (mana >= exactCombo.cost) {
            this.executeStratagem(player, exactCombo.name, exactCombo.cost);
            buf.length = 0;
            this.setComboFeedback(player, 'success', exactCombo.name.trim());
        } else {
            buf.length = 0;
            this.setComboFeedback(player, 'cooldown', exactCombo.name.trim());
        }
    }

    getCombos(player) {
        return player === 'left' ? [
            { name: 'GROW ',  seq: ['LEFT',  'UP', 'LEFT',  'DOWN'],     cost: MANA_COST  },
            { name: 'SHRINK', seq: ['RIGHT', 'UP', 'RIGHT', 'DOWN'],     cost: MANA_COST  },
            { name: 'BURST',  seq: ['RIGHT', 'RIGHT', 'RIGHT', 'RIGHT'], cost: BURST_COST },
        ] : [
            { name: 'GROW ',  seq: ['RIGHT', 'UP', 'RIGHT', 'DOWN'],     cost: MANA_COST  },
            { name: 'SHRINK', seq: ['LEFT',  'UP', 'LEFT',  'DOWN'],     cost: MANA_COST  },
            { name: 'BURST',  seq: ['LEFT',  'LEFT',  'LEFT',  'LEFT'],  cost: BURST_COST },
        ];
    }

    setComboFeedback(player, state, name = '') {
        this.refreshComboHud(player);
    }

    refreshComboHud(player) {
        const arrowTexts = player === 'left' ? this.arrowTextsLeft : this.arrowTextsRight;
        if (!arrowTexts) return;

        const buf    = player === 'left' ? this.comboBufferLeft : this.comboBufferRight;
        const mana   = player === 'left' ? this.manaLeft : this.manaRight;
        const combos = this.getCombos(player);

        for (let row = 0; row < 3; row++) {
            const combo   = combos[row];
            const hasMana = mana >= combo.cost;
            const matches = hasMana && buf.length > 0 && buf.every((v, i) => v === combo.seq[i]);
            const count   = matches ? buf.length : 0;
            for (let col = 0; col < 4; col++) {
                arrowTexts[row][col].setFill(col < count ? COMBO_ARROW_HIT_COLOR : HUD_LEGEND_COLOR);
            }
        }
    }

    applyPaddleHeight(paddle, height) {
        paddle.setSize(PADDLE_WIDTH, height);
        paddle.setOrigin(0.5, 0.5);

        paddle.y = Phaser.Math.Clamp(
            paddle.y,
            height / 2,
            PLAY_HEIGHT - height / 2
        );
    }

    executeStratagem(player, name, cost) {
        if (player === 'left') this.manaLeft  = Math.max(0, this.manaLeft  - cost);
        else                   this.manaRight = Math.max(0, this.manaRight - cost);

        if (name === 'GROW ') {
            if (player === 'left') {
                this.paddleLeftHeight = Math.min(PADDLE_MAX_HEIGHT, this.paddleLeftHeight + PADDLE_GROW_PX);
                this.applyPaddleHeight(this.paddleLeft, this.paddleLeftHeight);
                this.paddleLeft.fillColor = phaserColor(PADDLE_GROW_FLASH_COLOR);                this.time.delayedCall(PADDLE_FLASH_DURATION_MS, () => { this.paddleLeft.fillColor  = phaserColor(PADDLE_DEFAULT_COLOR); });
            } else {
                this.paddleRightHeight = Math.min(PADDLE_MAX_HEIGHT, this.paddleRightHeight + PADDLE_GROW_PX);
                this.applyPaddleHeight(this.paddleRight, this.paddleRightHeight);
                this.paddleRight.fillColor = phaserColor(PADDLE_GROW_FLASH_COLOR);                this.time.delayedCall(PADDLE_FLASH_DURATION_MS, () => { this.paddleRight.fillColor = phaserColor(PADDLE_DEFAULT_COLOR); });
            }
        } else if (name === 'SHRINK') {
            if (player === 'left') {
                this.paddleRightHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleRightHeight - PADDLE_SHRINK_PX);
                this.applyPaddleHeight(this.paddleRight, this.paddleRightHeight);
                this.paddleRight.fillColor = phaserColor(PADDLE_SHRINK_FLASH_COLOR);                this.time.delayedCall(PADDLE_FLASH_DURATION_MS, () => { this.paddleRight.fillColor = phaserColor(PADDLE_DEFAULT_COLOR); });
            } else {
                this.paddleLeftHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleLeftHeight - PADDLE_SHRINK_PX);
                this.applyPaddleHeight(this.paddleLeft, this.paddleLeftHeight);
                this.paddleLeft.fillColor = phaserColor(PADDLE_SHRINK_FLASH_COLOR);                this.time.delayedCall(PADDLE_FLASH_DURATION_MS, () => { this.paddleLeft.fillColor  = phaserColor(PADDLE_DEFAULT_COLOR); });
            }
        } else if (name === 'BURST') {
            this.ballSpeed   *= BURST_SPEED_MULT;
            this.ballVX      *= BURST_SPEED_MULT;
            this.ballVY      *= BURST_SPEED_MULT;
            this.BURSTActive  = true;
            if (!this.smashTintActive) {
                this.ball.fillColor = phaserColor(BURST_TINT);
            }
        }
    }

    // ── Mana bar rendering ────────────────────────────────────────────────────

    drawManaBars() {
        const g      = this.manaGraphics;
        const barW   = this._manaBarWidth;
        const barY   = this._barTopY;
        const leftX  = MANA_BAR_MARGIN;
        const rightX = CANVAS_WIDTH - MANA_BAR_MARGIN - barW;
        g.clear();

        // Left bar
        g.fillStyle(phaserColor(MANA_BAR_BACK_COLOR), 1);
        g.fillRect(leftX, barY, barW, MANA_BAR_HEIGHT);
        g.fillStyle(phaserColor(this.manaLeft >= MANA_HALF ? MANA_COLOR_HIGH : MANA_COLOR_LOW), 1);
        g.fillRect(leftX, barY, (this.manaLeft / MANA_MAX) * barW, MANA_BAR_HEIGHT);
        g.fillStyle(phaserColor(MANA_BAR_MID_COLOR), 0.5);
        g.fillRect(leftX + barW / 2, barY, 1, MANA_BAR_HEIGHT);

        // Right bar
        g.fillStyle(phaserColor(MANA_BAR_BACK_COLOR), 1);
        g.fillRect(rightX, barY, barW, MANA_BAR_HEIGHT);
        g.fillStyle(phaserColor(this.manaRight >= MANA_HALF ? MANA_COLOR_HIGH : MANA_COLOR_LOW), 1);
        g.fillRect(rightX, barY, (this.manaRight / MANA_MAX) * barW, MANA_BAR_HEIGHT);
        g.fillStyle(phaserColor(MANA_BAR_MID_COLOR), 0.5);
        g.fillRect(rightX + barW / 2, barY, 1, MANA_BAR_HEIGHT);
    }

    // ── Ball reset ────────────────────────────────────────────────────────────

    launchBall() {
        this.paddleLeftHeight  = PADDLE_HEIGHT;
        this.paddleRightHeight = PADDLE_HEIGHT;
        this.applyPaddleHeight(this.paddleLeft, this.paddleLeftHeight);
        this.applyPaddleHeight(this.paddleRight, this.paddleRightHeight);

        this.ball.x    = CANVAS_WIDTH / 2;
        this.ball.y    = PLAY_HEIGHT  / 2;
        this.ballSpeed = BALL_BASE_SPEED;

        this.BURSTActive     = false;
        this.smashTintActive = false;
        this.ball.fillColor  = phaserColor(BALL_NORMAL_TINT);

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

        const dt = Math.min(delta / 1000, MAX_DELTA_SECONDS);

        // Expire stale combo buffers
        if (this.comboBufferLeft.length  > 0 && time - this.comboTimerLeft  > COMBO_TIMEOUT_MS) {
            this.comboBufferLeft.length  = 0;
            this.refreshComboHud('left');
        }
        if (this.comboBufferRight.length > 0 && time - this.comboTimerRight > COMBO_TIMEOUT_MS) {
            this.comboBufferRight.length = 0;
            this.refreshComboHud('right');
        }

        // Smash timestamps — D=left smash, LEFT arrow=right smash
        if (Phaser.Input.Keyboard.JustDown(this.keys.d))    this.smashLeftAt  = time;
        if (Phaser.Input.Keyboard.JustDown(this.keys.left)) this.smashRightAt = time;

        // Paddle movement — clamped to play zone, using live heights
        const halfLeftPaddleHeight = this.paddleLeftHeight / 2;
        const halfRightPaddleHeight = this.paddleRightHeight / 2;

        if (this.keys.w.isDown)    this.paddleLeft.y  -= PADDLE_SPEED * dt;
        if (this.keys.s.isDown)    this.paddleLeft.y  += PADDLE_SPEED * dt;
        if (this.keys.up.isDown)   this.paddleRight.y -= PADDLE_SPEED * dt;
        if (this.keys.down.isDown) this.paddleRight.y += PADDLE_SPEED * dt;

        this.paddleLeft.y = Phaser.Math.Clamp(
            this.paddleLeft.y,
            halfLeftPaddleHeight,
            PLAY_HEIGHT - halfLeftPaddleHeight
        );
        this.paddleRight.y = Phaser.Math.Clamp(
            this.paddleRight.y,
            halfRightPaddleHeight,
            PLAY_HEIGHT - halfRightPaddleHeight
        );

        // Mana accrual
        const manaPerMs = MANA_MAX / MANA_FILL_TIME_MS;
        this.manaLeft   = Math.min(MANA_MAX, this.manaLeft  + manaPerMs * delta);
        this.manaRight  = Math.min(MANA_MAX, this.manaRight + manaPerMs * delta);

        // Ball movement
        const prevBallX = this.ball.x;
        const prevBallY = this.ball.y;
        this.ball.x += this.ballVX * dt;
        this.ball.y += this.ballVY * dt;

        // Wall bounce — contained in play zone
        const half = BALL_SIZE / 2;
        if (this.ball.y - half <= 0) {
            this.ball.y = half;
            this.ballVY = Math.abs(this.ballVY);
        } else if (this.ball.y + half >= PLAY_HEIGHT) {
            this.ball.y = PLAY_HEIGHT - half;
            this.ballVY = -Math.abs(this.ballVY);
        }

        // Paddle collisions
        this.checkPaddleCollision(this.paddleLeft,   1, this.smashLeftAt,  time, prevBallX, prevBallY);
        this.checkPaddleCollision(this.paddleRight, -1, this.smashRightAt, time, prevBallX, prevBallY);

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

    checkPaddleCollision(paddle, deflectDir, smashAt, currentTime, prevBallX, prevBallY) {
        const half   = BALL_SIZE / 2;
        const halfPW = PADDLE_WIDTH / 2;
        const halfPH = paddle.height / 2;

        const overlapping =
            this.ball.x - half < paddle.x + halfPW &&
            this.ball.x + half > paddle.x - halfPW &&
            this.ball.y - half < paddle.y + halfPH &&
            this.ball.y + half > paddle.y - halfPH;

        if (deflectDir ===  1 && this.ballVX > 0) return;
        if (deflectDir === -1 && this.ballVX < 0) return;

        const faceX = paddle.x + deflectDir * halfPW;
        const prevEdgeX = prevBallX - deflectDir * half;
        const currEdgeX = this.ball.x - deflectDir * half;
        const crossedFace = deflectDir === 1
            ? prevEdgeX >= faceX && currEdgeX <= faceX
            : prevEdgeX <= faceX && currEdgeX >= faceX;

        let sweptY = this.ball.y;
        if (crossedFace && currEdgeX !== prevEdgeX) {
            const t = (faceX - prevEdgeX) / (currEdgeX - prevEdgeX);
            sweptY = Phaser.Math.Linear(prevBallY, this.ball.y, t);
        }

        const sweptOverlapsY =
            sweptY + half >= paddle.y - halfPH &&
            sweptY - half <= paddle.y + halfPH;

        if (!overlapping && !(crossedFace && sweptOverlapsY)) return;
        if (!overlapping) this.ball.y = sweptY;

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
            this.ball.fillColor  = phaserColor(BALL_SMASH_TINT);
        } else if (this.smashTintActive) {
            // Restore to BURST tint if still active, otherwise default
            this.smashTintActive = false;
            this.ball.fillColor  = phaserColor(this.BURSTActive ? BURST_TINT : BALL_NORMAL_TINT);
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
    backgroundColor: BACKGROUND_COLOR,
    scale: {
        mode:       Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene:           PongScene,
};

new Phaser.Game(config);
