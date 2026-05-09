import { ACTIONS, REACTIONS } from './data/skills.js';
import { CHARACTER_CLASSES } from './data/characters.js';

const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

function cssHexToNumber(hex) {
  return Number(hex.replace('#', '0x'));
}

const COLORS = {
  background: '#050506',
  panel: '#111116',
  panelBorder: '#2e2e38',
  sky: '#0e3b58',
  grass: '#358f3d',
  formationGrid: '#a7a7a7',
  formationGridLine: '#4d4d4d',
  infoPanel: '#16161d',
  text: '#f5f5f5',
  mutedText: '#b9bbc8',
  redKnight: '#d84343',
  blueKnight: '#3f6fd9',
  spent: '#555862',
  sp: '#2e8fe8',
  hp: '#e04444',
  ap: '#f06a9a',
  rp: '#58a6ff',
  lp: '#f2cf45',
  emptyLp: '#5f5524',
  unitBorder: '#161616'
};

const PHASER_COLORS = Object.fromEntries(
  Object.entries(COLORS).map(([key, value]) => [key, cssHexToNumber(value)])
);

const RESOURCE_ICONS = {
  hp: '❤️',
  sp: '🛡️',
  ap: '🔶',
  rp: '🔷',
  lp: '⭐',
  ip: '🥾'
};

const ms = (value) => Math.round(value);

let battleSpeedMultiplier = 3;

// Layout
const LEFT_PANEL_WIDTH_RATIO = 0.29;
const CENTER_WIDTH_RATIO = 0.42;
const RIGHT_PANEL_WIDTH_RATIO = 0.29;
const BATTLE_WINDOW_HEIGHT_RATIO = 0.48;

const UNIT_SIZE = 70;

// Knight idle sprite
const KNIGHT_IDLE_TEXTURE_KEY = 'knight-idle';
const KNIGHT_IDLE_ASSET_PATH = 'assets/knight/Knight-Idle.png';
const KNIGHT_IDLE_FRAME_WIDTH = 16;
const KNIGHT_IDLE_FRAME_HEIGHT = 16;
const KNIGHT_IDLE_DEFAULT_FRAME = 0;
const KNIGHT_IDLE_TWITCH_FRAME = 1;
const KNIGHT_IDLE_SCALE = 4;
const KNIGHT_RANDOM_IDLE_TWITCH_ENABLED = false;
const KNIGHT_RANDOM_IDLE_TWITCH_TEST_KEY = 'I';
const KNIGHT_RANDOM_IDLE_TWITCH_DELAY_MS = ms(15000);
const KNIGHT_RANDOM_IDLE_TWITCH_HOLD_MS = ms(1000);
const KNIGHT_ATTACK_TEXTURE_KEY = 'knight-attack';
const KNIGHT_ATTACK_ASSET_PATH = 'assets/knight/Knight-Attack.png';
const KNIGHT_ATTACK_FRAME_WIDTH = 16;
const KNIGHT_ATTACK_FRAME_HEIGHT = 16;
const KNIGHT_ATTACK_START_FRAME = 0;
const KNIGHT_ATTACK_END_FRAME = 5;
const KNIGHT_ATTACK_FRAME_RATE = 12;
const KNIGHT_ATTACK_ANIMATION_KEY = 'knight-attack';
const KNIGHT_ATTACK_ACTION_KEYS = ['slash', 'thrust'];
const KNIGHT_ATTACK_ANIMATION_DURATION_MS = ms(
  (KNIGHT_ATTACK_END_FRAME - KNIGHT_ATTACK_START_FRAME + 1) /
    KNIGHT_ATTACK_FRAME_RATE *
    1000
);
const KNIGHT_ATTACK_FINAL_POSE_HOLD_MS = ms(1000);
const KNIGHT_BLOCK_PARRY_TEXTURE_KEY = 'knight-block-parry';
const KNIGHT_BLOCK_PARRY_ASSET_PATH = 'assets/knight/Knight-Block-Parry.png';
const KNIGHT_BLOCK_PARRY_FRAME_WIDTH = 16;
const KNIGHT_BLOCK_PARRY_FRAME_HEIGHT = 16;
const KNIGHT_BLOCK_START_FRAME = 0;
const KNIGHT_BLOCK_END_FRAME = 2;
const KNIGHT_BLOCK_FRAME_RATE = 10;
const KNIGHT_BLOCK_ANIMATION_KEY = 'knight-block';
const KNIGHT_BLOCK_FINAL_POSE_HOLD_MS = ms(1000);
const KNIGHT_BLOCK_SYNC_LEAD_FRAMES = 1;
const KNIGHT_BLOCK_SYNC_LEAD_MS = ms(
  KNIGHT_BLOCK_SYNC_LEAD_FRAMES / KNIGHT_BLOCK_FRAME_RATE * 1000
);
const KNIGHT_PARRY_START_FRAME = 0;
const KNIGHT_PARRY_END_FRAME = 11;
const KNIGHT_PARRY_FRAME_RATE = 12;
const KNIGHT_PARRY_ANIMATION_KEY = 'knight-parry';
const KNIGHT_PARRY_FINAL_POSE_HOLD_MS = ms(1000);
const KNIGHT_PARRY_FLOURISH_FRAME_COUNT = 7;
const KNIGHT_PARRY_SYNC_LEAD_MS = ms(
  (KNIGHT_PARRY_END_FRAME - KNIGHT_PARRY_START_FRAME + 1 - KNIGHT_PARRY_FLOURISH_FRAME_COUNT) /
    KNIGHT_PARRY_FRAME_RATE *
    1000
);
const SHOW_BATTLE_UNIT_NAME_LABELS = false;

// Formation
const FORMATION_ROWS = ['front', 'middle', 'back'];
const FORMATION_COLS = [0, 1, 2];
const FORMATION_ROW_ORDER_RED = ['back', 'middle', 'front'];
const FORMATION_ROW_ORDER_BLUE = ['front', 'middle', 'back'];

// Battlefield presentation
const BATTLE_HORIZON_RATIO = 0.50;
const SKY_STAR_COUNT = 42;
const SKY_STAR_COLOR = '#f5f5f5';
const SKY_STAR_ALPHA = 0.36;
const SKY_STAR_MIN_SIZE = 1;
const SKY_STAR_MAX_SIZE = 2;
const SKY_STAR_TOP_PADDING = 18;
const SKY_STAR_BOTTOM_PADDING = 22;
const FORMATION_GRID_LINE_COLOR = '#23652d';
const FORMATION_GRID_LINE_ALPHA = 0.45;
const FORMATION_GRID_LINE_SIZE = 2;
const FORMATION_GRASS_TOP_PADDING = 18;
const FORMATION_GRASS_BOTTOM_PADDING = 22;
const SHOW_BATTLE_GRID_LINES = false;
const BATTLE_GRID_TOGGLE_KEY = 'G';
const BATTLE_GRID_LINE_ALPHA_VISIBLE = 0.45;
const BATTLE_GRID_LINE_ALPHA_HIDDEN = 0;
const UNIT_VISUAL_Y_OFFSET = 0;
const UNIT_SPRITE_FORWARD_X_OFFSET = 12;
const UNIT_SHADOW_COLOR = '#071309';
const UNIT_SHADOW_ALPHA = 0.38;
const UNIT_SHADOW_WIDTH = 40;
const UNIT_SHADOW_HEIGHT = 12;
const UNIT_SHADOW_Y_OFFSET = 32;

const BATTLE_GRID_WIDTH = 330;
const BATTLE_GRID_SIDE_PADDING = 30;

// Panels
const INFO_PANEL_PADDING = 24;
const INFO_COLUMN_GAP = 28;
const INFO_TOOLTIP_HEIGHT = 82;
const INFO_DIVIDER_COLOR = COLORS.panelBorder;

const SHOW_SIDE_TEAM_STATUS_CARDS = false;
const SIDE_GRID_PADDING = 40;
const SIDE_GRID_TOP = 82;
const SIDE_CARD_WIDTH = 132;
const SIDE_CARD_HEIGHT = 136;
const SIDE_GRID_COLUMN_GAP = 28;
const SIDE_GRID_ROW_GAP = 20;


const COMBAT_LOG_TOP_OFFSET = 650;
const COMBAT_LOG_LEFT_PADDING = 28;
const TEAM_STATUS_PANEL_HEIGHT = COMBAT_LOG_TOP_OFFSET - SIDE_GRID_TOP - SIDE_GRID_PADDING;

const COMBAT_LOG_TOGGLE_X_OFFSET = 432;
const COMBAT_LOG_TOGGLE_Y_OFFSET = 0;
const COMBAT_LOG_TOGGLE_WIDTH = 48;
const COMBAT_LOG_TOGGLE_HEIGHT = 28;
const COMBAT_LOG_TOGGLE_PADDING = 8;
const COMBAT_LOG_TOGGLE_FONT_SIZE = 12;
const COMBAT_LOG_TOGGLE_VISIBLE_LABEL = 'X';
const COMBAT_LOG_TOGGLE_HIDDEN_LABEL = 'LOG';
const COMBAT_LOG_TOGGLE_FILL_COLOR = COLORS.infoPanel;
const COMBAT_LOG_TOGGLE_BORDER_COLOR = COLORS.panelBorder;
const COMBAT_LOG_TOGGLE_TEXT_COLOR = COLORS.text;

const LOG_MAX_LINES = 16;
const LOG_LINE_HEIGHT = 20;

// Text
const FONT_SIZE_HEADER = 24;
const FONT_SIZE_BODY = 12;
const FONT_SIZE_SMALL = 12;

// Resource blocks
const SP_BLOCK_SIZE = 16;
const HP_BLOCK_SIZE = 16;
const AP_BLOCK_SIZE = 12;
const RP_BLOCK_SIZE = 12;
const LP_BLOCK_SIZE = 12;
const RESOURCE_BLOCK_SPACING = 1;

// HUD: CAST
const CAST_TITLE_FONT_SIZE = 12;
const CAST_CALLOUT_Y_OFFSET = 0;
const CAST_CALLOUT_WIDTH = 80;
const CAST_CALLOUT_HEIGHT = 20;
const CAST_CALLOUT_PADDING = 1;
const CAST_CALLOUT_BORDER_COLOR = '#ffffff';
const CAST_CALLOUT_BACKGROUND_COLOR = '#050506';

// HUD: AP/RP/LP
const CAST_CALLOUT_RESOURCE_X_OFFSET = 4;
const CAST_CALLOUT_RESOURCE_Y_GAP = -10;
const CAST_CALLOUT_RESOURCE_GAP = 2;

const ACTION_CAST_ICON_SPACING = 6;
const ACTION_CAST_SPENT_ALPHA = 0.10;

const REACTION_CAST_ICON_SPACING = 22;
const REACTION_CAST_SPENT_ALPHA = 0.10;

const POPUP_RESOURCE_ROW_GAP = 1;

// HUD: UNIT TOGGLE
const SHOW_BATTLE_UNIT_HUD = true;

// HUD: Main resources
const BATTLE_MAIN_RESOURCE_ROW_Y_OFFSET = 40;
const BATTLE_MAIN_RESOURCE_ICON_SPACING = 3;
const BATTLE_MAIN_RESOURCE_GROUP_GAP = 0;
const BATTLE_MAIN_RESOURCE_MAJOR_GAP = 12;
const BATTLE_MAIN_RESOURCE_FONT_SIZE = 8;
const BATTLE_STATE_FULL_ALPHA = 1;
const BATTLE_STATE_EMPTY_ALPHA = 0.20;
const BATTLE_STATE_HIT_DIM_DURATION_MS = ms(260);
//const POPUP_RESOURCE_FONT_SIZE = 4;

const DEPTH_BACKGROUND = 0;
const DEPTH_GRID = 10;
const DEPTH_SHADOW = 20;
const DEPTH_UNIT = 30;
const DEPTH_UNIT_HUD = 40;
const DEPTH_DAMAGE_TEXT = 80;
const DEPTH_COMBAT_CALLOUT = 100;
const BATTLE_RESOURCE_CENTER_DEPTH_BONUS = 3;
const BLUE_RESOURCE_DEPTH_BONUS = {
  sp: 24,
  hp: 20,
  ap: 14,
  rp: 10,
  lp: 28
};

