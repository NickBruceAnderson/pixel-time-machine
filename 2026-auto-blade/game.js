import { ACTIONS, REACTIONS, LIMITS, TRAITS } from './data/skills.js';
import { BASE_UNIT_STATS, PROMOTION_STAT_BONUSES, CHARACTER_CLASSES } from './data/characters.js';
import { EQUIPMENT } from './data/equipment.js';

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
  ap: '#d83535',
  rp: '#1a53a8',
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
  ip: '🚩',
  mv: '🥾',
  rn: '⏹️'
};

const RESOURCE_COLORS = {
  hp: COLORS.hp,
  sp: COLORS.sp,
  ap: COLORS.ap,
  rp: COLORS.rp,
  lp: COLORS.lp,
  ip: COLORS.emptyLp
};

const ms = (value) => Math.round(value);

let battleSpeedMultiplier = 2;
const BATTLE_SPEED_OPTIONS = [1, 2, 4, 8, 16, 32, 64];

// Layout
const LEFT_PANEL_WIDTH_RATIO = 0.29;
const CENTER_WIDTH_RATIO = 0.42;
const RIGHT_PANEL_WIDTH_RATIO = 0.29;
const BATTLE_WINDOW_HEIGHT_RATIO = 0.48;

const UNIT_SIZE = 140;

const KNIGHT_RANDOM_IDLE_TWITCH_ENABLED = false;
const KNIGHT_RANDOM_IDLE_TWITCH_TEST_KEY = 'I';
const KNIGHT_RANDOM_IDLE_TWITCH_DELAY_MS = ms(15000);
const KNIGHT_RANDOM_IDLE_TWITCH_HOLD_MS = ms(1000);
const KNIGHT_ATTACK_ACTION_KEYS = ['slash', 'thrust', 'shiv'];

