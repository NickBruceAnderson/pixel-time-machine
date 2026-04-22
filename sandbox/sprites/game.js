/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────

const CANVAS_WIDTH    = 400;   // game canvas width in pixels
const CANVAS_HEIGHT   = 300;   // game canvas height in pixels

const WALK_SPEED      = 120;   // movement speed in pixels per second
const WALK_FRAME_RATE = 8;     // walk animation speed in frames per second
const SPRITE_SCALE    = 2;     // render scale (1 = original 32×48 px per frame)

// Physics body — collision rectangle positioned at Marle's feet.
// All values are in unscaled sprite pixels (before SPRITE_SCALE is applied).
const BODY_WIDTH      = 20;    // width of the collision box
const BODY_HEIGHT     = 12;    // height of the collision box
const BODY_OFFSET_X   = 6;     // pixels right from the sprite's left edge
const BODY_OFFSET_Y   = 36;    // pixels down from the sprite's top edge

const PHYSICS_DEBUG   = false; // true = draw collision boxes on screen
// ─────────────────────────────────────────────────────────────────────────────

// marle2.png — 128×192, 4 cols × 4 rows, 32×48 px per frame, no margin
// Row 0: walk-down  (frames  0– 3)   Row 2: walk-left  (frames  8–11)
// Row 1: walk-right (frames  4– 7)   Row 3: walk-up    (frames 12–15)
const FRAME_WIDTH  = 32;
const FRAME_HEIGHT = 48;

const ANIMS = {
    walk_down:  { start: 0,  end: 3  },
    walk_left:  { start: 4,  end: 7  },
    walk_right: { start: 8,  end: 11 },
    walk_up:    { start: 12, end: 15 },
};

// First frame of each direction — shown when standing still
const IDLE_FRAME = { down: 0, left: 4, right: 8, up: 12 };

class MarleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MarleScene' });
        this.facing = 'down'; // direction Marle last moved
    }

    preload() {
        // Load as a plain image — this.load.spritesheet() fails silently under
        // file:// protocol. We manually register the spritesheet in create().
        this.load.image('marle_raw', 'assets/marle2.png');
    }

    create() {
        // ── Register spritesheet from the loaded image via canvas ─────────────
        // marle2.png is RGBA so no pixel processing is needed — just re-register
        // it with Phaser's spritesheet frame data.
        const src = this.textures.get('marle_raw').getSourceImage();
        const canvas = document.createElement('canvas');
        canvas.width  = src.naturalWidth  || src.width;
        canvas.height = src.naturalHeight || src.height;
        canvas.getContext('2d').drawImage(src, 0, 0);
        this.textures.addSpriteSheet('marle', canvas, {
            frameWidth:  FRAME_WIDTH,
            frameHeight: FRAME_HEIGHT,
        });

        // ── Sprite with arcade physics body ───────────────────────────────────
        this.marle = this.physics.add.sprite(
            CANVAS_WIDTH  / 2,
            CANVAS_HEIGHT / 2,
            'marle',
            IDLE_FRAME.down
        );
        this.marle.setScale(SPRITE_SCALE);
        this.marle.setCollideWorldBounds(true);

        // Collision box sized to Marle's feet, not her full sprite
        this.marle.body.setSize(BODY_WIDTH, BODY_HEIGHT);
        this.marle.body.setOffset(BODY_OFFSET_X, BODY_OFFSET_Y);

        // ── Animations ────────────────────────────────────────────────────────
        for (const [key, range] of Object.entries(ANIMS)) {
            this.anims.create({
                key,
                frames:    this.anims.generateFrameNumbers('marle', { start: range.start, end: range.end }),
                frameRate: WALK_FRAME_RATE,
                repeat:    -1,
            });
        }

        // ── Input ─────────────────────────────────────────────────────────────
        this.keys = this.input.keyboard.createCursorKeys();

        // WASD as alternative movement keys
        const wasd = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
        });
        this.wasd = wasd;
    }

    update() {
        const { left, right, up, down } = this.keys;
        const { a, d, w, s } = this.wasd;

        let vx = 0;
        let vy = 0;

        if (left.isDown  || a.isDown) vx = -WALK_SPEED;
        if (right.isDown || d.isDown) vx =  WALK_SPEED;
        if (up.isDown    || w.isDown) vy = -WALK_SPEED;
        if (down.isDown  || s.isDown) vy =  WALK_SPEED;

        // Normalize diagonal movement so speed is consistent in all directions
        if (vx !== 0 && vy !== 0) {
            vx *= Math.SQRT1_2; // 1/√2 ≈ 0.707
            vy *= Math.SQRT1_2;
        }

        this.marle.setVelocity(vx, vy);

        if (vx !== 0 || vy !== 0) {
            // Vertical direction takes animation priority over horizontal
            const dir = vy > 0 ? 'down' : vy < 0 ? 'up' : vx > 0 ? 'right' : 'left';

            if (dir !== this.facing) {
                this.facing = dir;
                this.marle.play('walk_' + dir);
            }
        } else {
            // Standing still — stop animation and show the idle frame for current direction
            if (this.marle.anims.isPlaying) {
                this.marle.anims.stop();
                this.marle.setFrame(IDLE_FRAME[this.facing]);
            }
        }
    }
}

const config = {
    type:   Phaser.AUTO,
    width:  CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade:  { gravity: { y: 0 }, debug: PHYSICS_DEBUG },
    },
    scene: MarleScene,
};

new Phaser.Game(config);
