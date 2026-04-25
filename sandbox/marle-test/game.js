// --- TUNABLES ---
const SPRITE_KEY       = 'marle';
const SPRITE_PATH      = 'assets/marle5.png';
const FRAME_WIDTH      = 32;
const FRAME_HEIGHT     = 48;
const FRAMES_PER_ROW   = 17;
const SCALE            = 3;
const START_X          = 400;
const START_Y          = 300;
const MOVE_SPEED       = 200;
const RUN_MULTIPLIER   = 3;
const IDLE_FRAME       = 0;
const WALK_START       = 1;
const WALK_END         = 6;
const RUN_START        = 7;
const RUN_END          = 8;
const RUN_SEQUENCE     = [1, 2, 7, 7, 4, 5, 8, 8];
const SHOOT_READY_FRAME  = 9;
const SHOOT_FIRE_FRAME   = 10;
const SHOOT_FRAME_RATE   = 10;
const CAST_START              = 11;
const CAST_END                = 16;
const CAST_FRAME_RATE         = 10;
const CAST_RELEASE_FRAME      = 16;
const CAST_CANCELS_ON_SHOOT   = false;
const PROJECTILE_SPEED   = 2000;
const PROJECTILE_SIZE    = 10;
const PROJECTILE_LIFETIME = 1000;
const PLAYER_PROJECTILE_SPAWN_OFFSET_X = 0;
const PLAYER_PROJECTILE_SPAWN_OFFSET_Y = 8;
const SHOOT_COOLDOWN_MS  = 300;
const AURA_HEAL_AMOUNT         = 25;
const AURA_COOLDOWN_MS         = 800;
const ICE_PROJECTILE_COLOR     = 0x66ccff;
const ICE_PROJECTILE_WIDTH     = 48;
const ICE_PROJECTILE_HEIGHT    = 48;
const ICE_PROJECTILE_SPEED     = 700;
const ICE_PROJECTILE_LIFETIME  = 1400;
const ICE_COOLDOWN_MS          = 1000;
const HASTE_DURATION_MS  = 10000;
const HASTE_SHOOT_DIVISOR = 3;
const HASTE_OUTLINE_COLOR      = 0xffa500;
const OUTLINE_SOURCE_PIXELS    = 1;
const BUFF_FLASH_START_MS      = 3000;
const BUFF_FAST_FLASH_START_MS = 1000;
const BUFF_FLASH_SLOW_MS       = 300;
const BUFF_FLASH_FAST_MS       = 100;

// --- PLAYER HITBOX TUNABLES ---
const PLAYER_HITBOX_WIDTH    = 10;
const PLAYER_HITBOX_HEIGHT   = 32;
const PLAYER_HITBOX_OFFSET_X = 0;
const PLAYER_HITBOX_OFFSET_Y = 8;
const HITBOX_DEBUG           = true;
const HITBOX_DEBUG_COLOR     = 0xff0000;

// --- GAME OVER TUNABLES ---
const GAME_OVER_TEXT      = 'GAME OVER';
const RESTART_TEXT        = 'Press R to restart';
const GAME_OVER_FONT_SIZE = '48px';
const RESTART_FONT_SIZE   = '20px';
const GAME_OVER_COLOR     = '#ffffff';

// --- HUD TUNABLES ---
const HUD_MODE         = 'hide-bars'; // 'hide-bars' | 'hide-all' | 'show-all'
const SHOW_FLOAT_HUD   = false;       // false = hide HP/mana/stamina indicators above Marle
const GAME_WIDTH       = 1200;
const GAME_HEIGHT      = 900;
const FOOTER_HEIGHT    = 96;
const CANVAS_HEIGHT    = GAME_HEIGHT + FOOTER_HEIGHT;
const PLAYER_BOUNDS_PADDING_X = 16;
const PLAYER_BOUNDS_PADDING_Y = 24;
const FOOTER_BG_COLOR  = '#1a1a2e';
const FOOTER_TEXT_COLOR = '#ffffff';
const FOOTER_FONT_SIZE = '16px';
const FOOTER_PADDING_X      = 16;
const FOOTER_ACTIVE_COLOR   = '#8fd3ff';
const FOOTER_INACTIVE_COLOR = FOOTER_TEXT_COLOR;
const BAR_ROW_Y_OFFSET      = 18;
const CONTROLS_ROW_Y_OFFSET = 72;

// --- FLOATING HUD TUNABLES ---
const FLOAT_HEALTH_OFFSET_X     = -46;  // from player center, negative = left
const FLOAT_HEALTH_OFFSET_Y     = -84;  // above player center
const FLOAT_HEART_RADIUS        = 8;
const FLOAT_HEART_COLOR         = 0xcc2222;
const FLOAT_HEALTH_TEXT_GAP     = 2;    // gap between circle edge and health number
const FLOAT_HEALTH_FONT_SIZE    = '13px';
const FLOAT_HEALTH_TEXT_COLOR   = '#ffffff';
const FLOAT_MANA_OFFSET_X       = 0;
const FLOAT_MANA_OFFSET_Y       = -84;
const FLOAT_PIP_W               = 10;
const FLOAT_PIP_H               = 16;
const FLOAT_PIP_GAP             = 4;
const FLOAT_STAMINA_OFFSET_X    = 46;   // from player center, positive = right
const FLOAT_STAMINA_OFFSET_Y    = -84;
const FLOAT_STAMINA_RADIUS      = 10;
const FLOAT_STAMINA_TRACK_COLOR = 0x333333;
const FLOAT_STAMINA_FILL_COLOR  = 0x00cc44;
const FLOAT_STAMINA_LINE_W      = 3;

