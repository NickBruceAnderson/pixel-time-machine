/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH           = 600;    // canvas width in pixels
const CANVAS_HEIGHT          = 600;    // canvas height in pixels
const FOOTER_HEIGHT          = 100;    // reserved footer strip at bottom (text only)
const PLAY_H                 = CANVAS_HEIGHT - FOOTER_HEIGHT; // gameplay area height

const ARENA_COLOR            = 0x111122; // gameplay background fill
const FOOTER_COLOR           = 0x0a0a14; // footer background fill
const WALL_COLOR             = 0x445566; // wall fill
const PLAYER_COLOR           = 0x00dd66; // player tank body
const PLAYER_BARREL_COLOR    = 0x009944; // player barrel
const ENEMY_COLOR            = 0xdd2200; // enemy turret body
const ENEMY_BARREL_COLOR     = 0xaa1100; // enemy barrel
const PLAYER_BULLET_COLOR    = 0xffee00; // player bullet
const ENEMY_BULLET_COLOR     = 0xff7700; // enemy bullet
const SCORE_COLOR            = '#ffffff'; // score text color

const PLAYER_START_X         = 120;    // player start x
const PLAYER_START_Y         = 420;    // player start y
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
const BULLET_LIFESPAN_MS     = 1000;   // bullet auto-destroys after this many ms
const BULLET_COOLDOWN_MS     = 1000;    // min ms between player shots

const ENEMY_FIRE_INTERVAL_MS = 1000;   // base ms between enemy shots
const ENEMY_FIRE_JITTER_MS   = 800;    // random ms added to each enemy shot interval

const RESET_DELAY_MS         = 1000;   // ms pause before repositioning after a hit
const SCORE_TO_WIN           = 3;      // first to this score wins

const HIT_STAGE1_ALPHA       = 0.5;   // alpha during first hit flash stage
const HIT_STAGE1_MS          = 250;   // duration of first hit flash stage in ms
const HIT_STAGE2_ALPHA       = 0;     // alpha during second hit flash stage
const HIT_STAGE2_MS          = 250;   // duration of second hit flash stage in ms

const WALL_DESTRUCTIBLE      = 0;      // 0 = indestructible, 1 = bullet destroys wall

// HUD layout (footer area: y = PLAY_H to CANVAS_HEIGHT)
const HUD_Y                  = PLAY_H + 22;  // center y for score row in footer
const HUD_LABEL_Y            = PLAY_H + 70;  // center y for footer label
const BAR_W                  = 70;           // cooldown bar width in pixels
const BAR_H                  = 8;            // cooldown bar height in pixels
const PLAYER_BAR_X           = 75;           // player bar left edge x
const ENEMY_BAR_X            = 525;          // enemy bar right edge x
const BAR_BG_COLOR           = 0x223333;     // bar background color
const BAR_FILL_COLOR         = 0x44ff88;     // bar fill color (shot ready)

