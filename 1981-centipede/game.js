/// <reference types="phaser" />

// ─── Tunables ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH                = 800;
const CANVAS_HEIGHT               = 500;

const PLAY_TOP                    = 40;
const PLAY_HEIGHT                 = 400;
const PLAY_BOTTOM                 = PLAY_TOP + PLAY_HEIGHT;

const PLAYER_WIDTH                = 16;
const PLAYER_HEIGHT               = 16;
const PLAYER_SPEED_X              = 300;
const PLAYER_SPEED_Y              = 200;
const PLAYER_VERTICAL_BAND_HEIGHT = 30;
const PLAYER_MAX_Y                = PLAY_BOTTOM - PLAYER_HEIGHT - 10;
const PLAYER_MIN_Y                = PLAYER_MAX_Y - PLAYER_VERTICAL_BAND_HEIGHT;

const BULLET_WIDTH                = 4;
const BULLET_HEIGHT               = 12;
const BULLET_SPEED                = 500;

const MUSHROOM_ROWS               = 10;
const MUSHROOM_COLS               = 20;
const MUSHROOM_COUNT              = 40;
const MUSHROOM_WIDTH              = 12;
const MUSHROOM_HEIGHT             = 12;
const MUSHROOM_HP                 = 3;
const MUSHROOM_COLOR_HIT          = 0xffaa00;
const MUSHROOM_COLOR_LOW          = 0xff4400;

const CENTIPEDE_SEGMENTS          = 10;
const CENTIPEDE_SEGMENT_SIZE      = 14;
const BASE_CENTIPEDE_SPEED        = 200;
const CENTIPEDE_DROP_DISTANCE     = 20;
const CENTIPEDE_ROW_HEIGHT        = 20;
const CENTIPEDE_TOP_RESPAWN_Y     = PLAY_TOP + CENTIPEDE_SEGMENT_SIZE / 2 + 4;
const CENTIPEDE_BOTTOM_LOOP_Y     = PLAY_BOTTOM - CENTIPEDE_SEGMENT_SIZE / 2 - 4;

const MAX_WAVES                   = 10;
const WAVES_PER_LEVEL             = 2;
const WAVE_SPEED_INCREASE_PCT     = 10;
const LEVEL_SPEED_MULTIPLIERS     = [1.0, 1.2, 1.45, 1.75, 2.1];

const LEVEL_PALETTES = [
    { bg: '#000000', player: 0x00ff00, bullet: 0xffff00, headColor: 0xff8800, bodyColor: 0xff4444, mushFull: 0x00aa00, textColor: '#ffffff' },
    { bg: '#000510', player: 0x00ffcc, bullet: 0x00ffff, headColor: 0x22ccff, bodyColor: 0x0077bb, mushFull: 0x006644, textColor: '#00ffcc' },
    { bg: '#060400', player: 0xffee00, bullet: 0xffffff, headColor: 0xff9900, bodyColor: 0xddaa00, mushFull: 0x776600, textColor: '#ffee00' },
    { bg: '#060008', player: 0xff55ff, bullet: 0xee00ff, headColor: 0xff00bb, bodyColor: 0xaa00aa, mushFull: 0x550033, textColor: '#ff55ff' },
    { bg: '#0a0000', player: 0xff3333, bullet: 0xffaaaa, headColor: 0xffffff, bodyColor: 0xff0000, mushFull: 0x770000, textColor: '#ff3333' },
];

const BACKGROUND_COLOR            = LEVEL_PALETTES[0].bg;

const SCORE_SEGMENT               = 10;
const SCORE_MUSHROOM              = 1;
const SCORE_CLEAR_BONUS           = 50;

const SCORE_TEXT_X                = 20;
const SCORE_TEXT_Y                = PLAY_BOTTOM + 12;
const WAVE_TEXT_X                 = CANVAS_WIDTH - 20;
const WAVE_TEXT_Y                 = PLAY_BOTTOM + 12;
const SCORE_FONT_SIZE             = '20px';
const SCORE_FONT_FAMILY           = 'monospace';
const MESSAGE_FONT_SIZE           = '26px';
const MESSAGE_X                   = CANVAS_WIDTH / 2;
const MESSAGE_Y                   = CANVAS_HEIGHT / 2;
const SEPARATOR_COLOR             = 0x333333;