const _knightAnim = CHARACTER_CLASSES.knight.visual.animations;
const KNIGHT_ATTACK_ANIMATION_DURATION_MS = ms(
  (_knightAnim.attack.endFrame - _knightAnim.attack.startFrame + 1) /
    _knightAnim.attack.frameRate * 1000
);
const KNIGHT_ATTACK_FINAL_POSE_HOLD_MS = ms(_knightAnim.attack.finalPoseHoldMs);
const KNIGHT_BLOCK_SYNC_LEAD_FRAMES = 1;
const KNIGHT_BLOCK_SYNC_LEAD_MS = ms(
  KNIGHT_BLOCK_SYNC_LEAD_FRAMES / _knightAnim.block.frameRate * 1000
);
const KNIGHT_PARRY_FLOURISH_FRAME_COUNT = _knightAnim.parry.flourishFrameCount;
const KNIGHT_PARRY_SYNC_LEAD_MS = ms(
  (_knightAnim.parry.endFrame - _knightAnim.parry.startFrame + 1 - KNIGHT_PARRY_FLOURISH_FRAME_COUNT) /
    _knightAnim.parry.frameRate * 1000
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
const FORMATION_GRID_LINE_SIZE = 2;
const BATTLEFIELD_CENTER_X = GAME_WIDTH / 2;
const RED_FORMATION_CENTER_X = GAME_WIDTH / 3;
const BLUE_FORMATION_CENTER_X = GAME_WIDTH * 2 / 3;
const FORMATION_CENTER_Y = GAME_HEIGHT * 0.75 - 2;
const FORMATION_COLUMN_SPACING = 166.67;
const FORMATION_ROW_SPACING = 170;
const SHOW_BATTLE_GRID_LINES = false;
const BATTLE_GRID_TOGGLE_KEY = 'G';
const BATTLE_GRID_LINE_ALPHA_VISIBLE = 0.45;
const BATTLE_GRID_LINE_ALPHA_HIDDEN = 0;
const UNIT_VISUAL_Y_OFFSET = 0;
const UNIT_SPRITE_FORWARD_X_OFFSET = 24;
const TEAM_UNIT_TINT_ENABLED = true;
const RED_TEAM_UNIT_TINT = '#d84343';
const BLUE_TEAM_UNIT_TINT = '#3f6fd9';
const UNIT_SHADOW_COLOR = '#071309';
const UNIT_SHADOW_ALPHA = 0.38;
const UNIT_SHADOW_WIDTH = 80;
const UNIT_SHADOW_HEIGHT = 8;
const UNIT_SHADOW_Y_OFFSET = 64;

const BATTLE_GRID_WIDTH = FORMATION_ROW_SPACING * FORMATION_ROWS.length;
const BATTLE_GRID_HEIGHT = FORMATION_COLUMN_SPACING * FORMATION_COLS.length;

// Panels
const INFO_PANEL_PADDING = 6;
const INFO_COLUMN_GAP = 28;
const SIDE_GRID_PADDING = 40;

const UTILITY_BUTTON_X = 24;
const UTILITY_BUTTON_Y = GAME_HEIGHT - 104;
const UTILITY_BUTTON_WIDTH = 112;
const UTILITY_BUTTON_HEIGHT = 30;
const UTILITY_BUTTON_GAP = 8;
const UTILITY_BUTTON_PADDING = 12;
const UTILITY_BUTTON_DEPTH = 220;
const SPEED_MENU_WIDTH = 72;
const SPEED_MENU_OPTION_HEIGHT = 28;
const SPEED_MENU_GAP = 0;
const SPEED_MENU_DEPTH = UTILITY_BUTTON_DEPTH + 10;

// Hamburger utility menu
const UTILITY_MENU_BUTTON_X = 8;
const UTILITY_MENU_BUTTON_Y = 8;
const UTILITY_MENU_BUTTON_SIZE = 28;
const UTILITY_MENU_DROPDOWN_X = UTILITY_MENU_BUTTON_X;
const UTILITY_MENU_DROPDOWN_Y = UTILITY_MENU_BUTTON_Y + UTILITY_MENU_BUTTON_SIZE + 6;
const UTILITY_MENU_DROPDOWN_WIDTH = 128;
const UTILITY_MENU_ITEM_HEIGHT = 32;
const UTILITY_MENU_GAP = 4;
const UTILITY_MENU_LABEL = '☰';
const POPUP_PANEL_MARGIN = 24;
const POPUP_PANEL_TOP = 64;
const POPUP_SIDE_PANEL_WIDTH = 420;
const POPUP_SIDE_PANEL_HEIGHT = 560;
const POPUP_LOG_PANEL_WIDTH = 560;
const POPUP_LOG_PANEL_HEIGHT = 480;
const POPUP_STATS_PANEL_WIDTH = 350;
const POPUP_STATS_PANEL_HEIGHT = 820;
const POPUP_PANEL_PADDING = 24;
const POPUP_STATS_PANEL_PADDING = 4;
const POPUP_STATS_PANEL_BOTTOM_OFFSET = POPUP_PANEL_MARGIN;
const POPUP_PANEL_BACKGROUND_ALPHA = 0.92;
const POPUP_DEPTH = 200;
const POPUP_DETAIL_TEXT_ALPHA = 0.80;

const SHOW_SIDE_TEAM_STATUS_CARDS = false;
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
const UI_FONT_FAMILY = 'Arial, Helvetica, sans-serif';
const FONT_SIZE_HEADER = 24;
const FONT_SIZE_BODY = 12;
const FONT_SIZE_SMALL = 12;

// Resource rows (setup cards and stats popup)
const RESOURCE_ROW_LABEL_FONT_SIZE = 14;
const RESOURCE_ROW_ICON_FONT_SIZE = 13;
const RESOURCE_ROW_LABEL_TEXT_PADDING_Y = 2;
const RESOURCE_ROW_ICON_TEXT_PADDING_Y = 4;
const STATS_POPUP_RESOURCE_ROW_LABEL_FONT_SIZE = 12;
const RESOURCE_ROW_LABEL_WIDTH = 34;
const RESOURCE_ROW_ICON_SPACING = 14;
const RESOURCE_ROW_PAIR_GAP = 82;
const RESOURCE_ROW_GAP = 22;
const RESOURCE_ROW_EMPTY_ALPHA = 0.10;

// Stats popup CP row
const STATS_CP_FLAG_FONT_SIZE = 18;
const STATS_CP_FLAG_SPACING = 18;
const STATS_CP_ICON_X_OFFSET = 34;
const STATS_CP_FLAG_TEXT_PADDING_Y = 4;

// Setup card cost row
const SETUP_UNIT_CARD_COST_ICON_FONT_SIZE = 18;
const SETUP_UNIT_CARD_COST_ICON_X_OFFSET = 82;

// HUD: CAST
const CAST_TITLE_FONT_SIZE = 20;
const CAST_CALLOUT_Y_OFFSET = 0;
const CAST_CALLOUT_WIDTH = 160;
const CAST_CALLOUT_HEIGHT = 35;
const CAST_CALLOUT_PADDING = 6;
const CAST_CALLOUT_BORDER_COLOR = '#ffffff';
const CAST_CALLOUT_BACKGROUND_COLOR = '#050506';

// HUD: UNIT TOGGLE
const SHOW_BATTLE_UNIT_HUD = true;

// HUD: Main resources
const BATTLE_MAIN_RESOURCE_STATIC_SLOTS = true;
const BATTLE_MAIN_RESOURCE_FONT_SIZE = 12;
const BATTLE_MAIN_RESOURCE_ROW_Y_OFFSET = 78;
const BATTLE_MAIN_RESOURCE_ICON_SPACING = 8;
const BATTLE_MAIN_RESOURCE_GROUP_GAP = 0;
const BATTLE_MAIN_RESOURCE_MAJOR_GAP = 18;
const BATTLE_MAIN_RESOURCE_EMPTY_ALPHA = 0.16;
const BATTLE_MAIN_RESOURCE_STATIC_MAX_SLOTS = 4;
const BATTLE_MAIN_RESOURCE_STATIC_ICON_SPACING = 10;
const BATTLE_MAIN_RESOURCE_STATIC_GROUP_GAP = 20;
const BATTLE_MAIN_RESOURCE_STATIC_ROW_GAP = 14;
const BATTLE_STATE_FULL_ALPHA = 1;

const DEPTH_BACKGROUND = 0;
const DEPTH_GRID = 10;
const DEPTH_SHADOW = 20;
const DEPTH_UNIT = 30;
const DEPTH_UNIT_HUD = 40;
const DEPTH_DAMAGE_TEXT = 80;
const DEPTH_COMBAT_CALLOUT = 100;
const BATTLE_RESOURCE_CENTER_DEPTH_BONUS = 30;

// HUD: Resource backplate
const BATTLE_HUD_BACKPLATE_ENABLED = true;
const BATTLE_HUD_BACKPLATE_WIDTH = 100;
const BATTLE_HUD_BACKPLATE_HEIGHT = 30;
const BATTLE_HUD_BACKPLATE_Y_OFFSET = 85;
const BATTLE_HUD_BACKPLATE_COLOR = '#050506';
const BATTLE_HUD_BACKPLATE_ALPHA = 0.10;
const BATTLE_HUD_BACKPLATE_BORDER_COLOR = '#2e2e38';
const BATTLE_HUD_BACKPLATE_BORDER_THICKNESS = 0;
const BATTLE_HUD_BACKPLATE_DEPTH = DEPTH_UNIT_HUD - 1;

// HUD: LP
const BATTLE_LP_SHOW = true;
const BATTLE_LP_X_OFFSET = 30;
const BATTLE_LP_Y_OFFSET = 54;
const BATTLE_LP_FONT_SIZE = 14;
const BATTLE_LP_CORNER_X_INSET = 8;
const BATTLE_LP_CORNER_Y_INSET = 8;

// HUD: DAMAGE
const DAMAGE_POPUP_Y_OFFSET = 80;
const DAMAGE_NUMBER_X_OFFSET = 0;
const DAMAGE_NUMBER_Y_OFFSET = 60;
const DAMAGE_NUMBER_FONT_SIZE = 28;
const DAMAGE_NUMBER_DURATION_MS = ms(1000);
const DAMAGE_NUMBER_FLOAT_Y = 20;
const DAMAGE_NUMBER_HOLD_MS = ms(1000);

// Round banner
const ROUND_START_BANNER_ENABLED = true;
const ROUND_START_BANNER_TITLE_FONT_SIZE = 54;
const ROUND_START_BANNER_SUBTITLE_FONT_SIZE = 22;
const ROUND_START_BANNER_WIDTH = 560;
const ROUND_START_BANNER_HEIGHT = 150;
const ROUND_START_BANNER_Y = GAME_HEIGHT * 0.26;
const ROUND_START_BANNER_HOLD_MS = ms(3600);
const ROUND_START_BANNER_ACTION_START_DELAY_MS = ms(500);
const ROUND_START_BANNER_FADE_MS = ms(500);
const ROUND_START_BANNER_DEPTH = 180;
const ROUND_START_BANNER_BACKGROUND_ALPHA = 0.78;
const ROUND_START_BANNER_BACKGROUND_COLOR = '#071b35';
const ROUND_START_BANNER_BORDER_COLOR = '#58a6ff';
const ROUND_START_BANNER_TITLE_COLOR = '#d8ecff';
const ROUND_START_BANNER_SUBTITLE_COLOR = '#9dccff';
const FATIGUE_START_ROUND = 5;
const FATIGUE_INTERVAL_ROUNDS = 5;
const FATIGUE_RP_RECOVERY_PENALTY = 1;
const EXHAUSTION_START_ROUND = 10;
const EXHAUSTION_INTERVAL_ROUNDS = 5;
const EXHAUSTION_RP_DRAIN = 1;

// Initiative order
const INITIATIVE_ORDER_NUMBER_SHOW = true;
const INITIATIVE_ORDER_FONT_SIZE = 18;
const INITIATIVE_ORDER_CENTER_X_OFFSET = 5;
const INITIATIVE_ORDER_Y_OFFSET = 65;
const INITIATIVE_ORDER_COLOR = '#ffffff';
const INITIATIVE_ORDER_STROKE_COLOR = COLORS.background;
const INITIATIVE_ORDER_STROKE_THICKNESS = 4;
const INITIATIVE_ORDER_DEPTH = DEPTH_DAMAGE_TEXT;
const INITIATIVE_ORDER_ACTIVE_ALPHA = 1;
const INITIATIVE_ORDER_ACTED_ALPHA = 0.20;
const INITIATIVE_ORDER_INELIGIBLE_ALPHA = 0.10;

// Command progression
const COMMAND_LEVEL_MIN = 1;
const COMMAND_LEVEL_MAX = 9;
const COMMAND_LEVEL_DEFAULT = 2;
const STARTING_COMMAND_LEVEL = COMMAND_LEVEL_DEFAULT;
const STARTING_COMMAND_XP = 0;
const COMMAND_XP_TO_LEVEL = 10;
const STARTING_ENEMY_COMMAND_LEVEL = 6;
const STARTING_ENEMY_COMMAND_XP = 0;
const BATTLE_OVER_BANNER_HOLD_MS = ms(1400);
const BATTLE_OVER_RETURN_TO_SETUP_DELAY_MS = BATTLE_OVER_BANNER_HOLD_MS + ROUND_START_BANNER_FADE_MS;

// Setup phase
const SETUP_MIN_UNITS_TO_START = 1;
const SETUP_FORMATION_CP_CAP = COMMAND_LEVEL_DEFAULT;
const SETUP_AI_DEFAULT_COMMAND_SPEND = 6;
const SETUP_UI_DEPTH = 150;
const SETUP_PANEL_X = 390;
const SETUP_PANEL_Y = 124;
const SETUP_PANEL_WIDTH = 1470;
const SETUP_PANEL_HEIGHT = 470;
const SETUP_PANEL_ALPHA = 0.88;
const SETUP_BUTTON_HEIGHT = 34;
const SETUP_KNIGHT_CARD_WIDTH = 190;
const SETUP_KNIGHT_CARD_HEIGHT = 154;
const SETUP_START_BUTTON_WIDTH = 150;
const SETUP_COMMAND_ICON = '💲';
const SETUP_TITLE_Y_OFFSET = 18;
const SETUP_UNITS_PANEL_X = SETUP_PANEL_X;
const SETUP_UNITS_PANEL_Y = SETUP_PANEL_Y;
const SETUP_UNIT_TYPES = ['squire', 'thief', 'knight', 'archer'];
const SETUP_UNIT_CARD_GAP = 14;
const SETUP_UNITS_TITLE_X_OFFSET = 18;
const SETUP_UNITS_TITLE_Y_OFFSET = SETUP_TITLE_Y_OFFSET;
const SETUP_UNITS_CARD_X_OFFSET = 18;
const SETUP_UNITS_CARD_Y_OFFSET = 90;
const SETUP_PROMOTED_UNITS_CARD_Y_OFFSET = 272;
const SETUP_UNITS_PANEL_WIDTH = SETUP_UNITS_CARD_X_OFFSET * 2 + SETUP_KNIGHT_CARD_WIDTH * SETUP_UNIT_TYPES.length + SETUP_UNIT_CARD_GAP * (SETUP_UNIT_TYPES.length - 1);
const SETUP_UNITS_PANEL_HEIGHT = SETUP_PANEL_HEIGHT;
const SETUP_START_BUTTON_X = GAME_WIDTH / 2 - SETUP_START_BUTTON_WIDTH / 2;
const SETUP_START_BUTTON_Y = FORMATION_CENTER_Y - BATTLE_GRID_HEIGHT / 2 - SETUP_BUTTON_HEIGHT - 24;
const SETUP_KNIGHT_CARD_TITLE_X_OFFSET = 14;
const SETUP_KNIGHT_CARD_TITLE_Y_OFFSET = 10;
const SETUP_KNIGHT_CARD_COST_Y_OFFSET = 42;
const SETUP_KNIGHT_PREVIEW_X_OFFSET = 14;
const SETUP_KNIGHT_PREVIEW_Y_OFFSET = 66;
const SETUP_KNIGHT_PREVIEW_LABEL_WIDTH = 32;
const SETUP_KNIGHT_PREVIEW_ROW_GAP = 14;
const SETUP_CELL_ALPHA_PLAYER = 0.18;
const SETUP_CELL_ALPHA_AI = 0.08;
const SETUP_CP_TOOLTIP_OFFSET_X = 18;
const SETUP_CP_TOOLTIP_OFFSET_Y = 18;
const SETUP_CP_TOOLTIP_PADDING = 8;
const SETUP_CP_TOOLTIP_WIDTH = 150;
const SETUP_CP_TOOLTIP_HEIGHT = 70;
const SETUP_CELL_ALPHA_OCCUPIED = 0.28;
const SETUP_CELL_STROKE_PLAYER = '#58a6ff';
const SETUP_CELL_STROKE_AI = '#5f6674';
const SETUP_PREVIEW_ALPHA_PLAYER = 1;
const SETUP_PREVIEW_ALPHA_AI = 0.72;

// Unit formation
const MAX_SQUADS = 6;
const COMMAND_POINTS_PER_SQUAD = COMMAND_LEVEL_DEFAULT;
const AVAILABLE_UNITS_COLUMNS = 6;
const AVAILABLE_UNITS_VISIBLE_ROWS = 2;
const DEMO_AVAILABLE_UNIT_CLASSES = [
  'squire', 'squire', 'squire', 'squire',
  'thief', 'thief', 'thief', 'thief',
  'archer', 'archer', 'archer', 'archer',
  'knight', 'knight', 'knight', 'knight', 'knight', 'knight'
];
const DOUBLE_CLICK_MS = 280;
const SQUAD_UNIT_DRAG_THRESHOLD = 8;
const FORMATION_COMMAND_ICON = '👑';
const SELECTED_SQUAD_HIGHLIGHT = '#58a6ff';
const SELECTED_UNIT_HIGHLIGHT = '#f2cf45';
const FORMATION_COLUMN_GAP = 16;
const FORMATION_MAIN_X = SETUP_PANEL_X;
const FORMATION_MAIN_WIDTH = SETUP_PANEL_WIDTH;
const FORMATION_SECTION_PADDING = 16;
const FORMATION_SCROLLBAR_WIDTH = 12;
const FORMATION_LEFT_STATS_PANEL_X = 24;
const FORMATION_LEFT_STATS_PANEL_WIDTH = POPUP_STATS_PANEL_WIDTH;
const FORMATION_LEFT_STATS_PANEL_Y = SETUP_PANEL_Y + 55;
const FORMATION_LEFT_STATS_PANEL_HEIGHT = 655;
const FORMATION_LEFT_PANEL_GAP = 14;
const FORMATION_HOVER_TOOLTIP_DEFAULT_TITLE = 'Info';
const FORMATION_HOVER_TOOLTIP_DEFAULT_TEXT = 'Hover a stat icon for details.';
const FORMATION_CONTENT_X = SETUP_PANEL_X + FORMATION_COLUMN_GAP;
const FORMATION_HEADER_X = FORMATION_CONTENT_X;
const FORMATION_HEADER_Y = 42;
const COMMAND_LEVEL_BOX_WIDTH = 430;
const COMMAND_LEVEL_BOX_HEIGHT = 54;
const COMMAND_LEVEL_BOX_X = SETUP_PANEL_X + SETUP_PANEL_WIDTH - COMMAND_LEVEL_BOX_WIDTH;
const COMMAND_LEVEL_BOX_Y = FORMATION_HEADER_Y - 6;
const COMMAND_LEVEL_CONTROL_SIZE = 24;
const COMMAND_LEVEL_CONTROL_GAP = 14;
const COMMAND_LEVEL_BUTTON_Y = COMMAND_LEVEL_BOX_Y + 15;
const COMMAND_LEVEL_MINUS_BUTTON_X = COMMAND_LEVEL_BOX_X + 14;
const COMMAND_LEVEL_TEXT_X = COMMAND_LEVEL_MINUS_BUTTON_X + COMMAND_LEVEL_CONTROL_SIZE + COMMAND_LEVEL_CONTROL_GAP;
const COMMAND_LEVEL_ICON_X = COMMAND_LEVEL_BOX_X + COMMAND_LEVEL_BOX_WIDTH - COMMAND_LEVEL_CONTROL_SIZE - COMMAND_LEVEL_CONTROL_GAP - 32;
const COMMAND_LEVEL_PLUS_BUTTON_X = COMMAND_LEVEL_BOX_X + COMMAND_LEVEL_BOX_WIDTH - COMMAND_LEVEL_CONTROL_SIZE - 14;
const SQUAD_VIEWPORT_X = SETUP_PANEL_X + 56;
const SQUAD_SECTION_PADDING_TOP = 55;
const SQUAD_SECTION_PADDING_BOTTOM = 28;
const SQUAD_VIEWPORT_Y = SETUP_PANEL_Y + SQUAD_SECTION_PADDING_TOP;
const SQUAD_VISIBLE_CARDS_PER_PAGE = 3;
const SQUAD_VISIBLE_COLUMNS = 3;
const SQUAD_VISIBLE_ROWS = 1;
const SQUAD_TOTAL_ROWS = 2;
const SQUAD_CARD_WIDTH = 430;
const SQUAD_CARD_HEIGHT = 360;
const SQUAD_CARD_HEADER_HEIGHT = 64;
const SQUAD_CARD_BODY_BOTTOM_PADDING = 16;
const SQUAD_CARD_GAP = 20;
const SQUAD_CARD_STEP = SQUAD_CARD_WIDTH + SQUAD_CARD_GAP;
const SQUAD_ROW_STEP = SQUAD_CARD_HEIGHT + SQUAD_CARD_GAP;
const SQUAD_VIEWPORT_WIDTH = SQUAD_CARD_WIDTH * SQUAD_VISIBLE_COLUMNS + SQUAD_CARD_GAP * (SQUAD_VISIBLE_COLUMNS - 1);
const SQUAD_VIEWPORT_HEIGHT = SQUAD_CARD_HEIGHT;
const SQUAD_PAGE_SCROLL_DISTANCE = SQUAD_ROW_STEP;
const SQUAD_SCROLLBAR_WIDTH = FORMATION_SCROLLBAR_WIDTH;
const SQUAD_SCROLLBAR_X = SETUP_PANEL_X + SETUP_PANEL_WIDTH - FORMATION_SECTION_PADDING - SQUAD_SCROLLBAR_WIDTH;
const SQUAD_SCROLLBAR_Y = SQUAD_VIEWPORT_Y;
const SQUAD_SCROLLBAR_HEIGHT = SQUAD_CARD_HEIGHT;
const SQUAD_ACTIVE_BORDER_COLOR = SELECTED_SQUAD_HIGHLIGHT;
const SQUAD_INACTIVE_BORDER_COLOR = COLORS.panelBorder;
const SQUAD_PANEL_X = SQUAD_VIEWPORT_X;
const SQUAD_PANEL_Y = SQUAD_VIEWPORT_Y;
const SQUAD_BOARD_X_OFFSET = 78;
const SQUAD_BOARD_CELL_SIZE = 86;
const SQUAD_BOARD_CELL_WIDTH = SQUAD_BOARD_CELL_SIZE;
const SQUAD_BOARD_CELL_HEIGHT = SQUAD_BOARD_CELL_SIZE;
const SQUAD_BOARD_CELL_GAP = 8;
const SQUAD_BOARD_COLS = 3;
const SQUAD_BOARD_ROWS = 3;
const SQUAD_BOARD_WIDTH = SQUAD_BOARD_CELL_WIDTH * SQUAD_BOARD_COLS + SQUAD_BOARD_CELL_GAP * (SQUAD_BOARD_COLS - 1);
const SQUAD_BOARD_HEIGHT = SQUAD_BOARD_CELL_HEIGHT * SQUAD_BOARD_ROWS + SQUAD_BOARD_CELL_GAP * (SQUAD_BOARD_ROWS - 1);
const SQUAD_BOARD_EMPTY_ALPHA = 0.58;
const SQUAD_BOARD_OCCUPIED_ALPHA = 0.96;
const SQUAD_BOARD_OCCUPIED_COLOR = '#20202a';
const SQUAD_CELL_UNIT_ART_SCALE = 3.1;
const SQUAD_CELL_UNIT_ART_OFFSET_Y = -12;
const SQUAD_CELL_NAME_OFFSET_Y = -7;
const SQUAD_CELL_NAME_OFFSET_X = -2;
const SQUAD_CELL_NAME_BACKING_ALPHA = 0.72;
const SQUAD_CELL_SLOT_DEPTH = SETUP_UI_DEPTH + 2;
const SQUAD_CELL_SPRITE_DEPTH = SETUP_UI_DEPTH + 3;
const SQUAD_CELL_NAME_DEPTH = SETUP_UI_DEPTH + 5;
const ARMY_DRAG_GHOST_SIZE = SQUAD_BOARD_CELL_WIDTH - 8;
const ARMY_DRAG_GHOST_ALPHA = 0.86;
const ARMY_DRAG_GHOST_NAME_OFFSET_Y = -28;
const ARMY_DRAG_GHOST_SPRITE_OFFSET_Y = 0;
const ARMY_DRAG_GHOST_SPRITE_SCALE = SQUAD_CELL_UNIT_ART_SCALE;
const SELECTED_CELL_HIGHLIGHT = '#f2cf45';
const FORMATION_BG_COLOR = 0x2f3434;
const FORMATION_BG_DEPTH = DEPTH_GRID + 5;
const ASSIGNED_CARD_ALPHA = 0.48;
const ASSIGNED_CARD_FILL_COLOR = '#2b2d31';
const PICKER_X_START = FORMATION_CONTENT_X;
const PICKER_BOTTOM_ANCHOR_Y = 1012;
const AVAILABLE_UNITS_CELL_GAP = 14;
const AVAILABLE_UNITS_SCROLLBAR_WIDTH = FORMATION_SCROLLBAR_WIDTH;
const AVAILABLE_UNITS_SCROLL_SPEED = 1;
const ROSTER_X = PICKER_X_START;
const ROSTER_CARD_WIDTH = 224;
const ROSTER_CARD_HEIGHT = 164;
const ROSTER_CARD_GAP = AVAILABLE_UNITS_CELL_GAP;
const ROSTER_COLUMNS = AVAILABLE_UNITS_COLUMNS;
const ROSTER_VISIBLE_ROWS = AVAILABLE_UNITS_VISIBLE_ROWS;
const ROSTER_COLUMN_SPACING = ROSTER_CARD_WIDTH + ROSTER_CARD_GAP;
const ROSTER_ROW_SPACING = ROSTER_CARD_HEIGHT + ROSTER_CARD_GAP;
const ROSTER_VISIBLE_HEIGHT = ROSTER_CARD_HEIGHT * ROSTER_VISIBLE_ROWS + ROSTER_CARD_GAP * (ROSTER_VISIBLE_ROWS - 1);
const ROSTER_Y = PICKER_BOTTOM_ANCHOR_Y - ROSTER_VISIBLE_HEIGHT;
const ROSTER_PANEL_PADDING = FORMATION_SECTION_PADDING;
const ROSTER_PANEL_HEADER_HEIGHT = 42;
const ROSTER_PANEL_X = ROSTER_X - ROSTER_PANEL_PADDING;
const ROSTER_PANEL_Y = ROSTER_Y - ROSTER_PANEL_HEADER_HEIGHT;
const ROSTER_PANEL_WIDTH = ROSTER_CARD_WIDTH * ROSTER_COLUMNS + ROSTER_CARD_GAP * (ROSTER_COLUMNS - 1) + ROSTER_PANEL_PADDING * 2 + AVAILABLE_UNITS_SCROLLBAR_WIDTH + 12;
const ROSTER_PANEL_HEIGHT = ROSTER_PANEL_HEADER_HEIGHT + ROSTER_VISIBLE_HEIGHT + ROSTER_PANEL_PADDING;
const FORMATION_TOOLTIP_PANEL_X = FORMATION_LEFT_STATS_PANEL_X;
const FORMATION_TOOLTIP_PANEL_Y = FORMATION_LEFT_STATS_PANEL_Y + FORMATION_LEFT_STATS_PANEL_HEIGHT + FORMATION_LEFT_PANEL_GAP;
const FORMATION_TOOLTIP_PANEL_WIDTH = FORMATION_LEFT_STATS_PANEL_WIDTH;
const FORMATION_TOOLTIP_PANEL_HEIGHT = ROSTER_PANEL_Y + ROSTER_PANEL_HEIGHT - FORMATION_TOOLTIP_PANEL_Y;
const ROSTER_SCROLLBAR_X = ROSTER_PANEL_X + ROSTER_PANEL_WIDTH - ROSTER_PANEL_PADDING - AVAILABLE_UNITS_SCROLLBAR_WIDTH;
const ROSTER_SCROLLBAR_Y = ROSTER_Y;
const ROSTER_SCROLLBAR_HEIGHT = ROSTER_VISIBLE_HEIGHT;
const AVAILABLE_UNIT_NAME_FONT_SIZE = 20;
const AVAILABLE_UNIT_CLASS_FONT_SIZE = 13;
const AVAILABLE_UNIT_ART_SCALE = 5.5;
const AVAILABLE_UNIT_ART_CENTER_Y_OFFSET = 74;
const AVAILABLE_UNIT_STATS_FONT_SIZE = 12;
const AVAILABLE_UNIT_STATS_Y_OFFSET = 126;
const AVAILABLE_UNIT_STATS_ROW_GAP = 18;
const AVAILABLE_UNIT_STATS_GROUP_RESERVED_WIDTH = 52; // fits up to 4 icons
const AVAILABLE_UNIT_STATS_GROUP_GAP = 20;
const AVAILABLE_UNIT_STATS_ICON_SPACING = 13;
const FORMATION_ACTION_BUTTON_X = FORMATION_LEFT_STATS_PANEL_X;
const FORMATION_ACTION_BUTTON_Y = SETUP_PANEL_Y;
const FORMATION_ACTION_BUTTON_WIDTH = FORMATION_LEFT_STATS_PANEL_WIDTH;
const FORMATION_TOOLTIP_DEFINITIONS = {
  hp: {
    title: 'HP',
    description: 'HP means Health Points. A unit is defeated at 0 HP. HP is usually damaged after SP is broken.'
  },
  sp: {
    title: 'SP',
    description: 'SP means Stance Points. SP is the first line of defense before HP. Breaking SP makes a unit much easier to hurt.'
  },
  ap: {
    title: 'AP',
    description: 'AP means Action Points. Units spend AP to use active actions like attacks or movement. AP refreshes at the start of each round.'
  },
  rp: {
    title: 'RP',
    description: 'RP means Reaction Points. Units spend RP on defensive or reactionary skills like Block, Dodge, or Parry. RP refreshes each round, but fatigue can reduce RP recovery later in battle.'
  },
  lp: {
    title: 'LP',
    description: 'LP means Limit Points. LP powers stronger class-defining reactions or future ultimate skills. Some advanced skills may require LP before they can trigger.'
  },
  ip: {
    title: 'IP',
    description: 'IP means Initiative Points. Higher IP usually acts earlier in battle. If initiative is tied, use the current battle tie-breaker behavior.'
  },
  mv: {
    title: 'MV',
    description: 'MV means Movement. Movement controls how far a unit can advance when it needs to move toward a target.'
  },
  rn: {
    title: 'RN',
    description: 'RN means Range. Range controls how far a unit can reach with attacks or actions.'
  },
  broadsword: {
    title: 'Broadsword',
    description: 'A basic sword for front-line fighters. It grants Slash, a reliable melee attack.'
  },
  buckler: {
    title: 'Buckler',
    description: 'A small shield. It improves Block and helps sturdy units protect their SP and HP.'
  },
  chainmail: {
    title: 'Chainmail',
    description: 'Medium armor that adds durability. It increases SP, giving the unit a stronger first line of defense.'
  },
  fastLearner: {
    title: 'Fast Learner',
    description: 'A Squire trait. This unit gains mastery faster, making it better at learning from equipped skills over time.'
  },
  slash: {
    title: 'Slash',
    description: 'A basic melee sword attack. Slash spends AP and deals damage to SP first, or HP if the target’s stance is broken.'
  },
  move: {
    title: 'Move',
    description: 'Move spends AP to advance toward an enemy when no target is currently in range.'
  },
  block: {
    title: 'Block',
    description: 'A defensive reaction. Block spends RP to reduce or prevent incoming damage. Block can still work against Truestrike.'
  },
  parry: {
    title: 'Parry',
    description: 'A stronger defensive reaction. Parry can fully stop an incoming melee attack and punish the attacker when its conditions are met.'
  },
  thrust: {
    title: 'Thrust',
    description: 'A focused melee attack. Thrust spends AP and is better at pressuring HP once the target stance is broken.'
  },
  commandLevel: {
    title: 'Command Level',
    description: 'Command Level caps how many units you can place in each squad. Higher Command Level lets each squad field more units.'
  },
  squadSpot: {
    title: 'Squad Spot',
    description: 'A squad spot is a position where one unit can be placed. A squad can only use as many filled spots as its Command Level allows.'
  }
};

const CLASS_TOOLTIPS = {
  squire: 'Squires are sturdy learners with balanced frontline stats. They rely on Block to survive pressure and grow quickly through Fast Learner.',
  thief: 'Thieves are fast evasive duelists. They act quickly, pressure enemies with daggers, and use Dodge to avoid attacks when they have RP.',
  archer: 'Archers are ranged hunters who punish evasive targets. Their Marksman trait gives extra range, and Truestrike can shut down Dodge.',
  knight: 'Knights are promoted Squires built to protect the squad. They are tougher frontline defenders with stronger protective reactions.'
};

const UNIT_QUIPS = {
  Alten: 'Still believes one clean block can fix anything.',
  Alvin: 'Volunteers first, then asks what the plan is.',
  Bria: 'Keeps a spare knife and a sharper comeback.',
  Cedric: 'Polishes his gear before every bad idea.',
  Dara: 'Claims luck is a skill.',
  Emery: 'Looks calm because panic would be inefficient.',
  Fay: 'Counts arrows like other people count sheep.',
  Garakail: 'Laughs loud enough to count as armor.',
  Iris: 'Never misses a detail—or a target.',
  Jory: 'Has a heroic pose ready, just in case.',
  Kale: 'Says he is scouting, mostly wanders stylishly.',
  Lena: 'Remembers every promise and every shortcut.'
};

const UNIT_QUIP_FALLBACK = 'Still waiting for their legend to begin.';

const PRACTICE_ENEMY_COUNT = 2;
const PRACTICE_ENEMY_ALLOWED_CLASSES = ['squire', 'thief', 'archer'];
const PRACTICE_ENEMY_FORMATION_SLOTS = [
  { row: 'front', col: 1 },
  { row: 'back', col: 1 }
];
const ARMY_ROSTER_NAME_POOL = [
  'Alden', 'Bria', 'Cedric', 'Dara', 'Emery', 'Faye',
  'Garrick', 'Hale', 'Iris', 'Jory', 'Kael', 'Lena',
  'Mira', 'Nolan', 'Orin', 'Petra', 'Quinn', 'Rhea',
  'Silas', 'Tessa', 'Ulric', 'Vera', 'Wren', 'Yara'
];

function createArmyTestRoster() {
  const unitTypeCounts = {};

  return DEMO_AVAILABLE_UNIT_CLASSES.map((unitType, index) => {
    unitTypeCounts[unitType] = (unitTypeCounts[unitType] || 0) + 1;

    return {
      id: `${unitType}-${unitTypeCounts[unitType]}`,
      name: ARMY_ROSTER_NAME_POOL[index % ARMY_ROSTER_NAME_POOL.length],
      unitType
    };
  });
}

// Battle start
// Action timing
const ATTACK_RESOURCE_PREVIEW_DURATION_MS = ms(650);
const ATTACK_RESOURCE_COMMIT_DURATION_MS = ms(200);
const POST_ATTACK_RESOURCE_PAUSE_MS = ms(150);

const DEFENDER_RESOURCE_PREVIEW_DURATION_MS = ATTACK_RESOURCE_PREVIEW_DURATION_MS;
const DEFENDER_RESOURCE_COMMIT_DURATION_MS = ATTACK_RESOURCE_COMMIT_DURATION_MS;
const DEFENDER_LP_GAIN_STAGGER_MS = ms(250);

// Movement timing
const LUNGE_DURATION_MS = ms(450);
const FREEZE_DURATION_MS = ms(300);
const RETURN_DURATION_MS = ms(450);
const MOVE_ANIMATION_DURATION_MS = ms(450);
const MOVE_ANIMATION_EASE = 'Sine.easeInOut';

const ATTACK_LUNGE_STOP_DISTANCE = 132;

// Result timing
const ATTACKER_COUNTER_RESOURCE_DURATION_MS = ms(450);
const FINAL_STATS_DURATION_MS = ms(750);
const CLEANUP_BUFFER_MS = ms(300);

const FLOATING_EFFECT_DURATION_MS = ms(300);
const COUNTER_RESOURCE_PREVIEW_DURATION_MS = ms(500);
const SECONDARY_RESOURCE_COMMIT_STAGGER_MS = ms(250);

const DAMAGE_BLINK_ALPHA = 0.4;
const DAMAGE_BLINK_DURATION_MS = ms(160);
const DAMAGE_BLINK_REPEAT = 1;
const DODGE_FLIP_DURATION_MS = ms(300);
const DODGE_FLIP_BACK_DISTANCE = 28;
const DODGE_FLIP_UP_DISTANCE = 22;
const DODGE_FLIP_ROTATION_DEGREES = 360;
const DODGE_FLIP_FADE_ALPHA = 0.55;
const DODGE_FLIP_RETURN_DURATION_MS = ms(120);
const DODGE_FAIL_TILT_DEGREES = 90;
const DODGE_FAIL_DROP_DISTANCE = 16;
const DODGE_FAIL_DURATION_MS = ms(260);
const DODGE_FAIL_RECOVER_DURATION_MS = ms(220);
const DODGE_FAIL_BLINK_ALPHA = 0.45;
const DODGE_FAIL_BLINK_COUNT = 2;
const DODGE_RP_REFUND_VISUAL_DELAY_MS = ms(200);
const RANGED_PROJECTILE_DURATION_MS = ms(450);
const RANGED_PROJECTILE_ARC_HEIGHT = 80;
const RANGED_PROJECTILE_SIZE = 5;
const RANGED_PROJECTILE_START_X_OFFSET = 12;
const RANGED_PROJECTILE_START_Y_OFFSET = -40;
const RANGED_PROJECTILE_END_X_OFFSET = 0;
const RANGED_PROJECTILE_END_Y_OFFSET = -35;

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

const MOVE_ACTION_START_DELAY_MS =
  ATTACK_LUNGE_START_DELAY_MS;

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
  ms(400);

const ACTION_CAST_EFFECT_FADE_DELAY_MS =
  ACTION_CAST_COMMIT_DELAY_MS + ms(600);

const REACTION_CAST_EFFECT_FADE_DELAY_MS =
  REACTION_CAST_COMMIT_DELAY_MS - REACTION_CAST_LABEL_DELAY_MS + ms(600);

function buildGambitRows() {
  return [
    {
      label: 'G1: Parry',
      detail: [
        { text: '[player has ' },
        resourceTextSegment('rp'),
        { text: '] [player has ' },
        resourceTextSegment('lp'),
        { text: ']' }
      ]
    },
  {
    label: 'G2: Block',
    detail: [
      { text: '[player has ' },
      resourceTextSegment('rp'),
      { text: ']' }
    ]
  },
  {
    label: 'G3: Thrust',
    detail: [
      { text: '[enemy has 0 ' },
      resourceTextSegment('sp'),
      { text: ']' }
    ]
  },
  {
    label: 'G4: Slash',
    detail: [
      { text: '[enemy has 2+' },
      resourceTextSegment('sp'),
      { text: ']' }
    ]
  }
];
}

function cloneStats(stats) {
  return { ...stats };
}

function applyStatBonuses(stats, bonuses = {}) {
  Object.entries(bonuses).forEach(([key, value]) => {
    stats[key] = (stats[key] || 0) + value;
  });
}

function cloneAbility(ability) {
  return { ...ability };
}

function applyAbilityBonuses(ability, bonuses = {}) {
  Object.entries(bonuses).forEach(([key, value]) => {
    ability[key] = (ability[key] || 0) + value;
  });
}

function getClassDefinition(characterClass) {
  return CHARACTER_CLASSES[characterClass] || CHARACTER_CLASSES.knight;
}

function getClassEquipmentItems(classDefinition) {
  return [...new Set(Object.values(classDefinition.equipment || {}))]
    .filter(Boolean)
    .map((equipmentKey) => {
      const item = EQUIPMENT[equipmentKey];
      if (!item) {
        console.warn(`Unknown equipment: ${equipmentKey}`);
      }
      return item;
    })
    .filter(Boolean);
}

function getEquippedItems(unitOrClassDefinition) {
  return getClassEquipmentItems(unitOrClassDefinition);
}

function getEquipmentStatBonuses(unitOrClassDefinition) {
  const statBonuses = {};
  getEquippedItems(unitOrClassDefinition).forEach((item) => {
    applyStatBonuses(statBonuses, item.statBonuses);
  });
  return statBonuses;
}

function calculateClassStats(characterClass) {
  const classDefinition = getClassDefinition(characterClass);
  const stats = cloneStats(BASE_UNIT_STATS);

  if (classDefinition.promoted) {
    applyStatBonuses(stats, PROMOTION_STAT_BONUSES.promoted);
  }

  applyStatBonuses(stats, classDefinition.statBonuses);
  (classDefinition.traits || []).forEach((traitKey) => {
    const trait = TRAITS[traitKey];
    if (!trait) {
      console.warn(`Unknown trait: ${traitKey}`);
      return;
    }

    applyStatBonuses(stats, trait.statBonuses);
  });
  applyStatBonuses(stats, getEquipmentStatBonuses(classDefinition));

  stats.lp = BASE_UNIT_STATS.lp;
  return stats;
}

function calculateClassActions(characterClass) {
  const classDefinition = getClassDefinition(characterClass);
  const actions = {};
  const equipmentItems = getClassEquipmentItems(classDefinition);
  const grantedActionKeys = getEffectiveActions(classDefinition);

  grantedActionKeys.forEach((actionKey) => {
    const action = ACTIONS[actionKey];
    if (!action) {
      console.warn(`Unknown action: ${actionKey}`);
      return;
    }

    actions[actionKey] = cloneAbility(action);
  });

  equipmentItems.forEach((item) => {
    Object.entries(item.actionBonuses || {}).forEach(([actionKey, bonuses]) => {
      if (actions[actionKey]) {
        applyAbilityBonuses(actions[actionKey], bonuses);
      }
    });
    (item.grantsActions || []).forEach((actionKey) => {
      if (actions[actionKey] && Number.isFinite(actions[actionKey].range)) {
        actions[actionKey].range += item.rangeBonus || 0;
      }
    });
  });
  (classDefinition.traits || []).forEach((traitKey) => {
    const trait = TRAITS[traitKey];
    if (!trait) return;
    Object.entries(trait.actionRangeBonus || {}).forEach(([actionKey, bonus]) => {
      if (actions[actionKey] && Number.isFinite(actions[actionKey].range)) {
        actions[actionKey].range += bonus;
      }
    });
  });
  return actions;
}

function getGrantedActions(unitOrClassDefinition) {
  const actions = new Set();
  getEquippedItems(unitOrClassDefinition).forEach((item) => {
    (item.grantsActions || []).forEach((actionKey) => actions.add(actionKey));
  });
  return actions;
}

function getEffectiveActions(unitOrClassDefinition) {
  const classDefinition = unitOrClassDefinition.class
    ? getClassDefinition(unitOrClassDefinition.class)
    : unitOrClassDefinition;
  const actions = getGrantedActions(unitOrClassDefinition);
  if (actions.size === 0) {
    (classDefinition.actions || []).forEach((actionKey) => actions.add(actionKey));
  }
  actions.add('move');
  return actions;
}

function calculateClassReactions(characterClass) {
  const classDefinition = getClassDefinition(characterClass);
  const reactions = {};
  const equipmentItems = getClassEquipmentItems(classDefinition);
  const grantedReactionKeys = getEffectiveReactions(classDefinition);

  grantedReactionKeys.forEach((reactionKey) => {
    const reaction = REACTIONS[reactionKey];
    if (!reaction) {
      console.warn(`Unknown reaction: ${reactionKey}`);
      return;
    }

    reactions[reactionKey] = cloneAbility(reaction);
  });
  equipmentItems.forEach((item) => {
    Object.entries(item.reactionBonuses || {}).forEach(([reactionKey, bonuses]) => {
      if (reactions[reactionKey]) {
        applyAbilityBonuses(reactions[reactionKey], bonuses);
      }
    });
  });
  return reactions;
}

function calculateClassLimits(characterClass) {
  const classDefinition = getClassDefinition(characterClass);
  const limits = {};

  (classDefinition.limits || []).forEach((limitKey) => {
    const limit = LIMITS[limitKey];
    if (!limit) {
      console.warn(`Unknown limit: ${limitKey}`);
      return;
    }

    limits[limitKey] = cloneAbility(limit);
  });
  getClassEquipmentItems(classDefinition).forEach((item) => {
    Object.entries(item.limitBonuses || {}).forEach(([limitKey, bonuses]) => {
      if (limits[limitKey]) {
        applyAbilityBonuses(limits[limitKey], bonuses);
      }
    });
  });
  return limits;
}

function hasTrait(unit, traitKey) {
  return (unit.traits || []).includes(traitKey);
}

function getInnateReactions(unitOrClassDefinition) {
  const classDefinition = unitOrClassDefinition.class
    ? getClassDefinition(unitOrClassDefinition.class)
    : unitOrClassDefinition;
  return new Set(classDefinition.reactions || []);
}

function getGrantedReactions(unitOrClassDefinition) {
  const reactions = new Set();
  getEquippedItems(unitOrClassDefinition).forEach((item) => {
    (item.grantsReactions || []).forEach((reactionKey) => reactions.add(reactionKey));
  });
  return reactions;
}

function getEffectiveReactions(unitOrClassDefinition) {
  return new Set([
    ...getInnateReactions(unitOrClassDefinition),
    ...getGrantedReactions(unitOrClassDefinition)
  ]);
}

function getTraitValue(unit, traitKey, valueKey, fallback = 0) {
  if (!hasTrait(unit, traitKey)) {
    return fallback;
  }

  return TRAITS[traitKey]?.[valueKey] ?? fallback;
}

function getUnitCommandCost(unitType) {
  return getClassDefinition(unitType).cpCost || 0;
}

let sceneRef;
let layout;
let units;
let gamePhase = 'setup';
let redFormation = [];
let blueFormation = [];
let selectedSetupUnitType = 'knight';
let armyRoster = [];
let armySquads = [];
let selectedArmyRosterUnitId = null;
let selectedArmySquadIndex = 0;
let squadScrollOffset = 0;
let availableUnitsScrollRow = 0;
let lastArmyRosterClick = { unitId: null, time: 0 };
let draggedArmyRosterUnitId = null;
let armyDragSource = null;
let draggedArmyRosterGhost = null;
let setupNodes = [];
let setupTooltipNodes = [];
let formationHoverTargets = [];
let dynamicTooltipDefinitions = {};
let formationTooltipPanelNodes = [];
let formationHoveredTooltipKey = null;
let formationBackgroundNode = null;
let utilityMenuButtonNodes = [];
let commandLevel = STARTING_COMMAND_LEVEL;
let commandXp = STARTING_COMMAND_XP;
let enemyCommandLevel = STARTING_ENEMY_COMMAND_LEVEL;
let enemyCommandXp = STARTING_ENEMY_COMMAND_XP;
let battleRewardsGranted = false;
let logEntries = [];
let logRows = [];
let combatLogHeader;
let combatLogToggleButton;
let combatLogToggleLabel;
let isCombatLogVisible = true;
let round = 0;
let turn = 1;
let action = 1;
let turnQueue = [];
let roundInitiativeOrder = [];
let currentTurnActedUnits = new Set();
let battleEnded = false;
const resourceDisplayOverrides = new Map();
let actionTimer;
let speedLabel;
let speedButton;
let speedMenuNodes = [];
let isUtilityMenuOpen = false;
let utilityMenuNodes = [];
let infoPanelNodes = [];
let statusPanelNodes = [];
let currentAttacker = null;
let currentDefender = null;
let selectedStatsUnits = { red: null, blue: null };
let statsPanelNodes = { red: [], blue: [] };
let combatZoomMode = true;
let isBattleGridLineVisible = SHOW_BATTLE_GRID_LINES;
let battleGridLineNodes = [];
let isKnightRandomIdleTwitchEnabled = KNIGHT_RANDOM_IDLE_TWITCH_ENABLED;
let popupButtons = {};
let popupPanelNodes = [];
let activePopupKey = null;

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

function preloadClassVisuals(scene) {
  const loadedTextureKeys = new Set();
  for (const classDef of Object.values(CHARACTER_CLASSES)) {
    const v = classDef.visual;
    scene.load.spritesheet(v.idle.textureKey, v.idle.assetPath, {
      frameWidth: v.idle.frameWidth,
      frameHeight: v.idle.frameHeight
    });
    for (const anim of Object.values(v.animations)) {
      if (!loadedTextureKeys.has(anim.textureKey)) {
        loadedTextureKeys.add(anim.textureKey);
        scene.load.spritesheet(anim.textureKey, anim.assetPath, {
          frameWidth: anim.frameWidth,
          frameHeight: anim.frameHeight
        });
      }
    }
  }
}

function preload() {
  preloadClassVisuals(this);
}

function create() {
  sceneRef = this;
  sceneRef.input.mouse.disableContextMenu();
  createClassAnimations();
  createLayout();
  applyCombatZoomMode(false);

  setBattleSpeed(battleSpeedMultiplier);

  sceneRef.input.keyboard.on('keydown-ONE', () => setBattleSpeed(1));
  sceneRef.input.keyboard.on('keydown-TWO', () => setBattleSpeed(2));
  sceneRef.input.keyboard.on('keydown-THREE', () => setBattleSpeed(4));
  sceneRef.input.keyboard.on('keydown-FOUR', () => setBattleSpeed(8));
  sceneRef.input.keyboard.on('keydown-FIVE', () => setBattleSpeed(32));
  sceneRef.input.keyboard.on('keydown-SIX', () => setBattleSpeed(64));
  sceneRef.input.keyboard.on(`keydown-${COMBAT_ZOOM_KEY}`, toggleCombatZoomMode);
  sceneRef.input.keyboard.on(`keydown-${BATTLE_GRID_TOGGLE_KEY}`, toggleBattleGridLines);
  sceneRef.input.keyboard.on(`keydown-${KNIGHT_RANDOM_IDLE_TWITCH_TEST_KEY}`, toggleKnightRandomIdleTwitch);
  sceneRef.input.keyboard.on('keydown-LEFT', () => changeSquadPage(-1));
  sceneRef.input.keyboard.on('keydown-RIGHT', () => changeSquadPage(1));
  sceneRef.input.on('pointerdown', handleGlobalPointerDown);
  sceneRef.input.on('pointermove', handleArmyRosterDragMove);
  sceneRef.input.on('pointerup', handleArmyRosterDragEnd);
  sceneRef.input.on('wheel', handleSetupSquadWheel);

  enterSetupPhase();
}

function createClassAnimations() {
  const createdKeys = new Set();
  for (const classDef of Object.values(CHARACTER_CLASSES)) {
    for (const anim of Object.values(classDef.visual.animations)) {
      if (createdKeys.has(anim.animationKey)) {
        continue;
      }
      createdKeys.add(anim.animationKey);
      sceneRef.anims.create({
        key: anim.animationKey,
        frames: sceneRef.anims.generateFrameNumbers(anim.textureKey, {
          start: anim.startFrame,
          end: anim.endFrame
        }),
        frameRate: anim.frameRate,
        repeat: 0
      });
    }
  }
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
  const battleH = GAME_HEIGHT;
  const grassY = battleH * BATTLE_HORIZON_RATIO;
  const grassH = battleH - grassY;

  layout = {
    left: { x: 0, y: 0, w: GAME_WIDTH / 2, h: GAME_HEIGHT },
    center: { x: 0, y: 0, w: GAME_WIDTH, h: GAME_HEIGHT },
    right: { x: GAME_WIDTH / 2, y: 0, w: GAME_WIDTH / 2, h: GAME_HEIGHT },
    battle: { x: 0, y: 0, w: GAME_WIDTH, h: battleH },
    info: { x: 0, y: 0, w: 0, h: 0 },
    grass: { x: 0, y: grassY, w: GAME_WIDTH, h: grassH }
  };

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

  formationBackgroundNode = sceneRef.add.rectangle(
    0,
    0,
    GAME_WIDTH,
    GAME_HEIGHT,
    FORMATION_BG_COLOR
  )
    .setOrigin(0)
    .setDepth(FORMATION_BG_DEPTH);

  createPopupButtons();
}

function drawPanel(rect, title) {
  sceneRef.add.rectangle(rect.x, rect.y, rect.w, rect.h, PHASER_COLORS.panel)
    .setOrigin(0)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder);
  sceneRef.add.text(rect.x + rect.w / 2, 26, title, headerTextStyle())
    .setOrigin(0.5, 0);
}