// HUD: LP
const BATTLE_LP_SHOW = true;
const BATTLE_LP_X_OFFSET = 30;
const BATTLE_LP_Y_OFFSET = 34;
const BATTLE_LP_FONT_SIZE = 10;
const BATTLE_LP_CORNER_X_INSET = 8;
const BATTLE_LP_CORNER_Y_INSET = 8;

// HUD: DAMAGE
const DAMAGE_POPUP_Y_OFFSET = 80;
const DAMAGE_NUMBER_X_OFFSET = 0;
const DAMAGE_NUMBER_Y_OFFSET = 50;
const DAMAGE_NUMBER_FONT_SIZE = 18;
const DAMAGE_NUMBER_DURATION_MS = ms(1000);
const DAMAGE_NUMBER_FLOAT_Y = 20;
const DAMAGE_NUMBER_HOLD_MS = ms(1000);

// Battle start
const START_BATTLE_DELAY_MS = ms(250);

// Action timing
const ATTACK_TITLE_DURATION_MS = ms(350);
const ATTACK_RESOURCE_PREVIEW_DURATION_MS = ms(850);
const ATTACK_RESOURCE_COMMIT_DURATION_MS = ms(200);
const POST_ATTACK_RESOURCE_PAUSE_MS = ms(150);

const DEFENDER_TITLE_DURATION_MS = ATTACK_TITLE_DURATION_MS;
const DEFENDER_RESOURCE_PREVIEW_DURATION_MS = ATTACK_RESOURCE_PREVIEW_DURATION_MS;
const DEFENDER_RESOURCE_COMMIT_DURATION_MS = ATTACK_RESOURCE_COMMIT_DURATION_MS;
const DEFENDER_LP_GAIN_STAGGER_MS = ms(250);

// Movement timing
const LUNGE_DURATION_MS = ms(450);
const FREEZE_DURATION_MS = ms(300);
const RETURN_DURATION_MS = ms(450);

const ATTACK_LUNGE_DISTANCE = 360;
const ATTACK_LUNGE_STOP_DISTANCE = 72;

// Result timing
const ATTACKER_COUNTER_RESOURCE_DURATION_MS = ms(450);
const FINAL_STATS_DURATION_MS = ms(750);
const CLEANUP_BUFFER_MS = ms(300);

const FLOATING_EFFECT_DURATION_MS = ms(300);
const RESOURCE_ROW_FADE_IN_DURATION_MS = ms(250);
const COUNTER_RESOURCE_PREVIEW_DURATION_MS = ms(500);
const COUNTER_RESOURCE_COMMIT_DURATION_MS = ms(250);
const COUNTER_RESOURCE_FADE_DELAY_MS = ms(1000);
const SECONDARY_RESOURCE_COMMIT_STAGGER_MS = ms(250);

const RESOURCE_EFFECT_PREVIEW_AFTER_FADE_MS = ms(150);
const RESOURCE_EFFECT_FADE_DELAY_MS = FINAL_STATS_DURATION_MS;

const DAMAGE_BLINK_ALPHA = 0.4;
const DAMAGE_BLINK_DURATION_MS = ms(160);
const DAMAGE_BLINK_REPEAT = 1;

// KO
const KO_FADE_ALPHA = 0.10;
const KO_REMOVE_DELAY_MS = ms(500);

// Derived timing
const ACTION_CAST_LABEL_DELAY_MS =
  ms(0);

const ACTION_CAST_RESOURCE_DELAY_MS =
  ACTION_CAST_LABEL_DELAY_MS + ms(90);

const ACTION_CAST_COMMIT_DELAY_MS =
  ACTION_CAST_RESOURCE_DELAY_MS + ATTACK_RESOURCE_PREVIEW_DURATION_MS;

const ATTACK_LUNGE_START_DELAY_MS =
  ACTION_CAST_COMMIT_DELAY_MS + ATTACK_RESOURCE_COMMIT_DURATION_MS + POST_ATTACK_RESOURCE_PAUSE_MS;

const ATTACK_LUNGE_DURATION_MS =
  LUNGE_DURATION_MS;

const ATTACK_ANIMATION_START_DELAY_MS =
  ATTACK_LUNGE_START_DELAY_MS + ATTACK_LUNGE_DURATION_MS;

const REACTION_CAST_LABEL_DELAY_MS =
  ATTACK_LUNGE_START_DELAY_MS + ATTACK_LUNGE_DURATION_MS + FREEZE_DURATION_MS;

const REACTION_CAST_RESOURCE_DELAY_MS =
  REACTION_CAST_LABEL_DELAY_MS + ms(90);

const REACTION_CAST_COMMIT_DELAY_MS =
  REACTION_CAST_RESOURCE_DELAY_MS + DEFENDER_RESOURCE_PREVIEW_DURATION_MS;

const ATTACK_RETURN_DELAY_MS =
  REACTION_CAST_COMMIT_DELAY_MS + DEFENDER_RESOURCE_COMMIT_DURATION_MS + ATTACKER_COUNTER_RESOURCE_DURATION_MS;

const DEFENSE_RESULT_DELAY_MS =
  ATTACK_RETURN_DELAY_MS + RETURN_DURATION_MS;

const COUNTER_RESULT_DELAY_MS =
  DEFENSE_RESULT_DELAY_MS;

const NO_REACTION_IMPACT_PAUSE_MS =
  ms(200);

const NO_REACTION_RESULT_DELAY_MS =
  ATTACK_ANIMATION_START_DELAY_MS + KNIGHT_ATTACK_ANIMATION_DURATION_MS + NO_REACTION_IMPACT_PAUSE_MS;

const NO_REACTION_RETURN_DELAY_MS =
  NO_REACTION_RESULT_DELAY_MS + KNIGHT_ATTACK_FINAL_POSE_HOLD_MS;

const ACTION_DELAY_MS =
  DEFENSE_RESULT_DELAY_MS + FINAL_STATS_DURATION_MS + CLEANUP_BUFFER_MS;

const COMBAT_ZOOM_KEY = 'F';
const COMBAT_ZOOM_PADDING = 0;
const COMBAT_ZOOM_DURATION_MS = ms(250);

const RESOURCE_EFFECT_COMMIT_DELAY_MS =
  RESOURCE_ROW_FADE_IN_DURATION_MS + RESOURCE_EFFECT_PREVIEW_AFTER_FADE_MS;

const ACTION_CAST_EFFECT_FADE_DELAY_MS =
  ACTION_CAST_COMMIT_DELAY_MS + ms(600);

const REACTION_CAST_EFFECT_FADE_DELAY_MS =
  REACTION_CAST_COMMIT_DELAY_MS - REACTION_CAST_LABEL_DELAY_MS + ms(600);

const REACTION_RESOURCE_GAIN_DELAY_MS =
  REACTION_CAST_COMMIT_DELAY_MS;

function buildGambitRows() {
  return [
    {
      label: 'G1: Parry',
      detail: `[player has ${RESOURCE_ICONS.rp}] [player has ${RESOURCE_ICONS.lp}]`
    },
  {
    label: 'G2: Block',
    detail: `[player has ${RESOURCE_ICONS.rp}]`
  },
  {
    label: 'G3: Thrust',
    detail: `[enemy has 0 ${RESOURCE_ICONS.sp}]`
  },
  {
    label: 'G4: Slash',
    detail: `[enemy has 2+${RESOURCE_ICONS.sp}]`
  }
];
}

function buildEquipmentRows() {
  return [
    {
      label: 'RH: Broadsword',
      detail: '(Grants Thrust)'
    },
    {
      label: 'LH: Buckler',
      detail: '(Grants Parry)'
    },
    {
      label: 'AR: Plate Mail',
      detail: '(+2🛡️ -1🥾)'
    }
  ];
}

const TOOLTIP_TEXT = [
  'Hover Tooltip:',
  'If you hover over anything above, it will explain it here.',
  'We do not need to build this yet.'
];

let sceneRef;
let layout;
let units;
let logRows = [];
let combatLogHeader;
let combatLogToggleButton;
let combatLogToggleLabel;
let isCombatLogVisible = true;
let round = 0;
let turn = 1;
let action = 1;
let turnQueue = [];
let battleEnded = false;
let actionTimer;
let speedLabel;
let infoPanelNodes = [];
let statusPanelNodes = [];
let currentAttacker = null;
let currentDefender = null;
let combatZoomMode = true;
let isBattleGridLineVisible = SHOW_BATTLE_GRID_LINES;
let battleGridLineNodes = [];
let isKnightRandomIdleTwitchEnabled = KNIGHT_RANDOM_IDLE_TWITCH_ENABLED;

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: PHASER_COLORS.background,
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create
  }
};

new Phaser.Game(config);

function preload() {
  this.load.spritesheet(KNIGHT_IDLE_TEXTURE_KEY, KNIGHT_IDLE_ASSET_PATH, {
    frameWidth: KNIGHT_IDLE_FRAME_WIDTH,
    frameHeight: KNIGHT_IDLE_FRAME_HEIGHT
  });
  this.load.spritesheet(KNIGHT_ATTACK_TEXTURE_KEY, KNIGHT_ATTACK_ASSET_PATH, {
    frameWidth: KNIGHT_ATTACK_FRAME_WIDTH,
    frameHeight: KNIGHT_ATTACK_FRAME_HEIGHT
  });
  this.load.spritesheet(KNIGHT_BLOCK_PARRY_TEXTURE_KEY, KNIGHT_BLOCK_PARRY_ASSET_PATH, {
    frameWidth: KNIGHT_BLOCK_PARRY_FRAME_WIDTH,
    frameHeight: KNIGHT_BLOCK_PARRY_FRAME_HEIGHT
  });
}

function create() {
  sceneRef = this;
  createKnightAnimations();
  createLayout();
  applyCombatZoomMode(false);

  speedLabel = sceneRef.add.text(
    layout.left.x + SIDE_GRID_PADDING,
    layout.left.h - 60,
    `Speed: ${battleSpeedMultiplier}x`,
    smallTextStyle()
  );

  createUnits();
  setBattleSpeed(battleSpeedMultiplier);

  sceneRef.input.keyboard.on('keydown-ONE', () => setBattleSpeed(1));
  sceneRef.input.keyboard.on('keydown-TWO', () => setBattleSpeed(2));
  sceneRef.input.keyboard.on('keydown-THREE', () => setBattleSpeed(3));
  sceneRef.input.keyboard.on('keydown-FOUR', () => setBattleSpeed(4));
  sceneRef.input.keyboard.on(`keydown-${COMBAT_ZOOM_KEY}`, toggleCombatZoomMode);
  sceneRef.input.keyboard.on(`keydown-${BATTLE_GRID_TOGGLE_KEY}`, toggleBattleGridLines);
  sceneRef.input.keyboard.on(`keydown-${KNIGHT_RANDOM_IDLE_TWITCH_TEST_KEY}`, toggleKnightRandomIdleTwitch);

  startBattle();
}

function createKnightAnimations() {
  sceneRef.anims.create({
    key: KNIGHT_ATTACK_ANIMATION_KEY,
    frames: sceneRef.anims.generateFrameNumbers(KNIGHT_ATTACK_TEXTURE_KEY, {
      start: KNIGHT_ATTACK_START_FRAME,
      end: KNIGHT_ATTACK_END_FRAME
    }),
    frameRate: KNIGHT_ATTACK_FRAME_RATE,
    repeat: 0
  });
  sceneRef.anims.create({
    key: KNIGHT_BLOCK_ANIMATION_KEY,
    frames: sceneRef.anims.generateFrameNumbers(KNIGHT_BLOCK_PARRY_TEXTURE_KEY, {
      start: KNIGHT_BLOCK_START_FRAME,
      end: KNIGHT_BLOCK_END_FRAME
    }),
    frameRate: KNIGHT_BLOCK_FRAME_RATE,
    repeat: 0
  });
  sceneRef.anims.create({
    key: KNIGHT_PARRY_ANIMATION_KEY,
    frames: sceneRef.anims.generateFrameNumbers(KNIGHT_BLOCK_PARRY_TEXTURE_KEY, {
      start: KNIGHT_PARRY_START_FRAME,
      end: KNIGHT_PARRY_END_FRAME
    }),
    frameRate: KNIGHT_PARRY_FRAME_RATE,
    repeat: 0
  });
}

function toggleBattleGridLines() {
  setBattleGridLineVisibility(!isBattleGridLineVisible);
}