// --- HEALTH TUNABLES ---
const HEALTH_MAX             = 100;
const HEALTH_START           = 100;
const HEALTH_BAR_X           = 16;
const HEALTH_BAR_Y_OFFSET    = BAR_ROW_Y_OFFSET;
const HEALTH_BAR_WIDTH       = 240;
const HEALTH_BAR_HEIGHT      = 18;
const HEALTH_BAR_BG_COLOR    = 0x221111;
const HEALTH_BAR_FILL_COLOR  = 0xcc2222;
const HEALTH_BAR_BORDER_COLOR = 0xffffff;

// --- STAMINA TUNABLES ---
const STAMINA_MAX              = 100;
const STAMINA_START            = 100;
const STAMINA_DRAIN_PER_SECOND = 25;
const STAMINA_REGEN_PER_SECOND = 20;
const STAMINA_RUN_MIN          = 5;
const RUN_TOGGLE_MODE          = false;
const STAMINA_BAR_Y_OFFSET     = 42;
const STAMINA_BAR_BG_COLOR     = 0x223322;
const STAMINA_BAR_FILL_COLOR   = 0x00cc44;
const STAMINA_BAR_BORDER_COLOR = 0xffffff;

// --- MANA TUNABLES ---
const MANA_MAX               = 100;
const MANA_START             = 0;
const MANA_REGEN_PER_SECOND  = 20;
const MANA_AURA_COST         = 50;
const MANA_ICE_COST          = 50;
const MANA_HASTE_COST        = 100;
const MANA_BAR_X             = 400;
const MANA_BAR_Y_OFFSET      = BAR_ROW_Y_OFFSET;
const MANA_BAR_WIDTH         = 240;
const MANA_BAR_HEIGHT        = 18;
const MANA_BAR_BG_COLOR      = 0x222244;
const MANA_BAR_FILL_COLOR    = 0x3366ff;
const MANA_BAR_BORDER_COLOR  = 0xffffff;
const MANA_PIP_COLOR_READY     = 0x6699ff;
const MANA_PIP_COLOR_EMPTY     = 0x333355;
const MANA_BAR_DIVIDER_COLOR   = 0x8899cc;
const SPELL_PIP_WIDTH          = 5;
const SPELL_PIP_HEIGHT         = 12;
const SPELL_PIP_GAP            = 3;

// --- DUMMY TUNABLES ---
const DUMMY_X                     = 600;
const DUMMY_Y                     = 300;
const DUMMY_WIDTH                 = 28;
const DUMMY_HEIGHT                = 52;
const DUMMY_COLOR                 = 0x8b5a2b;
const DUMMY_ARM_COLOR             = 0x6b3f1f;
const DUMMY_MAX_HEALTH            = 5;
const BASIC_SHOT_DAMAGE           = 2;
const ICE_DAMAGE                  = 5;
const DUMMY_HIT_MANA_GAIN         = 5;
const DUMMY_RESPAWN_MS            = 3000;
const DUMMY_HEALTH_BAR_WIDTH      = 36;
const DUMMY_HEALTH_BAR_HEIGHT     = 5;
const DUMMY_HEALTH_BAR_Y_OFFSET   = 34;
const DUMMY_HEALTH_BAR_BG_COLOR   = 0x331111;
const DUMMY_HEALTH_BAR_FILL_COLOR = 0x00cc44;
const DUMMY_SPACING_Y             = 150;
const DUMMY_EYE_BIG_RADIUS        = 4;
const DUMMY_EYE_SMALL_RADIUS      = 2;
const DUMMY_EYE_COLOR             = 0x000000;
const DUMMY_MOUTH_COLOR           = 0x000000;
const TOP_DUMMY_COLOR             = 0xaa4a3a;
const ENEMY_PROJECTILE_COLOR      = 0xff3333;
const ENEMY_PROJECTILE_WIDTH      = 10;
const ENEMY_PROJECTILE_HEIGHT     = 6;
const ENEMY_PROJECTILE_SPEED      = 220;
const ENEMY_PROJECTILE_DAMAGE     = 10;
const TOP_DUMMY_SHOOT_COOLDOWN_MS = 1200;
const RIGHT_DUMMY_X               = 1100;
const RIGHT_DUMMY_Y               = 300;
const RIGHT_DUMMY_COLOR           = 0xaa4a3a;
const RIGHT_DUMMY_SHOOT_COOLDOWN_MS = 1200;

// Row indices
const ROW_UP    = 0;
const ROW_LEFT  = 1;
const ROW_DOWN  = 2;
const ROW_RIGHT = 3;

// Precomputed set of textureFrame indices that trigger spell release (one per direction)
const CAST_RELEASE_FRAMES = new Set([ROW_UP, ROW_LEFT, ROW_DOWN, ROW_RIGHT].map(r => r * FRAMES_PER_ROW + CAST_RELEASE_FRAME));

const DIR_VECS = {
    up:    { x:  0, y: -1 },
    left:  { x: -1, y:  0 },
    down:  { x:  0, y:  1 },
    right: { x:  1, y:  0 },
};

function getFrame(row, col) {
    return row * FRAMES_PER_ROW + col;
}

