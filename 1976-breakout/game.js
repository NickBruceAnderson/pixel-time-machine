/// <reference types="phaser" />

// ─── Tunables ────────────────────────────────────────────────────────────────
const CANVAS_WIDTH            = 800;
const CANVAS_HEIGHT           = 640;
const BACKGROUND_COLOR        = '#000000';

const PLAY_LEFT               = 0;
const PLAY_RIGHT              = CANVAS_WIDTH;
const PLAY_TOP                = 40;
const PLAY_BOTTOM             = 560;

const PADDLE_NORMAL_WIDTH     = 100;
const PADDLE_SHRUNK_WIDTH     = 50;
const PADDLE_HEIGHT           = 12;
const PADDLE_SPEED            = 520;
const PADDLE_Y                = PLAY_BOTTOM - 24;
const PADDLE_COLOR            = 0xffffff;

const BALL_SIZE               = 8;
const BALL_BASE_SPEED         = 240;
const BALL_SPEED_TIER_1       = 290;    // kicks in after BALL_SPEED_HIT_1 hits
const BALL_SPEED_TIER_2       = 360;    // kicks in after BALL_SPEED_HIT_2 hits
const BALL_SPEED_TIER_3       = 430;    // kicks in on orange/red brick contact
const BALL_SPEED_HIT_1        = 4;      // hit count threshold for tier 1
const BALL_SPEED_HIT_2        = 12;     // hit count threshold for tier 2
const BALL_COLOR              = 0xffffff;

const MAX_DELTA_S             = 1 / 30;

const SERVE_ANGLE_RANGE       = 25;     // degrees either side of straight up
const PADDLE_BOUNCE_MAX_ANGLE = 65;     // max angle from vertical at paddle edge

const BRICK_COLS              = 14;
const BRICK_ROWS              = 8;
const BRICK_GAP               = 2;
const BRICK_WIDTH             = 52;     // 14 cols + 13 gaps of 2 fits ~754px centered on 800
const BRICK_HEIGHT            = 18;
const BRICK_TOP_OFFSET        = 80;     // pixels below PLAY_TOP where first brick row starts

const BRICK_COLORS = {
    red:    0xff3333,
    orange: 0xff8800,
    green:  0x44cc44,
    yellow: 0xddcc00,
};

const BRICK_SCORES = {
    red: 7, orange: 5, green: 3, yellow: 1,
};

// row 0 = topmost row
const BRICK_ROW_COLORS = ['red', 'red', 'orange', 'orange', 'green', 'green', 'yellow', 'yellow'];

const LIVES_START             = 3;
const MAX_WALLS               = 2;

const SEPARATOR_COLOR         = 0x333333;

const HUD_Y                   = PLAY_BOTTOM + 16;
const HUD_FONT_SIZE           = '18px';
const HUD_FONT                = 'monospace';
const HUD_COLOR               = '#ffffff';

const MESSAGE_FONT_SIZE       = '28px';
const MESSAGE_COLOR           = '#ffffff';
const SUB_FONT_SIZE           = '16px';
const SUB_COLOR               = '#aaaaaa';

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

let paddleRect;
let paddleWidth;
let paddleShrunken;

let ballRect;
let ballVx, ballVy;
let ballActive;
let ballPrevX, ballPrevY;

let bricks;           // [{ rect, row, col, colorName, scoreValue, alive }]
let bricksRemaining;

let score, lives, currentWall, hitCount, hasHitRedZone;
let isGameOver, isWin, isWallClear;

let scoreText, livesText, wallText, messageText, subText;
let cursors, keyA, keyD, keySpace, keyEnter, keyR;

// ─── Lifecycle ────────────────────────────────────────────────────────────────
function preload() {}

