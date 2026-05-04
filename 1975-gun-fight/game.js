/// <reference types="phaser" />

// ─── Tunables ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH         = 512;
const CANVAS_HEIGHT        = 448;
const BG_COLOR             = '#000000';

const PLAY_TOP             = 24;
const PLAY_BOTTOM          = 428;
const CENTER_X             = CANVAS_WIDTH / 2;

const PLAYER_W             = 10;
const PLAYER_H             = 18;
const PLAYER_SPEED         = 120;
const PLAYER_COLOR         = 0xffd080;
const AIM_LINE_LEN         = 22;
const AIM_ANGLES_DEG       = [-45, -22, 0, 22, 45];
const AIM_START_INDEX      = 2;

const P1_START_X           = 76;
const P2_START_X           = CANVAS_WIDTH - 76;
const PLAYER_START_Y       = Math.round((PLAY_TOP + PLAY_BOTTOM) / 2);
const P1_MIN_X             = PLAYER_W / 2 + 4;
const P1_MAX_X             = CENTER_X - PLAYER_W / 2 - 4;
const P2_MIN_X             = CENTER_X + PLAYER_W / 2 + 4;
const P2_MAX_X             = CANVAS_WIDTH - PLAYER_W / 2 - 4;
const PLAYER_MIN_Y         = PLAY_TOP + PLAYER_H / 2 + 2;
const PLAYER_MAX_Y         = PLAY_BOTTOM - PLAYER_H / 2 - 2;

const BULLET_W             = 3;
const BULLET_H             = 3;
const BULLET_SPEED         = 400;
const BULLET_LIFETIME      = 2.5;
const BULLET_COLOR         = 0xffffff;

const AMMO_MAX             = 6;
const AMMO_ICON_W          = 5;
const AMMO_ICON_H          = 8;
const AMMO_SPACING         = 8;
const AMMO_Y               = CANVAS_HEIGHT - 10;

const MATCH_DURATION       = 90;
const HIT_FREEZE_SEC       = 1.0;
const AMMO_OUT_DELAY_SEC   = 1.2;

const MAX_OBSTACLES        = 8;
const WAGON_MIN_TOTAL      = 4;
const WAGON_SPEED_PX       = 55;
const WAGON_W              = 28;
const WAGON_H              = 16;
const WAGON_MIN_X          = CENTER_X - 64;
const WAGON_MAX_X          = CENTER_X + 64;
const CACTUS_W             = 10;
const CACTUS_H             = 26;
const TREE_W               = 14;
const TREE_H               = 32;
const OBSTACLE_COLOR       = 0x44cc44;
const WAGON_COLOR          = 0xcc8844;

const HUD_Y                = 12;
const GOTME_ABOVE          = 28;
const FONT_SM              = { fontSize: '13px', fontFamily: 'monospace', color: '#ffd080' };
const FONT_MD              = { fontSize: '17px', fontFamily: 'monospace', color: '#ffd080' };

const SCALE_MODE           = Phaser.Scale.FIT;
const SCALE_CENTER         = Phaser.Scale.CENTER_BOTH;

// ─── Config ──────────────────────────────────────────────────────────────────
const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: BG_COLOR,
    scale: {
        mode: SCALE_MODE,
        autoCenter: SCALE_CENTER,
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

// ─── Scene State ──────────────────────────────────────────────────────────────
let sc;
let p1, p2;
let bullets;
let obstacles;
let wagonObj;
let matchTimer, totalScore;
let phase;         // 'playing' | 'hitFreeze' | 'ammoOut' | 'sudden' | 'over'
let phaseTimer;
let gfx;
let scoreText1, scoreText2, timerText, messageText, gotMeText1, gotMeText2;
let cursors, keyA, keyD, keyW, keyS, keyQ, keyE, keyF, keySpace;
let keyShift, keyCtrl, keyEnter, keySlash, keyR;

const DEG = Math.PI / 180;

// ─── Obstacle spawn table ─────────────────────────────────────────────────────
const OBS_SLOTS = [
    { x: CENTER_X,      type: 'tree'   },
    { x: CENTER_X - 56, type: 'cactus' },
    { x: CENTER_X + 56, type: 'cactus' },
    { x: CENTER_X - 28, type: 'cactus' },
    { x: CENTER_X + 28, type: 'cactus' },
    { x: CENTER_X - 80, type: 'tree'   },
    { x: CENTER_X + 80, type: 'tree'   },
    { x: CENTER_X,      type: 'cactus' },
];
const OBS_Y_SLOTS = [
    PLAY_TOP + (PLAY_BOTTOM - PLAY_TOP) * 0.25,
    PLAY_TOP + (PLAY_BOTTOM - PLAY_TOP) * 0.50,
    PLAY_TOP + (PLAY_BOTTOM - PLAY_TOP) * 0.75,
];

// ─── Lifecycle ────────────────────────────────────────────────────────────────
function preload() {}

function create() {
    sc = this;
    gfx = sc.add.graphics();

    scoreText1  = sc.add.text(8, HUD_Y, '0', FONT_SM).setOrigin(0, 0.5);
    scoreText2  = sc.add.text(CANVAS_WIDTH - 8, HUD_Y, '0', FONT_SM).setOrigin(1, 0.5);
    timerText   = sc.add.text(CENTER_X, HUD_Y, '90', FONT_MD).setOrigin(0.5, 0.5);
    messageText = sc.add.text(CENTER_X, PLAYER_START_Y, '', FONT_MD)
                    .setOrigin(0.5).setAlign('center').setVisible(false);
    gotMeText1  = sc.add.text(0, 0, 'GOT ME!', FONT_SM).setOrigin(0.5).setVisible(false);
    gotMeText2  = sc.add.text(0, 0, 'GOT ME!', FONT_SM).setOrigin(0.5).setVisible(false);

    cursors  = sc.input.keyboard.createCursorKeys();
    keyA     = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD     = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW     = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyS     = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyQ     = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    keyE     = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    keyF     = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keySpace = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyShift = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    keyCtrl  = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    keyEnter = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keySlash = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH);
    keyR     = sc.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    initMatch();
}

