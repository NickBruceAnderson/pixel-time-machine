/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────

const CANVAS_WIDTH = 800;   // game canvas width in pixels
const CANVAS_HEIGHT = 900;   // total canvas height (play zone + UI zone + footer)
const BACKGROUND_COLOR = '#000000'; // game background color
const PLAY_HEIGHT = 600;   // playable area height; UI zone occupies the rest
const UI_ZONE_TOP = 600;   // Y where the UI zone begins (equals PLAY_HEIGHT)

const PADDLE_WIDTH = 6;     // paddle thickness in pixels
const PADDLE_HEIGHT = 60;    // starting paddle height in pixels
const PADDLE_SPEED = 500;   // paddle movement speed in pixels per second
const PADDLE_OFFSET = 40;    // distance from screen edge to paddle center
const PADDLE_GROW_PX = 20;    // pixels added to paddle on GROW
const PADDLE_SHRINK_PX = 20;    // pixels removed from opponent paddle on SHRINK
const PADDLE_MIN_HEIGHT = 20;    // paddle can never shrink below this (pixels)
const PADDLE_DEFAULT_COLOR  = '#ffffff'; // starting and post-flash paddle color
const PADDLE_GROW_FLASH_COLOR = '#0088ff'; // tint on growing player's paddle
const PADDLE_SHRINK_FLASH_COLOR = '#ff2200'; // tint on shrinking opponent's paddle
const PADDLE_FLASH_DURATION_MS = 200;       // how long the flash tint lasts

const BALL_SIZE = 6;     // ball width and height in pixels
const BALL_BASE_SPEED = 200;   // ball speed after every reset (also the launch speed)
const BALL_SPEED_INCREASE = 20;    // speed added on each paddle hit
const BALL_SPEED_CAP = 400;   // ball will never exceed this on normal hits
const BALL_SMASH_TINT = '#ff2200'; // ball color after a smash hit
const BALL_NORMAL_TINT = '#ffffff'; // default ball color

const SERVE_ANGLE_MAX = 30;    // max degrees from horizontal on serve
const DEFLECT_ANGLE_MAX = 60;    // max degrees from horizontal on paddle deflect

const SCORE_TO_WIN = 7;     // first to this score wins

const DIVIDER_DASH_HEIGHT = 18;    // height of each center-line dash in pixels
const DIVIDER_DASH_GAP = 30;    // center-to-center spacing between dashes
const DIVIDER_WIDTH = 4;     // width of center line in pixels
const DIVIDER_DASH_COLOR = '#444444';
const ZONE_SEPARATOR_COLOR = '#333333';

const SCORE_FONT_SIZE = '48px';
const SCORE_COLOR = '#ffffff';
const MESSAGE_FONT_SIZE = '28px';
const MESSAGE_COLOR = '#ffffff';

const SMASH_WINDOW_MS = 300;   // ms after smash key press that a smash can land
const SMASH_SPEED_MULT = 1.5;   // speed multiplier on a successful smash

const MANA_FILL_TIME_MS = 10000; // ms to fill mana bar from 0 to MANA_MAX
const MANA_MAX = 100;   // maximum mana value
const MANA_HALF = 50;    // bar color threshold; equals MANA_COST by design
const MANA_COST = 50;    // mana spent on GROW or SHRINK
const MANA_SMASH_BONUS = 0.1;  // fraction of MANA_MAX granted on a successful smash
const MANA_BAR_WIDTH = 180;   // fallback bar width; overridden at runtime by legend measurement
const MANA_BAR_HEIGHT = 24;    // mana bar height in pixels
const MANA_BAR_MARGIN = 20;    // distance from screen edges to HUD group
const MANA_BAR_BACK_COLOR = '#111111';
const MANA_BAR_MID_COLOR = '#ffffff';
const MANA_COLOR_LOW = '#3355ff'; // bar color below MANA_HALF
const MANA_COLOR_HIGH = '#00ccff'; // bar color at or above MANA_HALF

const COMBO_TIMEOUT_MS = 600;   // combo buffer clears if idle longer than this

const BURST_COST = 100;   // mana cost for BURST stratagem
const BURST_SPEED_MULT = 2.0;   // ball speed multiplier when BURST fires; persists until reset
const BURST_TINT = '#ffff00'; // ball color while BURST is active

const HUD_LEGEND_FONT_SIZE = 24;        // legend text size in pixels
const HUD_LEGEND_COLOR = '#aaaaaa'; // legend text color
const HUD_LEGEND_LINE_GAP = 6;         // pixels between legend lines
const HUD_LEGEND_BAR_GAP = 12;        // pixels between mana bar bottom and legend top

const MANA_PIP_WIDTH = 8;         // width of each mana cost pip rectangle
const MANA_PIP_HEIGHT = 6;         // height of each mana cost pip rectangle
const MANA_PIP_GAP = 2;         // horizontal gap between pips
const MANA_PIP_COLOR = '#00ccff'; // pip fill color
const MANA_PIP_MARGIN = 4;         // gap between legend text edge and first pip