function createPopupButtons() {
  const button = sceneRef.add.rectangle(
    UTILITY_MENU_BUTTON_X,
    UTILITY_MENU_BUTTON_Y,
    UTILITY_MENU_BUTTON_SIZE,
    UTILITY_MENU_BUTTON_SIZE,
    PHASER_COLORS.infoPanel
  )
    .setOrigin(0)
    .setStrokeStyle(1, PHASER_COLORS.panelBorder)
    .setInteractive({ useHandCursor: true })
    .setDepth(UTILITY_BUTTON_DEPTH);

  const label = sceneRef.add.text(
    UTILITY_MENU_BUTTON_X + UTILITY_MENU_BUTTON_SIZE / 2,
    UTILITY_MENU_BUTTON_Y + UTILITY_MENU_BUTTON_SIZE / 2,
    UTILITY_MENU_LABEL,
    combatLogToggleTextStyle()
  )
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .setDepth(UTILITY_BUTTON_DEPTH + 1);

  button.on('pointerdown', toggleUtilityMenu);
  label.on('pointerdown', toggleUtilityMenu);
  utilityMenuButtonNodes = [button, label];
}

function setFormationScreenVisible(isVisible) {
  if (formationBackgroundNode) {
    formationBackgroundNode.setVisible(isVisible);
  }

  utilityMenuButtonNodes.forEach((node) => {
    if (isLiveBattlefieldNode(node)) {
      node.setVisible(!isVisible);
    }
  });

  if (isVisible) {
    hideUtilityMenu();
    hideSpeedMenu();
    closePopups();
  }
}

function createUtilityButton(label, x, y, onClick) {
  const button = sceneRef.add.rectangle(
    x,
    y,
    UTILITY_BUTTON_WIDTH,
    UTILITY_BUTTON_HEIGHT,
    PHASER_COLORS.infoPanel
  )
    .setOrigin(0)
    .setStrokeStyle(1, PHASER_COLORS.panelBorder)
    .setInteractive({ useHandCursor: true })
    .setDepth(UTILITY_BUTTON_DEPTH);

  const text = sceneRef.add.text(
    x + UTILITY_BUTTON_PADDING,
    y + 8,
    label,
    combatLogToggleTextStyle()
  )
    .setInteractive({ useHandCursor: true })
    .setDepth(UTILITY_BUTTON_DEPTH);

  button.on('pointerdown', onClick);
  text.on('pointerdown', onClick);
  return { button, text };
}

function createSpeedButton() {
  const y = UTILITY_BUTTON_Y + UTILITY_BUTTON_HEIGHT + UTILITY_BUTTON_GAP;
  const nodes = createUtilityButton(`Speed: ${battleSpeedMultiplier}x`, UTILITY_BUTTON_X, y, cycleBattleSpeed);
  speedButton = nodes.button;
  speedLabel = nodes.text;
  [nodes.button, nodes.text].forEach((node) => {
    node.on('pointerover', showSpeedMenu);
    node.on('pointerout', scheduleSpeedMenuHide);
  });
}

function togglePopup(key) {
  if (activePopupKey === key) {
    closePopups();
    return;
  }

  openPopup(key);
}

function openPopup(key) {
  closePopups();
  activePopupKey = key;
  renderPopupPanel(key);
}

function closePopups() {
  activePopupKey = null;
  popupPanelNodes.forEach((node) => node.destroy());
  popupPanelNodes = [];
  infoPanelNodes.forEach((node) => node.destroy());
  infoPanelNodes = [];
  logRows.forEach((row) => row.destroy());
  logRows = [];
}

function handleGlobalPointerDown(pointer) {
  if (!pointer.rightButtonDown()) {
    return;
  }

  if (activePopupKey) {
    closePopups();
    return;
  }

  if (selectedStatsUnits.red || selectedStatsUnits.blue) {
    clearAllStatsPanels();
    return;
  }

  if (speedMenuNodes.length > 0) {
    hideSpeedMenu();
  }

  if (isUtilityMenuOpen) {
    hideUtilityMenu();
  }
}

function cycleBattleSpeed() {
  const currentIndex = BATTLE_SPEED_OPTIONS.indexOf(battleSpeedMultiplier);
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % BATTLE_SPEED_OPTIONS.length;
  setBattleSpeed(BATTLE_SPEED_OPTIONS[nextIndex]);
}

function showSpeedMenu() {
  if (speedMenuNodes.length > 0) {
    return;
  }

  const x = UTILITY_BUTTON_X;
  const speedButtonY = UTILITY_BUTTON_Y + UTILITY_BUTTON_HEIGHT + UTILITY_BUTTON_GAP;
  const menuHeight = BATTLE_SPEED_OPTIONS.length * SPEED_MENU_OPTION_HEIGHT +
    Math.max(0, BATTLE_SPEED_OPTIONS.length - 1) * SPEED_MENU_GAP;
  const y = speedButtonY - menuHeight;
  BATTLE_SPEED_OPTIONS.forEach((speed, index) => {
    const optionY = y + index * (SPEED_MENU_OPTION_HEIGHT + SPEED_MENU_GAP);
    const button = sceneRef.add.rectangle(x, optionY, UTILITY_BUTTON_WIDTH, SPEED_MENU_OPTION_HEIGHT, PHASER_COLORS.infoPanel)
      .setOrigin(0)
      .setStrokeStyle(1, PHASER_COLORS.panelBorder)
      .setInteractive({ useHandCursor: true })
      .setDepth(SPEED_MENU_DEPTH);
    const text = sceneRef.add.text(x + UTILITY_BUTTON_PADDING, optionY + 7, `${speed}x`, combatLogToggleTextStyle())
      .setInteractive({ useHandCursor: true })
      .setDepth(SPEED_MENU_DEPTH + 1);

    [button, text].forEach((node) => {
      node.on('pointerdown', () => {
        setBattleSpeed(speed);
        hideSpeedMenu();
      });
      node.on('pointerover', showSpeedMenu);
      node.on('pointerout', scheduleSpeedMenuHide);
    });
    speedMenuNodes.push(button, text);
  });
}

function scheduleSpeedMenuHide() {
  sceneRef.time.delayedCall(120, () => {
    const pointer = sceneRef.input.activePointer;
    const nodes = [speedButton, ...speedMenuNodes].filter(isLiveBattlefieldNode);
    const isOverUtility = nodes.some((node) => node.getBounds().contains(pointer.worldX, pointer.worldY));
    if (!isOverUtility) {
      hideSpeedMenu();
    }
  });
}

function hideSpeedMenu() {
  speedMenuNodes.forEach((node) => {
    if (isLiveBattlefieldNode(node)) {
      node.destroy();
    }
  });
  speedMenuNodes = [];
}

function toggleUtilityMenu() {
  if (isUtilityMenuOpen) {
    hideUtilityMenu();
  } else {
    showUtilityMenu();
  }
}

function showUtilityMenu() {
  if (isUtilityMenuOpen) {
    return;
  }
  isUtilityMenuOpen = true;

  const items = [
    { label: 'Log', onClick: toggleCombatLog, isSpeed: false },
    { label: `Speed: ${battleSpeedMultiplier}x`, onClick: cycleBattleSpeed, isSpeed: true }
  ];

  items.forEach((item, index) => {
    const itemY = UTILITY_MENU_DROPDOWN_Y + index * (UTILITY_MENU_ITEM_HEIGHT + UTILITY_MENU_GAP);
    const btn = sceneRef.add.rectangle(
      UTILITY_MENU_DROPDOWN_X,
      itemY,
      UTILITY_MENU_DROPDOWN_WIDTH,
      UTILITY_MENU_ITEM_HEIGHT,
      PHASER_COLORS.infoPanel
    )
      .setOrigin(0)
      .setStrokeStyle(1, PHASER_COLORS.panelBorder)
      .setInteractive({ useHandCursor: true })
      .setDepth(UTILITY_BUTTON_DEPTH);

    const txt = sceneRef.add.text(
      UTILITY_MENU_DROPDOWN_X + UTILITY_BUTTON_PADDING,
      itemY + UTILITY_MENU_ITEM_HEIGHT / 2,
      item.label,
      combatLogToggleTextStyle()
    )
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(UTILITY_BUTTON_DEPTH + 1);

    btn.on('pointerdown', item.onClick);
    txt.on('pointerdown', item.onClick);

    if (item.isSpeed) {
      speedLabel = txt;
    }

    utilityMenuNodes.push(btn, txt);
  });
}

function hideUtilityMenu() {
  isUtilityMenuOpen = false;
  speedLabel = null;
  destroyUtilityMenuNodes();
}

function destroyUtilityMenuNodes() {
  utilityMenuNodes.forEach((node) => {
    if (isLiveBattlefieldNode(node)) {
      node.destroy();
    }
  });
  utilityMenuNodes = [];
}

function getPopupRect(key) {
  if (key === 'combatLog') {
    return {
      x: GAME_WIDTH - POPUP_PANEL_MARGIN - POPUP_LOG_PANEL_WIDTH,
      y: POPUP_PANEL_TOP,
      w: POPUP_LOG_PANEL_WIDTH,
      h: POPUP_LOG_PANEL_HEIGHT
    };
  }

  return {
    x: POPUP_PANEL_MARGIN,
    y: GAME_HEIGHT - POPUP_STATS_PANEL_BOTTOM_OFFSET - POPUP_STATS_PANEL_HEIGHT,
    w: POPUP_STATS_PANEL_WIDTH,
    h: POPUP_STATS_PANEL_HEIGHT
  };
}

function getStatsPanelRect(teamKey) {
  const y = GAME_HEIGHT - POPUP_STATS_PANEL_BOTTOM_OFFSET - POPUP_STATS_PANEL_HEIGHT;
  if (teamKey === 'blue') {
    return {
      x: GAME_WIDTH - POPUP_PANEL_MARGIN - POPUP_STATS_PANEL_WIDTH,
      y,
      w: POPUP_STATS_PANEL_WIDTH,
      h: POPUP_STATS_PANEL_HEIGHT
    };
  }
  return {
    x: POPUP_PANEL_MARGIN,
    y,
    w: POPUP_STATS_PANEL_WIDTH,
    h: POPUP_STATS_PANEL_HEIGHT
  };
}

function clearStatsPanel(teamKey) {
  statsPanelNodes[teamKey].forEach((node) => {
    if (isLiveBattlefieldNode(node)) {
      node.destroy();
    }
  });
  statsPanelNodes[teamKey] = [];
}

function clearAllStatsPanels() {
  clearStatsPanel('red');
  clearStatsPanel('blue');
  selectedStatsUnits.red = null;
  selectedStatsUnits.blue = null;
}

function getUnitDisplayName(unit) {
  const teamLabel = unit.teamKey.charAt(0).toUpperCase() + unit.teamKey.slice(1);
  const className = unit.className || getClassDefinition(unit.class).name;
  return `${teamLabel} ${className}`;
}

function renderStatsPanel(teamKey) {
  clearStatsPanel(teamKey);
  const unit = selectedStatsUnits[teamKey];
  if (!unit) {
    return;
  }
  const rect = getStatsPanelRect(teamKey);
  const bg = sceneRef.add.rectangle(rect.x, rect.y, rect.w, rect.h, PHASER_COLORS.infoPanel)
    .setOrigin(0)
    .setAlpha(POPUP_PANEL_BACKGROUND_ALPHA)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder)
    .setDepth(POPUP_DEPTH);
  const titleNode = sceneRef.add.text(rect.x + POPUP_PANEL_PADDING, rect.y + 18, getUnitDisplayName(unit), headerTextStyle())
    .setDepth(POPUP_DEPTH + 1);
  const unitCost = unit.cpCost || getUnitCommandCost(unit.class);
  const costNode = sceneRef.add.text(rect.x + rect.w - POPUP_PANEL_PADDING, rect.y + 18, `${SETUP_COMMAND_ICON}${unitCost}`, headerTextStyle())
    .setOrigin(1, 0).setDepth(POPUP_DEPTH + 1);
  statsPanelNodes[teamKey].push(bg, titleNode, costNode);

  const contentX = rect.x + POPUP_STATS_PANEL_PADDING;
  const contentY = rect.y + 58;
  const contentW = rect.w - POPUP_STATS_PANEL_PADDING * 2;
  const contentH = rect.h - 58 - POPUP_STATS_PANEL_PADDING;

  const savedNodes = infoPanelNodes;
  infoPanelNodes = statsPanelNodes[teamKey];
  renderCharacterPanel(unit, contentX, contentY, contentW, contentH, false);
  infoPanelNodes = savedNodes;
}

function openStatsPanel(unit) {
  if (!unit) {
    return;
  }
  selectedStatsUnits[unit.teamKey] = unit;
  renderStatsPanel(unit.teamKey);
}

function renderPopupPanel(key) {
  const rect = getPopupRect(key);
  const title = {
    combatLog: 'Combat Log',
    stats: 'Stats'
  }[key];

  const background = sceneRef.add.rectangle(rect.x, rect.y, rect.w, rect.h, PHASER_COLORS.infoPanel)
    .setOrigin(0)
    .setAlpha(POPUP_PANEL_BACKGROUND_ALPHA)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder)
    .setDepth(POPUP_DEPTH);
  const titleNode = sceneRef.add.text(rect.x + POPUP_PANEL_PADDING, rect.y + 18, title, headerTextStyle())
    .setDepth(POPUP_DEPTH + 1);
  popupPanelNodes.push(background, titleNode);

  if (key === 'stats') {
    layout.info = {
      x: rect.x + POPUP_STATS_PANEL_PADDING,
      y: rect.y + 58,
      w: rect.w - POPUP_STATS_PANEL_PADDING * 2,
      h: rect.h - 58 - POPUP_STATS_PANEL_PADDING
    };
    createInfoPanel();
    return;
  }

  if (key === 'combatLog') {
    renderCombatLogRows();
  }
}

function enterSetupPhase() {
  gamePhase = 'setup';
  setFormationScreenVisible(true);
  initializeArmyManagement();
  redFormation = [];
  blueFormation = [];
  selectedSetupUnitType = 'knight';
  renderSetupUi();
}

function createPlacement(team, row, col, isPlayerControlled, unitType = 'knight', unitName = null) {
  return {
    team,
    unitType,
    unitName,
    row,
    col,
    cost: getUnitCommandCost(unitType),
    isPlayerControlled
  };
}

function initializeArmyManagement() {
  if (armyRoster.length === 0) {
    armyRoster = createArmyTestRoster();
  }

  if (armySquads.length === 0) {
    armySquads = Array.from({ length: MAX_SQUADS }, (_, index) => ({
      id: `squad-${index + 1}`,
      name: `Squad ${index + 1}`,
      cells: createEmptySquadCells()
    }));
  }
}

function createEmptySquadCells() {
  return Array.from({ length: SQUAD_BOARD_ROWS }, () => (
    Array.from({ length: SQUAD_BOARD_COLS }, () => null)
  ));
}

function getAllFormationCells() {
  return FORMATION_ROWS.flatMap((row) => FORMATION_COLS.map((col) => ({ row, col })));
}

function regenerateBlueAiFormation() {
  const cells = getAllFormationCells();
  for (let index = cells.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cells[index], cells[randomIndex]] = [cells[randomIndex], cells[index]];
  }
  const aiUnitCount = Math.floor(SETUP_AI_DEFAULT_COMMAND_SPEND / getUnitCommandCost('knight'));
  blueFormation = cells
    .slice(0, aiUnitCount)
    .map((cell) => createPlacement('blue', cell.row, cell.col, false));
}

function getSetupPlacements(teamKey) {
  return teamKey === 'red' ? redFormation : blueFormation;
}

function getSetupPlacementAt(teamKey, row, col) {
  return getSetupPlacements(teamKey).find((placement) => placement.row === row && placement.col === col) || null;
}

function getSetupCommandUsed(teamKey) {
  return getSetupPlacements(teamKey).reduce((sum, placement) => sum + placement.cost, 0);
}

function getRedCommandMax() {
  return commandLevel;
}

function getBlueCommandMax() {
  return enemyCommandLevel;
}

function getSetupCommandMax(teamKey) {
  return teamKey === 'red' ? getRedCommandMax() : getBlueCommandMax();
}

function isSetupReady() {
  return getSelectedArmySquadUnits().length >= SETUP_MIN_UNITS_TO_START;
}

function clearSetupUi() {
  clearSetupCpTooltip();
  formationHoverTargets = [];
  dynamicTooltipDefinitions = {};
  formationTooltipPanelNodes = [];
  formationHoveredTooltipKey = null;
  setupNodes.forEach((node) => {
    if (node && node.scene) {
      node.destroy();
    }
  });
  setupNodes = [];
}

function addSetupNode(node) {
  setupNodes.push(node);
  return node;
}

function renderSetupUi() {
  clearSetupUi();
  renderArmyManagementScreen();
}

function renderArmyManagementScreen() {
  addSetupNode(sceneRef.add.rectangle(
    SETUP_PANEL_X,
    SETUP_PANEL_Y,
    SETUP_PANEL_WIDTH,
    SETUP_PANEL_HEIGHT,
    PHASER_COLORS.infoPanel
  )
    .setOrigin(0)
    .setAlpha(SETUP_PANEL_ALPHA)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder)
    .setDepth(SETUP_UI_DEPTH));

  addSetupNode(sceneRef.add.text(FORMATION_HEADER_X, FORMATION_HEADER_Y, 'Unit Formation', {
    ...headerTextStyle(),
    fontSize: '36px'
  }).setDepth(SETUP_UI_DEPTH + 1));
  renderCommandLevelControls();

  renderFormationSelectedUnitStatsPanel();
  renderFormationTooltipPanel();
  renderArmySquads();
  renderArmyRoster();

  createSetupButton(
    'Practice Combat',
    FORMATION_ACTION_BUTTON_X,
    FORMATION_ACTION_BUTTON_Y,
    FORMATION_ACTION_BUTTON_WIDTH,
    startBattle,
    isSetupReady()
  );
}

function renderArmySquads() {
  renderSquadPageControls();
  armySquads.forEach((squad, squadIndex) => {
    const position = getSquadCardPosition(squadIndex);
    if (isSquadCardVisible(position.x, position.y)) {
      renderArmySquadPanel(squad, squadIndex, position.x, position.y);
    }
  });
}

function renderSquadPageControls() {
  const maxScrollOffset = getMaxSquadScrollOffset();
  const thumbHeight = maxScrollOffset === 0
    ? SQUAD_SCROLLBAR_HEIGHT
    : SQUAD_SCROLLBAR_HEIGHT * (SQUAD_VISIBLE_ROWS / SQUAD_TOTAL_ROWS);
  const track = renderSetupScrollbar({
    x: SQUAD_SCROLLBAR_X,
    y: SQUAD_SCROLLBAR_Y,
    width: SQUAD_SCROLLBAR_WIDTH,
    height: SQUAD_SCROLLBAR_HEIGHT,
    thumbSize: thumbHeight,
    scroll: squadScrollOffset,
    maxScroll: maxScrollOffset,
    orientation: 'vertical'
  });

  track.on('pointerdown', (pointer) => {
    if (maxScrollOffset === 0) {
      return;
    }
    const localY = Math.max(0, Math.min(SQUAD_SCROLLBAR_HEIGHT, pointer.worldY - SQUAD_SCROLLBAR_Y));
    const rawOffset = (localY / SQUAD_SCROLLBAR_HEIGHT) * maxScrollOffset;
    setSquadScrollOffset(Math.round(rawOffset / SQUAD_ROW_STEP) * SQUAD_ROW_STEP);
    renderSetupUi();
  });
}

function renderFormationSelectedUnitStatsPanel() {
  const unit = getArmyRosterUnit(selectedArmyRosterUnitId);
  if (!unit) {
    return;
  }

  const rect = {
    x: FORMATION_LEFT_STATS_PANEL_X,
    y: FORMATION_LEFT_STATS_PANEL_Y,
    w: FORMATION_LEFT_STATS_PANEL_WIDTH,
    h: FORMATION_LEFT_STATS_PANEL_HEIGHT
  };
  const detailUnit = createFormationRosterStatsUnit(unit);
  const bg = addSetupNode(sceneRef.add.rectangle(rect.x, rect.y, rect.w, rect.h, PHASER_COLORS.infoPanel)
    .setOrigin(0)
    .setAlpha(POPUP_PANEL_BACKGROUND_ALPHA)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder)
    .setDepth(POPUP_DEPTH));
  addSetupNode(sceneRef.add.text(rect.x + POPUP_PANEL_PADDING, rect.y + 10, unit.name, headerTextStyle())
    .setDepth(POPUP_DEPTH + 1));
  addSetupNode(sceneRef.add.text(rect.x + POPUP_PANEL_PADDING, rect.y + 36, detailUnit.className, {
    ...smallTextStyle(),
    fontSize: '13px'
  }).setDepth(POPUP_DEPTH + 1));
  registerDynamicHoverTooltip(
    `selected-unit-header:${unit.id}`,
    { x: rect.x, y: rect.y, w: rect.w, h: 58 },
    getUnitTooltip(unit.name, unit.unitType, detailUnit.className)
  );
  const detailNodes = [];
  const savedNodes = infoPanelNodes;
  infoPanelNodes = detailNodes;
  renderCharacterPanel(
    detailUnit,
    rect.x + POPUP_STATS_PANEL_PADDING,
    rect.y + 72,
    rect.w - POPUP_STATS_PANEL_PADDING * 2,
    rect.h - 72 - POPUP_STATS_PANEL_PADDING,
    false
  );
  infoPanelNodes = savedNodes;
  detailNodes.forEach(addSetupNode);
  registerHoverTooltip('hp', {
    x: rect.x + POPUP_STATS_PANEL_PADDING + RESOURCE_ROW_LABEL_WIDTH,
    y: rect.y + 62,
    w: 96,
    h: 20
  });
}

function renderFormationTooltipPanel(tooltipKey = formationHoveredTooltipKey) {
  formationTooltipPanelNodes.forEach((node) => {
    if (node && node.scene) {
      node.destroy();
    }
  });
  formationTooltipPanelNodes = [];

  const tooltip = getTooltipDefinition(tooltipKey);
  const title = tooltip?.title || FORMATION_HOVER_TOOLTIP_DEFAULT_TITLE;
  const description = tooltip?.description || FORMATION_HOVER_TOOLTIP_DEFAULT_TEXT;
  const background = addSetupNode(sceneRef.add.rectangle(
    FORMATION_TOOLTIP_PANEL_X,
    FORMATION_TOOLTIP_PANEL_Y,
    FORMATION_TOOLTIP_PANEL_WIDTH,
    FORMATION_TOOLTIP_PANEL_HEIGHT,
    PHASER_COLORS.infoPanel
  )
    .setOrigin(0)
    .setAlpha(POPUP_PANEL_BACKGROUND_ALPHA)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder)
    .setDepth(POPUP_DEPTH));
  const titleNode = addSetupNode(sceneRef.add.text(
    FORMATION_TOOLTIP_PANEL_X + POPUP_PANEL_PADDING,
    FORMATION_TOOLTIP_PANEL_Y + 16,
    title,
    headerTextStyle()
  ).setDepth(POPUP_DEPTH + 1));
  const bodyNode = addSetupNode(sceneRef.add.text(
    FORMATION_TOOLTIP_PANEL_X + POPUP_PANEL_PADDING,
    FORMATION_TOOLTIP_PANEL_Y + 54,
    description,
    smallTextStyle()
  )
    .setWordWrapWidth(FORMATION_TOOLTIP_PANEL_WIDTH - POPUP_PANEL_PADDING * 2)
    .setDepth(POPUP_DEPTH + 1));
  formationTooltipPanelNodes.push(background, titleNode, bodyNode);
}

