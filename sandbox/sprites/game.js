/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────
// Every magic number lives here. Tweak freely.

const CANVAS_WIDTH  = 680;   // game canvas width in pixels
const CANVAS_HEIGHT = 420;   // game canvas height in pixels

// ── Sprite sheet layout ──────────────────────────────────────────────────────
// Open debug.html in a browser — adjust Frame W/H until the green grid lines
// up with the sprite cells, then click each frame to get its index number.
const FRAME_WIDTH        = 16;   // width of one sprite frame in pixels
const FRAME_HEIGHT       = 24;   // height of one sprite frame in pixels
const FRAME_MARGIN       = 0;    // pixel gap from sheet edge before frame 0

// ── Animation frame indices ──────────────────────────────────────────────────
// Use debug.html to find these. Press [ / ] in-game to cycle the preview.
const IDLE_FRAME         = 0;    // frame shown when standing still (UPDATE ME)
const WALK_RIGHT_START   = 6;    // first frame of walk-right cycle (UPDATE ME)
const WALK_RIGHT_COUNT   = 3;    // number of frames in walk-right cycle
const WALK_LEFT_START    = 3;    // first frame of walk-left cycle (UPDATE ME)
const WALK_LEFT_COUNT    = 3;    // number of frames in walk-left cycle

// ── Sprite behaviour ─────────────────────────────────────────────────────────
const WALK_FRAME_RATE    = 8;    // animation playback speed in frames per second
const WALK_SPEED         = 80;   // horizontal pixels moved per second with A / D
const SPRITE_SCALE       = 4;    // render scale for the preview sprite (1 = original size)
const SHEET_SCALE        = 0.5;  // scale at which the full sprite sheet is shown on the left

// ── Magenta key-out ──────────────────────────────────────────────────────────
// Removes the hot-pink (#FF00FF) background. Pixels where R > T, G < T, B > T
// are made fully transparent before the spritesheet texture is built.
const MAGENTA_THRESHOLD  = 200;
// ─────────────────────────────────────────────────────────────────────────────

class MarleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MarleScene' });
        this.previewFrame = IDLE_FRAME; // tracks the currently displayed frame index
    }

    preload() {
        this.load.image('sheet_raw', 'assets/marle.png');
    }

    create() {
        // ── Build transparency-keyed spritesheet from the magenta-background PNG ──
        const srcImg = this.textures.get('sheet_raw').getSourceImage();

        const canvas = document.createElement('canvas');
        canvas.width  = srcImg.naturalWidth  || srcImg.width;
        canvas.height = srcImg.naturalHeight || srcImg.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(srcImg, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = imgData.data;
        for (let i = 0; i < px.length; i += 4) {
            if (px[i] > MAGENTA_THRESHOLD && px[i + 1] < MAGENTA_THRESHOLD && px[i + 2] > MAGENTA_THRESHOLD) {
                px[i + 3] = 0;
            }
        }
        ctx.putImageData(imgData, 0, 0);

        this.textures.addSpriteSheet('marle', canvas, {
            frameWidth:  FRAME_WIDTH,
            frameHeight: FRAME_HEIGHT,
            margin:      FRAME_MARGIN,
        });

        // ── Left panel: full sprite sheet at half scale (for reference) ───────
        this.add.image(0, 0, 'sheet_raw')
            .setOrigin(0, 0)
            .setScale(SHEET_SCALE)
            .setAlpha(0.85);

        // Yellow highlight rectangle — marks the current frame on the sheet
        this.highlight = this.add.rectangle(0, 0, FRAME_WIDTH * SHEET_SCALE, FRAME_HEIGHT * SHEET_SCALE)
            .setOrigin(0, 0)
            .setFillStyle(0x000000, 0)
            .setStrokeStyle(1, 0xffff00);

        // ── Right panel: large frame preview ─────────────────────────────────
        const previewX = canvas.width * SHEET_SCALE + (CANVAS_WIDTH - canvas.width * SHEET_SCALE) / 2;
        const previewY = CANVAS_HEIGHT / 2;

        this.marle = this.add.sprite(previewX, previewY, 'marle', this.previewFrame);
        this.marle.setScale(SPRITE_SCALE);

        // ── HUD text ──────────────────────────────────────────────────────────
        const tx = canvas.width * SHEET_SCALE + 10;
        this.frameText = this.add.text(tx, 10,
            this._frameLabel(),
            { fontSize: '12px', fill: '#ffff00', fontFamily: 'monospace' }
        );
        this.add.text(tx, CANVAS_HEIGHT - 50,
            'A / D — move\n[ / ] — prev / next frame',
            { fontSize: '11px', fill: '#aaaaaa', fontFamily: 'monospace' }
        );

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
            prevFrame: Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET,    // [
            nextFrame: Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET,  // ]
        });

        this._updateHighlight();
    }

    update(time, delta) {
        const dt = delta / 1000;

        // ── Frame cycling ([ / ]) ─────────────────────────────────────────────
        const totalFrames = Math.floor(480 / FRAME_WIDTH) * Math.ceil(757 / FRAME_HEIGHT);
        if (Phaser.Input.Keyboard.JustDown(this.keys.prevFrame)) {
            this.previewFrame = Math.max(0, this.previewFrame - 1);
            this.marle.setFrame(this.previewFrame);
            this.marle.anims.stop();
            this.frameText.setText(this._frameLabel());
            this._updateHighlight();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.nextFrame)) {
            this.previewFrame = this.previewFrame + 1;
            this.marle.setFrame(this.previewFrame);
            this.marle.anims.stop();
            this.frameText.setText(this._frameLabel());
            this._updateHighlight();
        }

        // ── Movement (A / D) ──────────────────────────────────────────────────
        if (this.keys.d.isDown) {
            this.marle.x += WALK_SPEED * dt;
            if (this.marle.anims.getName() !== 'walk_right') {
                this.marle.play('walk_right');
                this.frameText.setText('walking right');
            }
        } else if (this.keys.a.isDown) {
            this.marle.x -= WALK_SPEED * dt;
            if (this.marle.anims.getName() !== 'walk_left') {
                this.marle.play('walk_left');
                this.frameText.setText('walking left');
            }
        } else {
            if (this.marle.anims.isPlaying) {
                this.marle.anims.stop();
                this.marle.setFrame(this.previewFrame);
                this.frameText.setText(this._frameLabel());
            }
        }
    }

    _frameLabel() {
        const cols = Math.floor(480 / FRAME_WIDTH);
        const col  = this.previewFrame % cols;
        const row  = Math.floor(this.previewFrame / cols);
        return `Frame: ${this.previewFrame}  (col ${col}, row ${row})`;
    }

    _updateHighlight() {
        const cols = Math.floor(480 / FRAME_WIDTH);
        const col  = this.previewFrame % cols;
        const row  = Math.floor(this.previewFrame / cols);
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