function update(time, delta) {
    const dt = Math.min(delta / 1000, 1 / 20);

    if (phase === 'over') {
        if (Phaser.Input.Keyboard.JustDown(keyR)) sc.scene.restart();
        return;
    }

    if (phase === 'hitFreeze' || phase === 'ammoOut') {
        phaseTimer -= dt;
        if (phaseTimer <= 0) endFreeze();
        draw();
        return;
    }

    if (phase === 'playing') {
        matchTimer -= dt;
        if (matchTimer <= 0) {
            matchTimer = 0;
            endMatch();
            draw();
            return;
        }
    }

    handleInput(dt);
    updateBullets(dt);
    updateWagon(dt);
    updateHUD();
    draw();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function initMatch() {
    p1 = { x: P1_START_X, y: PLAYER_START_Y, aimIdx: AIM_START_INDEX, ammo: AMMO_MAX, score: 0 };
    p2 = { x: P2_START_X, y: PLAYER_START_Y, aimIdx: AIM_START_INDEX, ammo: AMMO_MAX, score: 0 };
    bullets    = [];
    obstacles  = [];
    wagonObj   = null;
    matchTimer = MATCH_DURATION;
    totalScore = 0;
    phase      = 'playing';
    phaseTimer = 0;
    messageText.setVisible(false);
    gotMeText1.setVisible(false);
    gotMeText2.setVisible(false);
    spawnInitialObstacles();
    updateHUD();
}

function resetRound() {
    p1.x = P1_START_X; p1.y = PLAYER_START_Y; p1.aimIdx = AIM_START_INDEX; p1.ammo = AMMO_MAX;
    p2.x = P2_START_X; p2.y = PLAYER_START_Y; p2.aimIdx = AIM_START_INDEX; p2.ammo = AMMO_MAX;
    bullets = [];
    messageText.setVisible(false);
}

// ─── Input ────────────────────────────────────────────────────────────────────
function handleInput(dt) {
    if (keyA.isDown) p1.x = Math.max(P1_MIN_X, p1.x - PLAYER_SPEED * dt);
    if (keyD.isDown) p1.x = Math.min(P1_MAX_X, p1.x + PLAYER_SPEED * dt);
    if (keyW.isDown) p1.y = Math.max(PLAYER_MIN_Y, p1.y - PLAYER_SPEED * dt);
    if (keyS.isDown) p1.y = Math.min(PLAYER_MAX_Y, p1.y + PLAYER_SPEED * dt);

    if (Phaser.Input.Keyboard.JustDown(keyQ)) p1.aimIdx = Math.max(0, p1.aimIdx - 1);
    if (Phaser.Input.Keyboard.JustDown(keyE)) p1.aimIdx = Math.min(AIM_ANGLES_DEG.length - 1, p1.aimIdx + 1);
    if (Phaser.Input.Keyboard.JustDown(keySpace) || Phaser.Input.Keyboard.JustDown(keyF)) tryFire(p1, 1);

    if (cursors.left.isDown)  p2.x = Math.max(P2_MIN_X, p2.x - PLAYER_SPEED * dt);
    if (cursors.right.isDown) p2.x = Math.min(P2_MAX_X, p2.x + PLAYER_SPEED * dt);
    if (cursors.up.isDown)    p2.y = Math.max(PLAYER_MIN_Y, p2.y - PLAYER_SPEED * dt);
    if (cursors.down.isDown)  p2.y = Math.min(PLAYER_MAX_Y, p2.y + PLAYER_SPEED * dt);

    if (Phaser.Input.Keyboard.JustDown(keyShift)) p2.aimIdx = Math.max(0, p2.aimIdx - 1);
    if (Phaser.Input.Keyboard.JustDown(keyCtrl))  p2.aimIdx = Math.min(AIM_ANGLES_DEG.length - 1, p2.aimIdx + 1);
    if (Phaser.Input.Keyboard.JustDown(keyEnter) || Phaser.Input.Keyboard.JustDown(keySlash)) tryFire(p2, -1);
}

function tryFire(p, dir) {
    if (p.ammo <= 0) return;
    p.ammo--;
    const rad = AIM_ANGLES_DEG[p.aimIdx] * DEG;
    bullets.push({
        x:    p.x + dir * (PLAYER_W / 2 + 2),
        y:    p.y,
        vx:   dir * BULLET_SPEED * Math.cos(rad),
        vy:   BULLET_SPEED * Math.sin(rad),
        owner: p,
        life: BULLET_LIFETIME
    });
}

// ─── Bullets ─────────────────────────────────────────────────────────────────
function updateBullets(dt) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x   += b.vx * dt;
        b.y   += b.vy * dt;
        b.life -= dt;

        if (b.y <= PLAY_TOP)    { b.y = PLAY_TOP;    b.vy =  Math.abs(b.vy); }
        if (b.y >= PLAY_BOTTOM) { b.y = PLAY_BOTTOM; b.vy = -Math.abs(b.vy); }

        if (b.x < 0 || b.x > CANVAS_WIDTH || b.life <= 0) {
            bullets.splice(i, 1);
            continue;
        }

        if (checkBulletObstacle(b, i)) continue;

        const target = b.owner === p1 ? p2 : p1;
        if (aabb(b.x, b.y, BULLET_W, BULLET_H, target.x, target.y, PLAYER_W, PLAYER_H)) {
            bullets.splice(i, 1);
            triggerHit(target);
            return;
        }
    }

    if ((phase === 'playing' || phase === 'sudden') &&
        p1.ammo === 0 && p2.ammo === 0 && bullets.length === 0) {
        phase      = 'ammoOut';
        phaseTimer = AMMO_OUT_DELAY_SEC;
    }
}