function setBattleGridLineVisibility(isVisible) {
  isBattleGridLineVisible = isVisible;
  const alpha = isVisible ? BATTLE_GRID_LINE_ALPHA_VISIBLE : BATTLE_GRID_LINE_ALPHA_HIDDEN;
  battleGridLineNodes.forEach((node) => {
    node.setAlpha(alpha);
  });
}

function toggleCombatZoomMode() {
  combatZoomMode = !combatZoomMode;
  applyCombatZoomMode(true);
}

function applyCombatZoomMode(animate = true) {
  const camera = sceneRef.cameras.main;

  const duration = animate ? COMBAT_ZOOM_DURATION_MS : 0;
  const ease = 'Quad.easeInOut';

  if (!combatZoomMode) {
    camera.pan(GAME_WIDTH / 2, GAME_HEIGHT / 2, duration, ease);
    camera.zoomTo(1, duration, ease);
    return;
  }

  const targetW = layout.battle.w + COMBAT_ZOOM_PADDING * 2;
  const targetH = layout.battle.h + COMBAT_ZOOM_PADDING * 2;
  const zoom = Math.min(GAME_WIDTH / targetW, GAME_HEIGHT / targetH);
  const centerX = layout.battle.x + layout.battle.w / 2;
  const centerY = layout.battle.y + layout.battle.h / 2;

  camera.pan(centerX, centerY, duration, ease);
  camera.zoomTo(zoom, duration, ease);
}

function createLayout() {
  const leftW = GAME_WIDTH * LEFT_PANEL_WIDTH_RATIO;
  const centerW = GAME_WIDTH * CENTER_WIDTH_RATIO;
  const rightW = GAME_WIDTH * RIGHT_PANEL_WIDTH_RATIO;
  const centerX = leftW;
  const rightX = leftW + centerW;
  const battleH = GAME_HEIGHT * BATTLE_WINDOW_HEIGHT_RATIO;
  const grassY = battleH * BATTLE_HORIZON_RATIO;
  const grassH = battleH - grassY;

  layout = {
    left: { x: 0, y: 0, w: leftW, h: GAME_HEIGHT },
    center: { x: centerX, y: 0, w: centerW, h: GAME_HEIGHT },
    right: { x: rightX, y: 0, w: rightW, h: GAME_HEIGHT },
    battle: { x: centerX, y: 0, w: centerW, h: battleH },
    info: { x: centerX, y: battleH, w: centerW, h: GAME_HEIGHT - battleH },
    grass: { x: centerX, y: grassY, w: centerW, h: grassH }
  };

  drawPanel(layout.left, 'Red Team');

  sceneRef.add.rectangle(layout.battle.x, layout.battle.y, layout.battle.w, layout.grass.y, PHASER_COLORS.sky)
    .setOrigin(0)
    .setDepth(DEPTH_BACKGROUND);
  drawSkyStars();
  sceneRef.add.rectangle(layout.grass.x, layout.grass.y, layout.grass.w, layout.grass.h, PHASER_COLORS.grass)
    .setOrigin(0)
    .setDepth(DEPTH_BACKGROUND);
  drawBattleFormationGrid('red');
  drawBattleFormationGrid('blue');
  sceneRef.add.rectangle(layout.battle.x, layout.battle.y, layout.battle.w, layout.battle.h)
    .setOrigin(0)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder);

  sceneRef.add.rectangle(layout.info.x, layout.info.y, layout.info.w, layout.info.h, PHASER_COLORS.infoPanel)
    .setOrigin(0)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder);
  createInfoPanel();

  drawPanel(layout.right, 'Blue Team');
  renderCombatLogHeader();
}

function drawPanel(rect, title) {
  sceneRef.add.rectangle(rect.x, rect.y, rect.w, rect.h, PHASER_COLORS.panel)
    .setOrigin(0)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder);
  sceneRef.add.text(rect.x + rect.w / 2, 26, title, headerTextStyle())
    .setOrigin(0.5, 0);
}

function createUnits() {
  units = [
    createCharacter('R1', 'knight', PHASER_COLORS.redKnight, 'red', 'front', 0),
    createCharacter('R2', 'knight', PHASER_COLORS.redKnight, 'red', 'front', 1),
    createCharacter('R3', 'knight', PHASER_COLORS.redKnight, 'red', 'middle', 1),
    createCharacter('R4', 'knight', PHASER_COLORS.redKnight, 'red', 'back', 1),
    createCharacter('B1', 'knight', PHASER_COLORS.blueKnight, 'blue', 'front', 0),
    createCharacter('B2', 'knight', PHASER_COLORS.blueKnight, 'blue', 'front', 1),
    createCharacter('B3', 'knight', PHASER_COLORS.blueKnight, 'blue', 'middle', 1),
    createCharacter('B4', 'knight', PHASER_COLORS.blueKnight, 'blue', 'back', 1)
  ];
  setActiveCombatants(firstLivingUnit('red'), firstLivingUnit('blue'));
  refreshInfoPanel();
}

function createCharacter(name, characterClass, color, teamKey, row, col) {
  const classStats = CHARACTER_CLASSES[characterClass];
  const { x, baseY } = getFormationPosition(teamKey, row, col);
  const spriteX = x + (teamKey === 'red'
    ? UNIT_SPRITE_FORWARD_X_OFFSET
    : -UNIT_SPRITE_FORWARD_X_OFFSET);
  
  const shadow = sceneRef.add.ellipse(
    x,
    baseY + UNIT_SHADOW_Y_OFFSET,
    UNIT_SHADOW_WIDTH,
    UNIT_SHADOW_HEIGHT,
    cssHexToNumber(UNIT_SHADOW_COLOR)
  )
    .setAlpha(UNIT_SHADOW_ALPHA);
  shadow.setDepth(DEPTH_SHADOW);

  const rect = sceneRef.add.sprite(
    spriteX,
    baseY,
    KNIGHT_IDLE_TEXTURE_KEY,
    KNIGHT_IDLE_DEFAULT_FRAME
  )
    .setScale(KNIGHT_IDLE_SCALE)
    .setFlipX(teamKey === 'blue');
  rect.setDepth(DEPTH_UNIT);
  
  const label = sceneRef.add.text(spriteX, baseY, name, {
    fontFamily: 'monospace',
    fontSize: '20px',
    color: COLORS.text
  })
    .setOrigin(0.5)
    .setVisible(SHOW_BATTLE_UNIT_NAME_LABELS)
    .setDepth(DEPTH_UNIT_HUD);

  const unit = {
    name,
    class: characterClass,
    color,
    teamKey,
    row,
    col,
    hp: classStats.hp,
    maxHp: classStats.maxHp,
    sp: classStats.sp,
    maxSp: classStats.maxSp,
    ap: classStats.ap,
    maxAp: classStats.maxAp,
    rp: classStats.rp,
    maxRp: classStats.maxRp,
    lp: classStats.lp,
    maxLp: classStats.maxLp,
    ip: classStats.ip,
    maxIp: classStats.maxIp,
    shadow,
    rect,
    label,
    battleHudNodes: {
      top: [],
      bottomLeft: [],
      bottomRight: [],
      lp: []
    }
  };

  refreshBattleUnitHud(unit);
  startKnightIdle(unit);
  return unit;
}

function startKnightIdle(unit) {
  if (!hasBattlefieldVisuals(unit) || unit.hp <= 0 || unit.isPlayingKnightAnimation) {
    return;
  }

  setKnightIdle(unit);
  startKnightRandomIdleTwitch(unit);
}

function toggleKnightRandomIdleTwitch() {
  isKnightRandomIdleTwitchEnabled = !isKnightRandomIdleTwitchEnabled;
  units.forEach((unit) => {
    if (isKnightRandomIdleTwitchEnabled) {
      startKnightRandomIdleTwitch(unit);
      return;
    }

    stopKnightRandomIdleTwitch(unit);
    if (!unit.isPlayingKnightAnimation) {
      setKnightIdle(unit);
    }
  });
}

function canRunKnightRandomIdleTwitch(unit) {
  return isKnightRandomIdleTwitchEnabled &&
    hasBattlefieldVisuals(unit) &&
    unit.hp > 0 &&
    !unit.isPlayingKnightAnimation;
}

function setKnightIdle(unit) {
  unit.rect.stop();
  unit.rect.setTexture(KNIGHT_IDLE_TEXTURE_KEY, KNIGHT_IDLE_DEFAULT_FRAME);
  unit.rect.setFrame(KNIGHT_IDLE_DEFAULT_FRAME);
  unit.rect.setFlipX(unit.teamKey === 'blue');
}

function stopKnightRandomIdleTwitch(unit) {
  if (unit.idleTwitchEvent) {
    unit.idleTwitchEvent.remove(false);
    unit.idleTwitchEvent = null;
  }

  if (unit.idleTwitchHoldEvent) {
    unit.idleTwitchHoldEvent.remove(false);
    unit.idleTwitchHoldEvent = null;
  }
}

function startKnightRandomIdleTwitch(unit) {
  if (!canRunKnightRandomIdleTwitch(unit)) {
    return;
  }

  setKnightIdle(unit);
  scheduleKnightRandomIdleTwitch(unit);
}

function scheduleKnightRandomIdleTwitch(unit) {
  if (!canRunKnightRandomIdleTwitch(unit)) {
    return;
  }

  stopKnightRandomIdleTwitch(unit);
  unit.idleTwitchEvent = sceneRef.time.delayedCall(KNIGHT_RANDOM_IDLE_TWITCH_DELAY_MS, () => {
    unit.idleTwitchEvent = null;
    playKnightRandomIdleTwitch(unit);
  });
}

function playKnightRandomIdleTwitch(unit) {
  if (!canRunKnightRandomIdleTwitch(unit)) {
    return;
  }

  unit.rect.setTexture(KNIGHT_IDLE_TEXTURE_KEY, KNIGHT_IDLE_TWITCH_FRAME);
  unit.rect.setFrame(KNIGHT_IDLE_TWITCH_FRAME);
  unit.idleTwitchHoldEvent = sceneRef.time.delayedCall(KNIGHT_RANDOM_IDLE_TWITCH_HOLD_MS, () => {
    unit.idleTwitchHoldEvent = null;
    if (!canRunKnightRandomIdleTwitch(unit)) {
      return;
    }

    setKnightIdle(unit);
    scheduleKnightRandomIdleTwitch(unit);
  });
}

function getCurrentIconRowWidth(entries, iconSpacing, groupGap) {
  const visibleEntries = entries.filter((entry) => entry.current > 0);
  const totalIcons = visibleEntries.reduce((sum, entry) => sum + entry.current, 0);
  if (totalIcons <= 0) {
    return 0;
  }

  return (totalIcons - 1) * iconSpacing + Math.max(0, visibleEntries.length - 1) * groupGap;
}

function addBattleHudIcon(unit, groupKey, x, y, resourceKey, fontSize) {
  const node = sceneRef.add.text(x, y, RESOURCE_ICONS[resourceKey], {
    fontFamily: 'Arial',
    fontSize: `${fontSize}px`,
    color: COLORS.text
  }).setOrigin(0.5, 0.5);

  node.resourceKey = resourceKey;
  node.setAlpha(BATTLE_STATE_FULL_ALPHA);
  node.setDepth(getBattleResourceDepth(unit, x, resourceKey));
  unit.battleHudNodes[groupKey].push(node);
}

function getBattleResourceDepth(unit, x, resourceKey) {
  return DEPTH_UNIT_HUD + getResourceOverlapBonus(unit, resourceKey, x);
}

function getResourceOverlapBonus(unit, resourceKey, x) {
  const centerBonus = getBattleCenterOverlapBonus(x);

  if (unit.teamKey !== 'blue') {
    return centerBonus;
  }

  return centerBonus + (BLUE_RESOURCE_DEPTH_BONUS[resourceKey] || 0);
}

function getBattleCenterOverlapBonus(x) {
  const battleCenterX = layout.battle.x + layout.battle.w / 2;
  const maxDistance = layout.battle.w / 2;
  const normalizedDistance = Math.min(1, Math.abs(x - battleCenterX) / maxDistance);
  return Math.round((1 - normalizedDistance) * BATTLE_RESOURCE_CENTER_DEPTH_BONUS);
}