// ─── Config ──────────────────────────────────────────────────────────────────
const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

// ─── Scene Globals ────────────────────────────────────────────────────────────
let scene;
let playerRect;
let bulletRect, bulletActive;
let mushroomList;    // [{ rect, hp }]
let centipedeList;   // [{ rect, dir }]
let score, scoreText, waveText, messageText;
let cursors, keyA, keyD, keyW, keyS, keySpace, keyEnter, keyR;
let isGameOver, isWin;
let currentSpeed;
let currentWave, currentLevel;
let currentPalette;

// ─── Lifecycle ────────────────────────────────────────────────────────────────
function preload() {}

function create() {
    scene          = this;
    isGameOver     = false;
    isWin          = false;
    score          = 0;
    bulletActive   = false;
    currentWave    = 1;
    currentLevel   = 1;
    currentPalette = LEVEL_PALETTES[0];
    currentSpeed   = computeSpeed();

    scene.add.rectangle(CANVAS_WIDTH / 2, PLAY_BOTTOM + 1, CANVAS_WIDTH, 2, SEPARATOR_COLOR);

    playerRect = scene.add.rectangle(CANVAS_WIDTH / 2, PLAYER_MAX_Y, PLAYER_WIDTH, PLAYER_HEIGHT, currentPalette.player);
    bulletRect = scene.add.rectangle(-100, -100, BULLET_WIDTH, BULLET_HEIGHT, currentPalette.bullet).setVisible(false);

    mushroomList  = [];
    centipedeList = [];
    spawnMushrooms();
    spawnCentipede();

    scoreText = scene.add.text(SCORE_TEXT_X, SCORE_TEXT_Y, 'SCORE 0', {
        fontSize: SCORE_FONT_SIZE,
        fontFamily: SCORE_FONT_FAMILY,
        color: currentPalette.textColor
    });

    waveText = scene.add.text(WAVE_TEXT_X, WAVE_TEXT_Y, '', {
        fontSize: SCORE_FONT_SIZE,
        fontFamily: SCORE_FONT_FAMILY,
        color: currentPalette.textColor
    }).setOrigin(1, 0);
    updateWaveText();

    messageText = scene.add.text(MESSAGE_X, MESSAGE_Y, '', {
        fontSize: MESSAGE_FONT_SIZE,
        fontFamily: SCORE_FONT_FAMILY,
        color: currentPalette.textColor,
        align: 'center'
    }).setOrigin(0.5).setVisible(false);

    cursors  = scene.input.keyboard.createCursorKeys();
    keyA     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyS     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyEnter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keyR     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
}

function update(time, delta) {
    if (isGameOver || isWin) {
        if (Phaser.Input.Keyboard.JustDown(keyR)     ||
            Phaser.Input.Keyboard.JustDown(keySpace) ||
            Phaser.Input.Keyboard.JustDown(keyEnter)) {
            scene.scene.restart();
        }
        return;
    }

    const dt = Math.min(delta / 1000, 1 / 30);
    updatePlayer(dt);
    updateBullet(dt);
    updateCentipede(dt);
}

// ─── Player ───────────────────────────────────────────────────────────────────
function updatePlayer(dt) {
    if (cursors.left.isDown || keyA.isDown) {
        playerRect.x = Math.max(PLAYER_WIDTH / 2, playerRect.x - PLAYER_SPEED_X * dt);
    } else if (cursors.right.isDown || keyD.isDown) {
        playerRect.x = Math.min(CANVAS_WIDTH - PLAYER_WIDTH / 2, playerRect.x + PLAYER_SPEED_X * dt);
    }
    if (cursors.up.isDown || keyW.isDown) {
        playerRect.y = Math.max(PLAYER_MIN_Y, playerRect.y - PLAYER_SPEED_Y * dt);
    } else if (cursors.down.isDown || keyS.isDown) {
        playerRect.y = Math.min(PLAYER_MAX_Y, playerRect.y + PLAYER_SPEED_Y * dt);
    }

    if (!bulletActive && Phaser.Input.Keyboard.JustDown(keySpace)) {
        bulletRect.x = playerRect.x;
        bulletRect.y = playerRect.y - PLAYER_HEIGHT / 2 - BULLET_HEIGHT / 2;
        bulletRect.setVisible(true);
        bulletActive = true;
    }
}

