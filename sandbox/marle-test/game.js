import { WORLD }                         from './config/world.js';
import { ACTIVE_CHARACTER, CHARACTERS }  from './config/characters.js';
import { ENEMY_TYPES, ENEMY_SPAWNS }     from './config/enemies.js';
import { PROJECTILE_TYPES }              from './config/projectiles.js';

// Convenience aliases
const SCALE         = WORLD.scale;
const PLAYER        = CHARACTERS[ACTIVE_CHARACTER];
const ROWS          = PLAYER.animations.rows;
const GAME_WIDTH    = WORLD.gameWidth;
const GAME_HEIGHT   = WORLD.gameHeight;
const FOOTER_HEIGHT = WORLD.footerHeight;
const CANVAS_HEIGHT = GAME_HEIGHT + FOOTER_HEIGHT;

// --- HUD MODE ---
const HUD_MODE       = 'hide-bars'; // 'hide-bars' | 'hide-all' | 'show-all'
const SHOW_FLOAT_HUD = true;

// --- FOOTER HUD ---
const FOOTER_BG_COLOR       = '#1a1a2e';
const FOOTER_TEXT_COLOR     = '#ffffff';
const FOOTER_FONT_SIZE      = '16px';
const FOOTER_PADDING_X      = 16;
const FOOTER_ACTIVE_COLOR   = '#8fd3ff';
const FOOTER_INACTIVE_COLOR = FOOTER_TEXT_COLOR;
const BAR_ROW_Y_OFFSET      = 46;
const CONTROLS_ROW_Y_OFFSET = 12;

// --- FOOTER HEALTH BAR ---
const HEALTH_BAR_X                = 16;
const HEALTH_BAR_Y_OFFSET         = BAR_ROW_Y_OFFSET;
const HEALTH_BAR_WIDTH            = 240;
const HEALTH_BAR_HEIGHT           = 18;
const HEALTH_BAR_BG_COLOR_CSS     = '#221111';
const HEALTH_BAR_FILL_COLOR_CSS   = '#cc2222';
const HEALTH_BAR_BORDER_COLOR_CSS = '#ffffff';

// --- FOOTER STAMINA BAR ---
const STAMINA_BAR_Y_OFFSET         = 70;
const STAMINA_BAR_BG_COLOR_CSS     = '#223322';
const STAMINA_BAR_FILL_COLOR_CSS   = '#00cc44';
const STAMINA_BAR_BORDER_COLOR_CSS = '#ffffff';

// --- FOOTER MANA BAR ---
const MANA_BAR_X                 = 400;
const MANA_BAR_Y_OFFSET          = BAR_ROW_Y_OFFSET;
const MANA_BAR_WIDTH             = 240;
const MANA_BAR_HEIGHT            = 18;
const MANA_BAR_BG_COLOR_CSS      = '#222244';
const MANA_BAR_FILL_COLOR_CSS    = '#3366ff';
const MANA_BAR_BORDER_COLOR_CSS  = '#ffffff';
const MANA_BAR_DIVIDER_COLOR_CSS = '#8899cc';
const MANA_PIP_COLOR_READY_CSS   = '#6699ff';
const MANA_PIP_COLOR_EMPTY_CSS   = '#333355';
const SPELL_PIP_WIDTH            = 5;
const SPELL_PIP_HEIGHT           = 12;
const SPELL_PIP_GAP              = 3;

// --- FLOATING HEALTH HUD ---
const FLOAT_HEALTH_OFFSET_X         = -12;
const FLOAT_HEALTH_OFFSET_Y         = -6;
const FLOAT_HEART_SCALE             = 0.6;
const FLOAT_HEALTH_NUMBER_OFFSET_X  = 0;
const FLOAT_HEALTH_NUMBER_OFFSET_Y  = 0;
const FLOAT_HEALTH_FONT_SIZE        = 8;
const FLOAT_HEALTH_TEXT_COLOR       = '#ffffff';
const FLOAT_HEALTH_SHOW_START_MS    = 2000;
const FLOAT_HEALTH_SHOW_CHANGE_MS   = 500;
const FLOAT_HEALTH_FADE_MS          = 150;

// --- FLOATING MANA HUD ---
const FLOAT_MANA_OFFSET_X           = -10;
const FLOAT_MANA_OFFSET_Y           = 12;
const FLOAT_MANA_PIP_W              = 2;
const FLOAT_MANA_PIP_H              = 3;
const FLOAT_MANA_PIP_GAP            = 2;
const FLOAT_MANA_BOB_AMPLITUDE      = 2;
const FLOAT_MANA_BOB_SPEED          = 0.006;
const FLOAT_MANA_PIP_ACTIVE_COLOR_CSS = '#6699ff';
const FLOAT_MANA_PIP_EMPTY_COLOR_CSS  = '#333355';
const FLOAT_MANA_PIP_EMPTY_ALPHA    = 0.05;
const FLOAT_MANA_PIP_ACTIVE_ALPHA   = 1;

// --- FLOATING STAMINA HUD ---
const FLOAT_STAMINA_OFFSET_X        = 10;
const FLOAT_STAMINA_OFFSET_Y        = -6;
const FLOAT_STAMINA_RADIUS          = 3;
const FLOAT_STAMINA_TRACK_COLOR_CSS = '#333333';
const FLOAT_STAMINA_FILL_COLOR_CSS  = '#00cc44';
const FLOAT_STAMINA_LINE_W          = 1;

// --- GAME OVER ---
const GAME_OVER_TEXT      = 'GAME OVER';
const RESTART_TEXT        = 'Press R to restart';
const GAME_OVER_FONT_SIZE = '48px';
const RESTART_FONT_SIZE   = '20px';
const GAME_OVER_COLOR     = '#ffffff';

// --- ENEMY HIT FEEDBACK ---
const ENEMY_HIT_FLASH_MS           = 80;
const ENEMY_HIT_KNOCKBACK_DISTANCE = 20;
const ENEMY_HIT_KNOCKBACK_MS       = 120;
const FLOATING_DAMAGE_Y_OFFSET     =  -10;
const FLOATING_DAMAGE_MS           = 600;
const FLOATING_DAMAGE_TEXT         = '-';
const HIT_PAUSE_MS                 = 40;
const DEATH_POP_SCALE              = 2.5;
const DEATH_POP_MS                 = 100;

// --- SHOOTING ---
const SHOOT_MOUSE_DEADZONE_PX = 8; // use facing fallback if pointer is this close to player

// --- BLOCK / PARRY ---
const BLOCK = PLAYER.block;