// Walls: each row is [centerX, centerY, width, height] in pixels
const WALLS = [
    [300, 160, 180, 16],   // top-center horizontal bar
    [150, 300,  16, 140],  // left-center vertical bar
    [450, 300,  16, 140],  // right-center vertical bar
    [300, 420, 180, 16],   // bottom-center horizontal bar
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
        this.gameOver       = false;
        this.playerBullet   = null;
        this.lastPlayerShot = -BULLET_COOLDOWN_MS;     // start ready
        this.lastEnemyShot  = -ENEMY_FIRE_INTERVAL_MS; // start ready

        // Gameplay background (top strip)
        this.add.rectangle(
            CANVAS_WIDTH / 2, PLAY_H / 2,
            CANVAS_WIDTH, PLAY_H,
            ARENA_COLOR
        );

        // Footer background (bottom strip)
        this.add.rectangle(
            CANVAS_WIDTH / 2, PLAY_H + FOOTER_HEIGHT / 2,
            CANVAS_WIDTH, FOOTER_HEIGHT,
            FOOTER_COLOR
        );

        // Restrict physics world to gameplay area so the player can't enter the footer
        this.physics.world.setBounds(0, 0, CANVAS_WIDTH, PLAY_H);

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

        // ── HUD footer ────────────────────────────────────────────────────────

        // Player score (far left)
        this.scorePlayerText = this.add.text(10, HUD_Y, 'You: 0', {
            fontSize: '13px', fill: SCORE_COLOR, fontFamily: 'monospace',
        }).setOrigin(0, 0.5).setDepth(10);

        // Player cooldown bar (left-anchored, fills rightward)
        this.add.rectangle(PLAYER_BAR_X, HUD_Y, BAR_W, BAR_H, BAR_BG_COLOR)
            .setOrigin(0, 0.5).setDepth(10);
        this.playerBarFill = this.add.rectangle(PLAYER_BAR_X, HUD_Y, BAR_W, BAR_H, BAR_FILL_COLOR)
            .setOrigin(0, 0.5).setDepth(11);

        // Enemy cooldown bar (right-anchored, fills leftward)
        this.add.rectangle(ENEMY_BAR_X, HUD_Y, BAR_W, BAR_H, BAR_BG_COLOR)
            .setOrigin(1, 0.5).setDepth(10);
        this.enemyBarFill = this.add.rectangle(ENEMY_BAR_X, HUD_Y, BAR_W, BAR_H, BAR_FILL_COLOR)
            .setOrigin(1, 0.5).setDepth(11);

        // Enemy score (far right)
        this.scoreEnemyText = this.add.text(CANVAS_WIDTH - 10, HUD_Y, 'Enemy: 0', {
            fontSize: '13px', fill: SCORE_COLOR, fontFamily: 'monospace',
        }).setOrigin(1, 0.5).setDepth(10);

        // Footer label (centered)
        this.add.text(CANVAS_WIDTH / 2, HUD_LABEL_Y, 'Tank, first to three wins', {
            fontSize: '13px', fill: '#445566', fontFamily: 'monospace',
        }).setOrigin(0.5, 0.5).setDepth(10);

        // Win / replay message — hidden until game over
        this.messageText = this.add.text(CANVAS_WIDTH / 2, PLAY_H / 2, '', {
            fontSize: '28px', fill: '#ffffff', fontFamily: 'monospace', align: 'center',
        }).setOrigin(0.5, 0.5).setDepth(10);

        // Bullet vs wall: bullet always dies; wall dies only if WALL_DESTRUCTIBLE
        for (const wall of this.wallObjects) {
            this.physics.add.overlap(this.playerBullets, wall, (b1, b2) => {
                const bullet = (b1 === wall) ? b2 : b1;
                if (bullet.active) bullet.destroy();
                if (WALL_DESTRUCTIBLE && wall.active) wall.destroy();
                if (this.playerBullet && !this.playerBullet.active) this.playerBullet = null;
            });
            this.physics.add.overlap(this.enemyBullets, wall, (b1, b2) => {
                const bullet = (b1 === wall) ? b2 : b1;
                if (bullet.active) bullet.destroy();
                if (WALL_DESTRUCTIBLE && wall.active) wall.destroy();
            });
            // Player body stops at walls
            this.physics.add.collider(this.player, wall);
        }

        // Player bullet hits enemy — player scores (enemy is never destroyed, only bullet)
        this.physics.add.overlap(this.playerBullets, this.enemy, (b1, b2) => {
            if (this.resetting || this.gameOver) return;
            const bullet = (b1 === this.enemy) ? b2 : b1;
            if (!bullet.active) return;
            bullet.destroy();
            this.playerBullet = null;
            this.scorePlayer++;
            this.triggerReset('enemy');
        });

        // Enemy bullet hits player — enemy scores
        this.physics.add.overlap(this.enemyBullets, this.player, (b1, b2) => {
            if (this.resetting || this.gameOver) return;
            const bullet = (b1 === this.player) ? b2 : b1;
            if (!bullet.active) return;
            bullet.destroy();
            this.scoreEnemy++;
            this.triggerReset('player');
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
            if (!this.resetting && !this.gameOver) this.fireEnemyBullet();
            this.scheduleEnemyShot();
        });
    }

    fireEnemyBullet() {
        this.lastEnemyShot = this.time.now;
        const rad    = this.enemyAimAngle();
        const bullet = this.add.rectangle(ENEMY_X, ENEMY_Y, BULLET_SIZE, BULLET_SIZE, ENEMY_BULLET_COLOR);
        this.physics.add.existing(bullet);
        this.enemyBullets.add(bullet);
        bullet.body.setVelocity(Math.sin(rad) * BULLET_SPEED, -Math.cos(rad) * BULLET_SPEED);
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
        this.playerBullets.add(bullet);
        this.playerBullet = bullet;
        bullet.body.setVelocity(Math.sin(rad) * BULLET_SPEED, -Math.cos(rad) * BULLET_SPEED);

        this.time.delayedCall(BULLET_LIFESPAN_MS, () => {
            if (bullet.active) bullet.destroy();
            if (this.playerBullet === bullet) this.playerBullet = null;
        });
    }

    // ── Round management ───────────────────────────────────────────────────────

    triggerReset(hitTarget) {
        this.resetting = true;
        this.player.body.setVelocity(0, 0);
        this.scorePlayerText.setText(`You: ${this.scorePlayer}`);
        this.scoreEnemyText.setText(`Enemy: ${this.scoreEnemy}`);
        this.playerBullets.clear(true, true);
        this.enemyBullets.clear(true, true);
        this.playerBullet = null;

        const hitBody   = hitTarget === 'player' ? this.player      : this.enemy;
        const hitBarrel = hitTarget === 'player' ? this.playerBarrel : this.enemyBarrel;
        this.playHitFlash(hitBody, hitBarrel);

        if (this.checkWin()) return;

        this.time.delayedCall(RESET_DELAY_MS, () => {
            this.player.setAlpha(1);
            this.playerBarrel.setAlpha(1);
            this.enemy.setAlpha(1);
            this.enemyBarrel.setAlpha(1);
            this.player.x = PLAYER_START_X;
            this.player.y = PLAYER_START_Y;
            this.player.body.reset(PLAYER_START_X, PLAYER_START_Y);
            this.playerAngle = PLAYER_START_ANGLE;
            this.player.rotation = Phaser.Math.DegToRad(this.playerAngle);
            this.resetting = false;
        });
    }

    checkWin() {
        if (this.scorePlayer >= SCORE_TO_WIN) {
            this.endGame('You win!');
            return true;
        }
        if (this.scoreEnemy >= SCORE_TO_WIN) {
            this.endGame('Enemy wins!');
            return true;
        }
        return false;
    }

    endGame(message) {
        this.gameOver = true;
        this.messageText.setText(message + '\n\nPress SPACE to play again');
    }

    playHitFlash(body, barrel) {
        body.setAlpha(HIT_STAGE1_ALPHA);
        barrel.setAlpha(HIT_STAGE1_ALPHA);
        this.time.delayedCall(HIT_STAGE1_MS, () => {
            body.setAlpha(HIT_STAGE2_ALPHA);
            barrel.setAlpha(HIT_STAGE2_ALPHA);
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

        // Cooldown bars update every frame regardless of game state
        const playerReady = Math.min(1, (time - this.lastPlayerShot) / BULLET_COOLDOWN_MS);
        const enemyReady  = Math.min(1, (time - this.lastEnemyShot)  / BULLET_COOLDOWN_MS);
        this.playerBarFill.setSize(Math.max(1, BAR_W * playerReady), BAR_H);
        this.enemyBarFill.setSize(Math.max(1, BAR_W * enemyReady),  BAR_H);

        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
                this.scene.restart();
            }
            return;
        }

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
