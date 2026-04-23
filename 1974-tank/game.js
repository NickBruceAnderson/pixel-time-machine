/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH           = 600;    // canvas width in pixels
const CANVAS_HEIGHT          = 600;    // canvas height in pixels

const ARENA_COLOR            = 0x111122; // background fill
const WALL_COLOR             = 0x445566; // wall fill
const PLAYER_COLOR           = 0x00dd66; // player tank body
const PLAYER_BARREL_COLOR    = 0x009944; // player barrel
const ENEMY_COLOR            = 0xdd2200; // enemy turret body
const ENEMY_BARREL_COLOR     = 0xaa1100; // enemy barrel
const PLAYER_BULLET_COLOR    = 0xffee00; // player bullet
const ENEMY_BULLET_COLOR     = 0xff7700; // enemy bullet
const SCORE_COLOR            = '#ffffff'; // score text color

const PLAYER_START_X         = 120;    // player start x
const PLAYER_START_Y         = 480;    // player start y
const PLAYER_START_ANGLE     = 0;      // start angle in degrees (0 = facing up, clockwise positive)

const ENEMY_X                = 480;    // enemy turret center x (fixed)
const ENEMY_Y                = 120;    // enemy turret center y (fixed)

const TANK_W                 = 18;     // tank body width in pixels
const TANK_H                 = 22;     // tank body height in pixels
const BARREL_W               = 4;      // barrel visual width in pixels
const BARREL_H               = 14;     // barrel visual length in pixels

const MOVE_SPEED             = 160;    // forward/backward speed in pixels per second
const ROTATE_SPEED           = 180;    // rotation speed in degrees per second

const BULLET_SIZE            = 4;      // bullet square side in pixels
const BULLET_SPEED           = 360;    // bullet travel speed in pixels per second
const BULLET_LIFESPAN_MS     = 2500;   // bullet auto-destroys after this many ms
const BULLET_COOLDOWN_MS     = 500;    // min ms between player shots

const ENEMY_FIRE_INTERVAL_MS = 2000;   // base ms between enemy shots
const ENEMY_FIRE_JITTER_MS   = 800;    // random ms added to each enemy shot interval

const RESET_DELAY_MS         = 1000;   // ms pause before repositioning after a hit

const SCORE_X                = CANVAS_WIDTH / 2;  // score text center x
const SCORE_Y                = 10;                 // score text top y

// Walls: each row is [centerX, centerY, width, height] in pixels
const WALLS = [
    [300, 160, 180, 16],   // top-center horizontal bar
    [150, 320,  16, 140],  // left-center vertical bar
    [450, 320,  16, 140],  // right-center vertical bar
    [300, 440, 180, 16],   // bottom-center horizontal bar
];
// ─────────────────────────────────────────────────────────────────────────────

class TankScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TankScene' });
    }

    create() {
        this.scorePlayer    = 0;
        this.scoreEnemy     = 0;
        this.resetting      = false;
        this.playerBullet   = null;
        this.lastPlayerShot = 0;

        // Background
        this.add.rectangle(
            CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2,
            CANVAS_WIDTH, CANVAS_HEIGHT,
            ARENA_COLOR
        );

        // Walls (static physics bodies stored for per-wall collision setup)
        this.wallObjects = [];
        for (const [wx, wy, ww, wh] of WALLS) {
            const wall = this.add.rectangle(wx, wy, ww, wh, WALL_COLOR);
            this.physics.add.existing(wall, true);
            this.wallObjects.push(wall);
        }

        // Player tank (dynamic body)
        this.player = this.add.rectangle(PLAYER_START_X, PLAYER_START_Y, TANK_W, TANK_H, PLAYER_COLOR);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.playerAngle = PLAYER_START_ANGLE;
        this.player.rotation = Phaser.Math.DegToRad(this.playerAngle);

        // Player barrel (visual only — no physics body)
        this.playerBarrel = this.add.rectangle(0, 0, BARREL_W, BARREL_H, PLAYER_BARREL_COLOR);

        // Enemy turret (static body — does not move)
        this.enemy = this.add.rectangle(ENEMY_X, ENEMY_Y, TANK_W, TANK_H, ENEMY_COLOR);
        this.physics.add.existing(this.enemy, true);

        // Enemy barrel (visual only)
        this.enemyBarrel = this.add.rectangle(0, 0, BARREL_W, BARREL_H, ENEMY_BARREL_COLOR);

        // Bullet groups
        this.playerBullets = this.physics.add.group();
        this.enemyBullets  = this.physics.add.group();

        // Score text (depth ensures it renders above all game objects)
        this.scoreText = this.add.text(SCORE_X, SCORE_Y, 'You 0  —  Enemy 0', {
            fontSize: '16px',
            fill: SCORE_COLOR,
            fontFamily: 'monospace',
        }).setOrigin(0.5, 0).setDepth(10);

        // Bullet vs wall: destroy bullet on contact
        for (const wall of this.wallObjects) {
            this.physics.add.overlap(this.playerBullets, wall, (b) => {
                if (b.active) {
                    b.destroy();
                    if (this.playerBullet === b) this.playerBullet = null;
                }
            });
            this.physics.add.overlap(this.enemyBullets, wall, (b) => {
                if (b.active) b.destroy();
            });
            // Player body stops at walls
            this.physics.add.collider(this.player, wall);
        }

        // Player bullet hits enemy — player scores
        this.physics.add.overlap(this.playerBullets, this.enemy, (b) => {
            if (this.resetting || !b.active) return;
            b.destroy();
            this.playerBullet = null;
            this.scorePlayer++;
            this.triggerReset();
        });

        // Enemy bullet hits player — enemy scores
        this.physics.add.overlap(this.enemyBullets, this.player, (b) => {
            if (this.resetting || !b.active) return;
            b.destroy();
            this.scoreEnemy++;
            this.triggerReset();
        });

        // Input
        this.keys = this.input.keyboard.addKeys({
            w:     Phaser.Input.Keyboard.KeyCodes.W,
            s:     Phaser.Input.Keyboard.KeyCodes.S,
            a:     Phaser.Input.Keyboard.KeyCodes.A,
            d:     Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.scheduleEnemyShot();
    }

    // ── Enemy ──────────────────────────────────────────────────────────────────

    scheduleEnemyShot() {
        const delay = ENEMY_FIRE_INTERVAL_MS + Phaser.Math.Between(0, ENEMY_FIRE_JITTER_MS);
        this.time.delayedCall(delay, () => {
            if (!this.resetting) this.fireEnemyBullet();
            this.scheduleEnemyShot();
        });
    }

    fireEnemyBullet() {
        const rad    = this.enemyAimAngle();
        const bullet = this.add.rectangle(ENEMY_X, ENEMY_Y, BULLET_SIZE, BULLET_SIZE, ENEMY_BULLET_COLOR);
        this.physics.add.existing(bullet);
        bullet.body.setVelocity(Math.sin(rad) * BULLET_SPEED, -Math.cos(rad) * BULLET_SPEED);
        this.enemyBullets.add(bullet);
        this.time.delayedCall(BULLET_LIFESPAN_MS, () => { if (bullet.active) bullet.destroy(); });
    }

    enemyAimAngle() {
        // Angle toward player in up=0/clockwise convention: atan2(dx, -dy)
        return Math.atan2(this.player.x - ENEMY_X, -(this.player.y - ENEMY_Y));
    }

    // ── Player ─────────────────────────────────────────────────────────────────

    firePlayerBullet() {
        if (this.playerBullet && this.playerBullet.active) return;
        if (this.time.now - this.lastPlayerShot < BULLET_COOLDOWN_MS) return;
        this.lastPlayerShot = this.time.now;

        const rad    = Phaser.Math.DegToRad(this.playerAngle);
        const spawnX = this.player.x + Math.sin(rad) * (TANK_H / 2 + BULLET_SIZE);
        const spawnY = this.player.y - Math.cos(rad) * (TANK_H / 2 + BULLET_SIZE);
        const bullet = this.add.rectangle(spawnX, spawnY, BULLET_SIZE, BULLET_SIZE, PLAYER_BULLET_COLOR);
        this.physics.add.existing(bullet);
        bullet.body.setVelocity(Math.sin(rad) * BULLET_SPEED, -Math.cos(rad) * BULLET_SPEED);
        this.playerBullets.add(bullet);
        this.playerBullet = bullet;

        this.time.delayedCall(BULLET_LIFESPAN_MS, () => {
            if (bullet.active) bullet.destroy();
            if (this.playerBullet === bullet) this.playerBullet = null;
        });
    }

    // ── Round management ───────────────────────────────────────────────────────

    triggerReset() {
        this.resetting = true;
        this.player.body.setVelocity(0, 0);
        this.scoreText.setText(`You ${this.scorePlayer}  —  Enemy ${this.scoreEnemy}`);
        this.playerBullets.clear(true, true);
        this.enemyBullets.clear(true, true);
        this.playerBullet = null;
        this.time.delayedCall(RESET_DELAY_MS, () => {
            this.player.x = PLAYER_START_X;
            this.player.y = PLAYER_START_Y;
            this.player.body.reset(PLAYER_START_X, PLAYER_START_Y);
            this.playerAngle = PLAYER_START_ANGLE;
            this.player.rotation = Phaser.Math.DegToRad(this.playerAngle);
            this.resetting = false;
        });
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    // Positions and rotates a barrel rectangle so it protrudes from a tank's nose.
    // Angle convention: 0 = up (north), clockwise positive; sin/−cos maps to screen X/Y.
    placeBarrel(barrel, cx, cy, rad) {
        const dist   = TANK_H / 2 + BARREL_H / 2;
        barrel.x     = cx + Math.sin(rad) * dist;
        barrel.y     = cy - Math.cos(rad) * dist;
        barrel.rotation = rad;
    }

    // ── Update loop ────────────────────────────────────────────────────────────

    update(time, delta) {
        const dt        = delta / 1000;
        const playerRad = Phaser.Math.DegToRad(this.playerAngle);

        // Barrel visuals always track their tanks
        this.placeBarrel(this.playerBarrel, this.player.x, this.player.y, playerRad);
        this.placeBarrel(this.enemyBarrel,  ENEMY_X, ENEMY_Y, this.enemyAimAngle());

        if (this.resetting) {
            this.player.body.setVelocity(0, 0);
            return;
        }

        // Rotate
        if (this.keys.a.isDown) this.playerAngle -= ROTATE_SPEED * dt;
        if (this.keys.d.isDown) this.playerAngle += ROTATE_SPEED * dt;
        this.player.rotation = Phaser.Math.DegToRad(this.playerAngle);

        // Move forward / backward along facing direction
        const rad = Phaser.Math.DegToRad(this.playerAngle);
        if (this.keys.w.isDown) {
            this.player.body.setVelocity(Math.sin(rad) * MOVE_SPEED, -Math.cos(rad) * MOVE_SPEED);
        } else if (this.keys.s.isDown) {
            this.player.body.setVelocity(-Math.sin(rad) * MOVE_SPEED, Math.cos(rad) * MOVE_SPEED);
        } else {
            this.player.body.setVelocity(0, 0);
        }

        // Fire
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.firePlayerBullet();
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width:  CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade:  { debug: false },
    },
    scene: TankScene,
};

new Phaser.Game(config);