// --- DERIVED NUMERIC COLORS ---
function cssInt(s) { return parseInt(s.slice(1), 16); }
const HEALTH_BAR_BG_COLOR         = cssInt(HEALTH_BAR_BG_COLOR_CSS);
const HEALTH_BAR_FILL_COLOR       = cssInt(HEALTH_BAR_FILL_COLOR_CSS);
const HEALTH_BAR_BORDER_COLOR     = cssInt(HEALTH_BAR_BORDER_COLOR_CSS);
const STAMINA_BAR_BG_COLOR        = cssInt(STAMINA_BAR_BG_COLOR_CSS);
const STAMINA_BAR_FILL_COLOR      = cssInt(STAMINA_BAR_FILL_COLOR_CSS);
const STAMINA_BAR_BORDER_COLOR    = cssInt(STAMINA_BAR_BORDER_COLOR_CSS);
const MANA_BAR_BG_COLOR           = cssInt(MANA_BAR_BG_COLOR_CSS);
const MANA_BAR_FILL_COLOR         = cssInt(MANA_BAR_FILL_COLOR_CSS);
const MANA_BAR_BORDER_COLOR       = cssInt(MANA_BAR_BORDER_COLOR_CSS);
const MANA_BAR_DIVIDER_COLOR      = cssInt(MANA_BAR_DIVIDER_COLOR_CSS);
const MANA_PIP_COLOR_READY        = cssInt(MANA_PIP_COLOR_READY_CSS);
const MANA_PIP_COLOR_EMPTY        = cssInt(MANA_PIP_COLOR_EMPTY_CSS);
const FLOAT_MANA_PIP_ACTIVE_COLOR = cssInt(FLOAT_MANA_PIP_ACTIVE_COLOR_CSS);
const FLOAT_MANA_PIP_EMPTY_COLOR  = cssInt(FLOAT_MANA_PIP_EMPTY_COLOR_CSS);
const FLOAT_STAMINA_TRACK_COLOR   = cssInt(FLOAT_STAMINA_TRACK_COLOR_CSS);
const FLOAT_STAMINA_FILL_COLOR    = cssInt(FLOAT_STAMINA_FILL_COLOR_CSS);
const REFLECTED_BULLET_COLOR = cssInt(BLOCK.reflectedProjectile.colorCss);

// Runtime helpers derived from PLAYER config
function getFrame(row, col) {
    return row * PLAYER.framesPerRow + col;
}

const CAST_RELEASE_FRAMES = new Set(
    Object.values(ROWS).map(r => r * PLAYER.framesPerRow + PLAYER.animations.castReleaseFrame)
);

const DIR_VECS = {
    up:    { x:  0, y: -1 },
    left:  { x: -1, y:  0 },
    down:  { x:  0, y:  1 },
    right: { x:  1, y:  0 },
};

// --- PHASER CONFIG ---
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#000000b0',
    pixelArt: true,
    roundPixels: true,
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
let hasteSprites  = [];
let hasteGlowFx   = null;
let key1, key2, key3;
let footerW, footerA, footerS, footerD, footerShiftRun, footerLmbShoot, footerAura, footerIce, footerHaste;
let health  = PLAYER.resources.healthStart;
let mana    = PLAYER.resources.manaStart;
let healthBarFill, manaBarFill, staminaBarFill;
let stamina    = PLAYER.resources.staminaStart;
let runToggled = false;
let pipAura, pipIce, pipHaste1, pipHaste2;
let dummies = [];
let enemyProjectiles = [];
let gameOver     = false;
let restartKey;
let goText, goSub;
let hitboxDebugRect;
let footerBg;
let footerBarObjects      = [];
let footerControlsObjects = [];
let floatHealthCircle, floatHealthText;
let floatHealthVisibleUntil = 0;
let floatHealthFadeTween    = null;
let floatManaPip1, floatManaPip2;
let floatStaminaGfx;
let hitPauseEndTime        = -Infinity;
let playerHurtEndTime      = -Infinity;
let playerInvulnEndTime    = -Infinity;
let playerKnockbackVx      = 0;
let playerKnockbackVy      = 0;
let playerKnockbackEndTime = -Infinity;
let dodging       = false;
let dodgeEndTime  = -Infinity;
let dodgeLastTime = -Infinity;
let dodgeDirX     = 0;
let dodgeDirY     = 0;
let isBlocking        = false;
let blockStartedAtMs  = -Infinity;
let parryFlashUntilMs = -Infinity;

function setHasteVisualVisible(show) {
    const haste = PLAYER.spells.haste;
    if (hasteGlowFx) {
        hasteGlowFx.active = show;
        hasteGlowFx.outerStrength = show ? haste.outlineSize : 0;
        if ('innerStrength' in hasteGlowFx) hasteGlowFx.innerStrength = 0;
        if ('alpha' in hasteGlowFx) hasteGlowFx.alpha = show ? haste.outlineAlpha : 0;
    }
    for (const s of hasteSprites) {
        s.setVisible(show);
        s.setAlpha(show ? haste.outlineAlpha : 0);
    }
}

function showFloatingHealth(scene, durationMs) {
    if (!SHOW_FLOAT_HUD) return;
    if (floatHealthFadeTween) { floatHealthFadeTween.stop(); floatHealthFadeTween = null; }
    floatHealthCircle.setAlpha(1).setVisible(true);
    floatHealthText.setAlpha(1).setVisible(true);
    floatHealthVisibleUntil = scene.time.now + durationMs;
}

function preload() {
    this.load.spritesheet(PLAYER.assetKey, PLAYER.assetPath, { frameWidth: PLAYER.frameWidth, frameHeight: PLAYER.frameHeight });
    for (const cfg of Object.values(ENEMY_TYPES)) {
        this.load.spritesheet(cfg.assetKey, cfg.assetPath, { frameWidth: cfg.frameWidth, frameHeight: cfg.frameHeight });
    }
    const iceCfg = PROJECTILE_TYPES.ice;
    this.load.image(iceCfg.assetKey, iceCfg.assetPath);
    this.load.image(PLAYER.hud.heartKey, PLAYER.hud.heartPath);
    this.load.tilemapTiledJSON(WORLD.tilemap.mapKey, WORLD.tilemap.mapPath);
    for (const tileset of WORLD.tilemap.tilesets) {
        this.load.image(tileset.key, tileset.path);
    }
}