function create() {
    scene = this;

    // State
    score         = 0;
    lives         = LIVES_START;
    currentWall   = 1;
    hitCount      = 0;
    hasHitRedZone = false;
    isGameOver    = false;
    isWin         = false;
    isWallClear   = false;

    // Separator lines
    scene.add.rectangle(CANVAS_WIDTH / 2, PLAY_TOP - 1, CANVAS_WIDTH, 2, SEPARATOR_COLOR);
    scene.add.rectangle(CANVAS_WIDTH / 2, PLAY_BOTTOM + 1, CANVAS_WIDTH, 2, SEPARATOR_COLOR);

    // Paddle
    paddleWidth    = PADDLE_NORMAL_WIDTH;
    paddleShrunken = false;
    paddleRect = scene.add.rectangle(CANVAS_WIDTH / 2, PADDLE_Y, paddleWidth, PADDLE_HEIGHT, PADDLE_COLOR);

    // Ball (sits above paddle before serve)
    ballActive = false;
    ballVx = 0;
    ballVy = 0;
    ballRect = scene.add.rectangle(
        CANVAS_WIDTH / 2,
        PADDLE_Y - PADDLE_HEIGHT / 2 - BALL_SIZE / 2,
        BALL_SIZE, BALL_SIZE, BALL_COLOR
    );

    // HUD
    scoreText = scene.add.text(16, HUD_Y, 'SCORE 0', {
        fontSize: HUD_FONT_SIZE, fontFamily: HUD_FONT, color: HUD_COLOR
    });
    livesText = scene.add.text(CANVAS_WIDTH / 2, HUD_Y, '', {
        fontSize: HUD_FONT_SIZE, fontFamily: HUD_FONT, color: HUD_COLOR
    }).setOrigin(0.5, 0);
    wallText = scene.add.text(CANVAS_WIDTH - 16, HUD_Y, '', {
        fontSize: HUD_FONT_SIZE, fontFamily: HUD_FONT, color: HUD_COLOR
    }).setOrigin(1, 0);

    // Message overlay (centered in playfield open area)
    messageText = scene.add.text(CANVAS_WIDTH / 2, PLAY_BOTTOM - 160, '', {
        fontSize: MESSAGE_FONT_SIZE, fontFamily: HUD_FONT, color: MESSAGE_COLOR
    }).setOrigin(0.5);
    subText = scene.add.text(CANVAS_WIDTH / 2, PLAY_BOTTOM - 120, '', {
        fontSize: SUB_FONT_SIZE, fontFamily: HUD_FONT, color: SUB_COLOR
    }).setOrigin(0.5);

    // Input
    cursors  = scene.input.keyboard.createCursorKeys();
    keyA     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyEnter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keyR     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    scene.input.on('pointermove', (ptr) => {
        if (!isGameOver && !isWin) {
            const hw = paddleWidth / 2;
            paddleRect.x = Phaser.Math.Clamp(ptr.x, PLAY_LEFT + hw, PLAY_RIGHT - hw);
        }
    });

    bricks = [];
    buildWall(currentWall);
    updateHud();
    showServeMessage();
}

function update(time, delta) {
    const dt = Math.min(delta / 1000, MAX_DELTA_S);

    if (isGameOver || isWin) {
        if (justPressed(keySpace) || justPressed(keyEnter) || justPressed(keyR)) {
            restartGame();
        }
        return;
    }

    if (isWallClear) {
        if (justPressed(keySpace) || justPressed(keyEnter)) {
            advanceWall();
        }
        return;
    }

    updatePaddle(dt);

    if (!ballActive) {
        // Ball follows paddle on X while waiting to serve
        ballRect.x = paddleRect.x;
        if (justPressed(keySpace)) {
            serveBall();
        }
        return;
    }

    ballPrevX = ballRect.x;
    ballPrevY = ballRect.y;
    updateBall(dt);
}

// ─── Input Helper ─────────────────────────────────────────────────────────────
function justPressed(key) {
    return Phaser.Input.Keyboard.JustDown(key);
}

// ─── Game State ───────────────────────────────────────────────────────────────
function restartGame() {
    bricks.forEach((b) => { if (b.rect) b.rect.destroy(); });
    bricks = [];

    score         = 0;
    lives         = LIVES_START;
    currentWall   = 1;
    hitCount      = 0;
    hasHitRedZone = false;
    isGameOver    = false;
    isWin         = false;
    isWallClear   = false;

    resetLife();
    buildWall(currentWall);
    updateHud();
}

function resetLife() {
    paddleWidth    = PADDLE_NORMAL_WIDTH;
    paddleShrunken = false;
    paddleRect.setSize(paddleWidth, PADDLE_HEIGHT);
    paddleRect.x = CANVAS_WIDTH / 2;

    ballActive = false;
    ballVx     = 0;
    ballVy     = 0;
    ballRect.x = CANVAS_WIDTH / 2;
    ballRect.y = PADDLE_Y - PADDLE_HEIGHT / 2 - BALL_SIZE / 2;

    clearMessage();
    showServeMessage();
}

// ─── Serve ────────────────────────────────────────────────────────────────────
function serveBall() {
    const angleOffset = (Math.random() * 2 - 1) * SERVE_ANGLE_RANGE;
    const rad         = Phaser.Math.DegToRad(-90 + angleOffset);
    const speed       = currentBallSpeed();
    ballVx     = Math.cos(rad) * speed;
    ballVy     = Math.sin(rad) * speed;
    ballActive = true;
    clearMessage();
}