function getUnitTooltip(name, unitType, className) {
  const classDesc = CLASS_TOOLTIPS[unitType] || '';
  const quip = UNIT_QUIPS[name] || UNIT_QUIP_FALLBACK;
  return {
    title: `${name} the ${className}`,
    description: `${classDesc}\n\n${quip}`
  };
}

function getTooltipDefinition(key) {
  return FORMATION_TOOLTIP_DEFINITIONS[key] || dynamicTooltipDefinitions[key] || null;
}

function registerHoverTooltip(key, bounds) {
  if (!getTooltipDefinition(key)) {
    return;
  }
  formationHoverTargets.push({ key, ...bounds });
}

function registerDynamicHoverTooltip(key, bounds, definition) {
  dynamicTooltipDefinitions[key] = definition;
  formationHoverTargets.push({ key, ...bounds });
}

function getHoveredTooltip(x, y) {
  return formationHoverTargets.find((target) => (
    x >= target.x &&
    x <= target.x + target.w &&
    y >= target.y &&
    y <= target.y + target.h
  ))?.key || null;
}

function updateFormationHoverTooltip(pointer) {
  if (gamePhase !== 'setup') {
    return;
  }
  const key = getHoveredTooltip(pointer.worldX, pointer.worldY);
  if (key === formationHoveredTooltipKey) {
    return;
  }
  formationHoveredTooltipKey = key;
  renderFormationTooltipPanel(key);
}

function createFormationRosterStatsUnit(rosterUnit) {
  const classDefinition = getClassDefinition(rosterUnit.unitType);
  const classStats = calculateClassStats(rosterUnit.unitType);
  return {
    name: rosterUnit.name,
    class: rosterUnit.unitType,
    className: classDefinition.name,
    cpCost: classDefinition.cpCost,
    promoted: classDefinition.promoted,
    traits: [...(classDefinition.traits || [])],
    equipment: { ...(classDefinition.equipment || {}) },
    actions: calculateClassActions(rosterUnit.unitType),
    reactions: calculateClassReactions(rosterUnit.unitType),
    limits: calculateClassLimits(rosterUnit.unitType),
    teamKey: 'red',
    row: 'front',
    col: 0,
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
    maxIp: classStats.maxIp
  };
}

function renderCommandLevelControls() {
  addSetupNode(sceneRef.add.rectangle(
    COMMAND_LEVEL_BOX_X,
    COMMAND_LEVEL_BOX_Y,
    COMMAND_LEVEL_BOX_WIDTH,
    COMMAND_LEVEL_BOX_HEIGHT,
    PHASER_COLORS.panel
  )
    .setOrigin(0)
    .setAlpha(0.75)
    .setStrokeStyle(1, PHASER_COLORS.panelBorder)
    .setDepth(SETUP_UI_DEPTH + 1));
  createSetupButton('-', COMMAND_LEVEL_MINUS_BUTTON_X, COMMAND_LEVEL_BUTTON_Y, COMMAND_LEVEL_CONTROL_SIZE, () => changeCommandLevel(-1), commandLevel > COMMAND_LEVEL_MIN, null, COMMAND_LEVEL_CONTROL_SIZE);
  addSetupNode(sceneRef.add.text(
    COMMAND_LEVEL_TEXT_X,
    COMMAND_LEVEL_BOX_Y + 13,
    `Command Level ${commandLevel}`,
    headerTextStyle()
  ).setDepth(SETUP_UI_DEPTH + 1));
  addSetupNode(sceneRef.add.text(
    COMMAND_LEVEL_ICON_X,
    COMMAND_LEVEL_BOX_Y + 13,
    FORMATION_COMMAND_ICON,
    headerTextStyle()
  ).setOrigin(0.5, 0).setDepth(SETUP_UI_DEPTH + 1));
  createSetupButton('+', COMMAND_LEVEL_PLUS_BUTTON_X, COMMAND_LEVEL_BUTTON_Y, COMMAND_LEVEL_CONTROL_SIZE, () => changeCommandLevel(1), commandLevel < COMMAND_LEVEL_MAX, null, COMMAND_LEVEL_CONTROL_SIZE);
  registerHoverTooltip('commandLevel', {
    x: COMMAND_LEVEL_BOX_X,
    y: COMMAND_LEVEL_BOX_Y,
    w: COMMAND_LEVEL_BOX_WIDTH,
    h: COMMAND_LEVEL_BOX_HEIGHT
  });
}

function changeCommandLevel(delta) {
  commandLevel = Math.max(COMMAND_LEVEL_MIN, Math.min(COMMAND_LEVEL_MAX, commandLevel + delta));
  trimArmySquadsToCommandLevel();
  setSquadScrollOffset(squadScrollOffset);
  renderSetupUi();
}

function trimArmySquadsToCommandLevel() {
  armySquads.forEach((squad) => {
    let kept = 0;
    squad.cells = squad.cells.map((rowCells) => rowCells.map((unitId) => {
      if (!unitId) {
        return null;
      }
      kept += 1;
      return kept <= commandLevel ? unitId : null;
    }));
  });
}

function renderArmySquadPanel(squad, squadIndex, x, y) {
  const isSelected = selectedArmySquadIndex === squadIndex;
  const borderColor = cssHexToNumber(isSelected ? SQUAD_ACTIVE_BORDER_COLOR : SQUAD_INACTIVE_BORDER_COLOR);
  const assignedCount = getSquadAssignedCount(squad);
  const commandPoints = getSquadCommandPoints(squad);
  const panel = addSetupNode(sceneRef.add.rectangle(
    x,
    y,
    SQUAD_CARD_WIDTH,
    SQUAD_CARD_HEIGHT,
    PHASER_COLORS.panel
  )
    .setOrigin(0)
    .setStrokeStyle(isSelected ? 3 : 2, borderColor)
    .setInteractive({ useHandCursor: true })
    .setDepth(SETUP_UI_DEPTH + 1));
  panel.on('pointerdown', () => handleArmySquadPanelClick(squadIndex));

  const title = addSetupNode(sceneRef.add.text(x + 16, y + 14, squad.name, headerTextStyle())
    .setDepth(SETUP_UI_DEPTH + 2));
  const cp = addSetupNode(sceneRef.add.text(
    x + SQUAD_CARD_WIDTH - 16,
    y + 18,
    `${assignedCount}/${commandPoints}`,
    headerTextStyle()
  )
    .setOrigin(1, 0)
    .setDepth(SETUP_UI_DEPTH + 2));
  [title, cp].forEach((node) => node.setInteractive({ useHandCursor: true }).on('pointerdown', () => handleArmySquadPanelClick(squadIndex)));

  const boardPosition = getArmySquadBoardPosition(x, y);
  renderArmySquadBoard(squad, squadIndex, boardPosition.x, boardPosition.y);
}

function getArmySquadBoardPosition(cardX, cardY) {
  const bodyTop = cardY + SQUAD_CARD_HEADER_HEIGHT;
  const bodyHeight = SQUAD_CARD_HEIGHT - SQUAD_CARD_HEADER_HEIGHT - SQUAD_CARD_BODY_BOTTOM_PADDING;
  return {
    x: cardX + SQUAD_BOARD_X_OFFSET,
    y: bodyTop + (bodyHeight - SQUAD_BOARD_HEIGHT) / 2
  };
}

function getSquadCardPosition(squadIndex) {
  return {
    x: SQUAD_VIEWPORT_X + (squadIndex % SQUAD_VISIBLE_COLUMNS) * SQUAD_CARD_STEP,
    y: SQUAD_VIEWPORT_Y + Math.floor(squadIndex / SQUAD_VISIBLE_COLUMNS) * SQUAD_ROW_STEP - squadScrollOffset
  };
}

function isSquadCardVisible(x, y) {
  return x >= SQUAD_VIEWPORT_X &&
    x + SQUAD_CARD_WIDTH <= SQUAD_VIEWPORT_X + SQUAD_VIEWPORT_WIDTH &&
    y >= SQUAD_VIEWPORT_Y &&
    y + SQUAD_CARD_HEIGHT <= SQUAD_VIEWPORT_Y + SQUAD_VIEWPORT_HEIGHT;
}

function getMaxSquadScrollOffset() {
  const rowCount = Math.ceil(armySquads.length / SQUAD_VISIBLE_COLUMNS);
  return Math.max(0, rowCount - SQUAD_VISIBLE_ROWS) * SQUAD_ROW_STEP;
}

function setSquadScrollOffset(offset) {
  squadScrollOffset = Math.max(0, Math.min(getMaxSquadScrollOffset(), offset));
}

function changeSquadPage(delta) {
  if (gamePhase !== 'setup') {
    return;
  }

  setSquadScrollOffset(squadScrollOffset + delta * SQUAD_PAGE_SCROLL_DISTANCE);
  renderSetupUi();
}

function renderArmySquadBoard(squad, squadIndex, boardX, boardY) {
  for (let row = 0; row < SQUAD_BOARD_ROWS; row += 1) {
    for (let col = 0; col < SQUAD_BOARD_COLS; col += 1) {
      const x = boardX + col * (SQUAD_BOARD_CELL_WIDTH + SQUAD_BOARD_CELL_GAP);
      const y = boardY + row * (SQUAD_BOARD_CELL_HEIGHT + SQUAD_BOARD_CELL_GAP);
      const unitId = squad.cells[row][col];
      renderArmySquadCell(squadIndex, row, col, x, y, unitId);
    }
  }
}

function renderArmySquadCell(squadIndex, row, col, x, y, unitId) {
  const unit = getArmyRosterUnit(unitId);
  const isSelectedUnit = unitId && selectedArmyRosterUnitId === unitId;
  const slot = addSetupNode(sceneRef.add.rectangle(
    x,
    y,
    SQUAD_BOARD_CELL_WIDTH - 8,
    SQUAD_BOARD_CELL_HEIGHT - 8,
    unit ? cssHexToNumber(SQUAD_BOARD_OCCUPIED_COLOR) : PHASER_COLORS.infoPanel
  )
    .setOrigin(0)
    .setAlpha(unit ? SQUAD_BOARD_OCCUPIED_ALPHA : SQUAD_BOARD_EMPTY_ALPHA)
    .setStrokeStyle(isSelectedUnit ? 3 : 1, cssHexToNumber(isSelectedUnit ? SELECTED_CELL_HIGHLIGHT : COLORS.panelBorder))
    .setInteractive({ useHandCursor: true })
    .setDepth(SQUAD_CELL_SLOT_DEPTH));
  slot.on('pointerdown', (pointer) => handleArmyCellPointerDown(squadIndex, row, col, pointer));
  if (!unit) {
    registerHoverTooltip('squadSpot', { x, y, w: SQUAD_BOARD_CELL_WIDTH - 8, h: SQUAD_BOARD_CELL_HEIGHT - 8 });
  }

  const label = unit ? unit.name : '';
  const nameX = x + (SQUAD_BOARD_CELL_WIDTH - 8) / 2 + SQUAD_CELL_NAME_OFFSET_X;
  const nameY = y + SQUAD_CELL_NAME_OFFSET_Y;
  if (label) {
    addSetupNode(sceneRef.add.rectangle(nameX, nameY, 72, 14, 0x141414)
      .setOrigin(0.5, 0.5)
      .setAlpha(SQUAD_CELL_NAME_BACKING_ALPHA)
      .setDepth(SQUAD_CELL_NAME_DEPTH - 1));
  }
  const text = addSetupNode(sceneRef.add.text(nameX, nameY, label, smallTextStyle())
    .setOrigin(0.5, 0.5)
    .setDepth(SQUAD_CELL_NAME_DEPTH)
    .setInteractive({ useHandCursor: true }));
  text.on('pointerdown', (pointer) => handleArmyCellPointerDown(squadIndex, row, col, pointer));

  if (unit) {
    const sprite = addSetupNode(sceneRef.add.sprite(
      x + SQUAD_BOARD_CELL_WIDTH / 2,
      y + SQUAD_BOARD_CELL_HEIGHT / 2 + SQUAD_CELL_UNIT_ART_OFFSET_Y,
      getUnitIdleTextureKey(unit.unitType),
      getUnitIdleDefaultFrame(unit.unitType)
    )
      .setScale(SQUAD_CELL_UNIT_ART_SCALE)
      .setTint(cssHexToNumber(RED_TEAM_UNIT_TINT))
      .setDepth(SQUAD_CELL_SPRITE_DEPTH)
      .setInteractive({ useHandCursor: true }));
    sprite.on('pointerdown', (pointer) => handleArmyCellPointerDown(squadIndex, row, col, pointer));
    const cellClassDef = getClassDefinition(unit.unitType);
    registerDynamicHoverTooltip(
      `unit-squad:${unit.id}`,
      { x, y, w: SQUAD_BOARD_CELL_WIDTH - 8, h: SQUAD_BOARD_CELL_HEIGHT - 8 },
      getUnitTooltip(unit.name, unit.unitType, cellClassDef.name)
    );
  }
}

function renderArmyRoster() {
  clampAvailableUnitsScrollRow();
  addSetupNode(sceneRef.add.rectangle(
    ROSTER_PANEL_X,
    ROSTER_PANEL_Y,
    ROSTER_PANEL_WIDTH,
    ROSTER_PANEL_HEIGHT,
    PHASER_COLORS.infoPanel
  )
    .setOrigin(0)
    .setAlpha(SETUP_PANEL_ALPHA)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder)
    .setDepth(SETUP_UI_DEPTH + 1));

  addSetupNode(sceneRef.add.text(ROSTER_X, ROSTER_PANEL_Y + 10, 'Available Units', headerTextStyle())
    .setDepth(SETUP_UI_DEPTH + 2));

  const firstVisibleIndex = availableUnitsScrollRow * ROSTER_COLUMNS;
  const visibleSlotCount = ROSTER_COLUMNS * ROSTER_VISIBLE_ROWS;
  for (let visibleIndex = 0; visibleIndex < visibleSlotCount; visibleIndex += 1) {
    const index = firstVisibleIndex + visibleIndex;
    const unit = armyRoster[index] || null;
    const col = visibleIndex % ROSTER_COLUMNS;
    const row = Math.floor(visibleIndex / ROSTER_COLUMNS);
    const x = ROSTER_X + col * ROSTER_COLUMN_SPACING;
    const y = ROSTER_Y + row * ROSTER_ROW_SPACING;
    renderArmyRosterCard(unit, x, y);
  }

  renderArmyRosterScrollbar();
}

function renderArmyRosterScrollbar() {
  const totalRows = getArmyRosterRowCount();
  if (totalRows <= ROSTER_VISIBLE_ROWS) {
    return;
  }

  const maxScrollRow = getMaxAvailableUnitsScrollRow();
  const thumbHeight = Math.max(36, ROSTER_SCROLLBAR_HEIGHT * (ROSTER_VISIBLE_ROWS / totalRows));
  renderSetupScrollbar({
    x: ROSTER_SCROLLBAR_X,
    y: ROSTER_SCROLLBAR_Y,
    width: AVAILABLE_UNITS_SCROLLBAR_WIDTH,
    height: ROSTER_SCROLLBAR_HEIGHT,
    thumbSize: thumbHeight,
    scroll: availableUnitsScrollRow,
    maxScroll: maxScrollRow,
    orientation: 'vertical'
  });
}

function renderSetupScrollbar({ x, y, width, height, thumbSize, scroll, maxScroll, orientation }) {
  const track = addSetupNode(sceneRef.add.rectangle(x, y, width, height, PHASER_COLORS.panel)
    .setOrigin(0)
    .setAlpha(0.8)
    .setInteractive({ useHandCursor: true })
    .setDepth(SETUP_UI_DEPTH + 2));
  const trackLength = orientation === 'horizontal' ? width : height;
  const thumbTravel = trackLength - thumbSize;
  const thumbOffset = maxScroll === 0 ? 0 : thumbTravel * (scroll / maxScroll);
  const thumbX = orientation === 'horizontal' ? x + thumbOffset : x;
  const thumbY = orientation === 'horizontal' ? y : y + thumbOffset;
  const thumbWidth = orientation === 'horizontal' ? thumbSize : width;
  const thumbHeight = orientation === 'horizontal' ? height : thumbSize;
  addSetupNode(sceneRef.add.rectangle(
    thumbX,
    thumbY,
    thumbWidth,
    thumbHeight,
    cssHexToNumber(SELECTED_SQUAD_HIGHLIGHT)
  )
    .setOrigin(0)
    .setAlpha(0.9)
    .setDepth(SETUP_UI_DEPTH + 3));
  return track;
}

function getArmyRosterRowCount() {
  return Math.ceil(armyRoster.length / ROSTER_COLUMNS);
}

function getMaxAvailableUnitsScrollRow() {
  return Math.max(0, getArmyRosterRowCount() - ROSTER_VISIBLE_ROWS);
}

function clampAvailableUnitsScrollRow() {
  availableUnitsScrollRow = Math.max(0, Math.min(getMaxAvailableUnitsScrollRow(), availableUnitsScrollRow));
}

function changeAvailableUnitsScroll(delta) {
  const oldScrollRow = availableUnitsScrollRow;
  availableUnitsScrollRow += Math.sign(delta) * AVAILABLE_UNITS_SCROLL_SPEED;
  clampAvailableUnitsScrollRow();
  if (availableUnitsScrollRow !== oldScrollRow) {
    renderSetupUi();
  }
}

function renderArmyRosterCard(unit, x, y) {
  const isSelected = unit && selectedArmyRosterUnitId === unit.id;
  const assignment = unit ? getArmyUnitAssignment(unit.id) : null;
  const isAssigned = Boolean(assignment);
  const fill = unit
    ? cssHexToNumber(isAssigned ? ASSIGNED_CARD_FILL_COLOR : COLORS.panel)
    : PHASER_COLORS.infoPanel;
  const contentAlpha = isAssigned ? ASSIGNED_CARD_ALPHA : 1;
  const card = addSetupNode(sceneRef.add.rectangle(x, y, ROSTER_CARD_WIDTH, ROSTER_CARD_HEIGHT, fill)
    .setOrigin(0)
    .setAlpha(unit ? 1 : 0.25)
    .setStrokeStyle(isSelected ? 3 : 1, cssHexToNumber(isSelected ? SELECTED_UNIT_HIGHLIGHT : COLORS.panelBorder))
    .setDepth(SETUP_UI_DEPTH + 1));

  if (!unit) {
    addSetupNode(sceneRef.add.text(x + 16, y + 18, 'Empty', smallTextStyle())
      .setAlpha(0.45)
      .setDepth(SETUP_UI_DEPTH + 2));
    return;
  }

  card.setInteractive({ useHandCursor: true });
  card.on('pointerdown', (pointer) => handleArmyRosterCardPointerDown(unit.id, pointer));

  const classDefinition = getClassDefinition(unit.unitType);

  const name = addSetupNode(sceneRef.add.text(x + 14, y + 8, unit.name, {
    ...headerTextStyle(),
    fontSize: `${AVAILABLE_UNIT_NAME_FONT_SIZE}px`
  })
    .setAlpha(contentAlpha)
    .setDepth(SETUP_UI_DEPTH + 2)
    .setInteractive({ useHandCursor: true }));
  const className = addSetupNode(sceneRef.add.text(x + 14, y + 34, classDefinition.name, {
    ...smallTextStyle(),
    fontSize: `${AVAILABLE_UNIT_CLASS_FONT_SIZE}px`
  })
    .setAlpha(contentAlpha)
    .setDepth(SETUP_UI_DEPTH + 2)
    .setInteractive({ useHandCursor: true }));
  [name, className].forEach((node) => {
    node.on('pointerdown', (pointer) => handleArmyRosterCardPointerDown(unit.id, pointer));
  });

  const sprite = addSetupNode(sceneRef.add.sprite(
    x + ROSTER_CARD_WIDTH / 2,
    y + AVAILABLE_UNIT_ART_CENTER_Y_OFFSET,
    getUnitIdleTextureKey(unit.unitType),
    getUnitIdleDefaultFrame(unit.unitType)
  )
    .setScale(AVAILABLE_UNIT_ART_SCALE)
    .setAlpha(contentAlpha)
    .setDepth(SETUP_UI_DEPTH + 2)
    .setInteractive({ useHandCursor: true }));
  sprite.on('pointerdown', (pointer) => handleArmyRosterCardPointerDown(unit.id, pointer));

  if (isAssigned) {
    const check = addSetupNode(sceneRef.add.text(x + ROSTER_CARD_WIDTH - 28, y + 12, '✓', headerTextStyle())
      .setOrigin(0.5, 0)
      .setAlpha(contentAlpha)
      .setDepth(SETUP_UI_DEPTH + 2)
      .setInteractive({ useHandCursor: true }));
    check.on('pointerdown', (pointer) => handleArmyRosterCardPointerDown(unit.id, pointer));
  }

  renderArmyRosterStats(unit.unitType, x, ROSTER_CARD_WIDTH, y + AVAILABLE_UNIT_STATS_Y_OFFSET, contentAlpha, SETUP_UI_DEPTH + 2);
  registerDynamicHoverTooltip(
    `unit-card:${unit.id}`,
    { x, y, w: ROSTER_CARD_WIDTH, h: ROSTER_CARD_HEIGHT },
    getUnitTooltip(unit.name, unit.unitType, classDefinition.name)
  );
}

function renderArmyRosterStats(unitType, cardX, cardWidth, y, alpha = 1, depth = SETUP_UI_DEPTH + 2) {
  const stats = calculateClassStats(unitType);
  const pairs = [
    ['HP', 'hp', stats.maxHp],
    ['SP', 'sp', stats.maxSp],
    ['AP', 'ap', stats.maxAp],
    ['RP', 'rp', stats.maxRp]
  ];

  const blockWidth = AVAILABLE_UNIT_STATS_GROUP_RESERVED_WIDTH * 2 + AVAILABLE_UNIT_STATS_GROUP_GAP;
  const startX = cardX + cardWidth / 2 - blockWidth / 2;
  const colStep = AVAILABLE_UNIT_STATS_GROUP_RESERVED_WIDTH + AVAILABLE_UNIT_STATS_GROUP_GAP;

  pairs.forEach(([label, resourceKey, max], index) => {
    const rowX = startX + (index % 2) * colStep;
    const rowY = y + Math.floor(index / 2) * AVAILABLE_UNIT_STATS_ROW_GAP;
    addSetupNode(sceneRef.add.text(rowX, rowY, RESOURCE_ICONS[resourceKey].repeat(max), {
      fontFamily: UI_FONT_FAMILY,
      fontSize: `${AVAILABLE_UNIT_STATS_FONT_SIZE}px`,
      resolution: getUiTextResolution(),
      color: getResourceIconColor(resourceKey)
    })
      .setAlpha(alpha)
      .setDepth(depth));
    registerHoverTooltip(resourceKey, {
      x: rowX,
      y: rowY - 8,
      w: Math.max(AVAILABLE_UNIT_STATS_ICON_SPACING, max * AVAILABLE_UNIT_STATS_ICON_SPACING),
      h: 18
    });
  });
}

function handleArmyRosterCardPointerDown(unitId, pointer) {
  if (pointer.rightButtonDown()) {
    if (clearSelectedFormationUnitIfMatched(unitId)) {
      return;
    }
    removeArmyRosterUnitAssignment(unitId);
    return;
  }

  if (pointer.leftButtonDown()) {
    if (isArmyRosterDoubleClick(unitId, pointer)) {
      draggedArmyRosterUnitId = null;
      clearArmyRosterDragGhost();
      quickAssignArmyRosterUnit(unitId);
      return;
    }
    beginArmyRosterDrag(unitId, pointer);
  }
}

function clearSelectedFormationUnitIfMatched(unitId) {
  if (selectedArmyRosterUnitId !== unitId) {
    return false;
  }

  selectedArmyRosterUnitId = null;
  armyDragSource = null;
  draggedArmyRosterUnitId = null;
  clearArmyRosterDragGhost();
  renderSetupUi();
  return true;
}

function isArmyRosterDoubleClick(unitId, pointer) {
  const now = pointer.event?.timeStamp ?? Date.now();
  const isDoubleClick = lastArmyRosterClick.unitId === unitId &&
    now - lastArmyRosterClick.time <= DOUBLE_CLICK_MS;
  lastArmyRosterClick = { unitId, time: now };
  return isDoubleClick;
}

function quickAssignArmyRosterUnit(unitId) {
  selectedArmyRosterUnitId = unitId;
  const squad = armySquads[selectedArmySquadIndex];
  const currentAssignment = getArmyUnitAssignment(unitId);
  if (!squad || currentAssignment?.squadIndex === selectedArmySquadIndex) {
    renderSetupUi();
    return;
  }

  if (getSquadAssignedCount(squad) >= getSquadCommandPoints(squad)) {
    renderSetupUi();
    return;
  }

  for (let row = 0; row < SQUAD_BOARD_ROWS; row += 1) {
    for (let col = 0; col < SQUAD_BOARD_COLS; col += 1) {
      if (!squad.cells[row][col]) {
        placeSelectedArmyUnitInCell(selectedArmySquadIndex, row, col);
        renderSetupUi();
        return;
      }
    }
  }

  renderSetupUi();
}

function removeArmyRosterUnitAssignment(unitId) {
  const assignment = getArmyUnitAssignment(unitId);
  if (!assignment) {
    return;
  }

  armySquads[assignment.squadIndex].cells[assignment.row][assignment.col] = null;
  renderSetupUi();
}

