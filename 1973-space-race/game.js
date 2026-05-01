/// <reference types="phaser" />

// ─── TUNABLES ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH         = 600;     // logical canvas width
const CANVAS_HEIGHT        = 700;     // logical canvas height (play + HUD)
const PLAY_HEIGHT          = 600;     // gameplay area height
const HUD_TOP              = 600;     // y where HUD begins

const BG_COLOR             = '#000000';  // canvas background

const SHIP_WIDTH           = 12;     // ship rectangle width
const SHIP_HEIGHT          = 18;     // ship rectangle height
const SHIP_SPEED           = 220;    // movement speed (px/s)
const SHIP1_COLOR          = 0x00ccff;  // player 1 color (cyan)
const SHIP2_COLOR          = 0xff6600;  // player 2 color (orange)
const SHIP1_START_X        = 150;    // P1 horizontal start x
const SHIP2_START_X        = 450;    // P2 horizontal start x
const SHIP_START_Y         = 555;    // both ships start y (near bottom)

const FINISH_LINE_Y        = 50;     // y of the finish line
const FINISH_LINE_COLOR    = 0xffff00;  // finish line color
const FINISH_LINE_HEIGHT   = 3;      // finish line thickness

const SCORE_TO_WIN         = 5;      // first to this score wins

const ASTEROID_COUNT       = 10;     // total asteroids in play
const ASTEROID_MIN_RADIUS  = 10;     // smallest asteroid radius
const ASTEROID_MAX_RADIUS  = 20;     // largest asteroid radius
const ASTEROID_MIN_SPEED   = 55;     // slowest asteroid (px/s)
const ASTEROID_MAX_SPEED   = 140;    // fastest asteroid (px/s)

// y positions of each horizontal asteroid lane
const ASTEROID_LANES       = [120, 200, 280, 365, 455];

const HIT_FLASH_ALPHA      = 0.15;   // ship alpha during flash stage
const HIT_FLASH_MS         = 150;    // flash stage duration
const RESET_DELAY_MS       = 700;    // total ms before ship reappears at start

const STAR_COUNT           = 80;     // background star count

// HUD text layout
const SCORE_FONT_SIZE      = '38px'; // score digit size
const UI_FONT_SIZE         = '13px'; // footer label size
const MSG_FONT_SIZE        = '26px'; // win message size
const P1_SCORE_X           = 120;    // P1 score text x
const P2_SCORE_X           = 480;    // P2 score text x
const SCORES_Y             = HUD_TOP + 30;  // score row y
const HUD_LABEL_Y          = HUD_TOP + 72;  // footer hint y