function currentBallSpeed() {
    if (hitCount >= BALL_SPEED_HIT_2) return BALL_SPEED_TIER_2;
    if (hitCount >= BALL_SPEED_HIT_1) return BALL_SPEED_TIER_1;
    return BALL_BASE_SPEED;
}

// ─── Paddle ───────────────────────────────────────────────────────────────────
function updatePaddle(dt) {
    const left  = cursors.left.isDown  || keyA.isDown;
    const right = cursors.right.isDown || keyD.isDown;
    const hw    = paddleWidth / 2;

    if (left)  paddleRect.x -= PADDLE_SPEED * dt;
    if (right) paddleRect.x += PADDLE_SPEED * dt;

    paddleRect.x = Phaser.Math.Clamp(paddleRect.x, PLAY_LEFT + hw, PLAY_RIGHT - hw);
}

// ─── Ball ─────────────────────────────────────────────────────────────────────
function updateBall(dt) {
    ballRect.x += ballVx * dt;
    ballRect.y += ballVy * dt;

    checkWallCollision();
    checkBrickCollision(ballPrevX, ballPrevY);
    checkPaddleCollision(ballPrevX, ballPrevY);

    if (ballRect.y - BALL_SIZE / 2 > PLAY_BOTTOM) {
        loseLife();
    }
}

// ─── Wall Collision ───────────────────────────────────────────────────────────
function checkWallCollision() {
    const r = BALL_SIZE / 2;

    if (ballRect.x - r < PLAY_LEFT) {
        ballRect.x = PLAY_LEFT + r;
        ballVx     = Math.abs(ballVx);
    }
    if (ballRect.x + r > PLAY_RIGHT) {
        ballRect.x = PLAY_RIGHT - r;
        ballVx     = -Math.abs(ballVx);
    }
    if (ballRect.y - r < PLAY_TOP) {
        ballRect.y = PLAY_TOP + r;
        ballVy     = Math.abs(ballVy);
        if (hasHitRedZone && !paddleShrunken) {
            shrinkPaddle();
        }
    }
}

// ─── Paddle Collision ─────────────────────────────────────────────────────────
function checkPaddleCollision(prevX, prevY) {
    const r  = BALL_SIZE / 2;
    const pw = paddleWidth / 2;
    const ph = PADDLE_HEIGHT / 2;
    const px = paddleRect.x;
    const py = paddleRect.y;

    // Only when ball moving down and was above paddle top edge last frame
    if (ballVy <= 0) return;
    if (prevY + r > py - ph) return;

    // No horizontal overlap
    if (ballRect.x + r < px - pw || ballRect.x - r > px + pw) return;

    // Ball crossed paddle top edge
    if (ballRect.y + r >= py - ph) {
        ballRect.y = py - ph - r;

        const relX     = (ballRect.x - px) / pw;          // -1 to +1
        const angleDeg = relX * PADDLE_BOUNCE_MAX_ANGLE;
        const rad      = Phaser.Math.DegToRad(-90 + angleDeg);
        const speed    = Math.max(
            Math.sqrt(ballVx * ballVx + ballVy * ballVy),
            currentBallSpeed()
        );

        ballVx = Math.cos(rad) * speed;
        ballVy = Math.sin(rad) * speed;  // negative = upward

        hitCount += 1;
        boostSpeedIfNeeded();
    }
}

// ─── Brick Collision ──────────────────────────────────────────────────────────
function checkBrickCollision(prevX, prevY) {
    const r = BALL_SIZE / 2;

    for (const brick of bricks) {
        if (!brick.alive) continue;

        const bx  = brick.rect.x - BRICK_WIDTH / 2;
        const by  = brick.rect.y - BRICK_HEIGHT / 2;
        const bx2 = bx + BRICK_WIDTH;
        const by2 = by + BRICK_HEIGHT;

        // Current frame AABB overlap
        if (ballRect.x + r <= bx  || ballRect.x - r >= bx2) continue;
        if (ballRect.y + r <= by  || ballRect.y - r >= by2) continue;

        // Use previous position to determine which axis was entered
        const prevOverlapX = (prevX + r > bx  && prevX - r < bx2);
        const prevOverlapY = (prevY + r > by  && prevY - r < by2);

        if (!prevOverlapX && prevOverlapY) {
            // Entered from left or right side
            ballVx = -ballVx;
        } else if (prevOverlapX && !prevOverlapY) {
            // Entered from top or bottom
            ballVy = -ballVy;
        } else {
            // Corner or already inside — flip both
            ballVx = -ballVx;
            ballVy = -ballVy;
        }

        destroyBrick(brick);

        hitCount += 1;
        boostSpeedIfNeeded();

        // Orange/red bricks trigger speed tier 3 and flag paddle shrink
        if (brick.colorName === 'orange' || brick.colorName === 'red') {
            const spd = Math.sqrt(ballVx * ballVx + ballVy * ballVy);
            if (spd < BALL_SPEED_TIER_3) {
                const ratio = BALL_SPEED_TIER_3 / spd;
                ballVx *= ratio;
                ballVy *= ratio;
            }
            hasHitRedZone = true;
        }

        break;  // one brick per frame
    }
}