function drawBattleHudIconRow(unit, groupKey, entries, startX, y, iconSpacing, groupGap, fontSize) {
  let cursorX = startX;

  entries.forEach((entry, entryIndex) => {
    for (let index = 0; index < entry.current; index += 1) {
      addBattleHudIcon(unit, groupKey, cursorX, y, entry.key, fontSize);
      cursorX += iconSpacing;
    }

    if (entry.current > 0 && entries.slice(entryIndex + 1).some((nextEntry) => nextEntry.current > 0)) {
      cursorX += groupGap;
    }
  });
}

function createBattleMainResourceRow(unit) {
  if (!SHOW_BATTLE_UNIT_HUD || !hasBattlefieldVisuals(unit)) {
    return;
  }

  const rowGroups = unit.teamKey === 'blue'
    ? [
      [
        { key: 'sp', current: unit.sp },
        { key: 'hp', current: unit.hp }
      ],
      [
        { key: 'ap', current: unit.ap },
        { key: 'rp', current: unit.rp }
      ]
    ]
    : [
      [
        { key: 'rp', current: unit.rp },
        { key: 'ap', current: unit.ap }
      ],
      [
        { key: 'hp', current: unit.hp },
        { key: 'sp', current: unit.sp }
      ]
    ];

  const groupWidths = rowGroups.map((entries) => getCurrentIconRowWidth(
    entries,
    BATTLE_MAIN_RESOURCE_ICON_SPACING,
    BATTLE_MAIN_RESOURCE_GROUP_GAP
  ));
  const visibleGroupCount = groupWidths.filter((width) => width > 0).length;
  const totalWidth = groupWidths.reduce((sum, width) => sum + width, 0) +
    Math.max(0, visibleGroupCount - 1) * BATTLE_MAIN_RESOURCE_MAJOR_GAP;

  let cursorX = unit.shadow.x - totalWidth / 2;
  const y = unit.rect.y + BATTLE_MAIN_RESOURCE_ROW_Y_OFFSET;

  rowGroups.forEach((entries, groupIndex) => {
    if (groupWidths[groupIndex] <= 0) {
      return;
    }

    drawBattleHudIconRow(
      unit,
      'top',
      entries,
      cursorX,
      y,
      BATTLE_MAIN_RESOURCE_ICON_SPACING,
      BATTLE_MAIN_RESOURCE_GROUP_GAP,
      BATTLE_MAIN_RESOURCE_FONT_SIZE
    );
    cursorX += groupWidths[groupIndex] + BATTLE_MAIN_RESOURCE_MAJOR_GAP;
  });
}

function createBattleLpMarker(unit) {
  if (!SHOW_BATTLE_UNIT_HUD || !BATTLE_LP_SHOW || !hasBattlefieldVisuals(unit) || unit.lp <= 0) {
    return;
  }

  const x = unit.teamKey === 'blue'
    ? unit.rect.x - BATTLE_LP_X_OFFSET + BATTLE_LP_CORNER_X_INSET
    : unit.rect.x + BATTLE_LP_X_OFFSET - BATTLE_LP_CORNER_X_INSET;

  const y = unit.rect.y + BATTLE_LP_Y_OFFSET - BATTLE_LP_CORNER_Y_INSET;

  addBattleHudIcon(
    unit,
    'lp',
    x,
    y,
    'lp',
    BATTLE_LP_FONT_SIZE
  );
}

function destroyBattleUnitHud(unit) {
  if (!unit || !unit.battleHudNodes) {
    return;
  }

  Object.keys(unit.battleHudNodes).forEach((groupKey) => {
    unit.battleHudNodes[groupKey].forEach((node) => {
      if (isLiveBattlefieldNode(node)) {
        node.destroy();
      }
    });

    unit.battleHudNodes[groupKey] = [];
  });
}

function refreshBattleUnitHud(unit) {
  if (!unit || !unit.battleHudNodes) {
    return;
  }

  destroyBattleUnitHud(unit);
  if (!SHOW_BATTLE_UNIT_HUD || !hasBattlefieldVisuals(unit)) {
    return;
  }

  createBattleMainResourceRow(unit);
  createBattleLpMarker(unit);
}

function refreshBattleStateResourceRow(unit) {
  refreshBattleUnitHud(unit);
}

function animateBattleStateResourceLoss(unit, resourceKey, before, after) {
  refreshBattleStateResourceRow(unit);
}

function getFormationPosition(teamKey, row, col) {
  const gridRect = getBattleGridRect(teamKey);
  const rowOrder = teamKey === 'red' ? FORMATION_ROW_ORDER_RED : FORMATION_ROW_ORDER_BLUE;
  const cellW = gridRect.w / FORMATION_ROWS.length;
  const cellH = gridRect.h / FORMATION_COLS.length;
  const x = gridRect.x + cellW * rowOrder.indexOf(row) + cellW / 2;
  const slotCenterY = gridRect.y + cellH * col + cellH / 2;
  const baseY = slotCenterY + UNIT_VISUAL_Y_OFFSET;
  return { x, baseY };
}

function getBattleGridRect(teamKey) {
  const x = teamKey === 'red'
    ? layout.battle.x + BATTLE_GRID_SIDE_PADDING
    : layout.battle.x + layout.battle.w - BATTLE_GRID_SIDE_PADDING - BATTLE_GRID_WIDTH;
  return {
    x,
    y: layout.grass.y + FORMATION_GRASS_TOP_PADDING,
    w: BATTLE_GRID_WIDTH,
    h: layout.grass.h - FORMATION_GRASS_TOP_PADDING - FORMATION_GRASS_BOTTOM_PADDING
  };
}

function drawBattleFormationGrid(teamKey) {
  const rect = getBattleGridRect(teamKey);
  const cellW = rect.w / FORMATION_ROWS.length;
  const cellH = rect.h / FORMATION_COLS.length;

  addBattleGridLineNode(rect.x, rect.y, rect.w, FORMATION_GRID_LINE_SIZE, 0, 0);
  addBattleGridLineNode(rect.x, rect.y + rect.h, rect.w, FORMATION_GRID_LINE_SIZE, 0, 0.5);
  addBattleGridLineNode(rect.x, rect.y, FORMATION_GRID_LINE_SIZE, rect.h, 0, 0);
  addBattleGridLineNode(rect.x + rect.w, rect.y, FORMATION_GRID_LINE_SIZE, rect.h, 0.5, 0);

  for (let index = 1; index < FORMATION_ROWS.length; index += 1) {
    addBattleGridLineNode(
      rect.x + cellW * index,
      rect.y,
      FORMATION_GRID_LINE_SIZE,
      rect.h,
      0.5,
      0
    );
  }

  for (let index = 1; index < FORMATION_COLS.length; index += 1) {
    addBattleGridLineNode(
      rect.x,
      rect.y + cellH * index,
      rect.w,
      FORMATION_GRID_LINE_SIZE,
      0,
      0.5
    );
  }
}

function addBattleGridLineNode(x, y, width, height, originX, originY) {
  const node = sceneRef.add.rectangle(
    x,
    y,
    width,
    height,
    cssHexToNumber(FORMATION_GRID_LINE_COLOR)
  )
    .setOrigin(originX, originY)
    .setAlpha(isBattleGridLineVisible ? BATTLE_GRID_LINE_ALPHA_VISIBLE : BATTLE_GRID_LINE_ALPHA_HIDDEN)
    .setDepth(DEPTH_GRID);

  battleGridLineNodes.push(node);
}

function firstLivingUnit(teamKey) {
  return livingTeamUnits(teamKey).sort(getFormationSortOrder)[0] || null;
}

function livingTeamUnits(teamKey) {
  return units.filter((unit) => unit.teamKey === teamKey && unit.hp > 0);
}

function livingEnemyUnits(unit) {
  const enemyTeam = unit.teamKey === 'red' ? 'blue' : 'red';
  return livingTeamUnits(enemyTeam);
}

function getTargetableEnemyRow(attacker) {
  const enemies = livingEnemyUnits(attacker);
  return FORMATION_ROWS.find((row) => enemies.some((enemy) => enemy.row === row)) || null;
}

function chooseTarget(attacker) {
  const enemies = livingEnemyUnits(attacker);
  if (enemies.length === 0) {
    return null;
  }
  const targetableRow = getTargetableEnemyRow(attacker);
  return enemies
    .filter((enemy) => enemy.row === targetableRow)
    .sort((a, b) => a.col - b.col || a.name.localeCompare(b.name))[0];
}

function isTeamDefeated(teamKey) {
  return livingTeamUnits(teamKey).length === 0;
}

function getFormationSortOrder(a, b) {
  const rowOrder = { front: 0, middle: 1, back: 2 };
  return rowOrder[a.row] - rowOrder[b.row] || a.col - b.col || a.name.localeCompare(b.name);
}

function setActiveCombatants(attacker, defender) {
  currentAttacker = attacker;
  currentDefender = defender;
  refreshInfoPanel();
}

function formatResourceCurrent(unit, resourceKey) {
  const current = unit[resourceKey];
  const maxKey = `max${resourceKey.charAt(0).toUpperCase()}${resourceKey.slice(1)}`;
  const max = unit[maxKey];
  const icon = RESOURCE_ICONS[resourceKey];

  return icon.repeat(current) + '·'.repeat(max - current);
}

function formatCharacterStats(unit) {
  return [
    `${unit.name} Knight`,
    `HP: ${formatResourceCurrent(unit, 'hp')}`,
    `SP: ${formatResourceCurrent(unit, 'sp')}`,
    `AP: ${formatResourceCurrent(unit, 'ap')}`,
    `RP: ${formatResourceCurrent(unit, 'rp')}`,
    `LP: ${formatResourceCurrent(unit, 'lp')}`
  ];
}

function createInfoPanel() {
  const tooltipY = layout.info.y + layout.info.h - INFO_TOOLTIP_HEIGHT;
  const dividerX = layout.info.x + layout.info.w / 2;

  sceneRef.add.line(
    0,
    0,
    dividerX,
    layout.info.y + INFO_PANEL_PADDING,
    dividerX,
    tooltipY - INFO_PANEL_PADDING / 2,
    cssHexToNumber(INFO_DIVIDER_COLOR)
  ).setOrigin(0);

  sceneRef.add.line(
    0,
    0,
    layout.info.x + INFO_PANEL_PADDING,
    tooltipY,
    layout.info.x + layout.info.w - INFO_PANEL_PADDING,
    tooltipY,
    cssHexToNumber(INFO_DIVIDER_COLOR)
  ).setOrigin(0);

  const tooltipText = sceneRef.add.text(
    layout.info.x + INFO_PANEL_PADDING,
    tooltipY + 14,
    TOOLTIP_TEXT,
    smallTextStyle()
  );
  tooltipText.setWordWrapWidth(layout.info.w - INFO_PANEL_PADDING * 2);

  refreshInfoPanel();
}

function refreshInfoPanel() {
  if (!units) {
    return;
  }

  infoPanelNodes.forEach((node) => node.destroy());
  infoPanelNodes = [];

  const tooltipY = layout.info.y + layout.info.h - INFO_TOOLTIP_HEIGHT;
  const columnY = layout.info.y + INFO_PANEL_PADDING;
  const columnHeight = tooltipY - columnY - INFO_PANEL_PADDING;
  const columnWidth = (layout.info.w - INFO_PANEL_PADDING * 2 - INFO_COLUMN_GAP) / 2;
  const leftX = layout.info.x + INFO_PANEL_PADDING;
  const rightX = leftX + columnWidth + INFO_COLUMN_GAP;

  renderActiveCombatPanel(currentAttacker, currentDefender, leftX, rightX, columnY, columnWidth, columnHeight);
  renderTeamStatusPanels();
}

function renderActiveCombatPanel(attacker, defender, leftX, rightX, y, columnWidth, columnHeight) {
  if (!attacker || !defender) {
    const node = sceneRef.add.text(leftX, y, 'Waiting for combatants...', smallTextStyle());
    infoPanelNodes.push(node);
    return;
  }

  renderCharacterPanel(attacker, leftX, y, columnWidth, columnHeight);
  renderCharacterPanel(defender, rightX, y, columnWidth, columnHeight);
}