function selectArmyRosterUnit(unitId) {
  selectedArmyRosterUnitId = unitId;
  renderSetupUi();
}

function beginArmyRosterDrag(unitId, pointer) {
  selectedArmyRosterUnitId = unitId;
  draggedArmyRosterUnitId = unitId;
  armyDragSource = {
    sourceType: 'available',
    unitId
  };
  clearArmyRosterDragGhost();
  createArmyDragGhost(unitId, pointer);
}

function handleArmyRosterDragMove(pointer) {
  updateFormationHoverTooltip(pointer);
  if (!armyDragSource) {
    return;
  }

  if (!draggedArmyRosterGhost && armyDragSource.sourceType === 'squad') {
    const dx = pointer.worldX - armyDragSource.startX;
    const dy = pointer.worldY - armyDragSource.startY;
    if (Math.hypot(dx, dy) < SQUAD_UNIT_DRAG_THRESHOLD) {
      return;
    }
    draggedArmyRosterUnitId = armyDragSource.unitId;
    createArmyDragGhost(armyDragSource.unitId, pointer);
  }

  if (!draggedArmyRosterGhost) {
    return;
  }
  draggedArmyRosterGhost.forEach(({ node, offsetX, offsetY }) => {
    node.setPosition(pointer.worldX + offsetX, pointer.worldY + offsetY);
  });
}

function handleArmyRosterDragEnd(pointer) {
  if (!armyDragSource) {
    return;
  }

  const dragSource = armyDragSource;
  const cell = getVisibleArmyCellAt(pointer.worldX, pointer.worldY);
  selectedArmyRosterUnitId = dragSource.unitId;
  armyDragSource = null;
  draggedArmyRosterUnitId = null;
  clearArmyRosterDragGhost();

  if (dragSource.sourceType === 'squad' && !cell) {
    renderSetupUi();
    return;
  }

  if (cell) {
    resolveArmyUnitDrop(dragSource, cell);
  }

  renderSetupUi();
}

function createArmyDragGhost(unitId, pointer) {
  const unit = getArmyRosterUnit(unitId);
  const bg = sceneRef.add.rectangle(pointer.worldX, pointer.worldY, ARMY_DRAG_GHOST_SIZE, ARMY_DRAG_GHOST_SIZE, cssHexToNumber(SQUAD_BOARD_OCCUPIED_COLOR))
    .setOrigin(0.5)
    .setAlpha(ARMY_DRAG_GHOST_ALPHA)
    .setStrokeStyle(2, cssHexToNumber(SELECTED_CELL_HIGHLIGHT))
    .setDepth(SETUP_UI_DEPTH + 30);
  const nameText = sceneRef.add.text(pointer.worldX, pointer.worldY + ARMY_DRAG_GHOST_NAME_OFFSET_Y, unit?.name || '', smallTextStyle())
    .setOrigin(0.5, 0.5)
    .setDepth(SETUP_UI_DEPTH + 32);
  const nodes = [
    { node: bg, offsetX: 0, offsetY: 0 },
    { node: nameText, offsetX: 0, offsetY: ARMY_DRAG_GHOST_NAME_OFFSET_Y }
  ];
  if (unit) {
    const sprite = sceneRef.add.sprite(
      pointer.worldX,
      pointer.worldY + ARMY_DRAG_GHOST_SPRITE_OFFSET_Y,
      getUnitIdleTextureKey(unit.unitType),
      getUnitIdleDefaultFrame(unit.unitType)
    )
      .setScale(ARMY_DRAG_GHOST_SPRITE_SCALE)
      .setTint(cssHexToNumber(RED_TEAM_UNIT_TINT))
      .setDepth(SETUP_UI_DEPTH + 31);
    nodes.push({ node: sprite, offsetX: 0, offsetY: ARMY_DRAG_GHOST_SPRITE_OFFSET_Y });
  }
  draggedArmyRosterGhost = nodes;
}

function clearArmyRosterDragGhost() {
  (draggedArmyRosterGhost || []).forEach(({ node }) => {
    if (node && node.scene) {
      node.destroy();
    }
  });
  draggedArmyRosterGhost = null;
}

function resolveArmyUnitDrop(dragSource, targetCell) {
  if (dragSource.sourceType === 'squad' &&
      dragSource.sourceSquadIndex === targetCell.squadIndex) {
    moveUnitWithinSquad(
      dragSource.sourceSquadIndex,
      dragSource.sourceRow,
      dragSource.sourceCol,
      targetCell.row,
      targetCell.col
    );
    return;
  }

  placeSelectedArmyUnitInCell(targetCell.squadIndex, targetCell.row, targetCell.col);
}

function moveUnitWithinSquad(squadIndex, sourceRow, sourceCol, targetRow, targetCol) {
  if (sourceRow === targetRow && sourceCol === targetCol) {
    return;
  }

  const squad = armySquads[squadIndex];
  const sourceUnitId = squad.cells[sourceRow][sourceCol];
  const targetUnitId = squad.cells[targetRow][targetCol];
  squad.cells[targetRow][targetCol] = sourceUnitId;
  squad.cells[sourceRow][sourceCol] = targetUnitId;
}

function handleSetupSquadWheel(pointer, over, dx, dy) {
  if (gamePhase !== 'setup') {
    return;
  }

  const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
  if (delta === 0) {
    return;
  }

  if (isPointerInsideAvailableUnitsViewport(pointer.worldX, pointer.worldY)) {
    changeAvailableUnitsScroll(delta);
    return;
  }

  if (!isPointerInsideSquadViewport(pointer.worldX, pointer.worldY)) {
    return;
  }

  if (delta !== 0) {
    setSquadScrollOffset(squadScrollOffset + Math.sign(delta) * SQUAD_ROW_STEP);
    renderSetupUi();
  }
}

function isPointerInsideAvailableUnitsViewport(x, y) {
  return x >= ROSTER_PANEL_X &&
    x <= ROSTER_PANEL_X + ROSTER_PANEL_WIDTH &&
    y >= ROSTER_Y &&
    y <= ROSTER_Y + ROSTER_VISIBLE_HEIGHT;
}

function isPointerInsideSquadViewport(x, y) {
  return x >= SQUAD_VIEWPORT_X &&
    x <= SQUAD_VIEWPORT_X + SQUAD_VIEWPORT_WIDTH &&
    y >= SQUAD_VIEWPORT_Y &&
    y <= SQUAD_VIEWPORT_Y + SQUAD_VIEWPORT_HEIGHT;
}

function getVisibleArmyCellAt(x, y) {
  for (let squadIndex = 0; squadIndex < armySquads.length; squadIndex += 1) {
    const cardPosition = getSquadCardPosition(squadIndex);
    if (!isSquadCardVisible(cardPosition.x, cardPosition.y)) {
      continue;
    }

    const boardPosition = getArmySquadBoardPosition(cardPosition.x, cardPosition.y);
    const boardX = boardPosition.x;
    const boardY = boardPosition.y;
    for (let row = 0; row < SQUAD_BOARD_ROWS; row += 1) {
      for (let col = 0; col < SQUAD_BOARD_COLS; col += 1) {
        const cellX = boardX + col * (SQUAD_BOARD_CELL_WIDTH + SQUAD_BOARD_CELL_GAP);
        const cellY = boardY + row * (SQUAD_BOARD_CELL_HEIGHT + SQUAD_BOARD_CELL_GAP);
        if (x >= cellX &&
            x <= cellX + SQUAD_BOARD_CELL_WIDTH - 8 &&
            y >= cellY &&
            y <= cellY + SQUAD_BOARD_CELL_HEIGHT - 8) {
          return { squadIndex, row, col };
        }
      }
    }
  }
  return null;
}

function selectArmySquad(squadIndex) {
  selectedArmySquadIndex = squadIndex;
  renderSetupUi();
}

function handleArmySquadPanelClick(squadIndex) {
  selectArmySquad(squadIndex);
}

function handleArmyCellPointerDown(squadIndex, row, col, pointer) {
  if (pointer.rightButtonDown()) {
    const unitId = armySquads[squadIndex].cells[row][col];
    if (unitId && clearSelectedFormationUnitIfMatched(unitId)) {
      return;
    }
    removeArmyUnitFromCell(squadIndex, row, col);
    return;
  }

  if (pointer.leftButtonDown()) {
    const unitId = armySquads[squadIndex].cells[row][col];
    if (unitId) {
      beginArmySquadCellDrag(squadIndex, row, col, unitId, pointer);
      return;
    }
    handleArmyCellClick(squadIndex, row, col);
  }
}

function beginArmySquadCellDrag(squadIndex, row, col, unitId, pointer) {
  selectedArmySquadIndex = squadIndex;
  selectedArmyRosterUnitId = unitId;
  draggedArmyRosterUnitId = null;
  armyDragSource = {
    sourceType: 'squad',
    sourceSquadIndex: squadIndex,
    sourceRow: row,
    sourceCol: col,
    unitId,
    startX: pointer.worldX,
    startY: pointer.worldY
  };
  clearArmyRosterDragGhost();
}

function handleArmyCellClick(squadIndex, row, col) {
  selectedArmySquadIndex = squadIndex;
  const squad = armySquads[squadIndex];
  const targetUnitId = squad.cells[row][col];

  if (targetUnitId) {
    selectedArmyRosterUnitId = targetUnitId;
    renderSetupUi();
    return;
  }

  if (!selectedArmyRosterUnitId) {
    renderSetupUi();
    return;
  }

  placeSelectedArmyUnitInCell(squadIndex, row, col);
  renderSetupUi();
}

function removeArmyUnitFromCell(squadIndex, row, col) {
  const squad = armySquads[squadIndex];
  if (!squad.cells[row][col]) {
    return;
  }

  squad.cells[row][col] = null;
  renderSetupUi();
}

function placeSelectedArmyUnitInCell(squadIndex, row, col) {
  const squad = armySquads[squadIndex];
  const currentAssignment = getArmyUnitAssignment(selectedArmyRosterUnitId);
  const targetUnitId = squad.cells[row][col];

  if (!targetUnitId &&
      currentAssignment?.squadIndex !== squadIndex &&
      getSquadAssignedCount(squad) >= getSquadCommandPoints(squad)) {
    return;
  }

  if (targetUnitId && currentAssignment) {
    armySquads[currentAssignment.squadIndex].cells[currentAssignment.row][currentAssignment.col] = targetUnitId;
  } else if (targetUnitId) {
    removeUnitFromArmySquads(targetUnitId);
  } else if (currentAssignment) {
    armySquads[currentAssignment.squadIndex].cells[currentAssignment.row][currentAssignment.col] = null;
  }

  squad.cells[row][col] = selectedArmyRosterUnitId;
}

function getSquadCommandPoints(squad) {
  return commandLevel;
}

function getSquadAssignedCount(squad) {
  return squad.cells.flat().filter(Boolean).length;
}

function getSquadAssignedCells(squad) {
  const assigned = [];
  squad.cells.forEach((rowCells, row) => {
    rowCells.forEach((unitId, col) => {
      if (unitId) {
        assigned.push({ unitId, row, col });
      }
    });
  });
  return assigned;
}

function getCombatCellForSquadBoardCell(boardRow, boardCol) {
  return {
    row: FORMATION_ROW_ORDER_RED[boardCol] || 'middle',
    col: FORMATION_COLS[boardRow] ?? 1
  };
}

function removeUnitFromArmySquads(unitId) {
  armySquads.forEach((squad) => {
    squad.cells = squad.cells.map((rowCells) => rowCells.map((existingUnitId) => (
      existingUnitId === unitId ? null : existingUnitId
    )));
  });
}

function getArmyRosterUnit(unitId) {
  return armyRoster.find((unit) => unit.id === unitId) || null;
}

function getArmyUnitAssignment(unitId) {
  for (let squadIndex = 0; squadIndex < armySquads.length; squadIndex += 1) {
    const squad = armySquads[squadIndex];
    for (let row = 0; row < squad.cells.length; row += 1) {
      const col = squad.cells[row].indexOf(unitId);
      if (col >= 0) {
        return { squadIndex, row, col };
      }
    }
  }

  return null;
}

function getSelectedArmySquadUnits() {
  const squad = armySquads[selectedArmySquadIndex];
  if (!squad) {
    return [];
  }

  return getSquadAssignedCells(squad)
    .map((cell) => ({
      ...getArmyRosterUnit(cell.unitId),
      formationRow: cell.row,
      formationCol: cell.col
    }))
    .filter((unit) => unit.id);
}

function buildPracticeCombatFormations() {
  redFormation = getSelectedArmySquadUnits().map((unit) => {
    const combatCell = getCombatCellForSquadBoardCell(unit.formationRow, unit.formationCol);
    return createPlacement(
      'red',
      combatCell.row,
      combatCell.col,
      true,
      unit.unitType,
      unit.name
    );
  });

  blueFormation = createRandomPracticeEnemyFormation();
}

function createRandomPracticeEnemyFormation() {
  return Array.from({ length: PRACTICE_ENEMY_COUNT }, (_, index) => {
    const unitType = PRACTICE_ENEMY_ALLOWED_CLASSES[
      Math.floor(Math.random() * PRACTICE_ENEMY_ALLOWED_CLASSES.length)
    ];
    const position = PRACTICE_ENEMY_FORMATION_SLOTS[index % PRACTICE_ENEMY_FORMATION_SLOTS.length];
    return createPlacement('blue', position.row, position.col, false, unitType);
  });
}

function renderSetupPanel() {
  renderArmyManagementScreen();
}

function createSetupButton(label, x, y, width, onClick, isActive = true, fillAlpha = null, height = SETUP_BUTTON_HEIGHT) {
  const fill = isActive ? PHASER_COLORS.sp : PHASER_COLORS.panel;
  const button = addSetupNode(sceneRef.add.rectangle(x, y, width, height, fill)
    .setOrigin(0)
    .setAlpha(fillAlpha ?? (isActive ? 0.85 : 0.45))
    .setStrokeStyle(1, PHASER_COLORS.panelBorder)
    .setInteractive({ useHandCursor: true })
    .setDepth(SETUP_UI_DEPTH + 1));
  const isCompact = width <= COMMAND_LEVEL_CONTROL_SIZE || label.length === 1;
  const text = addSetupNode(sceneRef.add.text(
    isCompact ? x + width / 2 : x + 12,
    isCompact ? y + height / 2 : y + 9,
    label,
    combatLogToggleTextStyle()
  )
    .setOrigin(isCompact ? 0.5 : 0, isCompact ? 0.5 : 0)
    .setInteractive({ useHandCursor: true })
    .setAlpha(isActive ? 1 : 0.55)
    .setDepth(SETUP_UI_DEPTH + 2));

  button.on('pointerdown', onClick);
  text.on('pointerdown', onClick);
}

function renderUnitsPanel() {
  addSetupNode(sceneRef.add.text(
    SETUP_UNITS_PANEL_X + SETUP_UNITS_TITLE_X_OFFSET,
    SETUP_UNITS_PANEL_Y + SETUP_UNITS_TITLE_Y_OFFSET,
    'Place your units',
    headerTextStyle()
  )
    .setDepth(SETUP_UI_DEPTH + 1));

  renderSetupUnitCardRow(getSetupUnitTypesByPromotion(false), SETUP_UNITS_CARD_Y_OFFSET);
  renderSetupUnitCardRow(getSetupUnitTypesByPromotion(true), SETUP_PROMOTED_UNITS_CARD_Y_OFFSET);
}

function getSetupUnitTypesByPromotion(isPromoted) {
  return SETUP_UNIT_TYPES.filter((unitType) => getClassDefinition(unitType).promoted === isPromoted);
}

function renderSetupUnitCardRow(unitTypes, cardYOffset) {
  unitTypes.forEach((unitType, index) => {
    const cardX = SETUP_UNITS_PANEL_X + SETUP_UNITS_CARD_X_OFFSET + index * (SETUP_KNIGHT_CARD_WIDTH + SETUP_UNIT_CARD_GAP);
    renderSetupUnitCard(unitType, cardX, SETUP_UNITS_PANEL_Y + cardYOffset);
  });
}


function renderSetupGrid(teamKey) {
  const rect = getBattleGridRect(teamKey);
  const cellW = rect.w / FORMATION_ROWS.length;
  const cellH = rect.h / FORMATION_COLS.length;
  const rowOrder = teamKey === 'red' ? FORMATION_ROW_ORDER_RED : FORMATION_ROW_ORDER_BLUE;
  const isEditableGrid = true;

  FORMATION_ROWS.forEach((row) => {
    FORMATION_COLS.forEach((col) => {
      const rowIndex = rowOrder.indexOf(row);
      const x = rect.x + rowIndex * cellW + cellW / 2;
      const y = rect.y + col * cellH + cellH / 2;
      const placement = getSetupPlacementAt(teamKey, row, col);
      const cell = addSetupNode(sceneRef.add.rectangle(x, y, cellW - 10, cellH - 10, PHASER_COLORS.infoPanel)
        .setAlpha(placement ? SETUP_CELL_ALPHA_OCCUPIED : (isEditableGrid ? SETUP_CELL_ALPHA_PLAYER : SETUP_CELL_ALPHA_AI))
        .setStrokeStyle(2, cssHexToNumber(isEditableGrid ? SETUP_CELL_STROKE_PLAYER : SETUP_CELL_STROKE_AI))
        .setInteractive({ useHandCursor: isEditableGrid })
        .setDepth(SETUP_UI_DEPTH - 3));
      cell.on('pointerdown', (pointer) => handleSetupPointerDown(teamKey, row, col, pointer));
      cell.on('pointerover', (pointer) => updateSetupCpTooltip(teamKey, row, col, pointer));
      cell.on('pointermove', (pointer) => updateSetupCpTooltip(teamKey, row, col, pointer));
      cell.on('pointerout', clearSetupCpTooltip);

      if (placement) {
        renderSetupPlacementPreview(placement);
      }
    });
  });
}

function getUnitIdleTextureKey(unitType) {
  return CHARACTER_CLASSES[unitType].visual.idle.textureKey;
}

function getUnitIdleDefaultFrame(unitType) {
  return CHARACTER_CLASSES[unitType].visual.idle.defaultFrame;
}

function getUnitIdleScale(unitType) {
  return CHARACTER_CLASSES[unitType].visual.idle.scale;
}

function getUnitSpriteOffset(unitType) {
  const idleVisual = CHARACTER_CLASSES[unitType].visual.idle;
  return {
    x: idleVisual.spriteOffsetX || 0,
    y: idleVisual.spriteOffsetY || 0
  };
}

function getUnitBaseSpriteX(teamKey, cellX) {
  return cellX + (teamKey === 'red' ? UNIT_SPRITE_FORWARD_X_OFFSET : -UNIT_SPRITE_FORWARD_X_OFFSET);
}

function getUnitSpritePosition(unitType, teamKey, cellX, baseY) {
  const offset = getUnitSpriteOffset(unitType);
  const facingSign = teamKey === 'blue' ? -1 : 1;

  return {
    x: getUnitBaseSpriteX(teamKey, cellX) + offset.x * facingSign,
    y: baseY + offset.y
  };
}