// --- PHASER CONFIG ---
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#000000b0',
    pixelArt: true,    // disables texture smoothing globally
    roundPixels: true, // snaps sprites to whole pixels to prevent sub-pixel bleed
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let wasd;
let shiftKey;
let lastDirection = 'down';
let shooting = false;
let projectiles = [];
let scene;
let lastShotTime  = -Infinity;
let casting       = false;
let pendingSpell          = null;
let pendingSpellDirection = null;
let hasteEndTime  = -Infinity;
let lastAuraTime  = -Infinity;
let lastIceTime   = -Infinity;
let hasteSprites = [];
let key1, key2, key3;
let footerW, footerA, footerS, footerD, footerShiftRun, footerLmbShoot, footerAura, footerIce, footerHaste;
let health = HEALTH_START;
let mana   = MANA_START;
let healthBarFill, manaBarFill, staminaBarFill;
let stamina     = STAMINA_START;
let runToggled  = false;
let pipAura, pipIce, pipHaste1, pipHaste2;
let dummies = [];
let enemyProjectiles       = [];
let topDummyLastShotTime   = -Infinity;
let rightDummyLastShotTime = -Infinity;
let gameOver     = false;
let restartKey;
let goText, goSub;
let hitboxDebugRect;
let footerBg;
let footerBarObjects      = [];
let footerControlsObjects = [];
let floatHealthCircle, floatHealthText;
let floatManaPip1, floatManaPip2;
let floatStaminaGfx;

function preload() {
    this.load.spritesheet(SPRITE_KEY, SPRITE_PATH, {
        frameWidth:  FRAME_WIDTH,
        frameHeight: FRAME_HEIGHT
    });
}