function checkBulletObstacle(b, bi) {
    for (let j = obstacles.length - 1; j >= 0; j--) {
        const o = obstacles[j];
        if (aabb(b.x, b.y, BULLET_W, BULLET_H, o.x, o.y, o.w, o.h)) {
            if (o.type === 'cactus') obstacles.splice(j, 1);
            bullets.splice(bi, 1);
            return true;
        }
    }
    if (wagonObj && aabb(b.x, b.y, BULLET_W, BULLET_H, wagonObj.x, wagonObj.y, WAGON_W, WAGON_H)) {
        bullets.splice(bi, 1);
        return true;
    }
    return false;
}

// ─── Wagon ────────────────────────────────────────────────────────────────────
function updateWagon(dt) {
    if (!wagonObj) return;
    wagonObj.x += wagonObj.vx * dt;
    if (wagonObj.x <= WAGON_MIN_X) { wagonObj.x = WAGON_MIN_X; wagonObj.vx =  WAGON_SPEED_PX; }
    if (wagonObj.x >= WAGON_MAX_X) { wagonObj.x = WAGON_MAX_X; wagonObj.vx = -WAGON_SPEED_PX; }
}

// ─── Scoring / Hit ────────────────────────────────────────────────────────────
function triggerHit(target) {
    const scorer = target === p1 ? p2 : p1;
    scorer.score++;
    totalScore++;

    const gotMe = target === p1 ? gotMeText1 : gotMeText2;
    gotMe.setPosition(target.x, target.y - GOTME_ABOVE).setVisible(true);

    if (totalScore >= WAGON_MIN_TOTAL && !wagonObj) {
        wagonObj = { x: CENTER_X, y: PLAYER_START_Y, vx: WAGON_SPEED_PX };
    }
    if (obstacles.length < MAX_OBSTACLES) spawnObstacle();

    updateHUD();
    phase      = 'hitFreeze';
    phaseTimer = HIT_FREEZE_SEC;
}