function boostSpeedIfNeeded() {
    const spd    = Math.sqrt(ballVx * ballVx + ballVy * ballVy);
    const target = currentBallSpeed();
    if (spd < target) {
        const ratio = target / spd;
        ballVx *= ratio;
        ballVy *= ratio;
    }
}

// ─── Bricks ───────────────────────────────────────────────────────────────────
function buildWall(wallNum) {
    bricks.forEach((b) => { if (b.rect) b.rect.destroy(); });
    bricks = [];
    bricksRemaining = 0;

    const totalW = BRICK_COLS * BRICK_WIDTH + (BRICK_COLS - 1) * BRICK_GAP;
    const startX = (CANVAS_WIDTH - totalW) / 2 + BRICK_WIDTH / 2;
    const startY = PLAY_TOP + BRICK_TOP_OFFSET + BRICK_HEIGHT / 2;

    for (let row = 0; row < BRICK_ROWS; row++) {
        const colorName = BRICK_ROW_COLORS[row];
        const color     = BRICK_COLORS[colorName];
        const scoreVal  = BRICK_SCORES[colorName];
        for (let col = 0; col < BRICK_COLS; col++) {
            const bx   = startX + col * (BRICK_WIDTH + BRICK_GAP);
            const by   = startY + row * (BRICK_HEIGHT + BRICK_GAP);
            const rect = scene.add.rectangle(bx, by, BRICK_WIDTH - 1, BRICK_HEIGHT - 1, color);
            bricks.push({ rect, row, col, colorName, scoreValue: scoreVal, alive: true });
            bricksRemaining += 1;
        }
    }
}

function destroyBrick(brick) {
    brick.alive = false;
    brick.rect.setVisible(false);
    score += brick.scoreValue;
    bricksRemaining -= 1;
    updateHud();

    if (bricksRemaining <= 0) {
        wallCleared();
    }
}

// ─── Wall Clear / Advance ─────────────────────────────────────────────────────
function wallCleared() {
    ballActive  = false;
    isWallClear = true;

    if (currentWall >= MAX_WALLS) {
        triggerWin();
    } else {
        messageText.setText('WALL CLEARED!');
        subText.setText('PRESS SPACE FOR WALL ' + (currentWall + 1));
    }
}

function advanceWall() {
    isWallClear   = false;
    currentWall  += 1;
    hasHitRedZone = false;
    hitCount      = 0;

    bricks.forEach((b) => { if (b.rect) b.rect.destroy(); });
    bricks = [];

    buildWall(currentWall);
    resetLife();
    updateHud();
}

// ─── Lives ────────────────────────────────────────────────────────────────────
function loseLife() {
    lives -= 1;
    updateHud();

    if (lives <= 0) {
        triggerGameOver();
    } else {
        resetLife();
    }
}

// ─── Game Over / Win ──────────────────────────────────────────────────────────
function triggerGameOver() {
    isGameOver = true;
    ballActive = false;
    messageText.setText('GAME OVER');
    subText.setText('PRESS SPACE OR R TO RESTART');
}

function triggerWin() {
    isWin      = true;
    messageText.setText('YOU ESCAPED!');
    subText.setText('PRESS SPACE OR R TO RESTART');
}

// ─── Paddle Shrink ────────────────────────────────────────────────────────────
function shrinkPaddle() {
    paddleShrunken = true;
    paddleWidth    = PADDLE_SHRUNK_WIDTH;
    paddleRect.setSize(paddleWidth, PADDLE_HEIGHT);
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function updateHud() {
    if (scoreText) scoreText.setText('SCORE ' + score);
    if (livesText) livesText.setText('BALLS ' + lives);
    if (wallText)  wallText.setText('WALL ' + currentWall + '/' + MAX_WALLS);
}

function showServeMessage() {
    if (messageText) messageText.setText('');
    if (subText)     subText.setText('PRESS SPACE TO SERVE');
}

function clearMessage() {
    if (messageText) messageText.setText('');
    if (subText)     subText.setText('');
}