function create() {
    scene = this;
    this.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    const res   = PLAYER.resources;
    const mov   = PLAYER.movement;
    const anim  = PLAYER.animations;
    const dodge = PLAYER.dodge;
    const haste = PLAYER.spells.haste;

    // Reset mutable globals on each create (handles scene.restart())
    health              = res.healthStart;
    mana                = res.manaStart;
    stamina             = res.staminaStart;
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
    hitPauseEndTime        = -Infinity;
    playerHurtEndTime      = -Infinity;
    playerInvulnEndTime    = -Infinity;
    playerKnockbackVx      = 0;
    playerKnockbackVy      = 0;
    playerKnockbackEndTime = -Infinity;
    dodging       = false;
    dodgeEndTime  = -Infinity;
    dodgeLastTime = -Infinity;
    dodgeDirX     = 0;
    dodgeDirY     = 0;
    isBlocking        = false;
    blockStartedAtMs  = -Infinity;
    parryFlashUntilMs = -Infinity;
    projectiles         = [];
    enemyProjectiles    = [];
    hasteSprites        = [];
    hasteGlowFx         = null;
    dummies             = [];
    hitboxDebugRect     = null;
    footerBarObjects      = [];
    footerControlsObjects = [];

    const anims = this.anims;

    // Idle animations
    const idleDirs = [
        ['idle_up',    ROWS.up],
        ['idle_left',  ROWS.left],
        ['idle_down',  ROWS.down],
        ['idle_right', ROWS.right],
    ];
    for (const [key, row] of idleDirs) {
        anims.create({
            key,
            frames: [{ key: PLAYER.assetKey, frame: getFrame(row, anim.idleFrame) }],
            frameRate: anim.idleFrameRate,
            repeat: 0
        });
    }

    // Walk animations
    const walkDirs = [
        ['walk_up',    ROWS.up],
        ['walk_left',  ROWS.left],
        ['walk_down',  ROWS.down],
        ['walk_right', ROWS.right],
    ];
    for (const [key, row] of walkDirs) {
        anims.create({
            key,
            frames: anims.generateFrameNumbers(PLAYER.assetKey, {
                start: getFrame(row, anim.walkStart),
                end:   getFrame(row, anim.walkEnd)
            }),
            frameRate: anim.walkFrameRate,
            repeat: -1
        });
    }

    // Run animations — custom frame sequence
    const runDirs = [
        ['run_up',    ROWS.up],
        ['run_left',  ROWS.left],
        ['run_down',  ROWS.down],
        ['run_right', ROWS.right],
    ];
    for (const [key, row] of runDirs) {
        anims.create({
            key,
            frames: anim.runSequence.map(col => ({ key: PLAYER.assetKey, frame: getFrame(row, col) })),
            frameRate: anim.runFrameRate,
            repeat: -1
        });
    }

    // Shoot animations (ready → fire, play once)
    const shootDirs = [
        ['shoot_up',    ROWS.up],
        ['shoot_left',  ROWS.left],
        ['shoot_down',  ROWS.down],
        ['shoot_right', ROWS.right],
    ];
    for (const [key, row] of shootDirs) {
        anims.create({
            key,
            frames: [
                { key: PLAYER.assetKey, frame: getFrame(row, anim.shootReadyFrame) },
                { key: PLAYER.assetKey, frame: getFrame(row, anim.shootFireFrame)  },
            ],
            frameRate: anim.shootFrameRate,
            repeat: 0
        });
    }

    this.textures.get(PLAYER.assetKey).setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get(PLAYER.hud.heartKey).setFilter(Phaser.Textures.FilterMode.NEAREST);
    for (const tileset of WORLD.tilemap.tilesets) {
        this.textures.get(tileset.key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    for (const cfg of Object.values(ENEMY_TYPES)) {
        this.textures.get(cfg.assetKey).setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    const map = this.make.tilemap({ key: WORLD.tilemap.mapKey });

    const tilesets = WORLD.tilemap.tilesets.map(tileset =>
        map.addTilesetImage(tileset.name, tileset.key)
    );

    if (tilesets.some(tileset => !tileset)) {
        console.error('Missing one or more tilesets.');
        console.error('Expected tilesets:', WORLD.tilemap.tilesets.map(t => t.name));
        console.error('Available tilesets:', map.tilesets.map(t => t.name));
        return;
    }

    const groundLayer = map.createLayer(WORLD.tilemap.worldLayerName, tilesets, 0, 0);
    if (!groundLayer) {
        console.error('Missing layer:', WORLD.tilemap.worldLayerName);
        console.error('Available layers:', map.layers.map(l => l.name));
        return;
    }
    groundLayer.setScale(SCALE);
    groundLayer.setDepth(0);

    player = this.add.sprite(PLAYER.startX, PLAYER.startY, PLAYER.assetKey);
    player.setScale(SCALE);
    player.setDepth(1);
    player.play('idle_down');

    const phb = PLAYER.hitbox;
    hitboxDebugRect = this.add.rectangle(
        PLAYER.startX + phb.offsetX * SCALE,
        PLAYER.startY + phb.offsetY * SCALE,
        phb.width  * SCALE,
        phb.height * SCALE
    ).setFillStyle(0x000000, 0).setStrokeStyle(1, cssInt(phb.debugColorCss))
     .setDepth(5).setVisible(phb.debug);

    if (player.postFX && player.postFX.addGlow) {
        const glowColor = Phaser.Display.Color.HexStringToColor(haste.outlineColorCss).color;
        hasteGlowFx = player.postFX.addGlow(glowColor, haste.outlineSize, 0, false);
    } else {
        const hasteOutlineColor = Phaser.Display.Color.HexStringToColor(haste.outlineColorCss).color;
        const o = haste.outlineSize;
        for (const [ox, oy] of [[-o, 0], [o, 0], [0, -o], [0, o]]) {
            const s = this.add.sprite(PLAYER.startX + ox, PLAYER.startY + oy, PLAYER.assetKey)
                .setScale(SCALE)
                .setTint(hasteOutlineColor)
                .setDepth(0);
            s.offsetX = ox;
            s.offsetY = oy;
            hasteSprites.push(s);
        }
    }
    setHasteVisualVisible(false);

    // Enemy animations — one set per type
    const seenAnimTypes = new Set();
    for (const spawn of ENEMY_SPAWNS) {
        if (seenAnimTypes.has(spawn.type)) continue;
        seenAnimTypes.add(spawn.type);
        const cfg = ENEMY_TYPES[spawn.type];
        const ea  = cfg.animations;
        anims.create({
            key: ea.idleKey,
            frames: ea.idleFrames.map(f => ({ key: cfg.assetKey, frame: f })),
            frameRate: ea.idleFrameRate,
            repeat: -1
        });
        anims.create({
            key: ea.attackKey,
            frames: ea.attackFrames.map(f => ({ key: cfg.assetKey, frame: f })),
            frameRate: ea.attackFrameRate,
            repeat: 0
        });
    }

    // Enemies
    for (const spawn of ENEMY_SPAWNS) {
        const cfg         = ENEMY_TYPES[spawn.type];
        const { x, y }   = spawn;
        const hbBgColor   = cssInt(cfg.healthBar.bgColorCss);
        const hbFillColor = cssInt(cfg.healthBar.fillColorCss);
        const ptCfg       = PROJECTILE_TYPES[cfg.attack.projectileType];
        const projColor   = cssInt(ptCfg.colorCss);

        const parts  = [];
        const sprite = this.add.sprite(x, y, cfg.assetKey).setScale(SCALE).setDepth(1);
        sprite.play(cfg.animations.idleKey);
        parts.push(sprite);
        const hbBg   = this.add.rectangle(x, y - cfg.healthBar.yOffset, cfg.healthBar.width, cfg.healthBar.height, hbBgColor).setDepth(2).setVisible(false);
        const hbFill = this.add.rectangle(x - cfg.healthBar.width / 2, y - cfg.healthBar.yOffset, cfg.healthBar.width, cfg.healthBar.height, hbFillColor).setOrigin(0, 0.5).setDepth(3).setVisible(false);
        parts.push(hbBg, hbFill);
        const dbgColor = cssInt(cfg.hitbox.debugColorCss);
        const hitboxDebugRect = this.add.rectangle(
            x + cfg.hitbox.offsetX * SCALE,
            y + cfg.hitbox.offsetY * SCALE,
            cfg.hitbox.width  * SCALE,
            cfg.hitbox.height * SCALE,
            dbgColor, cfg.hitbox.debugAlpha
        ).setStrokeStyle(cfg.hitbox.debugLineWidth, dbgColor).setDepth(6).setVisible(cfg.hitbox.debug);

        const aiCfg = { ...cfg.ai, ...(spawn.ai || {}) };
        const enemy = {
            type:            spawn.type,
            config:          cfg,
            x, y,
            health:          cfg.stats.maxHealth,
            alive:           true,
            respawnAt:       0,
            parts,
            hbBg,
            hbFill,
            sprite,
            hitboxDebugRect,
            aiCfg,
            shootDirection:  spawn.shootDirection,
            lastShotTime:     -Infinity,
            isAttacking:      false,
            firedThisAttack:  false,
            knockbackVx:      0,
            knockbackVy:      0,
            knockbackEndTime: -Infinity,
            floatDmgText:     null,
            flashTimer:       null,
        };

        sprite.on('animationupdate', (anim, frame) => {
            if (!enemy.alive) return;
            if (anim.key !== cfg.animations.attackKey) return;
            if (frame.textureFrame === cfg.animations.shootFrame && !enemy.firedThisAttack) {
                enemy.firedThisAttack = true;
                enemy.lastShotTime    = scene.time.now;
                const projSpeed = cfg.attack.projectileSpeed ?? ptCfg.speed;
                let vx = 0, vy = 0;
                let pw = ptCfg.width, ph = ptCfg.height;
                if (enemy.aiCfg.aimMode === 'towardPlayer') {
                    const ddx  = player.x - enemy.x;
                    const ddy  = player.y - enemy.y;
                    const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (dist > 0) { vx = (ddx / dist) * projSpeed; vy = (ddy / dist) * projSpeed; }
                } else {
                    const dir = enemy.shootDirection;
                    pw = (dir === 'left' || dir === 'right') ? ptCfg.width  : ptCfg.height;
                    ph = (dir === 'left' || dir === 'right') ? ptCfg.height : ptCfg.width;
                    vx = dir === 'left' ? -projSpeed : dir === 'right' ? projSpeed : 0;
                    vy = dir === 'up'   ? -projSpeed : dir === 'down'  ? projSpeed : 0;
                }
                const ep = scene.add.rectangle(
                    enemy.x + cfg.attack.projectileSpawnOffsetX * SCALE,
                    enemy.y + cfg.attack.projectileSpawnOffsetY * SCALE,
                    pw, ph, projColor
                ).setDepth(1);
                enemyProjectiles.push({ obj: ep, vx, vy, damage: ptCfg.damage });
            }
        });

        sprite.on('animationcomplete', (anim) => {
            if (anim.key !== cfg.animations.attackKey) return;
            enemy.isAttacking = false;
            enemy.sprite.play(cfg.animations.idleKey, true);
        });

        dummies.push(enemy);
    }

    // Cast animations (cols 11–16, play once)
    const castDirs = [
        ['cast_up',    ROWS.up],
        ['cast_left',  ROWS.left],
        ['cast_down',  ROWS.down],
        ['cast_right', ROWS.right],
    ];
    for (const [key, row] of castDirs) {
        anims.create({
            key,
            frames: anims.generateFrameNumbers(PLAYER.assetKey, {
                start: getFrame(row, anim.castStart),
                end:   getFrame(row, anim.castEnd)
            }),
            frameRate: anim.castFrameRate,
            repeat: 0
        });
    }

    // Dodge animations
    const dodgeDirs = [
        ['dodge_up',    ROWS.up],
        ['dodge_left',  ROWS.left],
        ['dodge_down',  ROWS.down],
        ['dodge_right', ROWS.right],
    ];

    for (const [key, row] of dodgeDirs) {
        anims.create({
            key,
            frames: anim.dodgeSequence.map(col => ({
                key: PLAYER.assetKey,
                frame: getFrame(row, col)
            })),
            frameRate: anim.dodgeFrameRate,
            repeat: -1
        });
    }

    player.on('animationcomplete', (anim) => {
        if (anim.key.startsWith('shoot_')) shooting = false;
        if (anim.key.startsWith('cast_'))  casting  = false;
        if (anim.key.startsWith('dodge_')) dodging  = false;
    });

    const resolveSpell = () => {
        const spell = pendingSpell;
        const dir   = pendingSpellDirection;
        pendingSpell          = null;
        pendingSpellDirection = null;
        if (spell === 'aura') {
            health = Math.min(res.healthMax, health + PLAYER.spells.aura.healAmount);
            showFloatingHealth(scene, FLOAT_HEALTH_SHOW_CHANGE_MS);
        } else if (spell === 'ice') {
            const vec    = DIR_VECS[dir];
            const iceCfg = PROJECTILE_TYPES[PLAYER.spells.ice.projectileType];
            const proj   = scene.add.image(
                player.x + PLAYER.combat.projectileSpawnOffsetX * SCALE,
                player.y + PLAYER.combat.projectileSpawnOffsetY * SCALE,
                iceCfg.assetKey
            ).setScale(iceCfg.scale).setAngle(iceCfg.angles[dir]);
            projectiles.push({
                obj:      proj,
                vx:       vec.x * iceCfg.speed,
                vy:       vec.y * iceCfg.speed,
                born:     scene.time.now,
                lifetime: iceCfg.lifetimeMs,
                damage:   PLAYER.spells.ice.damage
            });
        } else if (spell === 'haste') {
            hasteEndTime = scene.time.now + haste.durationMs;
        }
    };

    player.on('animationupdate', (anim, frame) => {
        if (!pendingSpell) return;
        if (!anim.key.startsWith('cast_')) return;
        if (CAST_RELEASE_FRAMES.has(frame.textureFrame)) resolveSpell();
    });

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
        if (dodging) return;
        if (isBlocking) return;
        if (mana < PLAYER.spells.aura.manaCost) return;
        if (scene.time.now - lastAuraTime < PLAYER.spells.aura.cooldownMs) return;
        mana -= PLAYER.spells.aura.manaCost;
        lastAuraTime = scene.time.now;
        casting = true;
        pendingSpell          = 'aura';
        pendingSpellDirection = lastDirection;
        player.play(`cast_${lastDirection}`);
    });

    this.input.keyboard.on('keydown-TWO', () => {
        if (dodging) return;
        if (isBlocking) return;
        if (mana < PLAYER.spells.ice.manaCost) return;
        if (scene.time.now - lastIceTime < PLAYER.spells.ice.cooldownMs) return;
        mana -= PLAYER.spells.ice.manaCost;
        lastIceTime = scene.time.now;
        casting = true;
        pendingSpell          = 'ice';
        pendingSpellDirection = lastDirection;
        player.play(`cast_${lastDirection}`);
    });

    this.input.keyboard.on('keydown-THREE', () => {
        if (dodging) return;
        if (isBlocking) return;
        if (mana < PLAYER.spells.haste.manaCost) return;
        mana -= PLAYER.spells.haste.manaCost;
        casting = true;
        pendingSpell          = 'haste';
        pendingSpellDirection = lastDirection;
        player.play(`cast_${lastDirection}`);
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[dodge.key]);
    this.input.keyboard.on(`keydown-${dodge.key}`, () => {
        if (gameOver) return;
        if (dodging) return;
        if (scene.time.now - dodgeLastTime < dodge.cooldownMS) return;
        if (stamina < dodge.staminaCost) return;

        let ddx = 0, ddy = 0;
        if (wasd.left.isDown)  ddx -= 1;
        if (wasd.right.isDown) ddx += 1;
        if (wasd.up.isDown)    ddy -= 1;
        if (wasd.down.isDown)  ddy += 1;
        if (ddx === 0 && ddy === 0) {
            const v = DIR_VECS[lastDirection];
            ddx = v.x; ddy = v.y;
        } else if (ddx !== 0 && ddy !== 0) {
            const dlen = Math.sqrt(ddx * ddx + ddy * ddy);
            ddx /= dlen; ddy /= dlen;
        }
        dodgeDirX = ddx;
        dodgeDirY = ddy;

        let dodgeDir;
        if (Math.abs(ddx) >= Math.abs(ddy)) {
            dodgeDir = ddx < 0 ? 'left' : 'right';
        } else {
            dodgeDir = ddy < 0 ? 'up' : 'down';
        }

        stamina               = Math.max(0, stamina - dodge.staminaCost);
        dodgeLastTime         = scene.time.now;
        isBlocking            = false;
        dodging               = true;
        dodgeEndTime          = scene.time.now + dodge.durationMs;
        shooting              = false;
        casting               = false;
        pendingSpell          = null;
        pendingSpellDirection = null;
        player.play(`dodge_${dodgeDir}`);
        playerInvulnEndTime = Math.max(playerInvulnEndTime, scene.time.now + dodge.invulnMs);
    });

    // Footer HUD — background
    footerBg = this.add.rectangle(0, GAME_HEIGHT, GAME_WIDTH, FOOTER_HEIGHT,
        Phaser.Display.Color.HexStringToColor(FOOTER_BG_COLOR).color)
        .setOrigin(0, 0).setScrollFactor(0).setDepth(10);

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
        .setFillStyle(0x000000, 0).setStrokeStyle(1, HEALTH_BAR_BORDER_COLOR));

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
        .setFillStyle(0x000000, 0).setStrokeStyle(1, STAMINA_BAR_BORDER_COLOR));

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
        .setFillStyle(0x000000, 0).setStrokeStyle(1, MANA_BAR_BORDER_COLOR));

    // --- Mana bar center divider (3 segmented dots at 50%) ---
    const divX   = mbx + MANA_BAR_WIDTH / 2 - 1;
    const segH   = 4;
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
    floatHealthCircle = this.add.image(
        player.x + FLOAT_HEALTH_OFFSET_X * SCALE,
        player.y + FLOAT_HEALTH_OFFSET_Y * SCALE,
        PLAYER.hud.heartKey
    ).setScale(FLOAT_HEART_SCALE * SCALE).setDepth(20);
    floatHealthText = this.add.text(
        player.x + FLOAT_HEALTH_OFFSET_X * SCALE + FLOAT_HEALTH_NUMBER_OFFSET_X * SCALE,
        player.y + FLOAT_HEALTH_OFFSET_Y * SCALE + FLOAT_HEALTH_NUMBER_OFFSET_Y * SCALE,
        String(Math.ceil(health)),
        { fontSize: `${FLOAT_HEALTH_FONT_SIZE * SCALE}px`, fontFamily: 'monospace', color: FLOAT_HEALTH_TEXT_COLOR }
    ).setOrigin(0.5, 0.5).setDepth(21);
    const pipW = FLOAT_MANA_PIP_W * SCALE;
    const pipH = FLOAT_MANA_PIP_H * SCALE;
    floatManaPip1 = this.add.rectangle(0, 0, pipW, pipH, FLOAT_MANA_PIP_EMPTY_COLOR).setAlpha(FLOAT_MANA_PIP_EMPTY_ALPHA).setDepth(20);
    floatManaPip2 = this.add.rectangle(0, 0, pipW, pipH, FLOAT_MANA_PIP_EMPTY_COLOR).setAlpha(FLOAT_MANA_PIP_EMPTY_ALPHA).setDepth(20);
    floatStaminaGfx = this.add.graphics().setDepth(20);
    if (!SHOW_FLOAT_HUD) {
        floatHealthCircle.setVisible(false);
        floatHealthText.setVisible(false);
        floatManaPip1.setVisible(false);
        floatManaPip2.setVisible(false);
        floatStaminaGfx.setVisible(false);
    } else {
        showFloatingHealth(this, FLOAT_HEALTH_SHOW_START_MS);
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

    // Right click blocks. Left click auto-shoots in update().
    this.input.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown()) {
            if (!gameOver && stamina >= BLOCK.minStaminaToBlock) {
                isBlocking = true;
                blockStartedAtMs = scene.time.now;
            }
        }
    });

    this.input.on('pointerup', (pointer) => {
        if (pointer.rightButtonReleased()) isBlocking = false;
    });
}

