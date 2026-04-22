/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────
// Every magic number lives here. Tweak freely.

const CANVAS_WIDTH  = 480;   // game canvas width in pixels
const CANVAS_HEIGHT = 270;   // game canvas height in pixels

// ── Sprite sheet layout ──────────────────────────────────────────────────────
// marle.png is a 480×757 RGB image with a solid magenta background.
// Frames are counted left-to-right, top-to-bottom starting at 0.
// Adjust FRAME_WIDTH / FRAME_HEIGHT until the grid lines up with the sprites,
// then adjust the animation start indices until the right frames play.
const FRAME_WIDTH        = 16;   // width of one sprite frame in pixels
const FRAME_HEIGHT       = 24;   // height of one sprite frame in pixels
const FRAME_MARGIN       = 0;    // pixel gap between the sheet edge and the first frame (left + top)
const FRAME_SPACING      = 0;    // pixel gap between adjacent frames in the grid

// ── Animation frame indices ──────────────────────────────────────────────────
// Frames are numbered 0, 1, 2 … left-to-right across the first row, then
// continuing on the next row. A 480px-wide sheet at 16px/frame = 30 per row,
// so row 1 starts at frame 30, row 2 at frame 60, etc.
// These defaults are educated guesses — open the sheet in an image editor,
// count frames, and update these numbers to match the actual walk cycles.
const WALK_RIGHT_START   = 6;    // index of the first walk-right frame
const WALK_RIGHT_COUNT   = 3;    // how many frames in the walk-right cycle
const WALK_LEFT_START    = 3;    // index of the first walk-left frame
const WALK_LEFT_COUNT    = 3;    // how many frames in the walk-left cycle
const IDLE_FRAME         = 0;    // frame shown when standing still

// ── Sprite behaviour ─────────────────────────────────────────────────────────
const WALK_FRAME_RATE    = 8;    // animation speed in frames per second
const WALK_SPEED         = 100;  // horizontal movement speed in pixels per second
const SPRITE_SCALE       = 4;    // render scale (1 = original pixel size, 4 = 64×96px on screen)

// ── Magenta key-out ──────────────────────────────────────────────────────────
// Pixels where R > threshold AND G < threshold AND B > threshold are made
// transparent. Standard SNES-rip magenta is #FF00FF — threshold of 200 catches
// it and minor palette variants.
const MAGENTA_THRESHOLD  = 200;
// ─────────────────────────────────────────────────────────────────────────────

class MarleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MarleScene' });
    }

    preload() {
        // Load as a plain image first so we can process it in create()
        this.load.image('marle_raw', 'assets/marle.png');
    }

    create() {
        // ── Build a transparency-keyed spritesheet from the raw image ─────────
        // The source PNG has no alpha channel, so we draw it to a canvas and
        // zero out every magenta pixel before handing it to Phaser.
        const rawSrc = this.textures.get('marle_raw').source[0].image;

        const canvas = document.createElement('canvas');
        canvas.width  = rawSrc.naturalWidth;
        canvas.height = rawSrc.naturalHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(rawSrc, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = imgData.data;
        for (let i = 0; i < px.length; i += 4) {
            if (px[i] > MAGENTA_THRESHOLD && px[i + 1] < MAGENTA_THRESHOLD && px[i + 2] > MAGENTA_THRESHOLD) {
                px[i + 3] = 0; // fully transparent
            }
        }
        ctx.putImageData(imgData, 0, 0);

        this.textures.addSpriteSheet('marle', canvas, {
            frameWidth:  FRAME_WIDTH,
            frameHeight: FRAME_HEIGHT,
            margin:      FRAME_MARGIN,
            spacing:     FRAME_SPACING,
        });

        // ── Animations ───────────────────────────────────────────────────────
        this.anims.create({
            key:       'walk_right',
            frames:    this.anims.generateFrameNumbers('marle', {
                start: WALK_RIGHT_START,
                end:   WALK_RIGHT_START + WALK_RIGHT_COUNT - 1,
            }),
            frameRate: WALK_FRAME_RATE,
            repeat:    -1,  // loop forever
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

        // ── Sprite ───────────────────────────────────────────────────────────
        this.marle = this.add.sprite(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'marle', IDLE_FRAME);
        this.marle.setScale(SPRITE_SCALE);

        // ── Input ────────────────────────────────────────────────────────────
        this.keys = this.input.keyboard.addKeys({
            left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        });
    }

    update(time, delta) {
        const dt = delta / 1000; // ms → seconds for pixels-per-second math

        if (this.keys.right.isDown) {
            this.marle.x += WALK_SPEED * dt;
            if (this.marle.anims.getName() !== 'walk_right') {
                this.marle.play('walk_right');
            }
        } else if (this.keys.left.isDown) {
            this.marle.x -= WALK_SPEED * dt;
            if (this.marle.anims.getName() !== 'walk_left') {
                this.marle.play('walk_left');
            }
        } else {
            this.marle.anims.stop();
            this.marle.setFrame(IDLE_FRAME);
        }
    }
}

const config = {
    type:            Phaser.AUTO,
    width:           CANVAS_WIDTH,
    height:          CANVAS_HEIGHT,
    backgroundColor: '#000000',
    scene:           MarleScene,
};

new Phaser.Game(config);