function create() {
    scene = this;

    // Reset mutable globals on each create (handles scene.restart())
    health              = HEALTH_START;
    mana                = MANA_START;
    stamina             = STAMINA_START;
    runToggled          = false;
    gameOver            = false;
    shooting            = false;
    casting             = false;
    pendingSpell          = null;
    pendingSpellDirection = null;
    lastDirection       = 'down';
    lastShotTime        = -Infinity;
    hasteEndTime        = -Infinity;
    lastAuraTime        = -Infinity;
    lastIceTime         = -Infinity;
    topDummyLastShotTime   = -Infinity;
    rightDummyLastShotTime = -Infinity;
    projectiles         = [];
    enemyProjectiles    = [];
    hasteSprites        = [];
    dummies             = [];
    hitboxDebugRect     = null;
    footerBarObjects      = [];
    footerControlsObjects = [];

    const anims = this.anims;

    // Idle animations (single frame, no loop)
    const idleDirs = [
        ['idle_up',    ROW_UP],
        ['idle_left',  ROW_LEFT],
        ['idle_down',  ROW_DOWN],
        ['idle_right', ROW_RIGHT],
    ];
    for (const [key, row] of idleDirs) {
        anims.create({
            key,
            frames: [{ key: SPRITE_KEY, frame: getFrame(row, IDLE_FRAME) }],
            frameRate: 1,
            repeat: 0
        });
    }

    // Walk animations
    const walkDirs = [
        ['walk_up',    ROW_UP],
        ['walk_left',  ROW_LEFT],
        ['walk_down',  ROW_DOWN],
        ['walk_right', ROW_RIGHT],
    ];
    for (const [key, row] of walkDirs) {
        anims.create({
            key,
            frames: anims.generateFrameNumbers(SPRITE_KEY, {
                start: getFrame(row, WALK_START),
                end:   getFrame(row, WALK_END)
            }),
            frameRate: 8,
            repeat: -1
        });
    }

    // Run animations — custom frame sequence via RUN_SEQUENCE
    const runDirs = [
        ['run_up',    ROW_UP],
        ['run_left',  ROW_LEFT],
        ['run_down',  ROW_DOWN],
        ['run_right', ROW_RIGHT],
    ];
    for (const [key, row] of runDirs) {
        anims.create({
            key,
            frames: RUN_SEQUENCE.map(col => ({ key: SPRITE_KEY, frame: getFrame(row, col) })),
            frameRate: 12,
            repeat: -1
        });
    }

    // Shoot animations (ready → fire, play once)
    const shootDirs = [
        ['shoot_up',    ROW_UP],
        ['shoot_left',  ROW_LEFT],
        ['shoot_down',  ROW_DOWN],
        ['shoot_right', ROW_RIGHT],
    ];
    for (const [key, row] of shootDirs) {
        anims.create({
            key,
            frames: [
                { key: SPRITE_KEY, frame: getFrame(row, SHOOT_READY_FRAME) },
                { key: SPRITE_KEY, frame: getFrame(row, SHOOT_FIRE_FRAME)  },
            ],
            frameRate: SHOOT_FRAME_RATE,
            repeat: 0
        });
    }

    // Force nearest-neighbor filtering; pixelArt:true sets this globally but explicit call
    // ensures it if the texture was cached before config was applied.
    this.textures.get(SPRITE_KEY).setFilter(Phaser.Textures.FilterMode.NEAREST);

    player = this.add.sprite(START_X, START_Y, SPRITE_KEY);
    player.setScale(SCALE);
    player.setDepth(1);
    player.play('idle_down');

    hitboxDebugRect = this.add.rectangle(
        START_X + PLAYER_HITBOX_OFFSET_X * SCALE,
        START_Y + PLAYER_HITBOX_OFFSET_Y * SCALE,
        PLAYER_HITBOX_WIDTH  * SCALE,
        PLAYER_HITBOX_HEIGHT * SCALE
    ).setFillStyle(0x000000, 0).setStrokeStyle(1, HITBOX_DEBUG_COLOR)
     .setDepth(5).setVisible(HITBOX_DEBUG);

    const o = OUTLINE_SOURCE_PIXELS * SCALE;
    const outlineOffsets = [
        [-o,  0],
        [ o,  0],
        [ 0,  o],
        [-o,  o],
        [ o,  o],
    ];
    for (const [ox, oy] of outlineOffsets) {
        const s = this.add.sprite(START_X + ox, START_Y + oy, SPRITE_KEY)
            .setScale(SCALE)
            .setTint(HASTE_OUTLINE_COLOR)
            .setDepth(0)
            .setVisible(false);
        s.offsetX = ox;
        s.offsetY = oy;
        hasteSprites.push(s);
    }

    // Dummies — four cactus-shaped targets
    const dArmW = Math.round(DUMMY_WIDTH * 0.5);
    const dArmH = Math.round(DUMMY_HEIGHT * 0.19);
    const dummyPositions = [
        { x: DUMMY_X,       y: DUMMY_Y - DUMMY_SPACING_Y, bodyColor: TOP_DUMMY_COLOR   },
        { x: DUMMY_X,       y: DUMMY_Y,                   bodyColor: DUMMY_COLOR        },
        { x: DUMMY_X,       y: DUMMY_Y + DUMMY_SPACING_Y, bodyColor: DUMMY_COLOR        },
        { x: RIGHT_DUMMY_X, y: RIGHT_DUMMY_Y,             bodyColor: RIGHT_DUMMY_COLOR  },
    ];
    for (const pos of dummyPositions) {
        const { x, y, bodyColor } = pos;
        const parts = [];
        const dArmY = y - Math.round(DUMMY_HEIGHT * 0.2);
        parts.push(this.add.rectangle(x, y, DUMMY_WIDTH, DUMMY_HEIGHT, bodyColor).setDepth(1));
        parts.push(this.add.rectangle(x - DUMMY_WIDTH / 2 - dArmW / 2, dArmY, dArmW, dArmH, DUMMY_ARM_COLOR).setDepth(1));
        parts.push(this.add.rectangle(x + DUMMY_WIDTH / 2 + dArmW / 2, dArmY, dArmW, dArmH, DUMMY_ARM_COLOR).setDepth(1));
        parts.push(this.add.circle(x - 6, y - 12, DUMMY_EYE_BIG_RADIUS,   DUMMY_EYE_COLOR).setDepth(2));
        parts.push(this.add.circle(x + 5, y - 14, DUMMY_EYE_SMALL_RADIUS, DUMMY_EYE_COLOR).setDepth(2));
        parts.push(this.add.rectangle(x + 1, y - 4, 8, 3, DUMMY_MOUTH_COLOR).setDepth(2));
        const hbBg   = this.add.rectangle(x, y - DUMMY_HEALTH_BAR_Y_OFFSET, DUMMY_HEALTH_BAR_WIDTH, DUMMY_HEALTH_BAR_HEIGHT, DUMMY_HEALTH_BAR_BG_COLOR).setDepth(2);
        const hbFill = this.add.rectangle(x - DUMMY_HEALTH_BAR_WIDTH / 2, y - DUMMY_HEALTH_BAR_Y_OFFSET, DUMMY_HEALTH_BAR_WIDTH, DUMMY_HEALTH_BAR_HEIGHT, DUMMY_HEALTH_BAR_FILL_COLOR).setOrigin(0, 0.5).setDepth(3);
        parts.push(hbBg, hbFill);
        dummies.push({ x, y, health: DUMMY_MAX_HEALTH, alive: true, respawnAt: 0, parts, hbFill });
    }

    // Cast animations (cols 11–16, play once)
    const castDirs = [
        ['cast_up',    ROW_UP],
        ['cast_left',  ROW_LEFT],
        ['cast_down',  ROW_DOWN],
        ['cast_right', ROW_RIGHT],
    ];
    for (const [key, row] of castDirs) {
        anims.create({
            key,
            frames: anims.generateFrameNumbers(SPRITE_KEY, {
                start: getFrame(row, CAST_START),
                end:   getFrame(row, CAST_END)
            }),
            frameRate: CAST_FRAME_RATE,
            repeat: 0
        });
    }

    // Return to normal logic when shoot or cast animation finishes
    player.on('animationcomplete', (anim) => {
        if (anim.key.startsWith('shoot_')) shooting = false;
        if (anim.key.startsWith('cast_'))  casting  = false;
    });

    const resolveSpell = () => {
        const spell = pendingSpell;
        const dir   = pendingSpellDirection;
        pendingSpell          = null;
        pendingSpellDirection = null;
        if (spell === 'aura') {
            health = Math.min(HEALTH_MAX, health + AURA_HEAL_AMOUNT);
        } else if (spell === 'ice') {
            const vec = DIR_VECS[dir];
            const proj = scene.add.rectangle(player.x + PLAYER_PROJECTILE_SPAWN_OFFSET_X * SCALE, player.y + PLAYER_PROJECTILE_SPAWN_OFFSET_Y * SCALE, ICE_PROJECTILE_WIDTH, ICE_PROJECTILE_HEIGHT, ICE_PROJECTILE_COLOR);
            projectiles.push({ obj: proj, vx: vec.x * ICE_PROJECTILE_SPEED, vy: vec.y * ICE_PROJECTILE_SPEED, born: scene.time.now, lifetime: ICE_PROJECTILE_LIFETIME, damage: ICE_DAMAGE });
        } else if (spell === 'haste') {
            hasteEndTime = scene.time.now + HASTE_DURATION_MS;
        }
    };

    // Fire spell effect when animation reaches the release frame
    player.on('animationupdate', (anim, frame) => {
        if (!pendingSpell) return;
        if (!anim.key.startsWith('cast_')) return;
        if (CAST_RELEASE_FRAMES.has(frame.textureFrame)) resolveSpell();
    });

    // Input
    wasd = {
        up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    key1     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    key2     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    key3     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

    this.input.keyboard.on('keydown-ONE', () => {
        if (mana < MANA_AURA_COST) return;
        if (scene.time.now - lastAuraTime < AURA_COOLDOWN_MS) return;
        mana -= MANA_AURA_COST;
        lastAuraTime = scene.time.now;
        casting = true;
        pendingSpell          = 'aura';
        pendingSpellDirection = lastDirection;
        player.play(`cast_${lastDirection}`);
    });

    this.input.keyboard.on('keydown-TWO', () => {
        if (mana < MANA_ICE_COST) return;
        if (scene.time.now - lastIceTime < ICE_COOLDOWN_MS) return;
        mana -= MANA_ICE_COST;
        lastIceTime = scene.time.now;
        casting = true;
        pendingSpell          = 'ice';
        pendingSpellDirection = lastDirection;
        player.play(`cast_${lastDirection}`);
    });

    this.input.keyboard.on('keydown-THREE', () => {
        if (mana < MANA_HASTE_COST) return;
        mana -= MANA_HASTE_COST;
        casting = true;
        pendingSpell          = 'haste';
        pendingSpellDirection = lastDirection;
        player.play(`cast_${lastDirection}`);
    });

    // Footer HUD — background
    footerBg = this.add.rectangle(0, GAME_HEIGHT, GAME_WIDTH, FOOTER_HEIGHT, Phaser.Display.Color.HexStringToColor(FOOTER_BG_COLOR).color)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(10);

    // --- Health bar ---
    const hbx = HEALTH_BAR_X;
    const hby = GAME_HEIGHT + HEALTH_BAR_Y_OFFSET;
    footerBarObjects.push(this.add.rectangle(hbx, hby, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, HEALTH_BAR_BG_COLOR)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(11));
    healthBarFill = this.add.rectangle(hbx, hby, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, HEALTH_BAR_FILL_COLOR)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(12);
    footerBarObjects.push(healthBarFill);
    footerBarObjects.push(this.add.rectangle(hbx + HEALTH_BAR_WIDTH / 2, hby + HEALTH_BAR_HEIGHT / 2, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT)
        .setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(13)
        .setFillStyle(0x000000, 0)
        .setStrokeStyle(1, HEALTH_BAR_BORDER_COLOR));

    // --- Stamina bar ---
    const sbx = HEALTH_BAR_X;
    const sby = GAME_HEIGHT + STAMINA_BAR_Y_OFFSET;
    footerBarObjects.push(this.add.rectangle(sbx, sby, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, STAMINA_BAR_BG_COLOR)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(11));
    staminaBarFill = this.add.rectangle(sbx, sby, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, STAMINA_BAR_FILL_COLOR)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(12);
    footerBarObjects.push(staminaBarFill);
    footerBarObjects.push(this.add.rectangle(sbx + HEALTH_BAR_WIDTH / 2, sby + HEALTH_BAR_HEIGHT / 2, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT)
        .setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(13)
        .setFillStyle(0x000000, 0)
        .setStrokeStyle(1, STAMINA_BAR_BORDER_COLOR));

    // --- Mana bar ---
    const mbx = MANA_BAR_X;
    const mby = GAME_HEIGHT + MANA_BAR_Y_OFFSET;
    footerBarObjects.push(this.add.rectangle(mbx, mby, MANA_BAR_WIDTH, MANA_BAR_HEIGHT, MANA_BAR_BG_COLOR)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(11));
    manaBarFill = this.add.rectangle(mbx, mby, 0, MANA_BAR_HEIGHT, MANA_BAR_FILL_COLOR)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(12);
    footerBarObjects.push(manaBarFill);
    footerBarObjects.push(this.add.rectangle(mbx + MANA_BAR_WIDTH / 2, mby + MANA_BAR_HEIGHT / 2, MANA_BAR_WIDTH, MANA_BAR_HEIGHT)
        .setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(13)
        .setFillStyle(0x000000, 0)
        .setStrokeStyle(1, MANA_BAR_BORDER_COLOR));

    // --- Mana bar center divider (3 segmented dots at 50%) ---
    const divX  = mbx + MANA_BAR_WIDTH / 2 - 1;
    const segH  = 4;
    const segGap = 3;
    for (let si = 0; si < 3; si++) {
        footerBarObjects.push(this.add.rectangle(divX, mby + si * (segH + segGap), 2, segH, MANA_BAR_DIVIDER_COLOR)
            .setOrigin(0, 0).setScrollFactor(0).setDepth(14));
    }

    // --- Controls row ---
    const fy = GAME_HEIGHT + CONTROLS_ROW_Y_OFFSET;
    const baseStyle = { fontSize: FOOTER_FONT_SIZE, fontFamily: 'monospace' };
    let cx = FOOTER_PADDING_X;
    const ft = (txt) => {
        const t = this.add.text(cx, fy, txt, { ...baseStyle, color: FOOTER_INACTIVE_COLOR })
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(11);
        cx += t.width;
        footerControlsObjects.push(t);
        return t;
    };
    const fp = () => {
        cx += SPELL_PIP_GAP;
        const p = this.add.rectangle(cx, fy, SPELL_PIP_WIDTH, SPELL_PIP_HEIGHT, MANA_PIP_COLOR_EMPTY)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(12);
        cx += SPELL_PIP_WIDTH;
        footerControlsObjects.push(p);
        return p;
    };
    footerW        = ft('W');
    footerA        = ft('A');
    footerS        = ft('S');
    footerD        = ft('D');
    ft(' Move');
    ft('  |  ');
    footerShiftRun = ft('Shift Run');
    ft('  |  ');
    footerLmbShoot = ft('LMB Shoot');
    ft('  |  ');
    footerAura  = ft('1 Aura');  pipAura   = fp();
    ft('  |  ');
    footerIce   = ft('2 Ice');   pipIce    = fp();
    ft('  |  ');
    footerHaste = ft('3 Haste'); pipHaste1 = fp(); pipHaste2 = fp();

    // Apply footer visibility based on HUD_MODE
    if (HUD_MODE === 'hide-bars' || HUD_MODE === 'hide-all') {
        for (const o of footerBarObjects) o.setVisible(false);
    }
    if (HUD_MODE === 'hide-all') {
        footerBg.setVisible(false);
        for (const o of footerControlsObjects) o.setVisible(false);
    }

    // Floating HUD — visible in all modes
    floatHealthCircle = this.add.circle(
        player.x + FLOAT_HEALTH_OFFSET_X, player.y + FLOAT_HEALTH_OFFSET_Y,
        FLOAT_HEART_RADIUS, FLOAT_HEART_COLOR
    ).setDepth(20);
    floatHealthText = this.add.text(
        player.x + FLOAT_HEALTH_OFFSET_X + FLOAT_HEART_RADIUS + FLOAT_HEALTH_TEXT_GAP,
        player.y + FLOAT_HEALTH_OFFSET_Y,
        String(Math.ceil(health)),
        { fontSize: FLOAT_HEALTH_FONT_SIZE, fontFamily: 'monospace', color: FLOAT_HEALTH_TEXT_COLOR }
    ).setOrigin(0, 0.5).setDepth(21);
    floatManaPip1 = this.add.rectangle(0, 0, FLOAT_PIP_W, FLOAT_PIP_H, MANA_PIP_COLOR_EMPTY).setDepth(20);
    floatManaPip2 = this.add.rectangle(0, 0, FLOAT_PIP_W, FLOAT_PIP_H, MANA_PIP_COLOR_EMPTY).setDepth(20);
    floatStaminaGfx = this.add.graphics().setDepth(20);
    if (!SHOW_FLOAT_HUD) {
        floatHealthCircle.setVisible(false);
        floatHealthText.setVisible(false);
        floatManaPip1.setVisible(false);
        floatManaPip2.setVisible(false);
        floatStaminaGfx.setVisible(false);
    }

    // Game over overlay (hidden until death)
    goText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, GAME_OVER_TEXT, {
        fontSize: GAME_OVER_FONT_SIZE, fontFamily: 'monospace', color: GAME_OVER_COLOR
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(20).setVisible(false);
    goSub = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, RESTART_TEXT, {
        fontSize: RESTART_FONT_SIZE, fontFamily: 'monospace', color: GAME_OVER_COLOR
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(20).setVisible(false);

    restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    restartKey.on('down', () => {
        if (gameOver) scene.scene.restart();
    });

    // Left click shoots in lastDirection
    this.input.on('pointerdown', (pointer) => {
        if (!pointer.leftButtonDown()) return;
        if (casting) {
            if (!CAST_CANCELS_ON_SHOOT) return;
            casting = false;
            pendingSpell          = null;
            pendingSpellDirection = null;
            player.stop();
        }
        const activeCooldown = scene.time.now < hasteEndTime ? SHOOT_COOLDOWN_MS / HASTE_SHOOT_DIVISOR : SHOOT_COOLDOWN_MS;
        if (scene.time.now - lastShotTime < activeCooldown) return;
        lastShotTime = scene.time.now;
        shooting = true;
        player.play(`shoot_${lastDirection}`);
        const vec  = DIR_VECS[lastDirection];
        const proj = scene.add.rectangle(player.x + PLAYER_PROJECTILE_SPAWN_OFFSET_X * SCALE, player.y + PLAYER_PROJECTILE_SPAWN_OFFSET_Y * SCALE, PROJECTILE_SIZE, PROJECTILE_SIZE, 0xffffff);
        projectiles.push({
            obj:    proj,
            vx:     vec.x * PROJECTILE_SPEED,
            vy:     vec.y * PROJECTILE_SPEED,
            born:   scene.time.now,
            damage: BASIC_SHOT_DAMAGE
        });
    });
}

function update(time, delta) {
    if (gameOver) return;
    const dt = delta / 1000;
    const frame = player.frame.name;

    const syncSprites = (sprites, endTime) => {
        const remaining = endTime - time;
        let show;
        if (remaining <= 0) {
            show = false;
        } else if (remaining <= BUFF_FAST_FLASH_START_MS) {
            show = Math.floor(time / BUFF_FLASH_FAST_MS) % 2 === 0;
        } else if (remaining <= BUFF_FLASH_START_MS) {
            show = Math.floor(time / BUFF_FLASH_SLOW_MS) % 2 === 0;
        } else {
            show = true;
        }
        for (const s of sprites) {
            if (show) {
                s.setPosition(player.x + s.offsetX, player.y + s.offsetY);
                s.setFrame(frame);
            }
            if (s.visible !== show) s.setVisible(show);
        }
    };
    syncSprites(hasteSprites, hasteEndTime);

    // Mana regen
    mana = Math.min(MANA_MAX, mana + MANA_REGEN_PER_SECOND * dt);

    // Update health bar fill width
    healthBarFill.width = HEALTH_BAR_WIDTH * (health / HEALTH_MAX);

    // Update mana bar fill width
    manaBarFill.width = MANA_BAR_WIDTH * (mana / MANA_MAX);

    // Update spell pips
    pipAura.setFillStyle(  mana >= MANA_AURA_COST  ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);
    pipIce.setFillStyle(   mana >= MANA_ICE_COST   ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);
    pipHaste1.setFillStyle(mana >= 50              ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);
    pipHaste2.setFillStyle(mana >= MANA_HASTE_COST ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);

    // Dummy respawn and health bar update
    for (const d of dummies) {
        if (!d.alive && time >= d.respawnAt) {
            d.health = DUMMY_MAX_HEALTH;
            d.alive  = true;
            for (const p of d.parts) p.setVisible(true);
        }
        d.hbFill.width = DUMMY_HEALTH_BAR_WIDTH * (d.health / DUMMY_MAX_HEALTH);
    }

    // Top dummy shoots left
    const topDummy = dummies[0];
    if (topDummy.alive && time - topDummyLastShotTime >= TOP_DUMMY_SHOOT_COOLDOWN_MS) {
        topDummyLastShotTime = time;
        const ep = scene.add.rectangle(topDummy.x, topDummy.y, ENEMY_PROJECTILE_WIDTH, ENEMY_PROJECTILE_HEIGHT, ENEMY_PROJECTILE_COLOR).setDepth(1);
        enemyProjectiles.push({ obj: ep, vx: -ENEMY_PROJECTILE_SPEED, vy: 0 });
    }

    // Right dummy shoots down
    const rightDummy = dummies[3];
    if (rightDummy.alive && time - rightDummyLastShotTime >= RIGHT_DUMMY_SHOOT_COOLDOWN_MS) {
        rightDummyLastShotTime = time;
        const ep = scene.add.rectangle(rightDummy.x, rightDummy.y, ENEMY_PROJECTILE_HEIGHT, ENEMY_PROJECTILE_WIDTH, ENEMY_PROJECTILE_COLOR).setDepth(1);
        enemyProjectiles.push({ obj: ep, vx: 0, vy: ENEMY_PROJECTILE_SPEED });
    }

    // Update hitbox debug rect position
    if (HITBOX_DEBUG && hitboxDebugRect) {
        hitboxDebugRect.setPosition(
            player.x + PLAYER_HITBOX_OFFSET_X * SCALE,
            player.y + PLAYER_HITBOX_OFFSET_Y * SCALE
        );
    }

    // Move enemy projectiles, check player hit, destroy offscreen
    const hbcx = player.x + PLAYER_HITBOX_OFFSET_X * SCALE;
    const hbcy = player.y + PLAYER_HITBOX_OFFSET_Y * SCALE;
    const phw  = PLAYER_HITBOX_WIDTH  * SCALE / 2;
    const phh  = PLAYER_HITBOX_HEIGHT * SCALE / 2;
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        const ep = enemyProjectiles[i];
        ep.obj.x += ep.vx * dt;
        ep.obj.y += ep.vy * dt;
        if (ep.obj.x < 0 || ep.obj.x > GAME_WIDTH || ep.obj.y < 0 || ep.obj.y > GAME_HEIGHT) {
            ep.obj.destroy();
            enemyProjectiles.splice(i, 1);
            continue;
        }
        const ew = ENEMY_PROJECTILE_WIDTH  / 2;
        const eh = ENEMY_PROJECTILE_HEIGHT / 2;
        if (Math.abs(ep.obj.x - hbcx) < phw + ew && Math.abs(ep.obj.y - hbcy) < phh + eh) {
            ep.obj.destroy();
            enemyProjectiles.splice(i, 1);
            health = Math.max(0, health - ENEMY_PROJECTILE_DAMAGE);
        }
    }

    // Death check
    if (health <= 0 && !gameOver) {
        gameOver = true;
        shooting = false;
        casting               = false;
        pendingSpell          = null;
        pendingSpellDirection = null;
        player.setVisible(false);
        for (const s of hasteSprites) s.setVisible(false);
        floatHealthCircle.setVisible(false);
        floatHealthText.setVisible(false);
        floatManaPip1.setVisible(false);
        floatManaPip2.setVisible(false);
        floatStaminaGfx.setVisible(false);
        goText.setVisible(true);
        goSub.setVisible(true);
        return;
    }

    // Move projectiles, destroy expired or offscreen, check dummy hit
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (time - p.born >= (p.lifetime ?? PROJECTILE_LIFETIME)) {
            p.obj.destroy();
            projectiles.splice(i, 1);
            continue;
        }
        p.obj.x += p.vx * dt;
        p.obj.y += p.vy * dt;
        if (p.obj.x < 0 || p.obj.x > GAME_WIDTH || p.obj.y < 0 || p.obj.y > GAME_HEIGHT) {
            p.obj.destroy();
            projectiles.splice(i, 1);
            continue;
        }

        let hit = false;
        for (const d of dummies) {
            if (!d.alive) continue;
            const hw = p.obj.width  / 2 + DUMMY_WIDTH  / 2;
            const hh = p.obj.height / 2 + DUMMY_HEIGHT / 2;
            if (Math.abs(p.obj.x - d.x) < hw && Math.abs(p.obj.y - d.y) < hh) {
                p.obj.destroy();
                projectiles.splice(i, 1);
                mana = Math.min(MANA_MAX, mana + DUMMY_HIT_MANA_GAIN);
                d.health -= p.damage ?? 0;
                if (d.health <= 0) {
                    d.health    = 0;
                    d.alive     = false;
                    d.respawnAt = time + DUMMY_RESPAWN_MS;
                    for (const dp of d.parts) dp.setVisible(false);
                }
                hit = true;
                break;
            }
        }
        if (hit) continue;
    }

    const left  = wasd.left.isDown;
    const right = wasd.right.isDown;
    const up    = wasd.up.isDown;
    const down  = wasd.down.isDown;

    // Shift: toggle mode or hold mode
    if (RUN_TOGGLE_MODE) {
        if (Phaser.Input.Keyboard.JustDown(shiftKey)) {
            if (!runToggled && stamina >= STAMINA_RUN_MIN) {
                runToggled = true;
            } else {
                runToggled = false;
            }
        }
    } else {
        runToggled = shiftKey.isDown && stamina >= STAMINA_RUN_MIN;
    }

    let dx = 0;
    let dy = 0;

    if (left)  dx -= 1;
    if (right) dx += 1;
    if (up)    dy -= 1;
    if (down)  dy += 1;

    const moving = (dx !== 0 || dy !== 0);

    // Stamina drain/regen
    const isRunning = runToggled && moving && stamina > 0;
    if (isRunning) {
        stamina = Math.max(0, stamina - STAMINA_DRAIN_PER_SECOND * dt);
        if (RUN_TOGGLE_MODE && stamina === 0) runToggled = false;
    } else {
        stamina = Math.min(STAMINA_MAX, stamina + STAMINA_REGEN_PER_SECOND * dt);
    }
    staminaBarFill.width = HEALTH_BAR_WIDTH * (stamina / STAMINA_MAX);

    const col = (active) => active ? FOOTER_ACTIVE_COLOR : FOOTER_INACTIVE_COLOR;
    footerW.setColor(col(up));
    footerA.setColor(col(left));
    footerS.setColor(col(down));
    footerD.setColor(col(right));
    footerShiftRun.setColor(col(runToggled));
    footerLmbShoot.setColor(col(scene.input.activePointer.leftButtonDown()));
    footerAura.setColor(col(key1.isDown));
    footerIce.setColor(col(key2.isDown));
    footerHaste.setColor(col(key3.isDown));

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;
    }

    const speed = MOVE_SPEED * (!shooting && isRunning ? RUN_MULTIPLIER : 1);
    player.x += dx * speed * dt;
    player.y += dy * speed * dt;

    // Clamp player to gameplay area
    player.x = Phaser.Math.Clamp(player.x, PLAYER_BOUNDS_PADDING_X, GAME_WIDTH  - PLAYER_BOUNDS_PADDING_X);
    player.y = Phaser.Math.Clamp(player.y, PLAYER_BOUNDS_PADDING_Y, GAME_HEIGHT - PLAYER_BOUNDS_PADDING_Y);

    // Floating HUD — follow player each frame
    if (SHOW_FLOAT_HUD) {
        floatHealthCircle.setPosition(player.x + FLOAT_HEALTH_OFFSET_X, player.y + FLOAT_HEALTH_OFFSET_Y);
        floatHealthText.setPosition(
            player.x + FLOAT_HEALTH_OFFSET_X + FLOAT_HEART_RADIUS + FLOAT_HEALTH_TEXT_GAP,
            player.y + FLOAT_HEALTH_OFFSET_Y
        );
        floatHealthText.setText(String(Math.ceil(health)));
        const pipHalfSpan = FLOAT_PIP_W / 2 + FLOAT_PIP_GAP / 2;
        floatManaPip1.setPosition(player.x + FLOAT_MANA_OFFSET_X - pipHalfSpan, player.y + FLOAT_MANA_OFFSET_Y);
        floatManaPip2.setPosition(player.x + FLOAT_MANA_OFFSET_X + pipHalfSpan, player.y + FLOAT_MANA_OFFSET_Y);
        floatManaPip1.setFillStyle(mana >= 50       ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);
        floatManaPip2.setFillStyle(mana >= MANA_MAX ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);
        floatStaminaGfx.clear();
        const showStamina = isRunning || stamina < STAMINA_MAX;
        floatStaminaGfx.setVisible(showStamina);
        if (showStamina) {
            const sx = player.x + FLOAT_STAMINA_OFFSET_X;
            const sy = player.y + FLOAT_STAMINA_OFFSET_Y;
            floatStaminaGfx.lineStyle(FLOAT_STAMINA_LINE_W, FLOAT_STAMINA_TRACK_COLOR, 1);
            floatStaminaGfx.beginPath();
            floatStaminaGfx.arc(sx, sy, FLOAT_STAMINA_RADIUS, 0, Math.PI * 2, false);
            floatStaminaGfx.strokePath();
            const fillAngle = Math.PI * 2 * (stamina / STAMINA_MAX);
            floatStaminaGfx.lineStyle(FLOAT_STAMINA_LINE_W, FLOAT_STAMINA_FILL_COLOR, 1);
            floatStaminaGfx.beginPath();
            floatStaminaGfx.arc(sx, sy, FLOAT_STAMINA_RADIUS, -Math.PI / 2, -Math.PI / 2 + fillAngle, false);
            floatStaminaGfx.strokePath();
        }
    }

    // Direction: horizontal overrides vertical
    if (moving) {
        if (dx < 0)       lastDirection = 'left';
        else if (dx > 0)  lastDirection = 'right';
        else if (dy < 0)  lastDirection = 'up';
        else if (dy > 0)  lastDirection = 'down';
    }

    // Shoot or cast animation overrides movement animation until complete
    if (shooting || casting) return;

    const prefix = moving ? (isRunning ? 'run' : 'walk') : 'idle';
    const animKey = `${prefix}_${lastDirection}`;

    if (player.anims.currentAnim?.key !== animKey) {
        player.play(animKey);
    }
}