function renderCharacterPanel(unit, x, y, width, height) {
  const lineHeight = 19;
  const skillDetailOffset = 120;
  let cursorY = y;

  function addPanelLine(text, alpha = 1) {
    const node = sceneRef.add.text(x, cursorY, text, {
      ...smallTextStyle(),
      alpha
    });
    node.setWordWrapWidth(width);
    infoPanelNodes.push(node);
    cursorY += lineHeight;
  }

  function addBlankLine() {
    cursorY += lineHeight;
  }

  function addResourceLine(label, resourceKey) {
    const labelNode = sceneRef.add.text(x, cursorY, `${label}:`, smallTextStyle());
    infoPanelNodes.push(labelNode);

    const current = unit[resourceKey];
    const maxKey = `max${resourceKey.charAt(0).toUpperCase()}${resourceKey.slice(1)}`;
    const max = unit[maxKey];
    const icon = RESOURCE_ICONS[resourceKey];

    for (let index = 0; index < max; index += 1) {
      const iconNode = sceneRef.add.text(x + 34 + index * 16, cursorY, icon, smallTextStyle());
      iconNode.setAlpha(index < current ? 1 : 0.10);
      infoPanelNodes.push(iconNode);
    }

    cursorY += lineHeight;
  }
  function addSplitLine(label, detail) {
    const labelNode = sceneRef.add.text(x, cursorY, label.padEnd(12), smallTextStyle());
    const detailNode = sceneRef.add.text(x + skillDetailOffset, cursorY, detail, smallTextStyle());
    detailNode.setAlpha(0.40);

    labelNode.setWordWrapWidth(width);
    detailNode.setWordWrapWidth(width - skillDetailOffset);

    infoPanelNodes.push(labelNode, detailNode);
    cursorY += lineHeight;
  }

  const slash = ACTIONS.slash;
  const thrust = ACTIONS.thrust;
  const block = REACTIONS.block;
  const parry = REACTIONS.parry;

  addPanelLine(`${unit.name} Knight`);
  addResourceLine('HP', 'hp');
  addResourceLine('SP', 'sp');
  addResourceLine('AP', 'ap');
  addResourceLine('RP', 'rp');
  addResourceLine('LP', 'lp');
  addResourceLine('IP', 'ip');

  addBlankLine();
  addPanelLine('Skills:');
  addSplitLine(
    'A1: Slash',
    `(Cost: ${slash.apCost}${RESOURCE_ICONS.ap} | Damage: ${slash.spDamage}${RESOURCE_ICONS.sp} or ${slash.hpDamage}${RESOURCE_ICONS.hp})`
  );
  addSplitLine(
    'A2: Thrust',
    `(Cost: ${thrust.apCost}${RESOURCE_ICONS.ap} | Damage: ${thrust.spDamage}${RESOURCE_ICONS.sp} or ${thrust.hpDamage}${RESOURCE_ICONS.hp})`
  );
  addSplitLine(
    'R1: Block',
    `(Cost: ${block.rpCost}${RESOURCE_ICONS.rp} | Blocks: ${block.blockAmount}${RESOURCE_ICONS.sp} or ${block.blockAmount}${RESOURCE_ICONS.hp})`
  );
  addSplitLine(
    'R2: Parry',
    `(Cost: ${parry.rpCost}${RESOURCE_ICONS.rp}${parry.lpCost}${RESOURCE_ICONS.lp} | Blocks: ${parry.blockAmount}${RESOURCE_ICONS.sp} or ${parry.blockAmount}${RESOURCE_ICONS.hp})`
  );
  addBlankLine();
  addPanelLine('Gambits:');
  buildGambitRows().forEach((row) => {
    addSplitLine(row.label, row.detail);
  });

  addBlankLine();
  addPanelLine('Equipment:');
  buildEquipmentRows().forEach((row) => {
    addSplitLine(row.label, row.detail);
  });
}

function renderTeamStatusPanels() {
  statusPanelNodes.forEach((node) => node.destroy());
  statusPanelNodes = [];

  if (!SHOW_SIDE_TEAM_STATUS_CARDS) {
    return;
  }

  renderTeamStatusPanel('red', {
    x: layout.left.x + SIDE_GRID_PADDING,
    y: layout.left.y + SIDE_GRID_TOP,
    w: layout.left.w - SIDE_GRID_PADDING * 2,
    h: TEAM_STATUS_PANEL_HEIGHT
  });

  renderTeamStatusPanel('blue', {
    x: layout.right.x + SIDE_GRID_PADDING,
    y: layout.right.y + SIDE_GRID_TOP,
    w: layout.right.w - SIDE_GRID_PADDING * 2,
    h: TEAM_STATUS_PANEL_HEIGHT
  });
}

function renderTeamStatusPanel(teamKey, rect) {
  renderFormationStatusGrid(teamKey, rect);
}

function renderFormationStatusGrid(teamKey, rect) {
  const teamUnits = units
    .filter((unit) => unit.teamKey === teamKey)
    .sort(getFormationSortOrder);
  const rowOrder = teamKey === 'red' ? FORMATION_ROW_ORDER_RED : FORMATION_ROW_ORDER_BLUE;
  const cardW = SIDE_CARD_WIDTH;
  const cardH = SIDE_CARD_HEIGHT;
  const totalW = cardW * FORMATION_ROWS.length + SIDE_GRID_COLUMN_GAP * (FORMATION_ROWS.length - 1);
  const totalH = cardH * FORMATION_COLS.length + SIDE_GRID_ROW_GAP * (FORMATION_COLS.length - 1);
  const startX = rect.x + Math.max(0, (rect.w - totalW) / 2);
  const startY = rect.y + Math.max(0, (rect.h - totalH) / 2);
  const colYs = [
    startY,
    startY + cardH + SIDE_GRID_ROW_GAP,
    startY + (cardH + SIDE_GRID_ROW_GAP) * 2
  ];

  teamUnits.forEach((unit) => {
    const rowIndex = rowOrder.indexOf(unit.row);
    const x = startX + rowIndex * (cardW + SIDE_GRID_COLUMN_GAP);
    const y = colYs[unit.col];
    renderCompactUnitCard(unit, x, y, cardW, cardH);
  });
}

function renderCompactUnitCard(unit, x, y, width, height) {
  const alpha = unit.hp > 0 ? 1 : 0.35;
  const card = sceneRef.add.rectangle(x, y, width, height, PHASER_COLORS.infoPanel)
    .setOrigin(0)
    .setAlpha(alpha)
    .setStrokeStyle(1, PHASER_COLORS.panelBorder);
  const name = sceneRef.add.text(x + 8, y + 8, `${unit.name} Knight`, smallTextStyle());
  const lines = [
    sceneRef.add.text(x + 8, y + 29, `HP: ${formatResourceCurrent(unit, 'hp')}`, smallTextStyle()),
    sceneRef.add.text(x + 8, y + 48, `SP: ${formatResourceCurrent(unit, 'sp')}`, smallTextStyle()),
    sceneRef.add.text(x + 8, y + 67, `AP: ${formatResourceCurrent(unit, 'ap')}`, smallTextStyle()),
    sceneRef.add.text(x + 8, y + 86, `RP: ${formatResourceCurrent(unit, 'rp')}`, smallTextStyle()),
    sceneRef.add.text(x + 8, y + 105, `LP: ${formatResourceCurrent(unit, 'lp')}`, smallTextStyle()),
    sceneRef.add.text(x + 8, y + 124, `IP: ${formatResourceCurrent(unit, 'ip')}`, smallTextStyle())
  ];

  [name, ...lines].forEach((node) => {
    node.setAlpha(alpha);
    node.setWordWrapWidth(width - 16);
  });
  statusPanelNodes.push(card, name, ...lines);
}

function renderCombatLogHeader() {
  combatLogHeader = sceneRef.add.text(
    layout.right.x + COMBAT_LOG_LEFT_PADDING,
    layout.right.y + COMBAT_LOG_TOP_OFFSET,
    'Combat Log',
    headerTextStyle()
  );
  createCombatLogToggle();
}

function createCombatLogToggle() {
  const x = layout.right.x + COMBAT_LOG_TOGGLE_X_OFFSET;
  const y = layout.right.y + COMBAT_LOG_TOP_OFFSET + COMBAT_LOG_TOGGLE_Y_OFFSET;

  combatLogToggleButton = sceneRef.add.rectangle(
    x,
    y,
    COMBAT_LOG_TOGGLE_WIDTH,
    COMBAT_LOG_TOGGLE_HEIGHT,
    cssHexToNumber(COMBAT_LOG_TOGGLE_FILL_COLOR)
  )
    .setOrigin(0)
    .setStrokeStyle(1, cssHexToNumber(COMBAT_LOG_TOGGLE_BORDER_COLOR))
    .setInteractive({ useHandCursor: true });

  combatLogToggleLabel = sceneRef.add.text(
    x + COMBAT_LOG_TOGGLE_PADDING,
    y + COMBAT_LOG_TOGGLE_PADDING,
    COMBAT_LOG_TOGGLE_VISIBLE_LABEL,
    combatLogToggleTextStyle()
  );

  combatLogToggleButton.on('pointerdown', toggleCombatLog);
  combatLogToggleLabel.setInteractive({ useHandCursor: true });
  combatLogToggleLabel.on('pointerdown', toggleCombatLog);
}

function drawSkyStars() {
  const skyTop = layout.battle.y + SKY_STAR_TOP_PADDING;
  const skyBottom = layout.grass.y - SKY_STAR_BOTTOM_PADDING;
  const skyHeight = Math.max(0, skyBottom - skyTop);

  for (let index = 0; index < SKY_STAR_COUNT; index += 1) {
    const xRatio = ((index * 37) % 101) / 100;
    const yRatio = ((index * 53) % 97) / 96;
    const sizeRatio = ((index * 29) % 100) / 100;
    const x = layout.battle.x + xRatio * layout.battle.w;
    const y = skyTop + yRatio * skyHeight;
    const size = SKY_STAR_MIN_SIZE + sizeRatio * (SKY_STAR_MAX_SIZE - SKY_STAR_MIN_SIZE);

    sceneRef.add.circle(x, y, size, cssHexToNumber(SKY_STAR_COLOR))
      .setAlpha(SKY_STAR_ALPHA)
      .setDepth(DEPTH_BACKGROUND);
  }
}

function toggleCombatLog() {
  setCombatLogVisible(!isCombatLogVisible);
}

function setCombatLogVisible(isVisible) {
  isCombatLogVisible = isVisible;
  combatLogHeader.setVisible(isCombatLogVisible);
  logRows.forEach((row) => row.setVisible(isCombatLogVisible));
  combatLogToggleLabel.setText(
    isCombatLogVisible ? COMBAT_LOG_TOGGLE_VISIBLE_LABEL : COMBAT_LOG_TOGGLE_HIDDEN_LABEL
  );
}

function showReactionCastEffect(effect) {
  const callout = createCombatCallout({
    unit: effect.unit,
    titleText: `${formatReactionCost(effect.reaction)} ${effect.reaction.name}`,
    resources: [
      { key: 'ap', before: effect.beforeAp, after: effect.afterAp, max: effect.maxAp },
      { key: 'rp', before: effect.beforeRp, after: effect.afterRp, max: effect.maxRp },
      { key: 'lp', before: effect.beforeLp, after: effect.afterLp, max: effect.maxLp }
    ],
    yOffset: CAST_CALLOUT_Y_OFFSET
  });

  sceneRef.time.delayedCall(REACTION_CAST_RESOURCE_DELAY_MS - REACTION_CAST_LABEL_DELAY_MS, () => {
    callout.showResources();
  });

  sceneRef.time.delayedCall(REACTION_CAST_COMMIT_DELAY_MS - REACTION_CAST_LABEL_DELAY_MS, () => {
    callout.commitResourceState('rp');
    refreshBattleUnitHud(effect.unit);

    sceneRef.time.delayedCall(DEFENDER_LP_GAIN_STAGGER_MS, () => {
      callout.commitResourceState('lp');
      refreshBattleUnitHud(effect.unit);
    });
  });

  sceneRef.time.delayedCall(REACTION_CAST_EFFECT_FADE_DELAY_MS, () => {
    sceneRef.tweens.add({
      targets: callout.nodes,
      alpha: 0,
      duration: FLOATING_EFFECT_DURATION_MS,
      onComplete: callout.destroy
    });
  });
}