// Key bindings
const KEYS_P1 = { up: 'W', down: 'S', left: 'A', right: 'D' };
const KEYS_P2 = { up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT' };
// ─────────────────────────────────────────────────────────────────────────────

class SpaceRaceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SpaceRaceScene' });
    }

    create() {
        this.score1         = 0;
        this.score2         = 0;
        this.gameOver       = false;
        this.ship1Resetting = false;
        this.ship2Resetting = false;

        this.buildStarfield();
        this.buildFinishLine();
        this.buildShips();
        this.buildAsteroids();
        this.buildHUD();

        this.keys = this.input.keyboard.addKeys({
            w:     Phaser.Input.Keyboard.KeyCodes[KEYS_P1.up],
            s:     Phaser.Input.Keyboard.KeyCodes[KEYS_P1.down],
            a:     Phaser.Input.Keyboard.KeyCodes[KEYS_P1.left],
            d:     Phaser.Input.Keyboard.KeyCodes[KEYS_P1.right],
            up:    Phaser.Input.Keyboard.KeyCodes[KEYS_P2.up],
            down:  Phaser.Input.Keyboard.KeyCodes[KEYS_P2.down],
            left:  Phaser.Input.Keyboard.KeyCodes[KEYS_P2.left],
            right: Phaser.Input.Keyboard.KeyCodes[KEYS_P2.right],
            r:     Phaser.Input.Keyboard.KeyCodes.R,
        });
    }

    buildStarfield() {
        const g = this.add.graphics();
        for (let i = 0; i < STAR_COUNT; i++) {
            const x       = Phaser.Math.Between(0, CANVAS_WIDTH);
            const y       = Phaser.Math.Between(0, PLAY_HEIGHT);
            const bright  = Math.random() < 0.15 ? 0.9 : 0.45;
            const radius  = Math.random() < 0.15 ? 1.5 : 0.8;
            g.fillStyle(0xffffff, bright);
            g.fillCircle(x, y, radius);
        }
    }

    buildFinishLine() {
        this.add.rectangle(
            CANVAS_WIDTH / 2, FINISH_LINE_Y,
            CANVAS_WIDTH, FINISH_LINE_HEIGHT,
            FINISH_LINE_COLOR
        );
        this.add.text(CANVAS_WIDTH / 2, FINISH_LINE_Y - 12, 'FINISH', {
            fontSize: '11px', fill: '#ffff00', fontFamily: 'monospace',
        }).setOrigin(0.5, 1);
    }

    buildShips() {
        this.ship1 = this.add.rectangle(
            SHIP1_START_X, SHIP_START_Y,
            SHIP_WIDTH, SHIP_HEIGHT,
            SHIP1_COLOR
        );
        this.ship2 = this.add.rectangle(
            SHIP2_START_X, SHIP_START_Y,
            SHIP_WIDTH, SHIP_HEIGHT,
            SHIP2_COLOR
        );
    }

    buildAsteroids() {
        this.asteroids = [];
        for (let i = 0; i < ASTEROID_COUNT; i++) {
            const laneY = ASTEROID_LANES[i % ASTEROID_LANES.length];
            const r     = Phaser.Math.Between(ASTEROID_MIN_RADIUS, ASTEROID_MAX_RADIUS);
            const x     = Phaser.Math.Between(0, CANVAS_WIDTH);
            const speed = Phaser.Math.Between(ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED);
            const dir   = (i % 2 === 0) ? 1 : -1;

            // Vary gray shade so asteroids don't look identical
            const shade = Phaser.Math.Between(100, 175);
            const color = (shade << 16) | (shade << 8) | shade;

            const obj = this.add.circle(x, laneY, r, color);
            this.asteroids.push({ obj, vx: speed * dir, r });
        }
    }

    buildHUD() {
        // Zone separator
        this.add.rectangle(CANVAS_WIDTH / 2, HUD_TOP, CANVAS_WIDTH, 1, 0x333333).setAlpha(0.6);

        // Player labels
        this.add.text(P1_SCORE_X, HUD_TOP + 6, 'P1', {
            fontSize: '12px', fill: '#00ccff', fontFamily: 'monospace',
        }).setOrigin(0.5, 0);
        this.add.text(P2_SCORE_X, HUD_TOP + 6, 'P2', {
            fontSize: '12px', fill: '#ff6600', fontFamily: 'monospace',
        }).setOrigin(0.5, 0);

        // Score counters
        this.score1Text = this.add.text(P1_SCORE_X, SCORES_Y, '0', {
            fontSize: SCORE_FONT_SIZE, fill: '#00ccff', fontFamily: 'monospace',
        }).setOrigin(0.5, 0.5);
        this.score2Text = this.add.text(P2_SCORE_X, SCORES_Y, '0', {
            fontSize: SCORE_FONT_SIZE, fill: '#ff6600', fontFamily: 'monospace',
        }).setOrigin(0.5, 0.5);

        // Center divider between scores
        this.add.text(CANVAS_WIDTH / 2, SCORES_Y, ':', {
            fontSize: SCORE_FONT_SIZE, fill: '#444444', fontFamily: 'monospace',
        }).setOrigin(0.5, 0.5);

        // Footer hint
        this.add.text(
            CANVAS_WIDTH / 2, HUD_LABEL_Y,
            'Space Race: reach the finish. Dodge asteroids. First to 5 wins.\nP1: WASD   P2: Arrow keys   R: restart after win',
            { fontSize: UI_FONT_SIZE, fill: '#445566', fontFamily: 'monospace', align: 'center' }
        ).setOrigin(0.5, 0.5);

        // Win overlay message (hidden until game over)
        this.messageText = this.add.text(CANVAS_WIDTH / 2, PLAY_HEIGHT / 2, '', {
            fontSize: MSG_FONT_SIZE, fill: '#ffffff', fontFamily: 'monospace', align: 'center',
        }).setOrigin(0.5, 0.5).setDepth(10);
    }

    // ── Ship hit: flash then teleport back to start ───────────────────────────

    hitShip(ship, isShip1) {
        if (isShip1) this.ship1Resetting = true;
        else         this.ship2Resetting = true;

        ship.setAlpha(HIT_FLASH_ALPHA);
        this.time.delayedCall(HIT_FLASH_MS, () => {
            ship.setAlpha(0);
        });
        this.time.delayedCall(RESET_DELAY_MS, () => {
            ship.x = isShip1 ? SHIP1_START_X : SHIP2_START_X;
            ship.y = SHIP_START_Y;
            ship.setAlpha(1);
            if (isShip1) this.ship1Resetting = false;
            else         this.ship2Resetting = false;
        });
    }

    checkAsteroidHits(ship, isShip1) {
        if (isShip1 ? this.ship1Resetting : this.ship2Resetting) return;

        const hw = SHIP_WIDTH / 2;
        const hh = SHIP_HEIGHT / 2;

        for (const ast of this.asteroids) {
            const dx   = ship.x - ast.obj.x;
            const dy   = ship.y - ast.obj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ast.r + Math.max(hw, hh)) {
                this.hitShip(ship, isShip1);
                return;
            }
        }
    }

    // ── Finish line crossed: award point, reset both ships ───────────────────

    scorePoint(player) {
        if (player === 1) {
            this.score1++;
            this.score1Text.setText(this.score1);
        } else {
            this.score2++;
            this.score2Text.setText(this.score2);
        }

        // Cancel any in-flight reset timers by snapping both ships back now
        this.ship1Resetting = false;
        this.ship2Resetting = false;
        this.ship1.setAlpha(1);
        this.ship2.setAlpha(1);
        this.ship1.x = SHIP1_START_X;  this.ship1.y = SHIP_START_Y;
        this.ship2.x = SHIP2_START_X;  this.ship2.y = SHIP_START_Y;

        if (this.score1 >= SCORE_TO_WIN) { this.endGame('Player 1 Wins!'); }
        else if (this.score2 >= SCORE_TO_WIN) { this.endGame('Player 2 Wins!'); }
    }

    endGame(message) {
        this.gameOver = true;
        this.messageText.setText(message + '\n\nPress R to play again');
    }

    // ── Main loop ─────────────────────────────────────────────────────────────

    update(time, delta) {
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.r)) this.scene.restart();
            return;
        }

        const dt = delta / 1000;
        const hw = SHIP_WIDTH  / 2;
        const hh = SHIP_HEIGHT / 2;

        // Move and wrap asteroids
        for (const ast of this.asteroids) {
            ast.obj.x += ast.vx * dt;
            if (ast.vx > 0 && ast.obj.x - ast.r > CANVAS_WIDTH) {
                ast.obj.x = -ast.r;
            } else if (ast.vx < 0 && ast.obj.x + ast.r < 0) {
                ast.obj.x = CANVAS_WIDTH + ast.r;
            }
        }

        // Ship 1 movement (WASD), clamped to play area
        if (!this.ship1Resetting) {
            if (this.keys.w.isDown) this.ship1.y = Math.max(hh, this.ship1.y - SHIP_SPEED * dt);
            if (this.keys.s.isDown) this.ship1.y = Math.min(PLAY_HEIGHT - hh, this.ship1.y + SHIP_SPEED * dt);
            if (this.keys.a.isDown) this.ship1.x = Math.max(hw, this.ship1.x - SHIP_SPEED * dt);
            if (this.keys.d.isDown) this.ship1.x = Math.min(CANVAS_WIDTH - hw, this.ship1.x + SHIP_SPEED * dt);
        }

        // Ship 2 movement (Arrow keys), clamped to play area
        if (!this.ship2Resetting) {
            if (this.keys.up.isDown)    this.ship2.y = Math.max(hh, this.ship2.y - SHIP_SPEED * dt);
            if (this.keys.down.isDown)  this.ship2.y = Math.min(PLAY_HEIGHT - hh, this.ship2.y + SHIP_SPEED * dt);
            if (this.keys.left.isDown)  this.ship2.x = Math.max(hw, this.ship2.x - SHIP_SPEED * dt);
            if (this.keys.right.isDown) this.ship2.x = Math.min(CANVAS_WIDTH - hw, this.ship2.x + SHIP_SPEED * dt);
        }

        // Finish line: nose of ship (top edge) crosses the line
        if (!this.ship1Resetting && this.ship1.y - hh <= FINISH_LINE_Y) {
            this.scorePoint(1);
            return;
        }
        if (!this.ship2Resetting && this.ship2.y - hh <= FINISH_LINE_Y) {
            this.scorePoint(2);
            return;
        }

        // Asteroid collision checks
        this.checkAsteroidHits(this.ship1, true);
        this.checkAsteroidHits(this.ship2, false);
    }
}

const config = {
    type:            Phaser.AUTO,
    width:           CANVAS_WIDTH,
    height:          CANVAS_HEIGHT,
    backgroundColor: BG_COLOR,
    scale: {
        mode:       Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: SpaceRaceScene,
};

new Phaser.Game(config);