const COMBO_ARROW_HIT_COLOR = '#3355ff'; // highlighted arrow color when combo prefix matches

const FOOTER_FONT_SIZE = 11;        // instruction text size in pixels
const FOOTER_COLOR = '#888888'; // instruction text color
const FOOTER_Y_OFFSET = 90;        // px from canvas bottom to footer text top

const phaserColor = (cssHex) => Phaser.Display.Color.HexStringToColor(cssHex).color;

// ─────────────────────────────────────────────────────────────────────────────

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
            this.setComboFeedback(player, 'fail');
            buf.length = 0;
            return;
        }

        const exactCombo = matchingCombos.find(combo => buf.length === combo.seq.length);
        if (!exactCombo) {
            this.setComboFeedback(player, 'input');
            return;
        }

        if (mana >= exactCombo.cost) {
            this.executeStratagem(player, exactCombo.name, exactCombo.cost);
            this.setComboFeedback(player, 'success', exactCombo.name.trim());
            buf.length = 0;
        } else {
            this.setComboFeedback(player, 'cooldown', exactCombo.name.trim());
            buf.length = 0;
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
        const combos = this.getCombos(player);

        for (let row = 0; row < 3; row++) {
            const combo   = combos[row];
            const matches = buf.length > 0 && buf.every((v, i) => v === combo.seq[i]);
            const count   = matches ? buf.length : 0;
            for (let col = 0; col < 4; col++) {
                arrowTexts[row][col].setFill(col < count ? COMBO_ARROW_HIT_COLOR : HUD_LEGEND_COLOR);
            }
        }
    }

    executeStratagem(player, name, cost) {
        if (player === 'left') this.manaLeft  = Math.max(0, this.manaLeft  - cost);
        else                   this.manaRight = Math.max(0, this.manaRight - cost);

        if (name === 'GROW ') {
            if (player === 'left') {
                this.paddleLeftHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleLeftHeight + PADDLE_GROW_PX);
                this.paddleLeft.height = this.paddleLeftHeight;
                this.paddleLeft.fillColor = phaserColor(PADDLE_GROW_FLASH_COLOR);
                this.time.delayedCall(PADDLE_FLASH_DURATION_MS, () => { this.paddleLeft.fillColor  = phaserColor(PADDLE_DEFAULT_COLOR); });
            } else {
                this.paddleRightHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleRightHeight + PADDLE_GROW_PX);
                this.paddleRight.height = this.paddleRightHeight;
                this.paddleRight.fillColor = phaserColor(PADDLE_GROW_FLASH_COLOR);
                this.time.delayedCall(PADDLE_FLASH_DURATION_MS, () => { this.paddleRight.fillColor = phaserColor(PADDLE_DEFAULT_COLOR); });
            }
        } else if (name === 'SHRINK') {
            if (player === 'left') {
                this.paddleRightHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleRightHeight - PADDLE_SHRINK_PX);
                this.paddleRight.height = this.paddleRightHeight;
                this.paddleRight.fillColor = phaserColor(PADDLE_SHRINK_FLASH_COLOR);
                this.time.delayedCall(PADDLE_FLASH_DURATION_MS, () => { this.paddleRight.fillColor = phaserColor(PADDLE_DEFAULT_COLOR); });
            } else {
                this.paddleLeftHeight = Math.max(PADDLE_MIN_HEIGHT, this.paddleLeftHeight - PADDLE_SHRINK_PX);
                this.paddleLeft.height = this.paddleLeftHeight;
                this.paddleLeft.fillColor = phaserColor(PADDLE_SHRINK_FLASH_COLOR);
                this.time.delayedCall(PADDLE_FLASH_DURATION_MS, () => { this.paddleLeft.fillColor  = phaserColor(PADDLE_DEFAULT_COLOR); });
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
        this.paddleLeft.height  = PADDLE_HEIGHT;
        this.paddleRight.height = PADDLE_HEIGHT;

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

        const dt = delta / 1000;

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
        const topL = this.paddleLeftHeight  / 2;
        const botL = PLAY_HEIGHT - this.paddleLeftHeight  / 2;
        const topR = this.paddleRightHeight / 2;
        const botR = PLAY_HEIGHT - this.paddleRightHeight / 2;

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
        const halfPH = paddle.height / 2;

        const overlapping =
            this.ball.x - half < paddle.x + halfPW &&
            this.ball.x + half > paddle.x - halfPW &&
            this.ball.y - half < paddle.y + halfPH &&
            this.ball.y + half > paddle.y - halfPH;

        if (!overlapping) return;
        if (deflectDir ===  1 && this.ballVX > 0) return;
        if (deflectDir === -1 && this.ballVX < 0) return;

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