function drawResourceRow(x, y, label, resourceKey, current, max, depth, addNode, labelFontSize = RESOURCE_ROW_LABEL_FONT_SIZE) {
  const labelNode = sceneRef.add.text(x, y, `${label}:`, {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${labelFontSize}px`,
    resolution: getUiTextResolution(),
    color: COLORS.text
  }).setPadding(0, RESOURCE_ROW_LABEL_TEXT_PADDING_Y).setOrigin(0, 0.5).setDepth(depth);
  addNode(labelNode);

  const iconX = x + RESOURCE_ROW_LABEL_WIDTH;
  if (max <= 0) {
    const noneNode = sceneRef.add.text(iconX, y, '0', {
      fontFamily: UI_FONT_FAMILY,
      fontSize: `${RESOURCE_ROW_ICON_FONT_SIZE}px`,
      resolution: getUiTextResolution(),
      color: getResourceIconColor(resourceKey)
    }).setPadding(0, RESOURCE_ROW_ICON_TEXT_PADDING_Y).setOrigin(0, 0.5).setAlpha(RESOURCE_ROW_EMPTY_ALPHA).setDepth(depth);
    addNode(noneNode);
    return;
  }

  for (let i = 0; i < max; i++) {
    const iconNode = sceneRef.add.text(iconX + i * RESOURCE_ROW_ICON_SPACING, y, RESOURCE_ICONS[resourceKey], {
      fontFamily: UI_FONT_FAMILY,
      fontSize: `${RESOURCE_ROW_ICON_FONT_SIZE}px`,
      resolution: getUiTextResolution(),
      color: getResourceIconColor(resourceKey)
    }).setPadding(0, RESOURCE_ROW_ICON_TEXT_PADDING_Y).setOrigin(0, 0.5).setAlpha(i < current ? 1 : RESOURCE_ROW_EMPTY_ALPHA).setDepth(depth);
    addNode(iconNode);
  }
}

function renderSetupUnitStatsPreview(unitType, x, y) {
  const stats = calculateClassStats(unitType);
  const pairs = [
    [['HP', 'hp', stats.maxHp], ['SP', 'sp', stats.maxSp]],
    [['AP', 'ap', stats.maxAp], ['RP', 'rp', stats.maxRp]],
    [['LP', 'lp', stats.lp], ['IP', 'ip', stats.maxIp]]
  ];
  const rightColumnX = x + RESOURCE_ROW_PAIR_GAP;
  const depth = SETUP_UI_DEPTH + 2;

  pairs.forEach(([left, right], index) => {
    const rowY = y + index * RESOURCE_ROW_GAP;
    drawResourceRow(x, rowY, left[0], left[1], left[2], left[2], depth, addSetupNode);
    drawResourceRow(rightColumnX, rowY, right[0], right[1], right[2], right[2], depth, addSetupNode);
  });

  const classActions = calculateClassActions(unitType);
  const mv = getEffectiveMoveDistance(getClassDefinition(unitType));
  const rn = Object.values(classActions)
    .filter((a) => a.key !== 'move' && Number.isFinite(a.range))
    .reduce((max, a) => Math.max(max, a.range), 0);
  const row4Y = y + pairs.length * RESOURCE_ROW_GAP;
  drawResourceRow(x, row4Y, 'MV', 'mv', mv, mv, depth, addSetupNode);
  drawResourceRow(rightColumnX, row4Y, 'RN', 'rn', rn, rn, depth, addSetupNode);
}

function renderSetupUnitCard(unitType, x, y) {
  const classDefinition = getClassDefinition(unitType);
  const isSelected = selectedSetupUnitType === unitType;
  const borderColor = isSelected ? PHASER_COLORS.sp : PHASER_COLORS.panelBorder;
  const borderWidth = isSelected ? 3 : 2;
  const card = addSetupNode(sceneRef.add.rectangle(x, y, SETUP_KNIGHT_CARD_WIDTH, SETUP_KNIGHT_CARD_HEIGHT, PHASER_COLORS.panel)
    .setOrigin(0)
    .setStrokeStyle(borderWidth, borderColor)
    .setInteractive({ useHandCursor: true })
    .setDepth(SETUP_UI_DEPTH + 1));
  addSetupNode(sceneRef.add.text(
    x + SETUP_KNIGHT_CARD_TITLE_X_OFFSET,
    y + SETUP_KNIGHT_CARD_TITLE_Y_OFFSET,
    classDefinition.name,
    headerTextStyle()
  ).setDepth(SETUP_UI_DEPTH + 2));
  addSetupNode(sceneRef.add.text(
    x + SETUP_KNIGHT_CARD_WIDTH - SETUP_KNIGHT_CARD_TITLE_X_OFFSET,
    y + SETUP_KNIGHT_CARD_TITLE_Y_OFFSET,
    `${SETUP_COMMAND_ICON}${getUnitCommandCost(unitType)}`,
    headerTextStyle()
  ).setOrigin(1, 0).setDepth(SETUP_UI_DEPTH + 2));
  renderSetupUnitStatsPreview(unitType, x + SETUP_KNIGHT_PREVIEW_X_OFFSET, y + SETUP_KNIGHT_PREVIEW_Y_OFFSET);
  card.on('pointerdown', () => {
    selectedSetupUnitType = unitType;
    renderSetupUi();
  });
}

function canShowSetupCpTooltip(teamKey, row, col) {
  return gamePhase === 'setup' &&
    teamKey === 'red' &&
    selectedSetupUnitType &&
    !getSetupPlacementAt(teamKey, row, col) &&
    getSetupCommandUsed(teamKey) + getUnitCommandCost(selectedSetupUnitType) <= getSetupCommandMax(teamKey);
}

function updateSetupCpTooltip(teamKey, row, col, pointer) {
  if (!canShowSetupCpTooltip(teamKey, row, col)) {
    clearSetupCpTooltip();
    return;
  }

  const classDefinition = getClassDefinition(selectedSetupUnitType);
  const unitCost = getUnitCommandCost(selectedSetupUnitType);
  const commandMax = getSetupCommandMax(teamKey);
  const availableCommand = commandMax - getSetupCommandUsed(teamKey);
  const x = Math.min(
    pointer.worldX + SETUP_CP_TOOLTIP_OFFSET_X,
    GAME_WIDTH - SETUP_CP_TOOLTIP_WIDTH - SETUP_CP_TOOLTIP_PADDING
  );
  const y = Math.min(
    pointer.worldY + SETUP_CP_TOOLTIP_OFFSET_Y,
    GAME_HEIGHT - SETUP_CP_TOOLTIP_HEIGHT - SETUP_CP_TOOLTIP_PADDING
  );

  clearSetupCpTooltip();
  const background = sceneRef.add.rectangle(
    x,
    y,
    SETUP_CP_TOOLTIP_WIDTH,
    SETUP_CP_TOOLTIP_HEIGHT,
    PHASER_COLORS.infoPanel
  )
    .setOrigin(0)
    .setAlpha(0.94)
    .setStrokeStyle(1, PHASER_COLORS.panelBorder)
    .setDepth(SETUP_UI_DEPTH + 20);
  const text = sceneRef.add.text(
    x + SETUP_CP_TOOLTIP_PADDING,
    y + SETUP_CP_TOOLTIP_PADDING,
    `${classDefinition.name}\nCost: ${SETUP_COMMAND_ICON} ${unitCost}\nAvailable: ${SETUP_COMMAND_ICON} ${availableCommand}/${commandMax}`,
    smallTextStyle()
  )
    .setDepth(SETUP_UI_DEPTH + 21);
  setupTooltipNodes.push(background, text);
}

function clearSetupCpTooltip() {
  setupTooltipNodes.forEach((node) => {
    if (node && node.scene) {
      node.destroy();
    }
  });
  setupTooltipNodes = [];
}

function renderSetupPlacementPreview(placement) {
  const { x, baseY } = getFormationPosition(placement.team, placement.row, placement.col);
  const spritePosition = getUnitSpritePosition(placement.unitType, placement.team, x, baseY);
  const shadow = addSetupNode(sceneRef.add.ellipse(
    x,
    baseY + UNIT_SHADOW_Y_OFFSET,
    UNIT_SHADOW_WIDTH,
    UNIT_SHADOW_HEIGHT,
    cssHexToNumber(UNIT_SHADOW_COLOR)
  )
    .setAlpha(UNIT_SHADOW_ALPHA)
    .setDepth(SETUP_UI_DEPTH - 2));
  const sprite = addSetupNode(sceneRef.add.sprite(spritePosition.x, spritePosition.y, getUnitIdleTextureKey(placement.unitType), getUnitIdleDefaultFrame(placement.unitType))
    .setScale(getUnitIdleScale(placement.unitType))
    .setFlipX(placement.team === 'blue')
    .setAlpha(placement.isPlayerControlled ? SETUP_PREVIEW_ALPHA_PLAYER : SETUP_PREVIEW_ALPHA_AI)
    .setInteractive({ useHandCursor: true })
    .setDepth(SETUP_UI_DEPTH - 1));
  sprite.setTint(cssHexToNumber(placement.team === 'blue' ? BLUE_TEAM_UNIT_TINT : RED_TEAM_UNIT_TINT));
  sprite.on('pointerdown', (pointer) => handleSetupPointerDown(placement.team, placement.row, placement.col, pointer));
}

function handleSetupPointerDown(teamKey, row, col, pointer) {
  if (pointer.rightButtonDown()) {
    if (activePopupKey) {
      return;
    }

    if (selectedStatsUnits.red || selectedStatsUnits.blue) {
      clearAllStatsPanels();
      return;
    }

    if (speedMenuNodes.length > 0) {
      return;
    }

    handleSetupCellRightClick(teamKey, row, col);
    return;
  }

  if (pointer.leftButtonDown()) {
    handleSetupCellLeftClick(teamKey, row, col);
  }
}

function handleSetupCellLeftClick(teamKey, row, col) {
  if (gamePhase !== 'setup') {
    return;
  }

  const placement = getSetupPlacementAt(teamKey, row, col);
  if (placement) {
    openSetupPlacementStats(placement);
    return;
  }

  placeSetupKnight(teamKey, row, col);
}

function handleSetupCellRightClick(teamKey, row, col) {
  if (gamePhase !== 'setup') {
    return;
  }

  removeSetupPlacement(teamKey, row, col);
}

function placeSetupKnight(teamKey, row, col) {
  const formation = teamKey === 'red' ? redFormation : blueFormation;
  if (getSetupCommandUsed(teamKey) + getUnitCommandCost(selectedSetupUnitType) > getSetupCommandMax(teamKey) ||
      getSetupPlacementAt(teamKey, row, col)) {
    return;
  }

  formation.push(createPlacement(teamKey, row, col, teamKey === 'red', selectedSetupUnitType));
  renderSetupUi();
}

function removeSetupPlacement(teamKey, row, col) {
  const formation = teamKey === 'red' ? redFormation : blueFormation;
  const existingIndex = formation.findIndex((placement) => (
    placement.team === teamKey &&
    placement.row === row &&
    placement.col === col
  ));
  if (existingIndex >= 0) {
    formation.splice(existingIndex, 1);
    clearAllStatsPanels();
    renderSetupUi();
  }
}

function openSetupPlacementStats(placement) {
  openStatsPanel(createSetupStatsUnit(placement));
}

function createSetupStatsUnit(placement) {
  const classDefinition = getClassDefinition(placement.unitType);
  const classStats = calculateClassStats(placement.unitType);
  const displayName = placement.team === 'red' ? 'Red' : 'Blue';

  return {
    name: displayName,
    class: placement.unitType,
    className: classDefinition.name,
    cpCost: classDefinition.cpCost,
    promoted: classDefinition.promoted,
    traits: [...(classDefinition.traits || [])],
    equipment: { ...(classDefinition.equipment || {}) },
    actions: calculateClassActions(placement.unitType),
    reactions: calculateClassReactions(placement.unitType),
    limits: calculateClassLimits(placement.unitType),
    teamKey: placement.team,
    row: placement.row,
    col: placement.col,
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
    maxIp: classStats.maxIp
  };
}

function createUnits() {
  const counters = { red: 0, blue: 0 };
  units = [...redFormation, ...blueFormation].map((placement) => {
    counters[placement.team] += 1;
    const prefix = placement.team === 'red' ? 'R' : 'B';
    const unitName = placement.unitName || `${prefix}${counters[placement.team]}`;
    const color = placement.team === 'red' ? PHASER_COLORS.redKnight : PHASER_COLORS.blueKnight;
    const unit = createCharacter(
      unitName,
      placement.unitType,
      color,
      placement.team,
      placement.row,
      placement.col
    );
    unit.isPlayerControlled = placement.isPlayerControlled;
    unit.cost = placement.cost;
    return unit;
  });
  setActiveCombatants(firstLivingUnit('red'), firstLivingUnit('blue'));
  refreshInfoPanel();
}

function createCharacter(name, characterClass, color, teamKey, row, col) {
  const classDefinition = getClassDefinition(characterClass);
  const classStats = calculateClassStats(characterClass);
  const { x, baseY } = getFormationPosition(teamKey, row, col);
  const baseSpriteX = getUnitBaseSpriteX(teamKey, x);
  const spritePosition = getUnitSpritePosition(characterClass, teamKey, x, baseY);
  
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
    spritePosition.x,
    spritePosition.y,
    getUnitIdleTextureKey(characterClass),
    getUnitIdleDefaultFrame(characterClass)
  )
    .setScale(getUnitIdleScale(characterClass))
    .setFlipX(teamKey === 'blue');
  rect.setDepth(DEPTH_UNIT);
  rect.setInteractive({ useHandCursor: true });

  const label = sceneRef.add.text(baseSpriteX, baseY, name, {
    fontFamily: UI_FONT_FAMILY,
    fontSize: '20px',
    resolution: getUiTextResolution(),
    color: COLORS.text
  })
    .setOrigin(0.5)
    .setVisible(SHOW_BATTLE_UNIT_NAME_LABELS)
    .setDepth(DEPTH_UNIT_HUD);

  const unit = {
    name,
    class: characterClass,
    className: classDefinition.name,
    cpCost: classDefinition.cpCost,
    promoted: classDefinition.promoted,
    traits: [...(classDefinition.traits || [])],
    equipment: { ...(classDefinition.equipment || {}) },
    actions: calculateClassActions(characterClass),
    reactions: calculateClassReactions(characterClass),
    limits: calculateClassLimits(characterClass),
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
    slotX: x,
    slotY: baseY,
    slotSpriteX: baseSpriteX,
    initiativeOrderNumber: null,
    initiativeOrderNode: null,
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

  applyTeamUnitTint(unit);
  rect.on('pointerdown', (pointer) => {
    if (!pointer.rightButtonDown()) {
      openUnitStats(unit);
    }
  });
  refreshBattleUnitHud(unit);
  startKnightIdle(unit);
  return unit;
}

function openUnitStats(unit) {
  if (!unit || gamePhase !== 'battle') {
    return;
  }

  openStatsPanel(unit);
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
  const idleFrame = getUnitIdleDefaultFrame(unit.class);
  unit.rect.setTexture(getUnitIdleTextureKey(unit.class), idleFrame);
  unit.rect.setFrame(idleFrame);
  unit.rect.setFlipX(unit.teamKey === 'blue');
  applyTeamUnitTint(unit);
}

function applyTeamUnitTint(unit) {
  if (!unit || !unit.rect) {
    return;
  }

  if (!TEAM_UNIT_TINT_ENABLED) {
    unit.rect.clearTint();
    return;
  }

  const tint = unit.teamKey === 'blue' ? BLUE_TEAM_UNIT_TINT : RED_TEAM_UNIT_TINT;
  unit.rect.setTint(cssHexToNumber(tint));
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

  const idleVisual = CHARACTER_CLASSES[unit.class]?.visual?.idle;
  if (idleVisual?.twitchFrame == null) {
    return;
  }

  unit.rect.setTexture(idleVisual.textureKey, idleVisual.twitchFrame);
  unit.rect.setFrame(idleVisual.twitchFrame);
  applyTeamUnitTint(unit);
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

function addBattleHudIcon(unit, groupKey, x, y, resourceKey, fontSize, alpha = BATTLE_STATE_FULL_ALPHA) {
  const node = sceneRef.add.text(x, y, RESOURCE_ICONS[resourceKey], {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${fontSize}px`,
    resolution: getUiTextResolution(),
    color: getResourceIconColor(resourceKey)
  }).setOrigin(0.5, 0.5);

  node.resourceKey = resourceKey;
  node.setAlpha(alpha);
  node.setDepth(getBattleResourceDepth(unit, x, resourceKey));
  unit.battleHudNodes[groupKey].push(node);
}

function getResourceIconColor(resourceKey) {
  return RESOURCE_COLORS[resourceKey] || COLORS.text;
}

function resourceTextSegment(resourceKey, count = 1) {
  return {
    text: RESOURCE_ICONS[resourceKey].repeat(count),
    color: getResourceIconColor(resourceKey)
  };
}

function addInlineTextSegments(segments, x, y, depth, alpha = 1) {
  let cursorX = x;
  return segments.map((segment) => {
    const node = sceneRef.add.text(cursorX, y, segment.text, {
      ...smallTextStyle(),
      color: segment.color || COLORS.text
    })
      .setAlpha(alpha)
      .setDepth(depth);
    cursorX += node.width;
    return node;
  });
}

function buildStatBonusSegments(statBonuses = {}) {
  const resourceKeys = ['hp', 'sp', 'ap', 'rp', 'lp', 'ip'];
  const segments = [{ text: '(' }];
  let hasBonus = false;

  resourceKeys.forEach((resourceKey) => {
    const amount = statBonuses[resourceKey] || 0;
    if (amount <= 0) {
      return;
    }

    if (hasBonus) {
      segments.push({ text: ' ' });
    }

    segments.push({ text: '+' });
    segments.push(resourceTextSegment(resourceKey, amount));
    hasBonus = true;
  });

  segments.push({ text: ')' });
  return hasBonus ? segments : [{ text: '' }];
}

function shortTextOrFallback(data, fallbackSegments) {
  if (data?.shortText) {
    return [{ text: data.shortText }];
  }

  return fallbackSegments;
}

function buildEquipmentBonusSegments(item) {
  if (item.statBonuses) {
    return buildStatBonusSegments(item.statBonuses);
  }

  if (item.moveBonus) {
    return [{ text: `Move +${item.moveBonus}` }];
  }

  const parts = [];

  Object.entries(item.actionBonuses || {}).forEach(([actionKey, bonuses]) => {
    Object.entries(bonuses).forEach(([bonusKey, amount]) => {
      parts.push([
        { text: `${ACTIONS[actionKey]?.name || actionKey} +` },
        resourceTextSegment(bonusKey === 'hpDamage' ? 'hp' : 'sp', amount)
      ]);
    });
  });

  Object.entries(item.reactionBonuses || {}).forEach(([reactionKey, bonuses]) => {
    Object.entries(bonuses).forEach(([, amount]) => {
      parts.push([
        { text: `${REACTIONS[reactionKey]?.name || reactionKey} +` },
        resourceTextSegment('sp', amount)
      ]);
    });
  });

  return parts.flatMap((part, index) => (
    index > 0 ? [{ text: ', ' }, ...part] : part
  ));
}