function endFreeze() {
    gotMeText1.setVisible(false);
    gotMeText2.setVisible(false);

    if (matchTimer <= 0 && p1.score !== p2.score) {
        const winner = p1.score > p2.score ? 'P1 WINS' : 'P2 WINS';
        messageText.setText(winner + '\n\nPRESS R').setVisible(true);
        phase   = 'over';
        bullets = [];
        return;
    }

    resetRound();
    phase = matchTimer > 0 ? 'playing' : 'sudden';
    if (phase === 'sudden') messageText.setText('SUDDEN DEATH').setVisible(true);
}

function endMatch() {
    updateHUD();
    if (p1.score === p2.score) {
        phase = 'sudden';
        messageText.setText('SUDDEN DEATH').setVisible(true);
    } else {
        const winner = p1.score > p2.score ? 'P1 WINS' : 'P2 WINS';
        messageText.setText(winner + '\n\nPRESS R').setVisible(true);
        phase = 'over';
    }
}

// ─── Obstacles ───────────────────────────────────────────────────────────────
function spawnInitialObstacles() {
    spawnObstacle(); spawnObstacle(); spawnObstacle();
}

function spawnObstacle() {
    const idx  = obstacles.length % OBS_SLOTS.length;
    const slot = OBS_SLOTS[idx];
    const y    = OBS_Y_SLOTS[idx % OBS_Y_SLOTS.length];
    const w    = slot.type === 'cactus' ? CACTUS_W : TREE_W;
    const h    = slot.type === 'cactus' ? CACTUS_H : TREE_H;
    obstacles.push({ x: slot.x, y, w, h, type: slot.type });
}

// ─── Draw ─────────────────────────────────────────────────────────────────────
function draw() {
    gfx.clear();

    gfx.lineStyle(1, 0x444444, 1);
    gfx.strokeRect(1, PLAY_TOP, CANVAS_WIDTH - 2, PLAY_BOTTOM - PLAY_TOP);

    gfx.lineStyle(1, 0x333333, 1);
    gfx.beginPath();
    gfx.moveTo(CENTER_X, PLAY_TOP);
    gfx.lineTo(CENTER_X, PLAY_BOTTOM);
    gfx.strokePath();

    for (const o of obstacles) {
        gfx.fillStyle(OBSTACLE_COLOR, 1);
        gfx.fillRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
    }

    if (wagonObj) {
        gfx.fillStyle(WAGON_COLOR, 1);
        gfx.fillRect(wagonObj.x - WAGON_W / 2, wagonObj.y - WAGON_H / 2, WAGON_W, WAGON_H);
    }

    drawPlayer(p1, 1);
    drawPlayer(p2, -1);

    gfx.fillStyle(BULLET_COLOR, 1);
    for (const b of bullets) {
        gfx.fillRect(b.x - BULLET_W / 2, b.y - BULLET_H / 2, BULLET_W, BULLET_H);
    }

    drawAmmo();
}

function drawPlayer(p, dir) {
    gfx.fillStyle(PLAYER_COLOR, 1);
    gfx.fillRect(p.x - PLAYER_W / 2, p.y - PLAYER_H / 2, PLAYER_W, PLAYER_H);

    const rad = AIM_ANGLES_DEG[p.aimIdx] * DEG;
    const ax  = p.x + dir * PLAYER_W / 2;
    const ay  = p.y;
    gfx.lineStyle(2, 0xffffff, 1);
    gfx.beginPath();
    gfx.moveTo(ax, ay);
    gfx.lineTo(ax + dir * AIM_LINE_LEN * Math.cos(rad),
               ay + AIM_LINE_LEN * Math.sin(rad));
    gfx.strokePath();
}

function drawAmmo() {
    const top = AMMO_Y - AMMO_ICON_H / 2;
    for (let i = 0; i < AMMO_MAX; i++) {
        gfx.fillStyle(i < p1.ammo ? PLAYER_COLOR : 0x333333, 1);
        gfx.fillRect(8 + i * AMMO_SPACING, top, AMMO_ICON_W, AMMO_ICON_H);
    }
    for (let i = 0; i < AMMO_MAX; i++) {
        gfx.fillStyle(i < p2.ammo ? PLAYER_COLOR : 0x333333, 1);
        gfx.fillRect(CANVAS_WIDTH - 8 - (i + 1) * AMMO_SPACING, top, AMMO_ICON_W, AMMO_ICON_H);
    }
}

function updateHUD() {
    scoreText1.setText(String(p1.score));
    scoreText2.setText(String(p2.score));
    timerText.setText(phase === 'sudden' ? 'SD' : String(Math.ceil(matchTimer)));
}

// ─── Util ─────────────────────────────────────────────────────────────────────
function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
    return Math.abs(ax - bx) < (aw + bw) / 2 &&
           Math.abs(ay - by) < (ah + bh) / 2;
}