function showActionCastEffect(effect) {
  const callout = createCombatCallout({
    unit: effect.unit,
    titleText: `${RESOURCE_ICONS.ap} ${effect.action.name}`,
    resources: [
      { key: 'ap', before: effect.before, after: effect.after, max: effect.max },
      { key: 'rp', before: effect.beforeRp, after: effect.afterRp, max: effect.maxRp },
      { key: 'lp', before: effect.beforeLp, after: effect.afterLp, max: effect.maxLp }
    ],
    yOffset: CAST_CALLOUT_Y_OFFSET
  });

  sceneRef.time.delayedCall(ACTION_CAST_RESOURCE_DELAY_MS - ACTION_CAST_LABEL_DELAY_MS, () => {
    callout.showResources();
  });

  sceneRef.time.delayedCall(ACTION_CAST_COMMIT_DELAY_MS - ACTION_CAST_LABEL_DELAY_MS, () => {
    callout.commitResourceState();
  });

  sceneRef.time.delayedCall(ATTACK_LUNGE_START_DELAY_MS - ACTION_CAST_LABEL_DELAY_MS, () => {
    refreshBattleUnitHud(effect.unit);
  });

  sceneRef.time.delayedCall(ACTION_CAST_EFFECT_FADE_DELAY_MS, () => {
    sceneRef.tweens.add({
      targets: callout.nodes,
      alpha: 0,
      duration: FLOATING_EFFECT_DURATION_MS,
      onComplete: callout.destroy
    });
  });
}

function showCounterResourceRowEffect(effect) {
  const callout = createCombatCallout({
    unit: effect.unit,
    titleText: '',
    resources: [
      { key: 'ap', before: effect.beforeAp, after: effect.afterAp, max: effect.maxAp },
      { key: 'rp', before: effect.beforeRp, after: effect.afterRp, max: effect.maxRp },
      { key: 'lp', before: effect.beforeLp, after: effect.afterLp, max: effect.maxLp }
    ],
    yOffset: CAST_CALLOUT_Y_OFFSET,
    showTitle: false
  });

  callout.showResources();

  sceneRef.time.delayedCall(COUNTER_RESOURCE_PREVIEW_DURATION_MS, () => {
    callout.commitResourceState('hp');
    callout.commitResourceState('sp');
    refreshBattleUnitHud(effect.unit);
  });

  sceneRef.time.delayedCall(COUNTER_RESOURCE_PREVIEW_DURATION_MS + SECONDARY_RESOURCE_COMMIT_STAGGER_MS, () => {
    callout.commitResourceState('ap');
    callout.commitResourceState('rp');
    callout.commitResourceState('lp');
    refreshBattleUnitHud(effect.unit);
  });

  sceneRef.time.delayedCall(
    COUNTER_RESOURCE_PREVIEW_DURATION_MS + COUNTER_RESOURCE_COMMIT_DURATION_MS + COUNTER_RESOURCE_FADE_DELAY_MS,
    () => {
      sceneRef.tweens.add({
        targets: callout.nodes,
        alpha: 0,
        duration: FLOATING_EFFECT_DURATION_MS,
        onComplete: callout.destroy
      });
    }
  );
}

function createCombatCallout({ unit, titleText, resources, yOffset, showTitle = true }) {
  const nodes = [];
  const resourceNodes = [];
  const showCastResources = !SHOW_BATTLE_UNIT_HUD;
  const x = unit.shadow.x;
  const y = unit.rect.y - UNIT_SIZE / 2 - yOffset;
  const top = y - CAST_CALLOUT_HEIGHT / 2;
  const resourceY = y + CAST_CALLOUT_HEIGHT / 2 + CAST_CALLOUT_RESOURCE_Y_GAP;

  const titleNodes = [];
  if (showTitle) {
    const background = sceneRef.add.rectangle(
      x,
      y,
      CAST_CALLOUT_WIDTH,
      CAST_CALLOUT_HEIGHT,
      cssHexToNumber(CAST_CALLOUT_BACKGROUND_COLOR)
    )
      .setStrokeStyle(2, cssHexToNumber(CAST_CALLOUT_BORDER_COLOR))
      .setDepth(DEPTH_COMBAT_CALLOUT);

    const title = sceneRef.add.text(x, top + CAST_CALLOUT_PADDING + 1, titleText, {
      fontFamily: 'monospace',
      fontSize: `${CAST_TITLE_FONT_SIZE}px`,
      color: COLORS.text
    })
      .setOrigin(0.5, 0)
      .setDepth(DEPTH_COMBAT_CALLOUT);

    titleNodes.push(background, title);
  }
  nodes.push(...titleNodes);

  function showResources() {
    if (!showCastResources) {
      return;
    }

    drawResourceRow(resources.filter((resource) => ['ap', 'rp', 'lp'].includes(resource.key)), resourceY);
  }

  function drawResourceRow(rowResources, yPosition) {
    if (rowResources.length <= 0) {
      return;
    }

    const iconEntries = [];
    rowResources.forEach((resource) => {
      for (let index = 0; index < resource.max; index += 1) {
        iconEntries.push({ resource, index });
      }
    });

    const totalWidth = Math.max(iconEntries.length - 1, 0) * ACTION_CAST_ICON_SPACING +
      (rowResources.length - 1) * CAST_CALLOUT_RESOURCE_GAP;
    let cursorX = x - totalWidth / 2 + CAST_CALLOUT_RESOURCE_X_OFFSET;
    let previousKey = null;

    iconEntries.forEach((entry) => {
      if (previousKey && previousKey !== entry.resource.key) {
        cursorX += CAST_CALLOUT_RESOURCE_GAP;
      }

      const iconNode = sceneRef.add.text(cursorX, yPosition, RESOURCE_ICONS[entry.resource.key], {
        fontFamily: 'Arial',
        fontSize: `${POPUP_RESOURCE_FONT_SIZE}px`,
        color: COLORS.text
      })
        .setOrigin(0.5, 0)
        .setDepth(DEPTH_COMBAT_CALLOUT);

      const targetAlpha = entry.index < entry.resource.before ? 1 : ACTION_CAST_SPENT_ALPHA;

      iconNode.setAlpha(0);
      resourceNodes.push({ node: iconNode, entry });
      nodes.push(iconNode);

      sceneRef.tweens.add({
        targets: iconNode,
        alpha: targetAlpha,
        duration: RESOURCE_ROW_FADE_IN_DURATION_MS
      });
      cursorX += ACTION_CAST_ICON_SPACING;
      previousKey = entry.resource.key;
    });
  }

  function commitResourceState(resourceKey = null) {
    resourceNodes.forEach(({ node, entry }) => {
      if (resourceKey && entry.resource.key !== resourceKey) {
        return;
      }

      node.setAlpha(entry.index < entry.resource.after ? 1 : ACTION_CAST_SPENT_ALPHA);
    });
  }

  function fadeTitleBox() {
    sceneRef.tweens.add({
      targets: nodes,
      alpha: 0,
      duration: FLOATING_EFFECT_DURATION_MS
    });
  }

  function destroy() {
    nodes.forEach((node) => node.destroy());
  }

  return {
    nodes,
    showResources,
    commitResourceState,
    fadeTitleBox,
    destroy
  };
}

function showResourceChangeEffect(effect) {
  const callout = createCombatCallout({
    unit: effect.unit,
    titleText: '',
    resources: [
      {
        key: effect.resourceKey,
        before: effect.before,
        after: effect.after,
        max: effect.max
      }
    ],
    yOffset: effect.yOffset || DAMAGE_POPUP_Y_OFFSET,
    showTitle: false
  });

  callout.showResources();

  sceneRef.time.delayedCall(RESOURCE_EFFECT_COMMIT_DELAY_MS, () => {
    callout.commitResourceState();
  });

  sceneRef.time.delayedCall(RESOURCE_EFFECT_FADE_DELAY_MS, () => {
    sceneRef.tweens.add({
      targets: callout.nodes,
      alpha: 0,
      duration: FLOATING_EFFECT_DURATION_MS,
      onComplete: callout.destroy
    });
  });
}

function showDamageNumberEffect(effect) {
  const lostAmount = effect.before - effect.after;
  if (lostAmount <= 0 && !effect.showZeroDamage) {
    return;
  }

  const node = sceneRef.add.text(
    effect.unit.shadow.x + DAMAGE_NUMBER_X_OFFSET,
    effect.unit.rect.y - DAMAGE_NUMBER_Y_OFFSET,
    `-${Math.max(0, lostAmount)}${RESOURCE_ICONS[effect.resourceKey]}`,
    {
      fontFamily: 'Arial',
      fontSize: `${DAMAGE_NUMBER_FONT_SIZE}px`,
      color: COLORS.text,
      stroke: COLORS.background,
      strokeThickness: 4
    }
  ).setOrigin(0.5, 0.5)
    .setDepth(DEPTH_DAMAGE_TEXT);

  sceneRef.time.delayedCall(DAMAGE_NUMBER_HOLD_MS, () => {
    sceneRef.tweens.add({
      targets: node,
      y: node.y - DAMAGE_NUMBER_FLOAT_Y,
      alpha: 0,
      duration: DAMAGE_NUMBER_DURATION_MS,
      ease: 'Quad.easeOut',
      onComplete: () => node.destroy()
    });
  });
}

function playAnimationEffect(animationEffect) {
  if (animationEffect.type === 'block') {
    playBlockAnimation(animationEffect.unit);
  } else if (animationEffect.type === 'attack') {
    playKnightAttack(animationEffect.unit);
  } else if (animationEffect.type === 'parry') {
    playParryAnimation(animationEffect.unit);
  } else if (animationEffect.type === 'damage') {
    playDamageBlink(animationEffect.unit);
  } else if (animationEffect.type === 'ko') {
    markUnitKo(animationEffect.unit);
  } else if (animationEffect.type === 'lungeOut') {
    playAttackLungeOut(animationEffect.unit, animationEffect.target);
  } else if (animationEffect.type === 'lungeReturn') {
    playAttackReturn(animationEffect.unit);
  }
}

function playKnightAttack(unit) {
  playKnightOneShotAnimation(
    unit,
    KNIGHT_ATTACK_TEXTURE_KEY,
    KNIGHT_ATTACK_ANIMATION_KEY,
    KNIGHT_ATTACK_FINAL_POSE_HOLD_MS
  );
}

function playKnightOneShotAnimation(unit, textureKey, animationKey, finalPoseHoldMs) {
  if (!hasBattlefieldVisuals(unit) || unit.hp <= 0) {
    return;
  }

  stopKnightRandomIdleTwitch(unit);

  unit.isPlayingKnightAnimation = true;
  unit.knightAnimationKey = animationKey;
  unit.knightAnimationRunId = (unit.knightAnimationRunId || 0) + 1;
  const runId = unit.knightAnimationRunId;
  unit.rect.stop();
  unit.rect.setTexture(textureKey, getKnightAnimationStartFrame(animationKey));
  unit.rect.setFlipX(unit.teamKey === 'blue');
  unit.rect.play(animationKey);

  const finish = () => holdKnightFinalPose(unit, animationKey, runId, finalPoseHoldMs);
  unit.rect.once('animationcomplete', finish);
  sceneRef.time.delayedCall(getKnightAnimationDurationMs(animationKey) + finalPoseHoldMs + ms(50), () => {
    finishKnightOneShotAnimation(unit, animationKey, runId);
  });
}

function holdKnightFinalPose(unit, animationKey, runId, finalPoseHoldMs) {
  if (!unit.isPlayingKnightAnimation ||
      unit.knightAnimationKey !== animationKey ||
      unit.knightAnimationRunId !== runId) {
    return;
  }

  sceneRef.time.delayedCall(finalPoseHoldMs, () => {
    finishKnightOneShotAnimation(unit, animationKey, runId);
  });
}

function finishKnightOneShotAnimation(unit, animationKey, runId) {
  if (!unit.isPlayingKnightAnimation ||
      unit.knightAnimationKey !== animationKey ||
      unit.knightAnimationRunId !== runId) {
    return;
  }

  unit.isPlayingKnightAnimation = false;
  unit.knightAnimationKey = null;

  if (!hasBattlefieldVisuals(unit) || unit.hp <= 0) {
    return;
  }

  setKnightIdle(unit);
  startKnightRandomIdleTwitch(unit);
}