function getEquipmentSlotDisplay(slotKey, item) {
  const raw = slotKey || item.slotType || item.slot || 'gear';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function buildActionDetailSegments(unit, actionData) {
  if (actionData.key === 'move') {
    const steps = getMoveStepCount(unit);
    return [
      resourceTextSegment('ap', actionData.apCost),
      { text: ' -> ' + '🥾'.repeat(steps) }
    ];
  }

  return [
    resourceTextSegment('ap', actionData.apCost),
    { text: ' -> ' },
    resourceTextSegment('sp', actionData.spDamage),
    { text: ' or ' },
    resourceTextSegment('hp', actionData.hpDamage)
  ];
}

function getBattleResourceDepth(unit, x, resourceKey) {
  return DEPTH_UNIT_HUD + getBattleCenterOverlapBonus(x);
}

function getBattleCenterOverlapBonus(x) {
  const battleCenterX = layout.battle.x + BATTLEFIELD_CENTER_X;
  const maxDistance = layout.battle.w / 2;
  const normalizedDistance = Math.min(1, Math.abs(x - battleCenterX) / maxDistance);
  return (1 - normalizedDistance) * BATTLE_RESOURCE_CENTER_DEPTH_BONUS;
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

function getBattleHudAnchor(unit) {
  return {
    rowX: unit.slotX ?? unit.shadow.x,
    rowY: unit.slotY ?? unit.rect.y,
    spriteX: unit.slotSpriteX ?? unit.rect.x
  };
}

function createBattleHudBackplate(unit) {
  if (!BATTLE_HUD_BACKPLATE_ENABLED || !hasBattlefieldVisuals(unit)) {
    return;
  }

  const anchor = getBattleHudAnchor(unit);
  const plate = sceneRef.add.rectangle(
    anchor.rowX,
    anchor.rowY + BATTLE_HUD_BACKPLATE_Y_OFFSET,
    BATTLE_HUD_BACKPLATE_WIDTH,
    BATTLE_HUD_BACKPLATE_HEIGHT,
    cssHexToNumber(BATTLE_HUD_BACKPLATE_COLOR)
  )
    .setOrigin(0.5, 0.5)
    .setAlpha(BATTLE_HUD_BACKPLATE_ALPHA)
    .setStrokeStyle(BATTLE_HUD_BACKPLATE_BORDER_THICKNESS, cssHexToNumber(BATTLE_HUD_BACKPLATE_BORDER_COLOR))
    .setDepth(BATTLE_HUD_BACKPLATE_DEPTH);

  unit.battleHudNodes.top.push(plate);
}

function createBattleMainResourceRow(unit) {
  if (!SHOW_BATTLE_UNIT_HUD || !hasBattlefieldVisuals(unit)) {
    return;
  }

  createBattleHudBackplate(unit);

  if (BATTLE_MAIN_RESOURCE_STATIC_SLOTS) {
    createStaticBattleMainResourceRows(unit);
    return;
  }

  const rowGroups = unit.teamKey === 'blue'
    ? [
      [
        { key: 'sp', current: unit.sp },
        { key: 'hp', current: unit.hp }
      ],
      [
        { key: 'rp', current: getDisplayedResource(unit, 'rp') },
        { key: 'ap', current: unit.ap }
      ]
    ]
    : [
      [
        { key: 'ap', current: unit.ap },
        { key: 'rp', current: getDisplayedResource(unit, 'rp') }
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
  const anchor = getBattleHudAnchor(unit);

  let cursorX = anchor.rowX - totalWidth / 2;
  const y = anchor.rowY + BATTLE_MAIN_RESOURCE_ROW_Y_OFFSET;

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

function getStaticBattleResourceRows(unit) {
  return unit.teamKey === 'blue'
    ? [
      ['sp', 'hp'],
      ['rp', 'ap']
    ]
    : [
      ['hp', 'sp'],
      ['ap', 'rp']
    ];
}

function getStaticBattleResourceGroupWidth(unit, resourceKey) {
  const maxKey = `max${resourceKey.charAt(0).toUpperCase()}${resourceKey.slice(1)}`;
  const slots = Math.min(unit[maxKey], BATTLE_MAIN_RESOURCE_STATIC_MAX_SLOTS);
  return Math.max(0, slots - 1) * BATTLE_MAIN_RESOURCE_STATIC_ICON_SPACING;
}

function getStaticBattleResourceReservedGroupWidth() {
  return (BATTLE_MAIN_RESOURCE_STATIC_MAX_SLOTS - 1) * BATTLE_MAIN_RESOURCE_STATIC_ICON_SPACING;
}

function isStaticResourceSlotFull(unit, resourceKey, index, slots) {
  const current = getDisplayedResource(unit, resourceKey);
  if (unit.teamKey === 'blue') {
    return index >= slots - current;
  }
  return index < current;
}

function drawStaticBattleResourceGroup(unit, resourceKey, startX, y) {
  const maxKey = `max${resourceKey.charAt(0).toUpperCase()}${resourceKey.slice(1)}`;
  const slots = Math.min(unit[maxKey], BATTLE_MAIN_RESOURCE_STATIC_MAX_SLOTS);

  for (let index = 0; index < slots; index += 1) {
    addBattleHudIcon(
      unit,
      'top',
      startX + index * BATTLE_MAIN_RESOURCE_STATIC_ICON_SPACING,
      y,
      resourceKey,
      BATTLE_MAIN_RESOURCE_FONT_SIZE,
      isStaticResourceSlotFull(unit, resourceKey, index, slots) ? BATTLE_STATE_FULL_ALPHA : BATTLE_MAIN_RESOURCE_EMPTY_ALPHA
    );
  }
}

function createStaticBattleMainResourceRows(unit) {
  const anchor = getBattleHudAnchor(unit);
  const rows = getStaticBattleResourceRows(unit);
  const firstY = anchor.rowY + BATTLE_MAIN_RESOURCE_ROW_Y_OFFSET;

  rows.forEach((row, rowIndex) => {
    const reservedGroupWidth = getStaticBattleResourceReservedGroupWidth();
    const totalWidth = reservedGroupWidth * row.length +
      Math.max(0, row.length - 1) * BATTLE_MAIN_RESOURCE_STATIC_GROUP_GAP;
    let cursorX = anchor.rowX - totalWidth / 2;
    const y = firstY + rowIndex * BATTLE_MAIN_RESOURCE_STATIC_ROW_GAP;

    row.forEach((resourceKey) => {
      // Red anchors toward combat center (right); right-align slots within reserved space.
      const groupStartX = unit.teamKey === 'red'
        ? cursorX + (reservedGroupWidth - getStaticBattleResourceGroupWidth(unit, resourceKey))
        : cursorX;
      drawStaticBattleResourceGroup(unit, resourceKey, groupStartX, y);
      cursorX += reservedGroupWidth + BATTLE_MAIN_RESOURCE_STATIC_GROUP_GAP;
    });
  });
}

function createBattleLpMarker(unit) {
  if (!SHOW_BATTLE_UNIT_HUD || !BATTLE_LP_SHOW || !hasBattlefieldVisuals(unit) || unit.lp <= 0) {
    return;
  }

  const anchor = getBattleHudAnchor(unit);
  const x = unit.teamKey === 'blue'
    ? anchor.spriteX - BATTLE_LP_X_OFFSET + BATTLE_LP_CORNER_X_INSET
    : anchor.spriteX + BATTLE_LP_X_OFFSET - BATTLE_LP_CORNER_X_INSET;

  const y = anchor.rowY + BATTLE_LP_Y_OFFSET - BATTLE_LP_CORNER_Y_INSET;

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

function getDisplayedResource(unit, resourceKey) {
  const override = resourceDisplayOverrides.get(`${unit.id}:${resourceKey}`);
  return override !== undefined ? override : unit[resourceKey];
}

function setResourceDisplayOverride(unit, resourceKey, value) {
  resourceDisplayOverrides.set(`${unit.id}:${resourceKey}`, value);
}

function clearResourceDisplayOverride(unit, resourceKey) {
  resourceDisplayOverrides.delete(`${unit.id}:${resourceKey}`);
}

function clearAllResourceDisplayOverrides() {
  resourceDisplayOverrides.clear();
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
  const centerX = teamKey === 'red' ? RED_FORMATION_CENTER_X : BLUE_FORMATION_CENTER_X;
  return {
    x: layout.battle.x + centerX - BATTLE_GRID_WIDTH / 2,
    y: FORMATION_CENTER_Y - BATTLE_GRID_HEIGHT / 2,
    w: BATTLE_GRID_WIDTH,
    h: BATTLE_GRID_HEIGHT
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

function getOpposingRowDistance(attackerRow, defenderRow) {
  const rowIndex = { front: 0, middle: 1, back: 2 };
  return rowIndex[attackerRow] + rowIndex[defenderRow] + 1;
}

function getEffectiveActionRange(unitOrAction, actionKey = null) {
  const action = actionKey
    ? unitOrAction.actions?.[actionKey]
    : unitOrAction;
  return Number.isFinite(action?.range) ? action.range : Infinity;
}

function isTargetInRange(attacker, defender, action) {
  return getOpposingRowDistance(attacker.row, defender.row) <= getEffectiveActionRange(action);
}

function getTargetableEnemyRow(attacker, rowOrder, selectedAction) {
  const enemies = livingEnemyUnits(attacker);
  return rowOrder.find((row) => enemies.some((enemy) => (
    enemy.row === row && isTargetInRange(attacker, enemy, selectedAction)
  ))) || null;
}

function chooseTarget(attacker, selectedAction) {
  const enemies = livingEnemyUnits(attacker);
  if (enemies.length === 0) {
    return null;
  }
  const rowOrder = ['front', 'middle', 'back'];
  const targetableRow = getTargetableEnemyRow(attacker, rowOrder, selectedAction);
  if (!targetableRow) {
    return null;
  }
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
  if (activePopupKey !== 'stats') {
    return;
  }

  infoPanelNodes.forEach((node) => node.destroy());
  infoPanelNodes = [];

  refreshInfoPanel();
}

function refreshInfoPanel() {
  if (!units || activePopupKey !== 'stats') {
    return;
  }

  infoPanelNodes.forEach((node) => node.destroy());
  infoPanelNodes = [];

  const columnY = layout.info.y + INFO_PANEL_PADDING;
  const columnHeight = layout.info.h - INFO_PANEL_PADDING;
  const columnWidth = layout.info.w - INFO_PANEL_PADDING * 2;
  const leftX = layout.info.x + INFO_PANEL_PADDING;

  renderActiveCombatPanel(currentAttacker, null, leftX, leftX, columnY, columnWidth, columnHeight);
  renderTeamStatusPanels();
}

function renderActiveCombatPanel(attacker, defender, leftX, rightX, y, columnWidth, columnHeight) {
  if (!attacker) {
    const node = sceneRef.add.text(leftX, y, 'Waiting for combatants...', smallTextStyle());
    infoPanelNodes.push(node);
    return;
  }

  renderCharacterPanel(attacker, leftX, y, columnWidth, columnHeight);
  if (defender) {
    renderCharacterPanel(defender, rightX, y, columnWidth, columnHeight);
  }
}

function renderCharacterPanel(unit, x, y, width, height, showHeader = true) {
  const lineHeight = 19;
  const skillDetailOffset = 120;
  let cursorY = y;

  function addPanelLine(text, alpha = 1) {
    const node = sceneRef.add.text(x, cursorY, text, {
      ...smallTextStyle(),
      alpha
    });
    node.setDepth(POPUP_DEPTH + 1);
    node.setWordWrapWidth(width);
    infoPanelNodes.push(node);
    cursorY += lineHeight;
  }

  function addBlankLine() {
    cursorY += lineHeight;
  }

  function addResourceLine(label, resourceKey) {
    const labelNode = sceneRef.add.text(x, cursorY, `${label}:`, smallTextStyle());
    labelNode.setDepth(POPUP_DEPTH + 1);
    infoPanelNodes.push(labelNode);

    const current = unit[resourceKey];
    const maxKey = `max${resourceKey.charAt(0).toUpperCase()}${resourceKey.slice(1)}`;
    const max = unit[maxKey];
    const icon = RESOURCE_ICONS[resourceKey];

    for (let index = 0; index < max; index += 1) {
      const iconNode = sceneRef.add.text(x + 34 + index * 16, cursorY, icon, {
        ...smallTextStyle(),
        color: getResourceIconColor(resourceKey)
      });
      iconNode.setAlpha(index < current ? 1 : 0.10);
      iconNode.setDepth(POPUP_DEPTH + 1);
      infoPanelNodes.push(iconNode);
    }

    cursorY += lineHeight;
  }

  function addResourcePairLine(leftLabel, leftKey, rightLabel, rightKey) {
    const rightColumnX = x + RESOURCE_ROW_PAIR_GAP;
    const depth = POPUP_DEPTH + 1;
    const addNode = (node) => { infoPanelNodes.push(node); };

    function getMax(key) {
      const maxKey = `max${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      return unit[maxKey];
    }

    drawResourceRow(x, cursorY, leftLabel, leftKey, unit[leftKey], getMax(leftKey), depth, addNode, STATS_POPUP_RESOURCE_ROW_LABEL_FONT_SIZE);
    drawResourceRow(rightColumnX, cursorY, rightLabel, rightKey, unit[rightKey], getMax(rightKey), depth, addNode, STATS_POPUP_RESOURCE_ROW_LABEL_FONT_SIZE);
    registerHoverTooltip(leftKey, {
      x: x + RESOURCE_ROW_LABEL_WIDTH,
      y: cursorY - 8,
      w: 96,
      h: 18
    });
    registerHoverTooltip(rightKey, {
      x: rightColumnX + RESOURCE_ROW_LABEL_WIDTH,
      y: cursorY - 8,
      w: 96,
      h: 18
    });
    cursorY += lineHeight;
  }

  function addSplitLine(label, detail) {
    const labelNode = sceneRef.add.text(x, cursorY, label.padEnd(12), smallTextStyle());
    const detailNode = sceneRef.add.text(x + skillDetailOffset, cursorY, detail, smallTextStyle());
    detailNode.setAlpha(0.40);
    labelNode.setDepth(POPUP_DEPTH + 1);
    detailNode.setDepth(POPUP_DEPTH + 1);

    labelNode.setWordWrapWidth(width);
    detailNode.setWordWrapWidth(width - skillDetailOffset);

    infoPanelNodes.push(labelNode, detailNode);
    cursorY += lineHeight;
  }
  function addRichSplitLine(label, segments, tooltipKey = null) {
    const labelNode = sceneRef.add.text(x, cursorY, label.padEnd(12), smallTextStyle());
    labelNode.setDepth(POPUP_DEPTH + 1);
    labelNode.setWordWrapWidth(width);

    const detailNodes = addInlineTextSegments(segments, x + skillDetailOffset, cursorY, POPUP_DEPTH + 1, POPUP_DETAIL_TEXT_ALPHA);
    infoPanelNodes.push(labelNode, ...detailNodes);
    if (tooltipKey) {
      registerHoverTooltip(tooltipKey, {
        x,
        y: cursorY - 8,
        w: width,
        h: 18
      });
    }
    cursorY += lineHeight;
  }

  const className = unit.className || getClassDefinition(unit.class).name;

  if (showHeader) {
    addPanelLine(className);
  }
  const unitCpCost = unit.cpCost || getUnitCommandCost(unit.class);

  function addCommandPointLine(count) {
    const labelNode = sceneRef.add.text(x, cursorY, 'COST:', smallTextStyle())
      .setOrigin(0, 0.5).setDepth(POPUP_DEPTH + 1);
    infoPanelNodes.push(labelNode);
    for (let i = 0; i < count; i++) {
      const flagNode = sceneRef.add.text(
        x + STATS_CP_ICON_X_OFFSET + i * STATS_CP_FLAG_SPACING,
        cursorY,
        SETUP_COMMAND_ICON,
        {
          fontFamily: UI_FONT_FAMILY,
          fontSize: `${STATS_CP_FLAG_FONT_SIZE}px`,
          resolution: getUiTextResolution(),
          color: COLORS.text
        }
      ).setPadding(0, STATS_CP_FLAG_TEXT_PADDING_Y).setOrigin(0, 0.5).setDepth(POPUP_DEPTH + 1);
      infoPanelNodes.push(flagNode);
    }
    cursorY += lineHeight;
  }

  if (showHeader) {
    addCommandPointLine(unitCpCost);
  }
  addResourcePairLine('HP', 'hp', 'SP', 'sp');
  addResourcePairLine('AP', 'ap', 'RP', 'rp');
  addResourcePairLine('LP', 'lp', 'IP', 'ip');
  {
    const mv = getEffectiveMoveDistance(unit);
    const rn = Object.values(unit.actions || {})
      .filter((a) => a.key !== 'move' && Number.isFinite(a.range))
      .reduce((max, a) => Math.max(max, a.range), 0);
    const addNode = (node) => { infoPanelNodes.push(node); };
    drawResourceRow(x, cursorY, 'MV', 'mv', mv, mv, POPUP_DEPTH + 1, addNode, STATS_POPUP_RESOURCE_ROW_LABEL_FONT_SIZE);
    drawResourceRow(x + RESOURCE_ROW_PAIR_GAP, cursorY, 'RN', 'rn', rn, rn, POPUP_DEPTH + 1, addNode, STATS_POPUP_RESOURCE_ROW_LABEL_FONT_SIZE);
    registerHoverTooltip('mv', {
      x: x + RESOURCE_ROW_LABEL_WIDTH,
      y: cursorY - 8,
      w: 96,
      h: 18
    });
    registerHoverTooltip('rn', {
      x: x + RESOURCE_ROW_PAIR_GAP + RESOURCE_ROW_LABEL_WIDTH,
      y: cursorY - 8,
      w: 96,
      h: 18
    });
    cursorY += lineHeight;
  }
  addBlankLine();

  addPanelLine('Equipment:');
  let equipmentRowCount = 0;
  Object.entries(unit.equipment || getClassDefinition(unit.class).equipment || {}).filter(([, equipmentKey]) => Boolean(equipmentKey)).forEach(([slotKey, equipmentKey]) => {
    const item = EQUIPMENT[equipmentKey];
    if (!item) {
      return;
    }

    addRichSplitLine(
      `${getEquipmentSlotDisplay(slotKey, item)}: ${item.name}`,
      shortTextOrFallback(item, buildEquipmentBonusSegments(item)),
      equipmentKey
    );
    equipmentRowCount += 1;
  });
  while (equipmentRowCount < 3) {
    addBlankLine();
    equipmentRowCount += 1;
  }
  const unitTraits = unit.traits || getClassDefinition(unit.class).traits || [];
  if (unitTraits.length > 0) {
    addBlankLine();
    addPanelLine('Traits:');
    unitTraits.forEach((traitKey, index) => {
      const trait = TRAITS[traitKey];
      if (!trait) {
        return;
      }

      const fallback = trait.statBonuses
        ? buildStatBonusSegments(trait.statBonuses)
        : [
          { text: 'Full Block: +' },
          resourceTextSegment('lp', trait.fullBlockLpGain || 0)
        ];

      addRichSplitLine(
        `T${index + 1}: ${trait.name}`,
        shortTextOrFallback(trait, fallback),
        traitKey
      );
    });
  }
  addBlankLine();

  addPanelLine('Actions:');
  Object.values(unit.actions || {}).forEach((actionData, index) => {
    addRichSplitLine(`A${index + 1}: ${actionData.name}`, buildActionDetailSegments(unit, actionData), actionData.key);
  });

  addBlankLine();
  addPanelLine('Reactions:');
  Object.values(unit.reactions || {}).forEach((reactionData, index) => {
    let fallback;
    if (reactionData.isPlaceholder) {
      fallback = [{ text: 'Block for Ally' }];
    } else if (reactionData.key === 'truestrike') {
      fallback = [resourceTextSegment('rp', reactionData.rpCost), { text: ' -> Grants 100% Accuracy' }];
    } else if (reactionData.key === 'dodge') {
      fallback = [resourceTextSegment('rp', reactionData.rpCost), { text: ' -> Grants 100% Evade' }];
    } else {
      fallback = [
        resourceTextSegment('rp', reactionData.rpCost),
        { text: ' -> Blocks ' },
        resourceTextSegment('sp', reactionData.blockAmount),
        { text: ' or ' },
        resourceTextSegment('hp', reactionData.blockAmount)
      ];
    }

    addRichSplitLine(`R${index + 1}: ${reactionData.name}`, fallback, reactionData.key);
  });

  const unitLimits = Object.values(unit.limits || {});
  if (unitLimits.length > 0) {
    addBlankLine();
    addPanelLine('Limit:');
    unitLimits.forEach((limitData, index) => {
      addRichSplitLine(`L${index + 1}: ${limitData.name}`, [
        resourceTextSegment('lp', limitData.lpCost),
        { text: ' -> ' },
        resourceTextSegment('sp', limitData.counterSpDamage),
        { text: ' + Blocks' }
      ], limitData.key);
    });
  }

  addBlankLine();
  addPanelLine('Gambits:');
  buildGambitRows().forEach((row) => {
    addRichSplitLine(row.label, row.detail);
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
    renderCompactResourceLine(unit, x + 8, y + 29, 'HP', 'hp', alpha),
    renderCompactResourceLine(unit, x + 8, y + 48, 'SP', 'sp', alpha),
    renderCompactResourceLine(unit, x + 8, y + 67, 'AP', 'ap', alpha),
    renderCompactResourceLine(unit, x + 8, y + 86, 'RP', 'rp', alpha),
    renderCompactResourceLine(unit, x + 8, y + 105, 'LP', 'lp', alpha),
    renderCompactResourceLine(unit, x + 8, y + 124, 'IP', 'ip', alpha)
  ].flat();

  name.setAlpha(alpha);
  [name, ...lines].forEach((node) => {
    node.setWordWrapWidth(width - 16);
  });
  statusPanelNodes.push(card, name, ...lines);
}

function renderCompactResourceLine(unit, x, y, label, resourceKey, alpha) {
  const labelNode = sceneRef.add.text(x, y, `${label}:`, smallTextStyle())
    .setAlpha(alpha);
  const current = unit[resourceKey];
  const maxKey = `max${resourceKey.charAt(0).toUpperCase()}${resourceKey.slice(1)}`;
  const max = unit[maxKey];
  const iconNodes = [];

  for (let index = 0; index < max; index += 1) {
    const iconNode = sceneRef.add.text(x + 34 + index * 16, y, RESOURCE_ICONS[resourceKey], {
      ...smallTextStyle(),
      color: getResourceIconColor(resourceKey)
    });
    iconNode.setAlpha(index < current ? alpha : Math.min(alpha, 0.10));
    iconNodes.push(iconNode);
  }

  return [labelNode, ...iconNodes];
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

function renderCombatLogRows() {
  logRows.forEach((row) => row.destroy());
  logRows = [];

  if (activePopupKey !== 'combatLog') {
    return;
  }

  const rect = getPopupRect('combatLog');
  const logStartY = rect.y + 62;

  logEntries.forEach((line, index) => {
    const row = sceneRef.add.text(rect.x + POPUP_PANEL_PADDING, logStartY + index * LOG_LINE_HEIGHT, line, smallTextStyle())
      .setDepth(POPUP_DEPTH + 1);
    row.setWordWrapWidth(rect.w - POPUP_PANEL_PADDING * 2);
    logRows.push(row);
  });
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
  togglePopup('combatLog');
}

function setCombatLogVisible(isVisible) {
  isCombatLogVisible = isVisible;
  if (isVisible) {
    openPopup('combatLog');
  } else if (activePopupKey === 'combatLog') {
    closePopups();
  }
}

function showReactionCastEffect(effect) {
  const reactionSegments = [];
  if ((effect.reaction.rpCost || 0) > 0) {
    reactionSegments.push({ text: RESOURCE_ICONS.rp.repeat(effect.reaction.rpCost), color: getResourceIconColor('rp') });
  }
  if ((effect.reaction.lpCost || 0) > 0) {
    reactionSegments.push({ text: RESOURCE_ICONS.lp.repeat(effect.reaction.lpCost), color: getResourceIconColor('lp') });
  }
  reactionSegments.push({ text: ` ${effect.reaction.name}`, color: COLORS.text });
  const callout = createCombatCallout({
    unit: effect.unit,
    segments: reactionSegments,
    yOffset: CAST_CALLOUT_Y_OFFSET
  });

  sceneRef.time.delayedCall(REACTION_CAST_COMMIT_DELAY_MS - REACTION_CAST_LABEL_DELAY_MS, () => {
    if (effect.rpSpentDisplay !== undefined) {
      setResourceDisplayOverride(effect.unit, 'rp', effect.rpSpentDisplay);
    }
    refreshBattleUnitHud(effect.unit);

    if (effect.rpSpentDisplay !== undefined) {
      sceneRef.time.delayedCall(DODGE_RP_REFUND_VISUAL_DELAY_MS, () => {
        clearResourceDisplayOverride(effect.unit, 'rp');
        refreshBattleUnitHud(effect.unit);
      });
    }

    sceneRef.time.delayedCall(DEFENDER_LP_GAIN_STAGGER_MS, () => {
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
    segments: [
      { text: RESOURCE_ICONS.ap, color: getResourceIconColor('ap') },
      { text: ` ${effect.action.name}`, color: COLORS.text }
    ],
    yOffset: CAST_CALLOUT_Y_OFFSET
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
  sceneRef.time.delayedCall(COUNTER_RESOURCE_PREVIEW_DURATION_MS, () => {
    refreshBattleUnitHud(effect.unit);
  });

  sceneRef.time.delayedCall(COUNTER_RESOURCE_PREVIEW_DURATION_MS + SECONDARY_RESOURCE_COMMIT_STAGGER_MS, () => {
    refreshBattleUnitHud(effect.unit);
  });
}

function showRoundStartBanner(roundNumber) {
  if (!ROUND_START_BANNER_ENABLED) {
    return;
  }

  const fatigueLevel = getFatigueLevel(roundNumber);
  const x = layout.battle.x + layout.battle.w / 2;
  const y = ROUND_START_BANNER_Y;
  const background = sceneRef.add.rectangle(
    x,
    y,
    ROUND_START_BANNER_WIDTH,
    ROUND_START_BANNER_HEIGHT,
    cssHexToNumber(ROUND_START_BANNER_BACKGROUND_COLOR)
  )
    .setAlpha(0)
    .setStrokeStyle(2, cssHexToNumber(ROUND_START_BANNER_BORDER_COLOR))
    .setDepth(ROUND_START_BANNER_DEPTH);
  const title = sceneRef.add.text(x, y - 36, `ROUND ${roundNumber} START`, {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${ROUND_START_BANNER_TITLE_FONT_SIZE}px`,
    resolution: getUiTextResolution(),
    color: ROUND_START_BANNER_TITLE_COLOR
  })
    .setOrigin(0.5)
    .setAlpha(0)
    .setDepth(ROUND_START_BANNER_DEPTH + 1);
  const subtitleParts = ['Initiative rolled.'];
  if (fatigueLevel > 0) {
    subtitleParts.push(`Fatigue: RP recovery -${fatigueLevel}`);
  } else {
    subtitleParts.push('AP and RP refilled.');
  }
  if (shouldApplyExhaustion(roundNumber)) {
    subtitleParts.push(`Exhaustion: -${EXHAUSTION_RP_DRAIN} RP`);
  }
  const subtitleText = subtitleParts.join(' ');
  const subtitle = sceneRef.add.text(x, y + 34, subtitleText, {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${ROUND_START_BANNER_SUBTITLE_FONT_SIZE}px`,
    resolution: getUiTextResolution(),
    color: ROUND_START_BANNER_SUBTITLE_COLOR
  })
    .setOrigin(0.5)
    .setAlpha(0)
    .setDepth(ROUND_START_BANNER_DEPTH + 1);
  const nodes = [background, title, subtitle];

  sceneRef.tweens.add({
    targets: background,
    alpha: ROUND_START_BANNER_BACKGROUND_ALPHA,
    duration: ROUND_START_BANNER_FADE_MS,
    ease: 'Quad.easeOut'
  });
  sceneRef.tweens.add({
    targets: [title, subtitle],
    alpha: 1,
    duration: ROUND_START_BANNER_FADE_MS,
    ease: 'Quad.easeOut'
  });
  sceneRef.time.delayedCall(ROUND_START_BANNER_FADE_MS + ROUND_START_BANNER_HOLD_MS, () => {
    sceneRef.tweens.add({
      targets: nodes,
      alpha: 0,
      duration: ROUND_START_BANNER_FADE_MS,
      ease: 'Quad.easeIn',
      onComplete: () => nodes.forEach((node) => node.destroy())
    });
  });
}

function showBattleOverBanner(winningTeamKey, cxpGained) {
  const x = layout.battle.x + layout.battle.w / 2;
  const y = ROUND_START_BANNER_Y;
  const titleText = winningTeamKey === 'red' ? 'RED TEAM WINS' : 'BLUE TEAM WINS';
  const subtitleText = cxpGained > 0
    ? `+${cxpGained} CXP | Command Level ${commandLevel}`
    : 'No CXP gained';
  const background = sceneRef.add.rectangle(
    x,
    y,
    ROUND_START_BANNER_WIDTH,
    ROUND_START_BANNER_HEIGHT,
    cssHexToNumber(ROUND_START_BANNER_BACKGROUND_COLOR)
  )
    .setAlpha(ROUND_START_BANNER_BACKGROUND_ALPHA)
    .setStrokeStyle(2, cssHexToNumber(ROUND_START_BANNER_BORDER_COLOR))
    .setDepth(ROUND_START_BANNER_DEPTH);
  const title = sceneRef.add.text(x, y - 36, titleText, {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${ROUND_START_BANNER_TITLE_FONT_SIZE}px`,
    resolution: getUiTextResolution(),
    color: ROUND_START_BANNER_TITLE_COLOR
  })
    .setOrigin(0.5)
    .setDepth(ROUND_START_BANNER_DEPTH + 1);
  const subtitle = sceneRef.add.text(x, y + 34, subtitleText, {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${ROUND_START_BANNER_SUBTITLE_FONT_SIZE}px`,
    resolution: getUiTextResolution(),
    color: ROUND_START_BANNER_SUBTITLE_COLOR
  })
    .setOrigin(0.5)
    .setDepth(ROUND_START_BANNER_DEPTH + 1);

  return [background, title, subtitle];
}

function createCombatCallout({ unit, segments, yOffset }) {
  const nodes = [];
  const x = unit.shadow.x;
  const y = unit.rect.y - UNIT_SIZE / 2 - yOffset;
  const top = y - CAST_CALLOUT_HEIGHT / 2;
  const textY = top + CAST_CALLOUT_PADDING + 1;

  const background = sceneRef.add.rectangle(
    x,
    y,
    CAST_CALLOUT_WIDTH,
    CAST_CALLOUT_HEIGHT,
    cssHexToNumber(CAST_CALLOUT_BACKGROUND_COLOR)
  )
    .setStrokeStyle(2, cssHexToNumber(CAST_CALLOUT_BORDER_COLOR))
    .setDepth(DEPTH_COMBAT_CALLOUT);
  nodes.push(background);

  const segmentNodes = segments.map((seg) =>
    sceneRef.add.text(0, textY, seg.text, {
      fontFamily: UI_FONT_FAMILY,
      fontSize: `${CAST_TITLE_FONT_SIZE}px`,
      resolution: getUiTextResolution(),
      color: seg.color
    })
      .setOrigin(0, 0)
      .setDepth(DEPTH_COMBAT_CALLOUT)
  );

  const totalWidth = segmentNodes.reduce((sum, node) => sum + node.width, 0);
  let cursorX = x - totalWidth / 2;
  segmentNodes.forEach((node) => {
    node.setX(cursorX);
    cursorX += node.width;
    nodes.push(node);
  });

  function destroy() {
    nodes.forEach((node) => node.destroy());
  }

  return {
    nodes,
    destroy
  };
}

function showResourceChangeEffect(effect) {
  sceneRef.time.delayedCall(RESOURCE_EFFECT_COMMIT_DELAY_MS, () => {
    refreshBattleUnitHud(effect.unit);
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
      fontFamily: UI_FONT_FAMILY,
      fontSize: `${DAMAGE_NUMBER_FONT_SIZE}px`,
      resolution: getUiTextResolution(),
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
  } else if (animationEffect.type === 'dodge') {
    playDodgeAnimation(animationEffect.unit, animationEffect.attacker);
  } else if (animationEffect.type === 'dodgeFail') {
    playFailedDodgeAnimation(animationEffect.unit, animationEffect.attacker);
  } else if (animationEffect.type === 'damage') {
    playDamageBlink(animationEffect.unit);
  } else if (animationEffect.type === 'ko') {
    markUnitKo(animationEffect.unit);
  } else if (animationEffect.type === 'lungeOut') {
    playAttackLungeOut(animationEffect.unit, animationEffect.target);
  } else if (animationEffect.type === 'lungeReturn') {
    playAttackReturn(animationEffect.unit);
  } else if (animationEffect.type === 'rangedProjectile') {
    playRangedProjectile(animationEffect.unit, animationEffect.target);
  }
}

function playKnightAttack(unit) {
  playClassOneShotAnimation(unit, 'attack');
}

function playClassOneShotAnimation(unit, animationType) {
  const animConfig = CHARACTER_CLASSES[unit.class]?.visual?.animations?.[animationType];
  if (!animConfig) {
    return;
  }

  if (!hasBattlefieldVisuals(unit) || unit.hp <= 0) {
    return;
  }

  stopKnightRandomIdleTwitch(unit);

  unit.isPlayingKnightAnimation = true;
  unit.knightAnimationKey = animConfig.animationKey;
  unit.knightAnimationRunId = (unit.knightAnimationRunId || 0) + 1;
  const runId = unit.knightAnimationRunId;
  const finalPoseHoldMs = ms(animConfig.finalPoseHoldMs);
  unit.rect.stop();
  unit.rect.setTexture(animConfig.textureKey, animConfig.startFrame);
  unit.rect.setFlipX(unit.teamKey === 'blue');
  applyTeamUnitTint(unit);
  unit.rect.play(animConfig.animationKey);

  const finish = () => holdKnightFinalPose(unit, animConfig.animationKey, runId, finalPoseHoldMs);
  unit.rect.once('animationcomplete', finish);
  sceneRef.time.delayedCall(getClassAnimationDurationMs(unit, animationType) + finalPoseHoldMs + ms(50), () => {
    finishKnightOneShotAnimation(unit, animConfig.animationKey, runId);
  });
}

function getClassAnimationDurationMs(unit, animationType) {
  const animConfig = CHARACTER_CLASSES[unit.class]?.visual?.animations?.[animationType];
  if (!animConfig) {
    return 0;
  }
  return getFrameAnimationDurationMs(animConfig.startFrame, animConfig.endFrame, animConfig.frameRate);
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

function playRangedProjectile(attacker, defender) {
  if (!hasBattlefieldVisuals(attacker) || !hasBattlefieldVisuals(defender)) {
    return;
  }

  const attackerHomeX = attacker.rect.x;
  const attackerHomeY = attacker.rect.y;
  const startX = attacker.rect.x + (attacker.teamKey === 'red'
    ? RANGED_PROJECTILE_START_X_OFFSET
    : -RANGED_PROJECTILE_START_X_OFFSET);
  const startY = attacker.rect.y + RANGED_PROJECTILE_START_Y_OFFSET;
  const endX = defender.rect.x + RANGED_PROJECTILE_END_X_OFFSET;
  const endY = defender.rect.y + RANGED_PROJECTILE_END_Y_OFFSET;
  const projectile = sceneRef.add.circle(startX, startY, RANGED_PROJECTILE_SIZE, PHASER_COLORS.lp)
    .setDepth(DEPTH_DAMAGE_TEXT);
  const tweenState = { progress: 0 };

  sceneRef.tweens.add({
    targets: tweenState,
    progress: 1,
    duration: RANGED_PROJECTILE_DURATION_MS,
    ease: 'Linear',
    onUpdate: () => {
      const t = tweenState.progress;
      projectile.x = startX + (endX - startX) * t;
      projectile.y = startY + (endY - startY) * t - Math.sin(Math.PI * t) * RANGED_PROJECTILE_ARC_HEIGHT;
    },
    onComplete: () => {
      projectile.destroy();
      attacker.rect.x = attackerHomeX;
      attacker.rect.y = attackerHomeY;
    }
  });
}

function getBattleStateNodes(unit) {
  if (!unit || !unit.battleHudNodes) {
    return [];
  }

  return Object.values(unit.battleHudNodes).flat().filter(isLiveBattlefieldNode);
}

function playBlockAnimation(unit) {
  playClassOneShotAnimation(unit, 'block');
}

function playParryAnimation(unit) {
  playClassOneShotAnimation(unit, 'parry');
}

function playDodgeAnimation(unit, attacker) {
  if (!hasBattlefieldVisuals(unit)) {
    return;
  }

  const sprite = unit.rect;
  const original = {
    x: sprite.x,
    y: sprite.y,
    angle: sprite.angle,
    alpha: sprite.alpha,
    scaleX: sprite.scaleX,
    scaleY: sprite.scaleY
  };
  const attackerX = attacker?.rect?.x ?? (unit.teamKey === 'red' ? GAME_WIDTH : 0);
  const direction = unit.teamKey === 'red'
    ? -1
    : (unit.teamKey === 'blue' ? 1 : Math.sign(sprite.x - attackerX) || 1);
  const rotation = direction * DODGE_FLIP_ROTATION_DEGREES;

  sceneRef.tweens.add({
    targets: sprite,
    x: original.x + direction * DODGE_FLIP_BACK_DISTANCE,
    y: original.y - DODGE_FLIP_UP_DISTANCE,
    angle: original.angle + rotation,
    alpha: DODGE_FLIP_FADE_ALPHA,
    duration: DODGE_FLIP_DURATION_MS,
    ease: 'Sine.easeOut',
    onComplete: () => {
      sceneRef.tweens.add({
        targets: sprite,
        x: original.x,
        y: original.y,
        angle: original.angle,
        alpha: original.alpha,
        scaleX: original.scaleX,
        scaleY: original.scaleY,
        duration: DODGE_FLIP_RETURN_DURATION_MS,
        ease: 'Sine.easeIn',
        onComplete: () => {
          sprite.x = original.x;
          sprite.y = original.y;
          sprite.angle = original.angle;
          sprite.alpha = original.alpha;
          sprite.setScale(original.scaleX, original.scaleY);
        }
      });
    }
  });
}

function playFailedDodgeAnimation(unit, attacker) {
  if (!hasBattlefieldVisuals(unit)) {
    return;
  }

  const sprite = unit.rect;
  const original = {
    x: sprite.x,
    y: sprite.y,
    angle: sprite.angle,
    alpha: sprite.alpha,
    scaleX: sprite.scaleX,
    scaleY: sprite.scaleY
  };
  const attackerX = attacker?.rect?.x ?? (unit.teamKey === 'red' ? GAME_WIDTH : 0);
  const direction = unit.teamKey === 'red'
    ? -1
    : (unit.teamKey === 'blue' ? 1 : Math.sign(sprite.x - attackerX) || 1);

  sceneRef.tweens.add({
    targets: sprite,
    angle: original.angle + direction * DODGE_FAIL_TILT_DEGREES,
    y: original.y + DODGE_FAIL_DROP_DISTANCE,
    alpha: DODGE_FAIL_BLINK_ALPHA,
    duration: DODGE_FAIL_DURATION_MS,
    ease: 'Sine.easeOut',
    onComplete: () => {
      let blinksLeft = DODGE_FAIL_BLINK_COUNT * 2;
      function doBlink() {
        if (blinksLeft <= 0) {
          sceneRef.tweens.add({
            targets: sprite,
            x: original.x,
            y: original.y,
            angle: original.angle,
            alpha: original.alpha,
            scaleX: original.scaleX,
            scaleY: original.scaleY,
            duration: DODGE_FAIL_RECOVER_DURATION_MS,
            ease: 'Sine.easeOut',
            onComplete: () => {
              sprite.x = original.x;
              sprite.y = original.y;
              sprite.angle = original.angle;
              sprite.alpha = original.alpha;
              sprite.setScale(original.scaleX, original.scaleY);
            }
          });
          return;
        }
        const targetAlpha = blinksLeft % 2 === 0 ? DODGE_FAIL_BLINK_ALPHA : original.alpha;
        sceneRef.tweens.add({
          targets: sprite,
          alpha: targetAlpha,
          duration: DAMAGE_BLINK_DURATION_MS,
          ease: 'Linear',
          onComplete: () => {
            blinksLeft--;
            doBlink();
          }
        });
      }
      doBlink();
    }
  });
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
  clearInitiativeOrderNumber(unit);
  destroyBattleUnitHud(unit);

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
  if (gamePhase !== 'setup' || !isSetupReady()) {
    return;
  }

  buildPracticeCombatFormations();
  if (!isSetupReady()) {
    return;
  }

  clearSetupUi();
  clearAllStatsPanels();
  setFormationScreenVisible(false);
  gamePhase = 'battle';
  round = 0;
  turn = 1;
  action = 1;
  turnQueue = [];
  roundInitiativeOrder = [];
  currentTurnActedUnits = new Set();
  battleEnded = false;
  battleRewardsGranted = false;
  clearAllResourceDisplayOverrides();
  createUnits();
  startRound();

  sceneRef.time.delayedCall(ROUND_START_BANNER_ACTION_START_DELAY_MS, () => {
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
  battleSpeedMultiplier = BATTLE_SPEED_OPTIONS.includes(multiplier) ? multiplier : battleSpeedMultiplier;
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
  resetTurnInitiativeProgress();
  const fatigueLevel = getFatigueLevel(round);
  const isExhaustionRound = shouldApplyExhaustion(round);

  livingUnits().forEach((unit) => {
    if (isExhaustionRound) {
      unit.rp = Math.max(0, unit.rp - EXHAUSTION_RP_DRAIN);
    }
    unit.ap = unit.maxAp;
    unit.rp = getFatiguedRpRecovery(unit, round);
    refreshBattleUnitHud(unit);
  });

  rollRoundInitiativeOrder();
  refreshInfoPanel();
  showRoundStartBanner(round);
  appendLog(`Round ${round} starts. Initiative rolled.`);
  if (fatigueLevel > 0 && (round - FATIGUE_START_ROUND) % FATIGUE_INTERVAL_ROUNDS === 0) {
    const fatigueText = round === FATIGUE_START_ROUND ? 'sets in' : 'worsens';
    appendLog(`Round ${round}: Fatigue ${fatigueText}. RP recovery -${fatigueLevel}.`);
  }
  if (isExhaustionRound) {
    const exhaustionText = round === EXHAUSTION_START_ROUND ? 'sets in' : 'worsens';
    appendLog(`Round ${round}: Exhaustion ${exhaustionText}. Living units lose ${EXHAUSTION_RP_DRAIN} RP.`);
  }
}

function getFatigueLevel(roundNumber) {
  if (roundNumber < FATIGUE_START_ROUND) {
    return 0;
  }

  return Math.floor((roundNumber - FATIGUE_START_ROUND) / FATIGUE_INTERVAL_ROUNDS + 1) *
    FATIGUE_RP_RECOVERY_PENALTY;
}

function getFatiguedRpRecovery(unit, roundNumber) {
  const recoveryTarget = Math.max(0, unit.maxRp - getFatigueLevel(roundNumber));
  return Math.max(0, Math.min(unit.maxRp, Math.max(unit.rp, recoveryTarget)));
}

function shouldApplyExhaustion(roundNumber) {
  return roundNumber >= EXHAUSTION_START_ROUND &&
    (roundNumber - EXHAUSTION_START_ROUND) % EXHAUSTION_INTERVAL_ROUNDS === 0;
}

function rollRoundInitiativeOrder() {
  clearInitiativeOrderNumbers();
  const living = livingUnits().sort((a, b) => b.ip - a.ip);
  const order = [];
  let index = 0;

  while (index < living.length) {
    let nextIndex = index + 1;
    while (nextIndex < living.length && living[nextIndex].ip === living[index].ip) {
      nextIndex += 1;
    }

    const tier = living.slice(index, nextIndex);
    for (let tierIndex = tier.length - 1; tierIndex > 0; tierIndex -= 1) {
      const randomIndex = Math.floor(Math.random() * (tierIndex + 1));
      [tier[tierIndex], tier[randomIndex]] = [tier[randomIndex], tier[tierIndex]];
    }

    order.push(...tier);
    index = nextIndex;
  }

  roundInitiativeOrder = order;
  roundInitiativeOrder.forEach((unit, orderIndex) => {
    unit.initiativeOrderNumber = orderIndex + 1;
  });
  refreshInitiativeOrderNumbers();
}

function getInitiativeOrderX(unit) {
  if (unit.teamKey === 'red') {
    return unit.slotX + INITIATIVE_ORDER_CENTER_X_OFFSET;
  }

  if (unit.teamKey === 'blue') {
    return unit.slotX - INITIATIVE_ORDER_CENTER_X_OFFSET;
  }

  return unit.slotX;
}

function refreshInitiativeOrderNumbers() {
  if (!INITIATIVE_ORDER_NUMBER_SHOW) {
    return;
  }

  roundInitiativeOrder.forEach((unit) => {
    clearInitiativeOrderNumber(unit);
    if (!hasBattlefieldVisuals(unit) || unit.hp <= 0 || !unit.initiativeOrderNumber) {
      return;
    }

    unit.initiativeOrderNode = sceneRef.add.text(
      getInitiativeOrderX(unit),
      unit.slotY + INITIATIVE_ORDER_Y_OFFSET,
      String(unit.initiativeOrderNumber),
      {
        fontFamily: UI_FONT_FAMILY,
        fontSize: `${INITIATIVE_ORDER_FONT_SIZE}px`,
        resolution: getUiTextResolution(),
        color: INITIATIVE_ORDER_COLOR,
        stroke: INITIATIVE_ORDER_STROKE_COLOR,
        strokeThickness: INITIATIVE_ORDER_STROKE_THICKNESS
      }
    )
      .setOrigin(0.5)
      .setDepth(INITIATIVE_ORDER_DEPTH);
  });
  refreshInitiativeOrderNumberAlphas();
}

function clearInitiativeOrderNumber(unit) {
  if (!unit) {
    return;
  }

  if (isLiveBattlefieldNode(unit.initiativeOrderNode)) {
    unit.initiativeOrderNode.destroy();
  }

  unit.initiativeOrderNode = null;
}

function clearInitiativeOrderNumbers() {
  if (!units) {
    return;
  }

  units.forEach((unit) => {
    clearInitiativeOrderNumber(unit);
    unit.initiativeOrderNumber = null;
  });
}

function getTurnEligibleUnitsInRoundOrder() {
  return roundInitiativeOrder.filter((unit) => unit.hp > 0 && unit.ap > 0);
}

function refreshInitiativeOrderNumberAlphas() {
  roundInitiativeOrder.forEach((unit) => {
    if (!isLiveBattlefieldNode(unit.initiativeOrderNode)) {
      return;
    }

    if (unit.hp <= 0) {
      unit.initiativeOrderNode.setVisible(false);
      return;
    }

    unit.initiativeOrderNode.setVisible(true);
    if (currentTurnActedUnits.has(unit)) {
      unit.initiativeOrderNode.setAlpha(INITIATIVE_ORDER_ACTED_ALPHA);
      return;
    }

    unit.initiativeOrderNode.setAlpha(unit.ap > 0
      ? INITIATIVE_ORDER_ACTIVE_ALPHA
      : INITIATIVE_ORDER_INELIGIBLE_ALPHA);
  });
}

function markUnitActedThisTurn(unit) {
  currentTurnActedUnits.add(unit);
  refreshInitiativeOrderNumberAlphas();
}

function resetTurnInitiativeProgress() {
  currentTurnActedUnits.clear();
  refreshInitiativeOrderNumberAlphas();
}

function chooseAction(attacker) {
  const actions = attacker.actions || calculateClassActions(attacker.class);
  const attack = Object.values(actions).find((candidate) => (
    candidate.key !== 'move' && chooseTarget(attacker, candidate)
  ));
  return attack || actions.move || null;
}

function chooseReaction(defender, attacker, selectedAction, attackContext = {}) {
  const dodge = defender.reactions?.dodge;
  const block = defender.reactions?.block;
  const parry = defender.limits?.parry;

  if (dodge && attackContext.canAttemptEvade !== false && defender.rp >= (dodge.rpCost || 0)) {
    return dodge;
  }

  if (parry && attackContext.canBeParried && defender.rp >= (parry.rpCost || 0) && defender.lp >= (parry.lpCost || 0)) {
    return parry;
  }

  if (block && attackContext.canBeBlocked && defender.rp >= (block.rpCost || 0)) {
    return block;
  }

  return null;
}

function getReactionBlockedAmount(reaction, incomingDamage) {
  if (reaction.blocksAllDamage) {
    return incomingDamage;
  }

  return Math.min(reaction.blockAmount || 0, incomingDamage);
}

function createAttackContext(selectedAction) {
  return {
    hasTruestrike: false,
    canAttemptEvade: true,
    canBeEvaded: true,
    canBeBlocked: true,
    canBeParried: selectedAction.attackType === 'melee'
  };
}

function getReactionCategory(reaction) {
  if (reaction.reactionType === 'dodge') {
    return 'evade';
  }

  return reaction.reactionType || reaction.limitType || reaction.key;
}

function isEvadeReaction(reaction) {
  return getReactionCategory(reaction) === 'evade';
}

function chooseTruestrikeReaction(attacker, selectedAction) {
  if (attacker.class !== 'archer' || selectedAction.key !== 'arrowShot') {
    return null;
  }

  const truestrike = attacker.reactions?.truestrike;
  if (!truestrike || attacker.rp < (truestrike.rpCost || 0)) {
    return null;
  }

  return truestrike;
}

function isRangedAction(action) {
  return action?.attackType === 'ranged';
}

function getForwardRow(row) {
  return { back: 'middle', middle: 'front', front: null }[row] || null;
}

function getOpenForwardCell(unit, targetRow, fromCol = unit.col) {
  const occupiedCols = new Set(livingTeamUnits(unit.teamKey)
    .filter((ally) => ally !== unit && ally.row === targetRow)
    .map((ally) => ally.col));
  const candidateCols = [fromCol, fromCol - 1, fromCol + 1]
    .filter((col) => FORMATION_COLS.includes(col));
  const openCol = candidateCols.find((col) => !occupiedCols.has(col));
  return Number.isFinite(openCol) ? { row: targetRow, col: openCol } : null;
}

function getMoveStepCount(unit) {
  return getEffectiveMoveDistance(unit);
}

function getEffectiveMoveDistance(unit) {
  return 1 + getEquippedItems(unit).reduce((sum, item) => sum + (item.moveBonus || 0), 0);
}

function setUnitFormationCell(unit, row, col, isAnimated = false) {
  const fromPosition = {
    rectX: unit.rect.x,
    rectY: unit.rect.y,
    labelX: unit.label.x,
    labelY: unit.label.y,
    shadowX: unit.shadow.x,
    shadowY: unit.shadow.y,
    stateNodes: getBattleStateNodes(unit).map((node) => ({ node, x: node.x, y: node.y }))
  };
  const { x, baseY } = getFormationPosition(unit.teamKey, row, col);
  const baseSpriteX = getUnitBaseSpriteX(unit.teamKey, x);
  const spritePosition = getUnitSpritePosition(unit.class, unit.teamKey, x, baseY);
  const toPosition = {
    rectX: spritePosition.x,
    rectY: spritePosition.y,
    labelX: baseSpriteX,
    labelY: baseY,
    shadowX: x,
    shadowY: baseY + UNIT_SHADOW_Y_OFFSET
  };
  unit.row = row;
  unit.col = col;
  unit.slotX = x;
  unit.slotY = baseY;
  unit.slotSpriteX = baseSpriteX;
  if (isAnimated) {
    playMoveAnimation(unit, fromPosition, toPosition);
  } else {
    unit.rect.x = toPosition.rectX;
    unit.rect.y = toPosition.rectY;
    unit.label.x = toPosition.labelX;
    unit.label.y = toPosition.labelY;
    unit.shadow.x = toPosition.shadowX;
    unit.shadow.y = toPosition.shadowY;
    refreshBattleUnitHud(unit);
  }
  refreshInitiativeOrderNumbers();
}

function playMoveAnimation(unit, fromPosition, toPosition) {
  unit.rect.x = fromPosition.rectX;
  unit.rect.y = fromPosition.rectY;
  unit.label.x = fromPosition.labelX;
  unit.label.y = fromPosition.labelY;
  unit.shadow.x = fromPosition.shadowX;
  unit.shadow.y = fromPosition.shadowY;
  fromPosition.stateNodes.forEach((entry) => {
    if (isLiveBattlefieldNode(entry.node)) {
      entry.node.x = entry.x;
      entry.node.y = entry.y;
    }
  });

  sceneRef.tweens.add({
    targets: unit.rect,
    x: toPosition.rectX,
    y: toPosition.rectY,
    duration: MOVE_ANIMATION_DURATION_MS,
    ease: MOVE_ANIMATION_EASE,
    onComplete: () => {
      unit.rect.x = toPosition.rectX;
      unit.rect.y = toPosition.rectY;
      unit.label.x = toPosition.labelX;
      unit.label.y = toPosition.labelY;
      refreshBattleUnitHud(unit);
      refreshInitiativeOrderNumbers();
    }
  });
  sceneRef.tweens.add({
    targets: unit.label,
    x: toPosition.labelX,
    y: toPosition.labelY,
    duration: MOVE_ANIMATION_DURATION_MS,
    ease: MOVE_ANIMATION_EASE
  });
  sceneRef.tweens.add({
    targets: unit.shadow,
    x: toPosition.shadowX,
    y: toPosition.shadowY,
    duration: MOVE_ANIMATION_DURATION_MS,
    ease: MOVE_ANIMATION_EASE
  });
  fromPosition.stateNodes.forEach((entry) => {
    if (!isLiveBattlefieldNode(entry.node)) {
      return;
    }

    sceneRef.tweens.add({
      targets: entry.node,
      x: `+=${toPosition.rectX - fromPosition.rectX}`,
      y: `+=${toPosition.rectY - fromPosition.rectY}`,
      duration: MOVE_ANIMATION_DURATION_MS,
      ease: MOVE_ANIMATION_EASE
    });
  });
}

function resolveMoveAction(unit, selectedAction, moveDelayMs = 0) {
  unit.ap = Math.max(0, unit.ap - selectedAction.apCost);
  const oldRow = unit.row;
  let currentRow = unit.row;
  let currentCol = unit.col;
  let targetCell = null;

  for (let step = 0; step < getMoveStepCount(unit); step += 1) {
    const targetRow = getForwardRow(currentRow);
    if (!targetRow) {
      break;
    }

    const nextCell = getOpenForwardCell(unit, targetRow, currentCol);
    if (!nextCell) {
      break;
    }

    targetCell = nextCell;
    currentRow = nextCell.row;
    currentCol = nextCell.col;
  }

  if (!getForwardRow(oldRow)) {
    refreshBattleUnitHud(unit);
    return `${unit.name} is already at the front.`;
  }

  if (!targetCell) {
    refreshBattleUnitHud(unit);
    return `${unit.name} cannot move forward.`;
  }

  if (moveDelayMs > 0) {
    sceneRef.time.delayedCall(moveDelayMs, () => {
      if (gamePhase !== 'battle' || unit.hp <= 0 || !hasBattlefieldVisuals(unit)) {
        return;
      }

      setUnitFormationCell(unit, targetCell.row, targetCell.col, true);
    });
  } else {
    setUnitFormationCell(unit, targetCell.row, targetCell.col, true);
  }

  return `${unit.name} moves from ${oldRow} to ${targetCell.row}.`;
}

function buildTurnQueue() {
  resetTurnInitiativeProgress();
  turnQueue = getTurnEligibleUnitsInRoundOrder();
  turn += 1;
  action = 1;
}

function takeNextAction() {
  if (gamePhase !== 'battle' || battleEnded) {
    return;
  }

  const living = livingUnits();
  if (isBattleOver()) {
    return;
  }

  if (turnQueue.length === 0) {
    if (living.every((unit) => unit.ap <= 0)) {
      startRound();
      sceneRef.time.delayedCall(ROUND_START_BANNER_ACTION_START_DELAY_MS, takeNextAction);
      return;
    }
    buildTurnQueue();
  }

  const attacker = turnQueue.shift();

  if (attacker.hp <= 0 || attacker.ap <= 0) {
    return takeNextAction();
  }

  const selectedAction = chooseAction(attacker);
  if (!selectedAction) {
    appendLog(`${attacker.name} has no action.`);
    return;
  }
  if (selectedAction.key === 'move') {
    setActiveCombatants(attacker, null);
    const tag = `[R${round}T${turn}A${action}]`;
    markUnitActedThisTurn(attacker);
    showActionCastEffect({
      unit: attacker,
      action: selectedAction
    });
    const effectText = resolveMoveAction(attacker, selectedAction, MOVE_ACTION_START_DELAY_MS);
    appendLog(`${tag} ${attacker.name} uses ${RESOURCE_ICONS.ap.repeat(selectedAction.apCost)}${selectedAction.name}.`, effectText);
    action += 1;
    refreshInfoPanel();
    return;
  }
  const defender = chooseTarget(attacker, selectedAction);
  if (!defender) {
    appendLog(`${attacker.name} has no target in range.`);
    return;
  }
  setActiveCombatants(attacker, defender);
  const tag = `[R${round}T${turn}A${action}]`;
  const attackerApBeforeResolve = attacker.ap;
  if (attackerApBeforeResolve <= 0) {
    return takeNextAction();
  }
  markUnitActedThisTurn(attacker);
  const effect = resolveAction(attacker, defender, selectedAction);

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
  const attackContext = createAttackContext(selectedAction);
  const truestrike = chooseTruestrikeReaction(attacker, selectedAction);
  if (truestrike) {
    const attackerRpBeforeTruestrike = attacker.rp;
    attacker.rp = Math.max(0, attacker.rp - (truestrike.rpCost || 0));
    attackContext.hasTruestrike = true;
    attackContext.canBeEvaded = false;
    effects.push(`${attacker.name} uses ${formatReactionCost(truestrike)}${truestrike.name}.`);
    visualEffects.push({
      type: 'reactionCast',
      unit: attacker,
      reaction: truestrike,
      beforeAp: attacker.ap,
      afterAp: attacker.ap,
      maxAp: attacker.maxAp,
      beforeRp: attackerRpBeforeTruestrike,
      afterRp: attacker.rp,
      maxRp: attacker.maxRp,
      beforeLp: attacker.lp,
      afterLp: attacker.lp,
      maxLp: attacker.maxLp,
      delayMs: REACTION_CAST_LABEL_DELAY_MS
    });
  }
  const reaction = chooseReaction(defender, attacker, selectedAction, attackContext);
  const resultDelayMs = reaction ? DEFENSE_RESULT_DELAY_MS : NO_REACTION_RESULT_DELAY_MS;
  const returnDelayMs = reaction ? ATTACK_RETURN_DELAY_MS : NO_REACTION_RETURN_DELAY_MS;

  const animationEffects = isRangedAction(selectedAction)
    ? [{
        type: 'rangedProjectile',
        unit: attacker,
        target: defender,
        delayMs: ATTACK_LUNGE_START_DELAY_MS
      }]
    : [
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

    const blockedAmount = getReactionBlockedAmount(reaction, remainingDamage);
    remainingDamage = Math.max(0, remainingDamage - blockedAmount);

    effects.push(`${defender.name} uses ${formatReactionCost(reaction)}${reaction.name}!`);
    const isFailedDodge = reaction.key === 'dodge' && !attackContext.canBeEvaded;
    animationEffects.push({
      type: isFailedDodge ? 'dodgeFail' : reaction.key,
      unit: defender,
      attacker,
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

    if (isEvadeReaction(reaction)) {
      if (!attackContext.canBeEvaded) {
        effects.push(`${defender.name}'s ${reaction.name} fails because of Truestrike.`);
      } else {
        const oldRp = defender.rp;
        defender.rp = Math.min(defender.maxRp, defender.rp + (reaction.rpRefund || 0));
        const rpGained = defender.rp - oldRp;
        effects.push(`${defender.name} dodges the attack.`);
        if (rpGained > 0) {
          reactionCastEffect.afterRp = defender.rp;
          reactionCastEffect.rpSpentDisplay = defenderRpAfter;
        }
        visualEffects.push({
          type: 'resourceChange',
          unit: defender,
          resourceKey: damageKey,
          before: defender[damageKey],
          after: defender[damageKey],
          max: defender[damageKey === 'sp' ? 'maxSp' : 'maxHp'],
          yOffset: DAMAGE_POPUP_Y_OFFSET,
          delayMs: COUNTER_RESULT_DELAY_MS,
          showZeroDamage: true
        });

        return {
          logText: effects.join(' '),
          visualEffects,
          animationEffects
        };
      }
    }

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

      const fullBlockLpGain = reaction.key === 'block' && hasTrait(defender, 'guardian')
        ? TRAITS.guardian.fullBlockLpGain
        : 0;
      if (fullBlockLpGain > 0) {
        const oldLp = defender.lp;
        defender.lp = Math.min(defender.maxLp, defender.lp + fullBlockLpGain);
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
  logEntries.push(line);

  while (logEntries.length > LOG_MAX_LINES) {
    logEntries.shift();
  }

  renderCombatLogRows();
}

function isBattleOver() {
  return isTeamDefeated('red') || isTeamDefeated('blue');
}

function endBattle(losingTeamKey) {
  if (gamePhase === 'battleOver') {
    return;
  }

  gamePhase = 'battleOver';
  battleEnded = true;
  clearAllResourceDisplayOverrides();
  if (actionTimer) {
    actionTimer.remove(false);
  }
  units.filter((unit) => unit.teamKey === losingTeamKey && unit.hp <= 0).forEach((unit) => {
    markUnitKo(unit);
  });
  const winningTeamKey = losingTeamKey === 'red' ? 'blue' : 'red';
  const cxpGained = battleRewardsGranted ? 0 : grantBattleRewards(winningTeamKey);
  battleRewardsGranted = true;
  refreshInfoPanel();
  const bannerNodes = showBattleOverBanner(winningTeamKey, cxpGained);
  const winner = winningTeamKey === 'red' ? 'Red' : 'Blue';
  appendLog(`Battle ends. ${winner} wins.`);
  scheduleReturnToSetup(bannerNodes);
}

function scheduleReturnToSetup(bannerNodes) {
  sceneRef.time.delayedCall(BATTLE_OVER_RETURN_TO_SETUP_DELAY_MS - ROUND_START_BANNER_FADE_MS, () => {
    sceneRef.tweens.add({
      targets: bannerNodes.filter(isLiveBattlefieldNode),
      alpha: 0,
      duration: ROUND_START_BANNER_FADE_MS,
      ease: 'Quad.easeIn',
      onComplete: () => {
        bannerNodes.forEach((node) => {
          if (isLiveBattlefieldNode(node)) {
            node.destroy();
          }
        });
        resetBattlefieldForSetup();
        enterSetupPhase();
      }
    });
  });
}

function resetBattlefieldForSetup() {
  if (actionTimer) {
    actionTimer.remove(false);
    actionTimer = null;
  }

  clearAllResourceDisplayOverrides();
  closePopups();
  clearInitiativeOrderNumbers();
  if (units) {
    units.forEach((unit) => {
      destroyBattleUnitHud(unit);
      [unit.rect, unit.label, unit.shadow, unit.initiativeOrderNode].forEach((node) => {
        if (isLiveBattlefieldNode(node)) {
          node.destroy();
        }
      });
      unit.isBattlefieldRemoved = true;
    });
  }

  units = [];
  currentAttacker = null;
  currentDefender = null;
  clearAllStatsPanels();
  turnQueue = [];
  roundInitiativeOrder = [];
  currentTurnActedUnits = new Set();
  battleEnded = false;
}

function getTeamCommandValue(teamKey) {
  if (units && gamePhase !== 'setup') {
    return units
      .filter((unit) => unit.teamKey === teamKey)
      .reduce((sum, unit) => sum + (unit.cost || getUnitCommandCost(unit.class)), 0);
  }

  return getSetupPlacements(teamKey).reduce((sum, placement) => sum + placement.cost, 0);
}

function addCommandXp(amount) {
  commandXp += amount;

  while (commandXp >= COMMAND_XP_TO_LEVEL) {
    commandXp -= COMMAND_XP_TO_LEVEL;
    commandLevel = Math.min(COMMAND_LEVEL_MAX, commandLevel + 1);
  }
}

function grantBattleRewards(winningTeamKey) {
  if (winningTeamKey !== 'red') {
    return 0;
  }

  const cxpGained = getTeamCommandValue('blue');
  addCommandXp(cxpGained);
  return cxpGained;
}

function livingUnits() {
  return units.filter((unit) => unit.hp > 0);
}

function getUiTextResolution() {
  return Math.min(window.devicePixelRatio || 1, 2);
}

function headerTextStyle() {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${FONT_SIZE_HEADER}px`,
    resolution: getUiTextResolution(),
    color: COLORS.text
  };
}

function bodyTextStyle() {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${FONT_SIZE_BODY}px`,
    resolution: getUiTextResolution(),
    color: COLORS.mutedText
  };
}

function smallTextStyle() {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${FONT_SIZE_SMALL}px`,
    resolution: getUiTextResolution(),
    color: COLORS.text,
    lineSpacing: 4
  };
}

function combatLogToggleTextStyle() {
  return {
    fontFamily: UI_FONT_FAMILY,
    fontSize: `${COMBAT_LOG_TOGGLE_FONT_SIZE}px`,
    resolution: getUiTextResolution(),
    color: COMBAT_LOG_TOGGLE_TEXT_COLOR
  };
}