function tryShootAtPointer(scene, pointer, now) {
    if (!pointer.leftButtonDown()) return;
    if (gameOver) return;
    if (isBlocking) return;
    if (dodging) return;

    if (casting) {
        if (!PLAYER.animations.castCancelsOnShoot) return;

        casting = false;
        pendingSpell = null;
        pendingSpellDirection = null;
        player.stop();
    }

    const activeCooldown = now < hasteEndTime
        ? PLAYER.combat.shootCooldownMs / PLAYER.spells.haste.shootDivisor
        : PLAYER.combat.shootCooldownMs;

    if (now - lastShotTime < activeCooldown) return;

    lastShotTime = now;
    shooting = true;
    player.play(`shoot_${lastDirection}`);

    const ddx = pointer.x - player.x;
    const ddy = pointer.y - player.y;
    const dist = Math.sqrt(ddx * ddx + ddy * ddy);

    let aimX;
    let aimY;

    if (dist < SHOOT_MOUSE_DEADZONE_PX) {
        aimX = DIR_VECS[lastDirection].x;
        aimY = DIR_VECS[lastDirection].y;
    } else {
        aimX = ddx / dist;
        aimY = ddy / dist;
    }

    const ptCfg = PROJECTILE_TYPES[PLAYER.combat.projectileType];

    const proj = scene.add.rectangle(
        player.x + PLAYER.combat.projectileSpawnOffsetX * SCALE,
        player.y + PLAYER.combat.projectileSpawnOffsetY * SCALE,
        ptCfg.width,
        ptCfg.height,
        cssInt(ptCfg.colorCss)
    );

    projectiles.push({
        obj: proj,
        vx: aimX * ptCfg.speed,
        vy: aimY * ptCfg.speed,
        born: now,
        lifetime: ptCfg.lifetimeMs,
        damage: ptCfg.damage
    });
}