// ─── Bullet ───────────────────────────────────────────────────────────────────
function updateBullet(dt) {
    if (!bulletActive) return;

    bulletRect.y -= BULLET_SPEED * dt;

    if (bulletRect.y + BULLET_HEIGHT / 2 < PLAY_TOP) {
        deactivateBullet();
        return;
    }

    for (let i = mushroomList.length - 1; i >= 0; i--) {
        const m = mushroomList[i];
        if (aabb(bulletRect.x, bulletRect.y, BULLET_WIDTH, BULLET_HEIGHT,
                 m.rect.x, m.rect.y, MUSHROOM_WIDTH, MUSHROOM_HEIGHT)) {
            damageMushroom(i);
            deactivateBullet();
            return;
        }
    }

    for (let i = centipedeList.length - 1; i >= 0; i--) {
        const s = centipedeList[i];
        if (aabb(bulletRect.x, bulletRect.y, BULLET_WIDTH, BULLET_HEIGHT,
                 s.rect.x, s.rect.y, CENTIPEDE_SEGMENT_SIZE, CENTIPEDE_SEGMENT_SIZE)) {
            killSegment(i);
            deactivateBullet();
            return;
        }
    }
}

// ─── Centipede ───────────────────────────────────────────────────────────────
function updateCentipede(dt) {
    const half = CENTIPEDE_SEGMENT_SIZE / 2;

    for (let i = 0; i < centipedeList.length; i++) {
        const seg   = centipedeList[i];
        const nextX = seg.rect.x + seg.dir * currentSpeed * dt;

        const wallHit = nextX - half < 0 || nextX + half > CANVAS_WIDTH;
        let   mushHit = false;

        if (!wallHit) {
            for (const m of mushroomList) {
                if (aabb(nextX, seg.rect.y, CENTIPEDE_SEGMENT_SIZE, CENTIPEDE_SEGMENT_SIZE,
                         m.rect.x, m.rect.y, MUSHROOM_WIDTH, MUSHROOM_HEIGHT)) {
                    mushHit = true;
                    break;
                }
            }
        }

        if (wallHit || mushHit) {
            seg.dir   *= -1;
            seg.rect.y += CENTIPEDE_DROP_DISTANCE;
        } else {
            seg.rect.x = nextX;
        }

        seg.rect.fillColor = i === 0 ? currentPalette.headColor : currentPalette.bodyColor;

        if (seg.rect.y >= CENTIPEDE_BOTTOM_LOOP_Y) {
            loopCentipede();
            return;
        }
    }

    for (const seg of centipedeList) {
        if (aabb(seg.rect.x, seg.rect.y, CENTIPEDE_SEGMENT_SIZE, CENTIPEDE_SEGMENT_SIZE,
                 playerRect.x, playerRect.y, PLAYER_WIDTH, PLAYER_HEIGHT)) {
            triggerGameOver();
            return;
        }
    }
}

// ─── Spawn ───────────────────────────────────────────────────────────────────
function spawnMushrooms() {
    const zoneTop    = PLAY_TOP + CENTIPEDE_ROW_HEIGHT * 2;
    const zoneBottom = PLAYER_MIN_Y - PLAYER_HEIGHT / 2 - 20;
    const cellW      = (CANVAS_WIDTH - 40) / MUSHROOM_COLS;
    const cellH      = (zoneBottom - zoneTop) / MUSHROOM_ROWS;

    const positions = [];
    for (let r = 0; r < MUSHROOM_ROWS; r++) {
        for (let c = 0; c < MUSHROOM_COLS; c++) {
            positions.push([r, c]);
        }
    }
    Phaser.Utils.Array.Shuffle(positions);

    for (let i = 0; i < MUSHROOM_COUNT; i++) {
        const [r, c] = positions[i];
        const x    = 20 + c * cellW + cellW / 2;
        const y    = zoneTop + r * cellH + cellH / 2;
        const rect = scene.add.rectangle(x, y, MUSHROOM_WIDTH, MUSHROOM_HEIGHT, currentPalette.mushFull);
        mushroomList.push({ rect, hp: MUSHROOM_HP });
    }
}