function getKnightAnimationStartFrame(animationKey) {
  if (animationKey === KNIGHT_ATTACK_ANIMATION_KEY) {
    return KNIGHT_ATTACK_START_FRAME;
  }

  if (animationKey === KNIGHT_BLOCK_ANIMATION_KEY) {
    return KNIGHT_BLOCK_START_FRAME;
  }

  return KNIGHT_PARRY_START_FRAME;
}

function getKnightAnimationDurationMs(animationKey) {
  if (animationKey === KNIGHT_ATTACK_ANIMATION_KEY) {
    return getFrameAnimationDurationMs(KNIGHT_ATTACK_START_FRAME, KNIGHT_ATTACK_END_FRAME, KNIGHT_ATTACK_FRAME_RATE);
  }

  if (animationKey === KNIGHT_BLOCK_ANIMATION_KEY) {
    return getFrameAnimationDurationMs(KNIGHT_BLOCK_START_FRAME, KNIGHT_BLOCK_END_FRAME, KNIGHT_BLOCK_FRAME_RATE);
  }

  return getFrameAnimationDurationMs(KNIGHT_PARRY_START_FRAME, KNIGHT_PARRY_END_FRAME, KNIGHT_PARRY_FRAME_RATE);
}

function getFrameAnimationDurationMs(startFrame, endFrame, frameRate) {
  return ms((endFrame - startFrame + 1) / frameRate * 1000);
}

function isLiveBattlefieldNode(node) {
  return node && node.scene;
}

function hasBattlefieldVisuals(unit) {
  return unit &&
    !unit.isBattlefieldRemoved &&
    isLiveBattlefieldNode(unit.rect) &&
    isLiveBattlefieldNode(unit.label);
}

function playAttackLungeOut(attacker, defender) {
  if (!hasBattlefieldVisuals(attacker) || !hasBattlefieldVisuals(defender)) {
    return;
  }

  const dx = defender.rect.x - attacker.rect.x;
  const dy = defender.rect.y - attacker.rect.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const stateNodes = getBattleStateNodes(attacker);

  attacker.homeRectX = attacker.rect.x;
  attacker.homeRectY = attacker.rect.y;
  attacker.homeLabelX = attacker.label.x;
  attacker.homeLabelY = attacker.label.y;
  attacker.homeShadowX = attacker.shadow.x;
  attacker.homeShadowY = attacker.shadow.y;
  attacker.homeStateNodePositions = stateNodes.map((node) => ({ node, x: node.x, y: node.y }));

  if (len < 1) {
    return;
  }

  const nx = dx / len;
  const ny = dy / len;
  const lungeDistance = Math.max(0, len - ATTACK_LUNGE_STOP_DISTANCE);

  sceneRef.tweens.add({
    targets: [attacker.rect, attacker.label, attacker.shadow, ...stateNodes],
    x: `+=${nx * lungeDistance}`,
    y: `+=${ny * lungeDistance}`,
    duration: ATTACK_LUNGE_DURATION_MS,
    ease: 'Quad.easeOut'
  });
}

function playAttackReturn(attacker) {
  if (!hasBattlefieldVisuals(attacker)) {
    return;
  }

  const stateNodes = getBattleStateNodes(attacker);
  sceneRef.tweens.add({
    targets: attacker.rect,
    x: attacker.homeRectX,
    y: attacker.homeRectY,
    duration: ATTACK_LUNGE_DURATION_MS,
    ease: 'Quad.easeInOut'
  });

  sceneRef.tweens.add({
    targets: attacker.shadow,
    x: attacker.homeShadowX,
    y: attacker.homeShadowY,
    duration: ATTACK_LUNGE_DURATION_MS,
    ease: 'Quad.easeInOut'
  });

  sceneRef.tweens.add({
    targets: attacker.label,
    x: attacker.homeLabelX,
    y: attacker.homeLabelY,
    duration: ATTACK_LUNGE_DURATION_MS,
    ease: 'Quad.easeInOut',
    onComplete: () => {
      attacker.rect.x = attacker.homeRectX;
      attacker.rect.y = attacker.homeRectY;
      attacker.label.x = attacker.homeLabelX;
      attacker.label.y = attacker.homeLabelY;
      attacker.shadow.x = attacker.homeShadowX;
      attacker.shadow.y = attacker.homeShadowY;
      (attacker.homeStateNodePositions || []).forEach((entry) => {
        if (!isLiveBattlefieldNode(entry.node)) {
          return;
        }

        entry.node.x = entry.x;
        entry.node.y = entry.y;
      });
    }
  });

  stateNodes.forEach((node) => {
    const home = (attacker.homeStateNodePositions || []).find((entry) => entry.node === node);
    if (!home) {
      return;
    }

    sceneRef.tweens.add({
      targets: node,
      x: home.x,
      y: home.y,
      duration: ATTACK_LUNGE_DURATION_MS,
      ease: 'Quad.easeInOut'
    });
  });
}

function getBattleStateNodes(unit) {
  if (!unit || !unit.battleHudNodes) {
    return [];
  }

  return Object.values(unit.battleHudNodes).flat().filter(isLiveBattlefieldNode);
}

function playBlockAnimation(unit) {
  playKnightOneShotAnimation(
    unit,
    KNIGHT_BLOCK_PARRY_TEXTURE_KEY,
    KNIGHT_BLOCK_ANIMATION_KEY,
    KNIGHT_BLOCK_FINAL_POSE_HOLD_MS
  );
}

function playParryAnimation(unit) {
  playKnightOneShotAnimation(
    unit,
    KNIGHT_BLOCK_PARRY_TEXTURE_KEY,
    KNIGHT_PARRY_ANIMATION_KEY,
    KNIGHT_PARRY_FINAL_POSE_HOLD_MS
  );
}

function playDamageBlink(unit) {
  if (!hasBattlefieldVisuals(unit)) {
    return;
  }

  unit.rect.setAlpha(1);
  sceneRef.tweens.add({
    targets: unit.rect,
    alpha: DAMAGE_BLINK_ALPHA,
    duration: DAMAGE_BLINK_DURATION_MS,
    yoyo: true,
    repeat: DAMAGE_BLINK_REPEAT,
    onComplete: () => {
      unit.rect.setAlpha(unit.hp <= 0 ? 0.35 : 1);
    }
  });
}

function markUnitKo(unit) {
  if (!hasBattlefieldVisuals(unit) || unit.koRemovalScheduled) {
    return;
  }

  unit.koRemovalScheduled = true;
  stopKnightRandomIdleTwitch(unit);
  unit.isPlayingKnightAnimation = false;
  unit.knightAnimationKey = null;
  unit.rect.setAlpha(KO_FADE_ALPHA);
  unit.label.setAlpha(KO_FADE_ALPHA);
  unit.shadow.setAlpha(KO_FADE_ALPHA);
  unit.label.setText(`${unit.name} KO`);
  getBattleStateNodes(unit).forEach((node) => node.setAlpha(KO_FADE_ALPHA));

  sceneRef.time.delayedCall(KO_REMOVE_DELAY_MS, () => {
    [unit.rect, unit.label, unit.shadow, ...getBattleStateNodes(unit)].forEach((node) => {
      if (isLiveBattlefieldNode(node)) {
        node.destroy();
      }
    });

    destroyBattleUnitHud(unit);
    unit.isBattlefieldRemoved = true;
  });
}

function startBattle() {
  appendLog('Round 1 starts.');
  startRound();

  sceneRef.time.delayedCall(ms(250), () => {
    takeNextAction();

    actionTimer = sceneRef.time.addEvent({
      delay: ACTION_DELAY_MS,
      callback: takeNextAction,
      callbackScope: sceneRef,
      loop: true
    });
  });
}

function setBattleSpeed(multiplier) {
  const valid = [1, 2, 3, 4];
  battleSpeedMultiplier = valid.includes(multiplier) ? multiplier : battleSpeedMultiplier;
  sceneRef.time.timeScale = battleSpeedMultiplier;
  if (sceneRef.tweens && typeof sceneRef.tweens.timeScale !== 'undefined') {
    sceneRef.tweens.timeScale = battleSpeedMultiplier;
  }
  if (speedLabel) {
    speedLabel.setText(`Speed: ${battleSpeedMultiplier}x`);
  }
}

function startRound() {
  round += 1;
  turn = 0;
  action = 1;
  turnQueue = [];

  livingUnits().forEach((unit) => {
    unit.ap = unit.maxAp;
    unit.rp = unit.maxRp;
    refreshBattleUnitHud(unit);
  });

  refreshInfoPanel();

  if (round > 1) {
    appendLog(`Round ${round} starts.`);
  }
}

function chooseAction(attacker, defender) {
  if (defender.sp <= 0) {
    return ACTIONS.thrust;
  }

  return ACTIONS.slash;
}

function chooseReaction(defender, attacker, selectedAction) {
  const block = REACTIONS.block;
  const parry = REACTIONS.parry;

  if (selectedAction.attackType !== 'melee') {
    return null;
  }

  if (defender.rp >= parry.rpCost && defender.lp >= parry.lpCost) {
    return parry;
  }

  if (defender.rp >= block.rpCost) {
    return block;
  }

  return null;
}

function buildTurnQueue(living) {
  const eligible = living.filter((unit) => unit.ap > 0);
  eligible.sort((a, b) => b.ip - a.ip);

  const queue = [];
  let i = 0;
  while (i < eligible.length) {
    let j = i + 1;
    while (j < eligible.length && eligible[j].ip === eligible[i].ip) {
      j += 1;
    }
    const tier = eligible.slice(i, j);
    for (let k = tier.length - 1; k > 0; k -= 1) {
      const m = Math.floor(Math.random() * (k + 1));
      [tier[k], tier[m]] = [tier[m], tier[k]];
    }
    queue.push(...tier);
    i = j;
  }

  turnQueue = queue;
  turn += 1;
  action = 1;
}

function takeNextAction() {
  if (battleEnded) {
    return;
  }

  const living = livingUnits();
  if (isBattleOver()) {
    return;
  }

  if (turnQueue.length === 0) {
    if (living.every((unit) => unit.ap <= 0)) {
      startRound();
      return;
    }
    buildTurnQueue(living);
  }

  const attacker = turnQueue.shift();

  if (attacker.hp <= 0 || attacker.ap <= 0) {
    return takeNextAction();
  }

  const defender = chooseTarget(attacker);
  if (!defender) {
    return;
  }
  setActiveCombatants(attacker, defender);
  const tag = `[R${round}T${turn}A${action}]`;
  const selectedAction = chooseAction(attacker, defender);
  const attackerApBeforeResolve = attacker.ap;
  if (attackerApBeforeResolve <= 0) {
    console.debug(`DEBUG ${tag} ${attacker.name} blocked AP before=${attackerApBeforeResolve} action=${selectedAction.name}`);
    return takeNextAction();
  }
  const effect = resolveAction(attacker, defender, selectedAction);
  console.debug(
    `DEBUG ${tag} ${attacker.name} AP before=${attackerApBeforeResolve} after=${attacker.ap} action=${selectedAction.name}`
  );

  const actionCostText = RESOURCE_ICONS.ap.repeat(selectedAction.apCost);
  appendLog(`${tag} ${attacker.name} uses ${actionCostText}${selectedAction.name}.`, effect.logText);

  effect.visualEffects.forEach((visualEffect) => {
    sceneRef.time.delayedCall(visualEffect.delayMs || 0, () => {
      if (visualEffect.type === 'actionCast') {
        showActionCastEffect(visualEffect);
        return;
      }

      if (visualEffect.type === 'reactionCast') {
        showReactionCastEffect(visualEffect);
        return;
      }

      if (visualEffect.type === 'resourceChange') {
        if (['hp', 'sp'].includes(visualEffect.resourceKey)) {
          animateBattleStateResourceLoss(
            visualEffect.unit,
            visualEffect.resourceKey,
            visualEffect.before,
            visualEffect.after
          );

          showDamageNumberEffect(visualEffect);
          return;
        }

        showResourceChangeEffect(visualEffect);
        refreshBattleUnitHud(visualEffect.unit);
        return;
      }

      if (visualEffect.type === 'counterResourceRow') {
        showCounterResourceRowEffect(visualEffect);
      }
    });
  });
  effect.animationEffects.forEach((animationEffect) => {
    sceneRef.time.delayedCall(animationEffect.delayMs || 0, () => {
      playAnimationEffect(animationEffect);
    });
  });

  action += 1;
  refreshInfoPanel();

  if (isBattleOver()) {
    const koHpEffect = effect.visualEffects.find((visualEffect) => (
      visualEffect.type === 'resourceChange' &&
      visualEffect.resourceKey === 'hp' &&
      visualEffect.after <= 0
    ));

    const koDelayMs = koHpEffect
      ? koHpEffect.delayMs + RESOURCE_EFFECT_COMMIT_DELAY_MS + ms(200)
      : ms(500);

    battleEnded = true;

    sceneRef.time.delayedCall(koDelayMs, () => {
      endBattle(isTeamDefeated('red') ? 'red' : 'blue');
    });
  }
}