function update(time, delta) {
    if (gameOver) return;
    tryShootAtPointer(this, this.input.activePointer, time);
    const dt = delta / 1000;
    const frame = player.frame.name;
    const res   = PLAYER.resources;
    const mov   = PLAYER.movement;
    const dodge = PLAYER.dodge;
    const haste = PLAYER.spells.haste;

    const hasteRemaining = hasteEndTime - time;
    let hasteShow;
    if (hasteRemaining <= 0) {
        hasteShow = false;
    } else if (hasteRemaining <= haste.fastFlashStartMs) {
        hasteShow = Math.floor(time / haste.flashFastMs) % 2 === 0;
    } else if (hasteRemaining <= haste.flashStartMs) {
        hasteShow = Math.floor(time / haste.flashSlowMs) % 2 === 0;
    } else {
        hasteShow = true;
    }
    setHasteVisualVisible(hasteShow);
    if (hasteShow) {
        for (const s of hasteSprites) {
            s.setPosition(player.x + s.offsetX, player.y + s.offsetY);
            s.setFrame(frame);
        }
    }

    // Mana regen
    mana = Math.min(res.manaMax, mana + res.manaRegenPerSecond * dt);

    // Update health/mana bar widths
    healthBarFill.width = HEALTH_BAR_WIDTH * (health / res.healthMax);
    manaBarFill.width   = MANA_BAR_WIDTH   * (mana   / res.manaMax);

    // Update spell pips
    pipAura.setFillStyle(  mana >= PLAYER.spells.aura.manaCost ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);
    pipIce.setFillStyle(   mana >= PLAYER.spells.ice.manaCost  ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);
    pipHaste1.setFillStyle(mana >= haste.manaCost / 2          ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);
    pipHaste2.setFillStyle(mana >= haste.manaCost              ? MANA_PIP_COLOR_READY : MANA_PIP_COLOR_EMPTY);

    // Enemy respawn, health bar update, movement, and attack trigger
    const hitPaused = time < hitPauseEndTime;
    for (const d of dummies) {
        const cfg = d.config;
        if (!d.alive && time >= d.respawnAt) {
            d.health          = cfg.stats.maxHealth;
            d.alive           = true;
            d.isAttacking     = false;
            d.firedThisAttack = false;
            d.knockbackEndTime = -Infinity;
            if (d.flashTimer) { d.flashTimer.remove(); d.flashTimer = null; }
            d.sprite.clearTint();
            if (d.floatDmgText) { d.floatDmgText.destroy(); d.floatDmgText = null; }
            for (const p of d.parts) p.setVisible(true);
            d.hbBg.setVisible(false);
            d.hbFill.setVisible(false);
            if (d.hitboxDebugRect) d.hitboxDebugRect.setVisible(cfg.hitbox.debug);
            d.sprite.play(cfg.animations.idleKey, true);
        }
        d.hbFill.width = cfg.healthBar.width * (d.health / cfg.stats.maxHealth);

        if (d.alive && d.knockbackEndTime > time) {
            d.x += d.knockbackVx * dt;
            d.y += d.knockbackVy * dt;
            d.sprite.setPosition(d.x, d.y);
            d.hbBg.setPosition(d.x, d.y - cfg.healthBar.yOffset);
            d.hbFill.setPosition(d.x - cfg.healthBar.width / 2, d.y - cfg.healthBar.yOffset);
            if (d.hitboxDebugRect) d.hitboxDebugRect.setPosition(
                d.x + cfg.hitbox.offsetX * SCALE,
                d.y + cfg.hitbox.offsetY * SCALE
            );
        }

        if (!hitPaused) {
            if (d.alive && d.aiCfg.moveMode === 'slowChase' && d.knockbackEndTime <= time) {
                const mdx   = player.x - d.x;
                const mdy   = player.y - d.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist > d.aiCfg.stopDistance && mdist < d.aiCfg.aggroRange) {
                    const spd = cfg.stats.moveSpeed;
                    d.x += (mdx / mdist) * spd * dt;
                    d.y += (mdy / mdist) * spd * dt;
                    d.sprite.setPosition(d.x, d.y);
                    d.hbBg.setPosition(d.x, d.y - cfg.healthBar.yOffset);
                    d.hbFill.setPosition(d.x - cfg.healthBar.width / 2, d.y - cfg.healthBar.yOffset);
                    if (d.hitboxDebugRect) d.hitboxDebugRect.setPosition(
                        d.x + cfg.hitbox.offsetX * SCALE,
                        d.y + cfg.hitbox.offsetY * SCALE
                    );
                }
            }

            if (d.alive && d.aiCfg.aimMode !== 'none' && d.aiCfg.aimMode != null && !d.isAttacking) {
                if (time - d.lastShotTime >= cfg.attack.cooldownMs) {
                    d.isAttacking     = true;
                    d.firedThisAttack = false;
                    d.sprite.play(cfg.animations.attackKey, true);
                }
            }
        }
    }

    // Update player hitbox debug rect position
    const phb = PLAYER.hitbox;
    if (phb.debug && hitboxDebugRect) {
        hitboxDebugRect.setPosition(
            player.x + phb.offsetX * SCALE,
            player.y + phb.offsetY * SCALE
        );
    }

    // Move enemy projectiles, check player hit, destroy offscreen
    const hbcx = player.x + phb.offsetX * SCALE;
    const hbcy = player.y + phb.offsetY * SCALE;
    const phw  = phb.width  * SCALE / 2;
    const phh  = phb.height * SCALE / 2;
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        const ep = enemyProjectiles[i];
        ep.obj.x += ep.vx * dt;
        ep.obj.y += ep.vy * dt;
        if (ep.obj.x < 0 || ep.obj.x > GAME_WIDTH || ep.obj.y < 0 || ep.obj.y > GAME_HEIGHT) {
            ep.obj.destroy();
            enemyProjectiles.splice(i, 1);
            continue;
        }
        const ew = ep.obj.width  / 2;
        const eh = ep.obj.height / 2;
        if (Math.abs(ep.obj.x - hbcx) < phw + ew && Math.abs(ep.obj.y - hbcy) < phh + eh) {
            const epX   = ep.obj.x;
            const epY   = ep.obj.y;
            const epVx  = ep.vx;
            const epVy  = ep.vy;
            const epW   = ep.obj.width;
            const epH   = ep.obj.height;
            const epDmg = ep.damage ?? 1;
            ep.obj.destroy();
            enemyProjectiles.splice(i, 1);
            if (time < playerInvulnEndTime) continue;

            if (isBlocking) {
                stamina = Math.max(0, stamina - BLOCK.hitStaminaCost);
                if (stamina <= 0) isBlocking = false;
                const isParry = (time - blockStartedAtMs) <= BLOCK.parryWindowMs;
                if (isParry) {
                    parryFlashUntilMs = time + BLOCK.parryFlashMs;
                    player.stop();
                    player.setFrame(getFrame(ROWS[lastDirection], BLOCK.parryFrame));
                    const epLen  = Math.sqrt(epVx * epVx + epVy * epVy);
                    const reflSpd = epLen * BLOCK.reflectedProjectile.speedMultiplier;
                    const rvx = epLen > 0 ? (-epVx / epLen) * reflSpd : 0;
                    const rvy = epLen > 0 ? (-epVy / epLen) * reflSpd : 0;
                    const reflProj = scene.add.rectangle(epX, epY, epW, epH, REFLECTED_BULLET_COLOR).setDepth(1);
                    projectiles.push({
                        obj:      reflProj,
                        vx:       rvx,
                        vy:       rvy,
                        born:     time,
                        lifetime: 1400,
                        damage:   Math.ceil(epDmg * BLOCK.reflectedProjectile.damageMultiplier),
                    });
                }
                continue;
            }

            health = Math.max(0, health - epDmg);
            showFloatingHealth(this, FLOAT_HEALTH_SHOW_CHANGE_MS);

            // Hurt frame
            shooting              = false;
            casting               = false;
            pendingSpell          = null;
            pendingSpellDirection = null;
            player.stop();
            player.setFrame(getFrame(ROWS[lastDirection], PLAYER.animations.hurtFrame));
            playerHurtEndTime = time + PLAYER.hurt.durationMs;

            // Knockback in projectile direction
            const epLen = Math.sqrt(epVx * epVx + epVy * epVy);
            if (epLen > 0) {
                const kbSpd = PLAYER.hurt.knockbackDistance / (PLAYER.hurt.knockbackMs / 1000);
                playerKnockbackVx      = (epVx / epLen) * kbSpd;
                playerKnockbackVy      = (epVy / epLen) * kbSpd;
                playerKnockbackEndTime = time + PLAYER.hurt.knockbackMs;
            }

            // Invulnerability
            playerInvulnEndTime = time + PLAYER.hurt.invulnMs;
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
        setHasteVisualVisible(false);
        floatHealthCircle.setVisible(false);
        floatHealthText.setVisible(false);
        floatManaPip1.setVisible(false);
        floatManaPip2.setVisible(false);
        floatStaminaGfx.setVisible(false);
        goText.setVisible(true);
        goSub.setVisible(true);
        return;
    }

    // Move projectiles, destroy expired or offscreen, check enemy hit
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (time - p.born >= p.lifetime) {
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
            const cfg = d.config;
            const hw = p.obj.width  / 2 + cfg.hitbox.width  * SCALE / 2;
            const hh = p.obj.height / 2 + cfg.hitbox.height * SCALE / 2;
            if (Math.abs(p.obj.x - (d.x + cfg.hitbox.offsetX * SCALE)) < hw &&
                Math.abs(p.obj.y - (d.y + cfg.hitbox.offsetY * SCALE)) < hh) {
                p.obj.destroy();
                projectiles.splice(i, 1);
                mana = Math.min(res.manaMax, mana + cfg.stats.hitManaGain);
                d.health -= p.damage ?? 0;

                // Flash white
                if (d.flashTimer) d.flashTimer.remove();
                d.sprite.setTint(0xffffff);
                d.flashTimer = scene.time.delayedCall(ENEMY_HIT_FLASH_MS, () => {
                    d.sprite.clearTint();
                    d.flashTimer = null;
                });

                // Knockback in projectile direction
                const kbLen = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (kbLen > 0) {
                    const kbSpd = ENEMY_HIT_KNOCKBACK_DISTANCE / (ENEMY_HIT_KNOCKBACK_MS / 1000);
                    d.knockbackVx      = (p.vx / kbLen) * kbSpd;
                    d.knockbackVy      = (p.vy / kbLen) * kbSpd;
                    d.knockbackEndTime = time + ENEMY_HIT_KNOCKBACK_MS;
                }

                // Floating damage text
                if (d.floatDmgText) { d.floatDmgText.destroy(); }
                const dmgText = scene.add.text(
                    d.x, d.y + FLOATING_DAMAGE_Y_OFFSET,
                    FLOATING_DAMAGE_TEXT + String(p.damage ?? 0),
                    { fontSize: '16px', fontFamily: 'monospace', color: '#ffffff' }
                ).setOrigin(0.5, 1).setDepth(10);
                d.floatDmgText = dmgText;
                scene.tweens.add({
                    targets:  dmgText,
                    y:        dmgText.y - 30,
                    alpha:    0,
                    duration: FLOATING_DAMAGE_MS,
                    onComplete: () => { dmgText.destroy(); if (d.floatDmgText === dmgText) d.floatDmgText = null; }
                });

                // Brief hit pause
                hitPauseEndTime = time + HIT_PAUSE_MS;

                if (d.health <= 0) {
                    d.health    = 0;
                    d.alive     = false;
                    if (cfg.stats.respawn) {
                        d.respawnAt = time + cfg.stats.respawnMs;
                    } else {
                        d.respawnAt = Infinity;
                    }                    for (const dp of d.parts) dp.setVisible(false);
                    if (d.hitboxDebugRect) d.hitboxDebugRect.setVisible(false);
                    if (d.flashTimer) { d.flashTimer.remove(); d.flashTimer = null; }
                    d.sprite.clearTint();
                    if (d.floatDmgText) { d.floatDmgText.destroy(); d.floatDmgText = null; }
                    // Death pop
                    const pop = scene.add.rectangle(d.x, d.y, 24, 24, 0xffffff).setAlpha(0.8).setDepth(5);
                    scene.tweens.add({
                        targets:  pop,
                        scaleX:   DEATH_POP_SCALE,
                        scaleY:   DEATH_POP_SCALE,
                        alpha:    0,
                        duration: DEATH_POP_MS,
                        onComplete: () => pop.destroy()
                    });
                } else {
                    d.hbBg.setVisible(true);
                    d.hbFill.setVisible(true);
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
    if (mov.runToggleMode) {
        if (Phaser.Input.Keyboard.JustDown(shiftKey)) {
            if (!runToggled && stamina >= res.staminaRunMin) {
                runToggled = true;
            } else {
                runToggled = false;
            }
        }
    } else {
        // Hysteresis: stay running until stamina=0, only restart at staminaRunMin
        runToggled = shiftKey.isDown && (runToggled ? stamina > 0 : stamina >= res.staminaRunMin);
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
        stamina = Math.max(0, stamina - res.staminaDrainPerSecond * dt);
        if (mov.runToggleMode && stamina === 0) runToggled = false;
    } else if (!isBlocking) {
        stamina = Math.min(res.staminaMax, stamina + res.staminaRegenPerSecond * dt);
    }
    if (isBlocking) {
        stamina = Math.max(0, stamina - BLOCK.staminaDrainPerSecond * dt);
        if (stamina <= 0) isBlocking = false;
    }
    staminaBarFill.width = HEALTH_BAR_WIDTH * (stamina / res.staminaMax);

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

    if (dodging) {
        if (time >= dodgeEndTime) {
            dodging = false;
        } else {
            const dodgeSpd = dodge.distance / (dodge.durationMs / 1000);
            player.x += dodgeDirX * dodgeSpd * dt;
            player.y += dodgeDirY * dodgeSpd * dt;
        }
        } else {
            let speed = mov.moveSpeed * (!shooting && isRunning ? mov.runMultiplier : 1);

            if (isBlocking) {
                speed *= BLOCK.moveSpeedMultiplier;
            }

            player.x += dx * speed * dt;
            player.y += dy * speed * dt;
        }

    if (playerKnockbackEndTime > time) {
        player.x += playerKnockbackVx * dt;
        player.y += playerKnockbackVy * dt;
    }

    // Clamp player to gameplay area
    player.x = Phaser.Math.Clamp(player.x, PLAYER.bounds.paddingX, GAME_WIDTH  - PLAYER.bounds.paddingX);
    player.y = Phaser.Math.Clamp(player.y, PLAYER.bounds.paddingY, GAME_HEIGHT - PLAYER.bounds.paddingY);

    // Floating HUD — follow player each frame
    if (SHOW_FLOAT_HUD) {
        floatHealthCircle.setPosition(
            player.x + FLOAT_HEALTH_OFFSET_X * SCALE,
            player.y + FLOAT_HEALTH_OFFSET_Y * SCALE
        );
        floatHealthText.setPosition(
            player.x + FLOAT_HEALTH_OFFSET_X * SCALE + FLOAT_HEALTH_NUMBER_OFFSET_X * SCALE,
            player.y + FLOAT_HEALTH_OFFSET_Y * SCALE + FLOAT_HEALTH_NUMBER_OFFSET_Y * SCALE
        );
        floatHealthText.setText(String(Math.ceil(health)));
        if (this.time.now >= floatHealthVisibleUntil && floatHealthFadeTween === null && floatHealthCircle.visible) {
            floatHealthFadeTween = this.tweens.add({
                targets: [floatHealthCircle, floatHealthText],
                alpha: 0,
                duration: FLOAT_HEALTH_FADE_MS,
                onComplete: () => {
                    floatHealthCircle.setVisible(false);
                    floatHealthText.setVisible(false);
                    floatHealthFadeTween = null;
                }
            });
        }

        const pipW        = FLOAT_MANA_PIP_W   * SCALE;
        const pipH        = FLOAT_MANA_PIP_H   * SCALE;
        const pipGap      = FLOAT_MANA_PIP_GAP * SCALE;
        const pipHalfSpan = pipW / 2 + pipGap / 2;
        const bob         = Math.sin(time * FLOAT_MANA_BOB_SPEED) * FLOAT_MANA_BOB_AMPLITUDE * SCALE;
        floatManaPip1.setPosition(player.x + FLOAT_MANA_OFFSET_X * SCALE - pipHalfSpan, player.y + FLOAT_MANA_OFFSET_Y * SCALE + bob);
        floatManaPip2.setPosition(player.x + FLOAT_MANA_OFFSET_X * SCALE + pipHalfSpan, player.y + FLOAT_MANA_OFFSET_Y * SCALE - bob);
        floatManaPip1.setAlpha(mana >= res.manaMax / 2 ? FLOAT_MANA_PIP_ACTIVE_ALPHA : FLOAT_MANA_PIP_EMPTY_ALPHA);
        floatManaPip2.setAlpha(mana >= res.manaMax     ? FLOAT_MANA_PIP_ACTIVE_ALPHA : FLOAT_MANA_PIP_EMPTY_ALPHA);
        floatManaPip1.setFillStyle(mana >= res.manaMax / 2 ? FLOAT_MANA_PIP_ACTIVE_COLOR : FLOAT_MANA_PIP_EMPTY_COLOR);
        floatManaPip2.setFillStyle(mana >= res.manaMax     ? FLOAT_MANA_PIP_ACTIVE_COLOR : FLOAT_MANA_PIP_EMPTY_COLOR);

        floatStaminaGfx.clear();
        const showStamina = isRunning || stamina < res.staminaMax;
        floatStaminaGfx.setVisible(showStamina);
        if (showStamina) {
            const sx = player.x + FLOAT_STAMINA_OFFSET_X * SCALE;
            const sy = player.y + FLOAT_STAMINA_OFFSET_Y * SCALE;
            floatStaminaGfx.lineStyle(FLOAT_STAMINA_LINE_W * SCALE, FLOAT_STAMINA_TRACK_COLOR, 1);
            floatStaminaGfx.beginPath();
            floatStaminaGfx.arc(sx, sy, FLOAT_STAMINA_RADIUS * SCALE, 0, Math.PI * 2, false);
            floatStaminaGfx.strokePath();
            const fillAngle = Math.PI * 2 * (stamina / res.staminaMax);
            floatStaminaGfx.lineStyle(FLOAT_STAMINA_LINE_W * SCALE, FLOAT_STAMINA_FILL_COLOR, 1);
            floatStaminaGfx.beginPath();
            floatStaminaGfx.arc(sx, sy, FLOAT_STAMINA_RADIUS * SCALE, -Math.PI / 2, -Math.PI / 2 + fillAngle, false);
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

    // Invulnerability blink
    if (dodging || time < playerHurtEndTime) {
        player.setVisible(true);
    } else if (time < playerInvulnEndTime) {
        player.setVisible(Math.floor(time / PLAYER.hurt.invulnBlinkIntervalMs) % 2 === 0);
    } else {
        player.setVisible(true);
    }

    // Clear hurt when duration expires
    if (playerHurtEndTime > -Infinity && time >= playerHurtEndTime) playerHurtEndTime = -Infinity;

    // Block/parry visual override
    if (isBlocking) {
        player.stop();

        const blockVisualFrame = time < parryFlashUntilMs ? BLOCK.parryFrame : BLOCK.frame;
        player.setFrame(getFrame(ROWS[lastDirection], blockVisualFrame));

        return;
    }

    // Shoot, cast, hurt, or dodge overrides movement animation
    if (shooting || casting || time < playerHurtEndTime || dodging) return;

    const prefix  = moving ? (isRunning ? 'run' : 'walk') : 'idle';
    const animKey = `${prefix}_${lastDirection}`;
    if (player.anims.currentAnim?.key !== animKey) {
        player.play(animKey);
    }
}
