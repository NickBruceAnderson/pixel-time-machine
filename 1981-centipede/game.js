/// <reference types="phaser" />

// ─── Tunables ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH            = 800;
const CANVAS_HEIGHT           = 900;
const BACKGROUND_COLOR        = '#000000';

const PLAY_TOP                = 40;
const PLAY_HEIGHT             = 760;
const PLAY_BOTTOM             = PLAY_TOP + PLAY_HEIGHT;

const PLAYER_WIDTH            = 16;
const PLAYER_HEIGHT           = 16;
const PLAYER_SPEED            = 300;
const PLAYER_Y                = PLAY_BOTTOM - PLAYER_HEIGHT - 10;
const PLAYER_COLOR            = 0x00ff00;

const BULLET_WIDTH            = 4;
const BULLET_HEIGHT           = 12;
const BULLET_SPEED            = 500;
const BULLET_COLOR            = 0xffff00;

const MUSHROOM_ROWS           = 10;
const MUSHROOM_COLS           = 20;
const MUSHROOM_COUNT          = 30;
const MUSHROOM_WIDTH          = 12;
const MUSHROOM_HEIGHT         = 12;
const MUSHROOM_HP             = 3;
const MUSHROOM_COLOR_FULL     = 0x00aa00;
const MUSHROOM_COLOR_HIT      = 0xffaa00;
const MUSHROOM_COLOR_LOW      = 0xff4400;

const CENTIPEDE_SEGMENTS      = 10;
const CENTIPEDE_SEGMENT_SIZE  = 14;
const CENTIPEDE_SPEED         = 80;
const CENTIPEDE_DROP_DISTANCE = 20;
const CENTIPEDE_ROW_HEIGHT    = 20;
const CENTIPEDE_COLOR         = 0xff4444;
const CENTIPEDE_HEAD_COLOR    = 0xff8800;

const SCORE_SEGMENT           = 10;
const SCORE_MUSHROOM          = 1;
const SCORE_CLEAR_BONUS       = 50;
const SPEED_INCREASE          = 10;
const SPEED_CAP               = 200;

const SCORE_TEXT_X            = 20;
const SCORE_TEXT_Y            = PLAY_BOTTOM + 12;
const SCORE_FONT_SIZE         = '20px';
const SCORE_FONT_FAMILY       = 'monospace';
const SCORE_COLOR             = '#ffffff';
const MESSAGE_FONT_SIZE       = '26px';
const MESSAGE_COLOR           = '#ffffff';
const MESSAGE_X               = CANVAS_WIDTH / 2;
const MESSAGE_Y               = CANVAS_HEIGHT / 2;
const SEPARATOR_COLOR         = 0x333333;

// ─── Config ──────────────────────────────────────────────────────────────────
const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

// ─── Scene Globals ────────────────────────────────────────────────────────────
let scene;
let playerRect;
let bulletRect, bulletActive;
let mushroomList;    // [{ rect, hp }]
let centipedeList;   // [{ rect, dir }]
let score, scoreText, messageText;
let cursors, keyA, keyD, keySpace, keyEnter;
let isGameOver;
let currentSpeed;

// ─── Lifecycle ────────────────────────────────────────────────────────────────
function preload() {}

function create() {
    scene        = this;
    isGameOver   = false;
    score        = 0;
    bulletActive = false;
    currentSpeed = CENTIPEDE_SPEED;

    scene.add.rectangle(CANVAS_WIDTH / 2, PLAY_BOTTOM + 1, CANVAS_WIDTH, 2, SEPARATOR_COLOR);

    playerRect = scene.add.rectangle(CANVAS_WIDTH / 2, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR);
    bulletRect = scene.add.rectangle(-100, -100, BULLET_WIDTH, BULLET_HEIGHT, BULLET_COLOR).setVisible(false);

    mushroomList  = [];
    centipedeList = [];
    spawnMushrooms();
    spawnCentipede();

    scoreText = scene.add.text(SCORE_TEXT_X, SCORE_TEXT_Y, 'SCORE 0', {
        fontSize: SCORE_FONT_SIZE,
        fontFamily: SCORE_FONT_FAMILY,
        color: SCORE_COLOR
    });

    messageText = scene.add.text(MESSAGE_X, MESSAGE_Y, '', {
        fontSize: MESSAGE_FONT_SIZE,
        fontFamily: SCORE_FONT_FAMILY,
        color: MESSAGE_COLOR,
        align: 'center'
    }).setOrigin(0.5).setVisible(false);

    cursors  = scene.input.keyboard.createCursorKeys();
    keyA     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyEnter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
}

function update(time, delta) {
    if (isGameOver) {
        if (Phaser.Input.Keyboard.JustDown(keySpace) || Phaser.Input.Keyboard.JustDown(keyEnter)) {
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
        playerRect.x = Math.max(PLAYER_WIDTH / 2, playerRect.x - PLAYER_SPEED * dt);
    } else if (cursors.right.isDown || keyD.isDown) {
        playerRect.x = Math.min(CANVAS_WIDTH - PLAYER_WIDTH / 2, playerRect.x + PLAYER_SPEED * dt);
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

        seg.rect.fillColor = i === 0 ? CENTIPEDE_HEAD_COLOR : CENTIPEDE_COLOR;

        if (seg.rect.y + half >= PLAYER_Y - PLAYER_HEIGHT / 2) {
            triggerGameOver();
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
    const zoneBottom = PLAYER_Y - PLAYER_HEIGHT / 2 - 20;
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
        const rect = scene.add.rectangle(x, y, MUSHROOM_WIDTH, MUSHROOM_HEIGHT, MUSHROOM_COLOR_FULL);
        mushroomList.push({ rect, hp: MUSHROOM_HP });
    }
}

function spawnCentipede() {
    const y = PLAY_TOP + CENTIPEDE_SEGMENT_SIZE / 2 + 4;
    for (let i = 0; i < CENTIPEDE_SEGMENTS; i++) {
        const x    = CENTIPEDE_SEGMENT_SIZE / 2 + 4 + i * (CENTIPEDE_SEGMENT_SIZE + 2);
        const rect = scene.add.rectangle(x, y, CENTIPEDE_SEGMENT_SIZE, CENTIPEDE_SEGMENT_SIZE,
            i === 0 ? CENTIPEDE_HEAD_COLOR : CENTIPEDE_COLOR);
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
    scoreText.setText('SCORE ' + score);
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
    scoreText.setText('SCORE ' + score);

    if (centipedeList.length === 0) {
        score += SCORE_CLEAR_BONUS;
        currentSpeed = Math.min(currentSpeed + SPEED_INCREASE, SPEED_CAP);
        scoreText.setText('SCORE ' + score);
        spawnCentipede();
    }
}

function triggerGameOver() {
    isGameOver = true;
    messageText.setText('GAME OVER\nSCORE ' + score + '\n\nSPACE or ENTER to restart').setVisible(true);
}

function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
    return Math.abs(ax - bx) * 2 < aw + bw && Math.abs(ay - by) * 2 < ah + bh;
}