function resolveAction(attacker, defender, selectedAction) {
  const attackerApBefore = attacker.ap;
  attacker.ap = Math.max(0, attacker.ap - selectedAction.apCost);
  const attackerApAfter = attacker.ap;

  const effects = [];
  const visualEffects = [
    {
      type: 'actionCast',
      unit: attacker,
      action: selectedAction,
      costResourceKey: 'ap',
      costAmount: selectedAction.apCost,
      max: attacker.maxAp,
      before: attackerApBefore,
      after: attackerApAfter,
      maxRp: attacker.maxRp,
      beforeRp: attacker.rp,
      afterRp: attacker.rp,
      maxLp: attacker.maxLp,
      beforeLp: attacker.lp,
      afterLp: attacker.lp,
      delayMs: ACTION_CAST_LABEL_DELAY_MS
    }
  ];
  const reaction = chooseReaction(defender, attacker, selectedAction);
  const resultDelayMs = reaction ? DEFENSE_RESULT_DELAY_MS : NO_REACTION_RESULT_DELAY_MS;
  const returnDelayMs = reaction ? ATTACK_RETURN_DELAY_MS : NO_REACTION_RETURN_DELAY_MS;

  const animationEffects = [
    {
      type: 'lungeOut',
      unit: attacker,
      target: defender,
      delayMs: ATTACK_LUNGE_START_DELAY_MS
    },
    {
      type: 'lungeReturn',
      unit: attacker,
      delayMs: returnDelayMs
    }
  ];
  if (KNIGHT_ATTACK_ACTION_KEYS.includes(selectedAction.key)) {
    animationEffects.unshift({
      type: 'attack',
      unit: attacker,
      delayMs: ATTACK_ANIMATION_START_DELAY_MS
    });
  }

  const damageKey = defender.sp > 0 ? 'sp' : 'hp';
  const damageAmount = damageKey === 'sp' ? selectedAction.spDamage : selectedAction.hpDamage;
  let remainingDamage = damageAmount;

  if (reaction) {
    const defenderRpBefore = defender.rp;
    const defenderLpBefore = defender.lp;

    defender.rp = Math.max(0, defender.rp - reaction.rpCost);
    defender.lp = Math.max(0, defender.lp - reaction.lpCost);

    const defenderRpAfter = defender.rp;
    const defenderLpAfter = defender.lp;

    const blockedAmount = Math.min(reaction.blockAmount, remainingDamage);
    remainingDamage = Math.max(0, remainingDamage - blockedAmount);

    effects.push(`${defender.name} uses ${formatReactionCost(reaction)}${reaction.name}!`);
    animationEffects.push({
      type: reaction.key,
      unit: defender,
      delayMs: reaction.key === 'parry'
        ? Math.max(0, ATTACK_ANIMATION_START_DELAY_MS - KNIGHT_PARRY_SYNC_LEAD_MS)
        : Math.max(0, REACTION_CAST_LABEL_DELAY_MS - KNIGHT_BLOCK_SYNC_LEAD_MS)
    });

    const reactionCastEffect = {
      type: 'reactionCast',
      unit: defender,
      reaction,
      beforeAp: defender.ap,
      afterAp: defender.ap,
      maxAp: defender.maxAp,
      beforeRp: defenderRpBefore,
      afterRp: defenderRpAfter,
      maxRp: defender.maxRp,
      beforeLp: defenderLpBefore,
      afterLp: defenderLpAfter,
      maxLp: defender.maxLp,
      delayMs: REACTION_CAST_LABEL_DELAY_MS
    };

    visualEffects.push(reactionCastEffect);

    if (remainingDamage <= 0) {
      const maxKey = damageKey === 'sp' ? 'maxSp' : 'maxHp';
      visualEffects.push({
        type: 'resourceChange',
        unit: defender,
        resourceKey: damageKey,
        before: defender[damageKey],
        after: defender[damageKey],
        max: defender[maxKey],
        yOffset: DAMAGE_POPUP_Y_OFFSET,
        delayMs: COUNTER_RESULT_DELAY_MS,
        showZeroDamage: true
      });

      const counterRowEffect = {
        type: 'counterResourceRow',
        unit: attacker,
        beforeAp: attacker.ap,
        afterAp: attacker.ap,
        maxAp: attacker.maxAp,
        beforeRp: attacker.rp,
        afterRp: attacker.rp,
        maxRp: attacker.maxRp,
        beforeLp: attacker.lp,
        afterLp: attacker.lp,
        maxLp: attacker.maxLp,
        beforeHp: attacker.hp,
        afterHp: attacker.hp,
        maxHp: attacker.maxHp,
        beforeSp: attacker.sp,
        afterSp: attacker.sp,
        maxSp: attacker.maxSp,
        hasChange: false,
        delayMs: COUNTER_RESULT_DELAY_MS
      };

      if (reaction.lpGainOnFullBlock > 0) {
        const oldLp = defender.lp;
        defender.lp = Math.min(defender.maxLp, defender.lp + reaction.lpGainOnFullBlock);
        const lpGained = defender.lp - oldLp;

        if (lpGained > 0) {
          effects.push(`${defender.name} gains${RESOURCE_ICONS.lp.repeat(lpGained)}.`);
          reactionCastEffect.afterLp = defender.lp;
        }
      }

      if (reaction.counterSpDamage > 0) {
        const counterDamage = Math.min(reaction.counterSpDamage, attacker.sp);
        const attackerSpBefore = attacker.sp;
        attacker.sp = Math.max(0, attacker.sp - counterDamage);

        if (counterDamage > 0) {
          effects.push(`${attacker.name} -${counterDamage}${RESOURCE_ICONS.sp}.`);
          counterRowEffect.beforeSp = attackerSpBefore;
          counterRowEffect.afterSp = attacker.sp;
          counterRowEffect.hasChange = true;
          visualEffects.push({
            type: 'resourceChange',
            unit: attacker,
            resourceKey: 'sp',
            before: attackerSpBefore,
            after: attacker.sp,
            max: attacker.maxSp,
            yOffset: DAMAGE_POPUP_Y_OFFSET,
            delayMs: COUNTER_RESULT_DELAY_MS
          });
          animationEffects.push({
            type: 'damage',
            unit: attacker,
            delayMs: COUNTER_RESULT_DELAY_MS
          });
        }
      }

      if (reaction.rpDamage > 0) {
        const rpDamage = Math.min(reaction.rpDamage, attacker.rp);
        const attackerRpBefore = attacker.rp;
        attacker.rp = Math.max(0, attacker.rp - rpDamage);

        if (rpDamage > 0) {
          effects.push(`${attacker.name} -${rpDamage}${RESOURCE_ICONS.rp}.`);
          counterRowEffect.beforeRp = attackerRpBefore;
          counterRowEffect.afterRp = attacker.rp;
          counterRowEffect.hasChange = true;
        }
      }

      if (counterRowEffect.hasChange) {
        visualEffects.push(counterRowEffect);
      }

      return {
        logText: effects.join(' '),
        visualEffects,
        animationEffects
      };
    }
  }

  if (damageKey === 'sp') {
    const spDamage = Math.min(remainingDamage, defender.sp);
    const defenderSpBefore = defender.sp;
    defender.sp = Math.max(0, defender.sp - spDamage);

    effects.push(`${defender.name} -${spDamage}${RESOURCE_ICONS.sp}.`);
    visualEffects.push({
      type: 'resourceChange',
      unit: defender,
      resourceKey: 'sp',
      before: defenderSpBefore,
      after: defender.sp,
      max: defender.maxSp,
      yOffset: DAMAGE_POPUP_Y_OFFSET,
      delayMs: resultDelayMs
    });
    if (spDamage > 0) {
      animationEffects.push({
        type: 'damage',
        unit: defender,
        delayMs: resultDelayMs
      });
    }
  } else {
    const hpDamage = Math.min(remainingDamage, defender.hp);
    const defenderHpBefore = defender.hp;
    defender.hp = Math.max(0, defender.hp - hpDamage);

    effects.push(`${defender.name} -${hpDamage}${RESOURCE_ICONS.hp}.`);
    visualEffects.push({
      type: 'resourceChange',
      unit: defender,
      resourceKey: 'hp',
      before: defenderHpBefore,
      after: defender.hp,
      max: defender.maxHp,
      yOffset: DAMAGE_POPUP_Y_OFFSET,
      delayMs: resultDelayMs
    });
    if (hpDamage > 0) {
      animationEffects.push({
        type: 'damage',
        unit: defender,
        delayMs: resultDelayMs
      });
    }

    if (defender.hp <= 0) {
      effects.push(`${defender.name} dies.`);
      animationEffects.push({
        type: 'ko',
        unit: defender,
        delayMs: resultDelayMs + RESOURCE_EFFECT_COMMIT_DELAY_MS + ms(200)
      });
    }
  }

  return {
    logText: effects.join(' '),
    visualEffects,
    animationEffects
  };
}

function formatResourceLoss(unitName, amount, resourceKey) {
  return `${unitName} -${RESOURCE_ICONS[resourceKey].repeat(amount)}`;
}

function formatReactionCost(reaction) {
  return (
    RESOURCE_ICONS.rp.repeat(reaction.rpCost || 0) +
    RESOURCE_ICONS.lp.repeat(reaction.lpCost || 0)
  );
}

function formatResourceGain(unitName, amount, resourceKey) {
  return `${unitName} +${RESOURCE_ICONS[resourceKey].repeat(amount)}`;
}

function appendLog(actionText, effectText) {
  const line = effectText ? `${actionText} ${effectText}` : actionText;
  const logStartY = layout.right.y + COMBAT_LOG_TOP_OFFSET + 52;

  const y = logStartY + logRows.length * LOG_LINE_HEIGHT;
  const row = sceneRef.add.text(layout.right.x + COMBAT_LOG_LEFT_PADDING, y, line, smallTextStyle());
  row.setWordWrapWidth(layout.right.w - COMBAT_LOG_LEFT_PADDING * 2);
  row.setVisible(isCombatLogVisible);
  logRows.push(row);

  while (logRows.length > LOG_MAX_LINES) {
    logRows.shift().destroy();
    logRows.forEach((row, index) => {
      row.setY(logStartY + index * LOG_LINE_HEIGHT);
    });
  }
}

function isBattleOver() {
  return isTeamDefeated('red') || isTeamDefeated('blue');
}

function endBattle(losingTeamKey) {
  battleEnded = true;
  if (actionTimer) {
    actionTimer.remove(false);
  }
  units.filter((unit) => unit.teamKey === losingTeamKey && unit.hp <= 0).forEach((unit) => {
    markUnitKo(unit);
  });
  refreshInfoPanel();
  const winner = losingTeamKey === 'red' ? 'Blue' : 'Red';
  appendLog(`Battle ends. ${winner} wins.`);
}

function livingUnits() {
  return units.filter((unit) => unit.hp > 0);
}

function headerTextStyle() {
  return {
    fontFamily: 'monospace',
    fontSize: `${FONT_SIZE_HEADER}px`,
    color: COLORS.text
  };
}

function bodyTextStyle() {
  return {
    fontFamily: 'monospace',
    fontSize: `${FONT_SIZE_BODY}px`,
    color: COLORS.mutedText
  };
}

function smallTextStyle() {
  return {
    fontFamily: 'monospace',
    fontSize: `${FONT_SIZE_SMALL}px`,
    color: COLORS.text,
    lineSpacing: 4
  };
}

function combatLogToggleTextStyle() {
  return {
    fontFamily: 'monospace',
    fontSize: `${COMBAT_LOG_TOGGLE_FONT_SIZE}px`,
    color: COMBAT_LOG_TOGGLE_TEXT_COLOR
  };
}

