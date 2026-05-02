/// <reference types="phaser" />

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 900;
const BACKGROUND_COLOR = '#000000';
const PLAY_TOP = 10;
const PLAY_HEIGHT = 600;
const PLAY_BOTTOM = PLAY_TOP + PLAY_HEIGHT;

const PADDLE_WIDTH = 6;
const PADDLE_HEIGHT = 60;
const PADDLE_SPEED = 500;
const PADDLE_OFFSET = 40;

const BALL_SIZE = 6;
const BALL_SPEED = 200;
const TICK_RATE = 60;
const STATE_SEND_RATE = 30;
const SCORE_TO_WIN = 7;

const DIVIDER_DASH_HEIGHT = 18;
const DIVIDER_DASH_GAP = 30;
const DIVIDER_WIDTH = 4;
const DIVIDER_DASH_COLOR = '#444444';
const ZONE_SEPARATOR_COLOR = '#333333';

const SCORE_FONT_SIZE = '48px';
const STATUS_FONT_SIZE = '16px';
const STATUS_COLOR = '#aaaaaa';
const ROOM_STATUS_X = CANVAS_WIDTH / 2;
const ROOM_STATUS_Y = PLAY_BOTTOM + 110;

const SERVER_URL = 'ws://localhost:2567';
const ROOM_NAME = 'pong';

const phaserColor = (cssHex) => Phaser.Display.Color.HexStringToColor(cssHex).color;

class OnlinePongScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OnlinePongScene' });
    }

    create() {
        this.room = null;
        this.playerNumber = 0;
        this.inputDir = 0;
        this.lastSentInput = null;

        for (let y = PLAY_TOP; y < PLAY_BOTTOM; y += DIVIDER_DASH_GAP) {
            this.add.rectangle(
                CANVAS_WIDTH / 2,
                y + DIVIDER_DASH_HEIGHT / 2,
                DIVIDER_WIDTH,
                DIVIDER_DASH_HEIGHT,
                phaserColor(DIVIDER_DASH_COLOR)
            );
        }

        this.add.rectangle(CANVAS_WIDTH / 2, PLAY_TOP, CANVAS_WIDTH, 1, phaserColor(ZONE_SEPARATOR_COLOR)).setAlpha(0.6);
        this.add.rectangle(CANVAS_WIDTH / 2, PLAY_BOTTOM, CANVAS_WIDTH, 1, phaserColor(ZONE_SEPARATOR_COLOR)).setAlpha(0.6);

        this.paddleLeft = this.add.rectangle(
            PADDLE_OFFSET,
            PLAY_TOP + PLAY_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            0xffffff
        );
        this.paddleRight = this.add.rectangle(
            CANVAS_WIDTH - PADDLE_OFFSET,
            PLAY_TOP + PLAY_HEIGHT / 2,
            PADDLE_WIDTH,
            PADDLE_HEIGHT,
            0xffffff
        );
        this.ball = this.add.rectangle(
            CANVAS_WIDTH / 2,
            PLAY_TOP + PLAY_HEIGHT / 2,
            BALL_SIZE,
            BALL_SIZE,
            0xffffff
        );

        this.scoreLeftText = this.add.text(
            CANVAS_WIDTH / 2 - 80,
            PLAY_BOTTOM + 20,
            '0',
            { fontSize: SCORE_FONT_SIZE, fill: '#ffffff', fontFamily: 'monospace' }
        ).setOrigin(0.5, 0);
        this.scoreRightText = this.add.text(
            CANVAS_WIDTH / 2 + 80,
            PLAY_BOTTOM + 20,
            '0',
            { fontSize: SCORE_FONT_SIZE, fill: '#ffffff', fontFamily: 'monospace' }
        ).setOrigin(0.5, 0);
        this.statusText = this.add.text(
            ROOM_STATUS_X,
            ROOM_STATUS_Y,
            'Connecting...',
            { fontSize: STATUS_FONT_SIZE + 'px', fill: STATUS_COLOR, fontFamily: 'monospace', align: 'center' }
        ).setOrigin(0.5, 0);

        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        });

        this.connect();
    }

    async connect() {
        try {
            const client = new Colyseus.Client(SERVER_URL);
            this.room = await client.joinOrCreate(ROOM_NAME);
            this.statusText.setText('Joined room. Waiting for assignment...');

            this.room.onMessage('assignment', (message) => {
                this.playerNumber = message.playerNumber;
                this.statusText.setText(`Room ${this.room.roomId} | You are Player ${this.playerNumber}`);
            });

            this.room.onMessage('state', (state) => {
                this.applyServerState(state);
            });

            this.room.onLeave(() => {
                this.statusText.setText('Disconnected from room.');
                this.room = null;
            });

            this.room.onError((code, message) => {
                this.statusText.setText(`Room error ${code}: ${message}`);
            });
        } catch (error) {
            this.statusText.setText('Connection failed. Start the server on port 2567.');
            console.error(error);
        }
    }

    applyServerState(state) {
        this.paddleLeft.y = state.paddles.left.y;
        this.paddleRight.y = state.paddles.right.y;
        this.ball.x = state.ball.x;
        this.ball.y = state.ball.y;
        this.scoreLeftText.setText(String(state.score.left));
        this.scoreRightText.setText(String(state.score.right));

        const players = `${state.players.connected}/2 players`;
        const status = state.gameOver ? `Game over. ${state.winner} wins.` : players;
        const role = this.playerNumber > 0 ? `Player ${this.playerNumber}` : 'Spectator';
        this.statusText.setText(`Room ${state.roomId} | ${role} | ${status}`);
    }

    update() {
        if (!this.room || this.playerNumber === 0) return;

        const upPressed = this.playerNumber === 1 ? this.keys.w.isDown : this.keys.up.isDown;
        const downPressed = this.playerNumber === 1 ? this.keys.s.isDown : this.keys.down.isDown;
        const nextInput = upPressed === downPressed ? 0 : (upPressed ? -1 : 1);

        if (nextInput !== this.lastSentInput) {
            this.room.send('input', { dir: nextInput, stratagem: null });
            this.lastSentInput = nextInput;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: OnlinePongScene,
};

new Phaser.Game(config);