function spawnCentipede() {
    for (let i = 0; i < CENTIPEDE_SEGMENTS; i++) {
        const x    = CENTIPEDE_SEGMENT_SIZE / 2 + 4 + i * (CENTIPEDE_SEGMENT_SIZE + 2);
        const rect = scene.add.rectangle(x, CENTIPEDE_TOP_RESPAWN_Y, CENTIPEDE_SEGMENT_SIZE, CENTIPEDE_SEGMENT_SIZE,
            i === 0 ? currentPalette.headColor : currentPalette.bodyColor);
        centipedeList.push({ rect, dir: 1 });
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function deactivateBullet() {
    bulletActive = false;
    bulletRect.setVisible(false);
    bulletRect.x = -100;
    bulletRect.y = -100;
}

function damageMushroom(index) {
    const m = mushroomList[index];
    m.hp -= 1;
    score += SCORE_MUSHROOM;
    updateScoreText();
    if (m.hp <= 0) {
        m.rect.destroy();
        mushroomList.splice(index, 1);
    } else {
        m.rect.fillColor = m.hp === 1 ? MUSHROOM_COLOR_LOW : MUSHROOM_COLOR_HIT;
    }
}

function killSegment(index) {
    centipedeList[index].rect.destroy();
    centipedeList.splice(index, 1);
    score += SCORE_SEGMENT;
    updateScoreText();
    if (centipedeList.length === 0) {
        advanceWave();
    }
}

function triggerGameOver() {
    isGameOver = true;
    messageText.setText('GAME OVER\nSCORE ' + score + '\n\nR to restart').setVisible(true);
}

function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
    return Math.abs(ax - bx) * 2 < aw + bw && Math.abs(ay - by) * 2 < ah + bh;
}

// ─── Wave / Level ─────────────────────────────────────────────────────────────
function computeSpeed() {
    const levelMult   = LEVEL_SPEED_MULTIPLIERS[currentLevel - 1];
    const waveInLevel = (currentWave - 1) % WAVES_PER_LEVEL;
    const waveMult    = 1 + (WAVE_SPEED_INCREASE_PCT / 100) * waveInLevel;
    return BASE_CENTIPEDE_SPEED * levelMult * waveMult;
}

function updateScoreText() {
    scoreText.setText('SCORE ' + score);
}

function updateWaveText() {
    waveText.setText('LEVEL ' + currentLevel + '  WAVE ' + currentWave + ' / ' + MAX_WAVES);
}

function advanceWave() {
    score += SCORE_CLEAR_BONUS;
    updateScoreText();

    currentWave++;
    if (currentWave > MAX_WAVES) {
        triggerWin();
        return;
    }

    const newLevel = Math.ceil(currentWave / WAVES_PER_LEVEL);
    if (newLevel !== currentLevel) {
        currentLevel = newLevel;
        applyPalette(LEVEL_PALETTES[currentLevel - 1]);
    }

    currentSpeed = computeSpeed();
    updateWaveText();

    for (const m of mushroomList) m.rect.destroy();
    mushroomList = [];
    spawnMushrooms();
    spawnCentipede();
}

function loopCentipede() {
    for (const seg of centipedeList) seg.rect.destroy();
    centipedeList = [];
    spawnCentipede();
}

function applyPalette(palette) {
    currentPalette = palette;
    scene.cameras.main.setBackgroundColor(palette.bg);
    playerRect.fillColor  = palette.player;
    bulletRect.fillColor  = palette.bullet;
    scoreText.setColor(palette.textColor);
    waveText.setColor(palette.textColor);
    messageText.setColor(palette.textColor);
}

function triggerWin() {
    isWin = true;
    messageText.setText('YOU SURVIVED\nSCORE ' + score + '\n\nR to restart').setVisible(true);
}
