/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────
// Every magic number lives here. Tweak freely.

const CANVAS_WIDTH  = 680;   // game canvas width in pixels
const CANVAS_HEIGHT = 420;   // game canvas height in pixels

// ── Sprite sheet layout ──────────────────────────────────────────────────────
// Open debug.html and adjust Frame W/H until the grid aligns, then click
// frames to get their index numbers. marle2.png is 128×192 with real alpha.
const FRAME_WIDTH        = 32;   // width of one sprite frame in pixels
const FRAME_HEIGHT       = 32;   // height of one sprite frame in pixels
const FRAME_MARGIN       = 0;    // pixel gap from sheet edge to first frame

// ── Animation frame indices ──────────────────────────────────────────────────
// Use debug.html or [ / ] in-game to find the right frame numbers.
const IDLE_FRAME         = 0;    // frame shown when standing still
const WALK_RIGHT_START   = 8;    // first frame of walk-right cycle (UPDATE ME)
const WALK_RIGHT_COUNT   = 4;    // number of frames in walk-right cycle
const WALK_LEFT_START    = 4;    // first frame of walk-left cycle (UPDATE ME)
const WALK_LEFT_COUNT    = 4;    // number of frames in walk-left cycle

// ── Sprite behaviour ─────────────────────────────────────────────────────────
const WALK_FRAME_RATE    = 8;    // animation playback speed in frames per second
const WALK_SPEED         = 80;   // horizontal pixels moved per second with A / D
const SPRITE_SCALE       = 4;    // render scale for the large preview on the right
const SHEET_SCALE        = 2;    // scale at which the full sprite sheet is shown on the left
// ─────────────────────────────────────────────────────────────────────────────

class MarleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MarleScene' });
        this.previewFrame = IDLE_FRAME;
    }

    preload() {
        // marle2.png is RGBA — load directly as a spritesheet, no processing needed
        this.load.image('sheet_bg', 'assets/marle2.png');
        this.load.spritesheet('marle', 'assets/marle2.png', {
            frameWidth:  FRAME_WIDTH,
            frameHeight: FRAME_HEIGHT,
            margin:      FRAME_MARGIN,
        });
    }

    create() {
        // Derive sheet dimensions from the loaded texture
        const src = this.textures.get('sheet_bg').source[0];
        this.sheetW    = src.width;
        this.sheetH    = src.height;
        this.sheetCols = Math.floor((this.sheetW - FRAME_MARGIN) / FRAME_WIDTH);
        this.sheetRows = Math.floor((this.sheetH - FRAME_MARGIN) / FRAME_HEIGHT);

        // ── Left panel: full sprite sheet for reference ───────────────────────
        this.add.image(0, 0, 'sheet_bg').setOrigin(0, 0).setScale(SHEET_SCALE);

        // Yellow highlight box — marks the current frame on the sheet
        this.highlight = this.add.rectangle(
            0, 0,
            FRAME_WIDTH  * SHEET_SCALE,
            FRAME_HEIGHT * SHEET_SCALE
        ).setOrigin(0, 0).setFillStyle(0x000000, 0).setStrokeStyle(2, 0xffff00);

        // ── Right panel: large frame preview ─────────────────────────────────
        const panelLeft = this.sheetW * SHEET_SCALE;
        const previewX  = panelLeft + (CANVAS_WIDTH - panelLeft) / 2;
        const previewY  = CANVAS_HEIGHT / 2;

        this.marle = this.add.sprite(previewX, previewY, 'marle', this.previewFrame);
        this.marle.setScale(SPRITE_SCALE);

        // ── HUD text ──────────────────────────────────────────────────────────
        const tx = panelLeft + 8;
        this.frameText = this.add.text(tx, 8, this._frameLabel(), {
            fontSize: '13px', fill: '#ffff00', fontFamily: 'monospace',
        });
        this.add.text(tx, CANVAS_HEIGHT - 40,
            'A / D — move     [ / ] — prev / next frame', {
            fontSize: '11px', fill: '#888888', fontFamily: 'monospace',
        });

        // ── Animations ────────────────────────────────────────────────────────
        this.anims.create({
            key:       'walk_right',
            frames:    this.anims.generateFrameNumbers('marle', {
                start: WALK_RIGHT_START,
                end:   WALK_RIGHT_START + WALK_RIGHT_COUNT - 1,
            }),
            frameRate: WALK_FRAME_RATE,
            repeat:    -1,
        });

        this.anims.create({
            key:       'walk_left',
            frames:    this.anims.generateFrameNumbers('marle', {
                start: WALK_LEFT_START,
                end:   WALK_LEFT_START + WALK_LEFT_COUNT - 1,
            }),
            frameRate: WALK_FRAME_RATE,
            repeat:    -1,
        });

        // ── Input ─────────────────────────────────────────────────────────────
        this.keys = this.input.keyboard.addKeys({
            a:         Phaser.Input.Keyboard.KeyCodes.A,
            d:         Phaser.Input.Keyboard.KeyCodes.D,
            prevFrame: Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET,   // [
            nextFrame: Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET, // ]
        });

        this._updateHighlight();
    }

    update(time, delta) {
        const dt = delta / 1000;

        // ── Frame cycling ([ / ]) ─────────────────────────────────────────────
        const maxFrame = this.sheetCols * this.sheetRows - 1;
        if (Phaser.Input.Keyboard.JustDown(this.keys.prevFrame)) {
            this.previewFrame = Math.max(0, this.previewFrame - 1);
            this._showFrame();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.nextFrame)) {
            this.previewFrame = Math.min(maxFrame, this.previewFrame + 1);
            this._showFrame();
        }

        // ── Movement (A / D) ──────────────────────────────────────────────────
        if (this.keys.d.isDown) {
            this.marle.x += WALK_SPEED * dt;
            if (this.marle.anims.getName() !== 'walk_right') {
                this.marle.play('walk_right');
                this.frameText.setText('→ walk_right (frames ' + WALK_RIGHT_START + '–' + (WALK_RIGHT_START + WALK_RIGHT_COUNT - 1) + ')');
            }
        } else if (this.keys.a.isDown) {
            this.marle.x -= WALK_SPEED * dt;
            if (this.marle.anims.getName() !== 'walk_left') {
                this.marle.play('walk_left');
                this.frameText.setText('← walk_left (frames ' + WALK_LEFT_START + '–' + (WALK_LEFT_START + WALK_LEFT_COUNT - 1) + ')');
            }
        } else {
            if (this.marle.anims.isPlaying) {
                this.marle.anims.stop();
                this.marle.setFrame(this.previewFrame);
                this.frameText.setText(this._frameLabel());
            }
        }
    }

    _showFrame() {
        this.marle.anims.stop();
        this.marle.setFrame(this.previewFrame);
        this.frameText.setText(this._frameLabel());
        this._updateHighlight();
    }

    _frameLabel() {
        const col = this.previewFrame % this.sheetCols;
        const row = Math.floor(this.previewFrame / this.sheetCols);
        return `Frame: ${this.previewFrame}  (col ${col}, row ${row})`;
    }

    _updateHighlight() {
        const col = this.previewFrame % this.sheetCols;
        const row = Math.floor(this.previewFrame / this.sheetCols);
        this.highlight.setPosition(
            (FRAME_MARGIN + col * FRAME_WIDTH)  * SHEET_SCALE,
            (FRAME_MARGIN + row * FRAME_HEIGHT) * SHEET_SCALE
        );
    }
}

const config = {
    type:            Phaser.AUTO,
    width:           CANVAS_WIDTH,
    height:          CANVAS_HEIGHT,
    backgroundColor: '#111111',
    scene:           MarleScene,
};

new Phaser.Game(config);
