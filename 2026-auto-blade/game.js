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
  infoPanel: '#16161d',
  text: '#f5f5f5',
  mutedText: '#b9bbc8',
  redKnight: '#d84343',
  blueKnight: '#3f6fd9',
  spent: '#555862',
  sp: '#2e8fe8',
  hp: '#e04444',
  ap: '#f06a9a',
  pp: '#58a6ff',
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
  ap: '🟥',
  pp: '🟦',
  lp: '🟨'
};

const ACTIONS = {
  slash: {
    key: 'slash',
    name: 'Slash',
    apCost: 1,
    spDamage: 2,
    hpDamage: 1
  }
};

const CHARACTER_CLASSES = {
  knight: {
    hp: 1,
    maxHp: 1,
    sp: 3,
    maxSp: 3,
    ap: 2,
    maxAp: 2,
    pp: 1,
    maxPp: 1,
    lp: 0,
    maxLp: 1
  },
  squire: {
    hp: 1,
    maxHp: 1,
    sp: 2,
    maxSp: 2,
    ap: 1,
    maxAp: 1,
    pp: 1,
    maxPp: 1,
    lp: 0,
    maxLp: 1
  }
};

const LEFT_PANEL_WIDTH_RATIO = 0.29;
const CENTER_WIDTH_RATIO = 0.42;
const RIGHT_PANEL_WIDTH_RATIO = 0.29;
const BATTLE_WINDOW_HEIGHT_RATIO = 0.37;

const UNIT_WIDTH = 70;
const UNIT_HEIGHT = 118;
const UNIT_LEFT_X_RATIO = 0.26;
const UNIT_RIGHT_X_RATIO = 0.74;
const UNIT_BASE_Y_RATIO = 0.85;

const SP_BLOCK_SIZE = 12;
const HP_BLOCK_SIZE = 12;
const AP_BLOCK_SIZE = 8;
const PP_BLOCK_SIZE = 8;
const LP_BLOCK_SIZE = 8;
const RESOURCE_BLOCK_SPACING = 2;

const ACTION_DELAY_MS = 3000;
const FLOATING_EFFECT_DURATION_MS = 1000;
const FLOATING_EFFECT_FONT_SIZE = 24;
const INFO_PANEL_PADDING = 24;
const INFO_COLUMN_GAP = 28;
const INFO_TOOLTIP_HEIGHT = 82;
const INFO_DIVIDER_COLOR = COLORS.panelBorder;
const FONT_SIZE_HEADER = 24;
const FONT_SIZE_BODY = 18;
const FONT_SIZE_SMALL = 14;
const LOG_MAX_LINES = 8;
const LOG_LINE_HEIGHT = 20;

function buildSkillLines() {
  const slash = ACTIONS.slash;

  return [
    'Skills:',
    `A1: ${slash.name} | Cost: ${RESOURCE_ICONS.ap.repeat(slash.apCost)} | Damage: ${RESOURCE_ICONS.sp.repeat(slash.spDamage)} or ${RESOURCE_ICONS.hp.repeat(slash.hpDamage)}`,
    'A2:',
    'P1:',
    'P2:'
  ];
}

function buildGambitLines() {
  const slash = ACTIONS.slash;

  return [
    'Gambits:',
    `${slash.name} | enemy has ${RESOURCE_ICONS.sp.repeat(2)}+`,
    slash.name
  ];
}

function buildEquipmentLines() {
  return [
    'Equipment:',
    'RH: Broadsword (Grants Thrust)',
    'LH: Buckler (Grants Parry)'
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
let round = 0;
let turn = 1;
let action = 1;
let nextActorIndex = 0;
let battleEnded = false;
let actionTimer;
let infoPanelNodes = [];

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
    create
  }
};

new Phaser.Game(config);

function create() {
  sceneRef = this;
  createLayout();
  createUnits();
  startBattle();
}

function createLayout() {
  const leftW = GAME_WIDTH * LEFT_PANEL_WIDTH_RATIO;
  const centerW = GAME_WIDTH * CENTER_WIDTH_RATIO;
  const rightW = GAME_WIDTH * RIGHT_PANEL_WIDTH_RATIO;
  const centerX = leftW;
  const rightX = leftW + centerW;
  const battleH = GAME_HEIGHT * BATTLE_WINDOW_HEIGHT_RATIO;
  const grassH = 48;

  layout = {
    left: { x: 0, y: 0, w: leftW, h: GAME_HEIGHT },
    center: { x: centerX, y: 0, w: centerW, h: GAME_HEIGHT },
    right: { x: rightX, y: 0, w: rightW, h: GAME_HEIGHT },
    battle: { x: centerX, y: 0, w: centerW, h: battleH },
    info: { x: centerX, y: battleH, w: centerW, h: GAME_HEIGHT - battleH },
    grass: { x: centerX, y: battleH - grassH, w: centerW, h: grassH }
  };

  drawPanel(layout.left, 'Menu');
  sceneRef.add.text(layout.left.x + 28, 80, 'Ignore for now', bodyTextStyle());

  sceneRef.add.rectangle(layout.battle.x, layout.battle.y, layout.battle.w, layout.battle.h, PHASER_COLORS.sky)
    .setOrigin(0);
  sceneRef.add.rectangle(layout.grass.x, layout.grass.y, layout.grass.w, layout.grass.h, PHASER_COLORS.grass)
    .setOrigin(0);
  sceneRef.add.rectangle(layout.battle.x, layout.battle.y, layout.battle.w, layout.battle.h)
    .setOrigin(0)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder);

  sceneRef.add.rectangle(layout.info.x, layout.info.y, layout.info.w, layout.info.h, PHASER_COLORS.infoPanel)
    .setOrigin(0)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder);
  createInfoPanel();

  drawPanel(layout.right, 'Combat Log');
}

function drawPanel(rect, title) {
  sceneRef.add.rectangle(rect.x, rect.y, rect.w, rect.h, PHASER_COLORS.panel)
    .setOrigin(0)
    .setStrokeStyle(2, PHASER_COLORS.panelBorder);
  sceneRef.add.text(rect.x + 28, 26, title, headerTextStyle());
}

function createUnits() {
  units = [
    createCharacter('K1', 'knight', PHASER_COLORS.redKnight, layout.battle.x + layout.battle.w * UNIT_LEFT_X_RATIO),
    createCharacter('K2', 'knight', PHASER_COLORS.blueKnight, layout.battle.x + layout.battle.w * UNIT_RIGHT_X_RATIO)
  ];

  units[0].enemy = units[1];
  units[1].enemy = units[0];
  refreshInfoPanel();
}

function createCharacter(name, characterClass, color, x) {
  const classStats = CHARACTER_CLASSES[characterClass];

  const baseY = layout.battle.y + layout.battle.h * UNIT_BASE_Y_RATIO;
  const rect = sceneRef.add.rectangle(x, baseY - UNIT_HEIGHT / 2, UNIT_WIDTH, UNIT_HEIGHT, color)
    .setStrokeStyle(3, PHASER_COLORS.unitBorder);
  const label = sceneRef.add.text(x, baseY - UNIT_HEIGHT / 2, name, {
    fontFamily: 'monospace',
    fontSize: '20px',
    color: COLORS.text
  }).setOrigin(0.5);

  return {
    name,
    class: characterClass,
    color,
    hp: classStats.hp,
    maxHp: classStats.maxHp,
    sp: classStats.sp,
    maxSp: classStats.maxSp,
    ap: classStats.ap,
    maxAp: classStats.maxAp,
    pp: classStats.pp,
    maxPp: classStats.maxPp,
    lp: classStats.lp,
    maxLp: classStats.maxLp,
    rect,
    label
  };
}

function formatResourceCurrent(unit, resourceKey) {
  return RESOURCE_ICONS[resourceKey].repeat(unit[resourceKey]);
}

function formatCharacterStats(unit) {
  return [
    `${unit.name} Knight`,
    `HP: ${formatResourceCurrent(unit, 'hp')}`,
    `SP: ${formatResourceCurrent(unit, 'sp')}`,
    `AP: ${formatResourceCurrent(unit, 'ap')}`,
    `PP: ${formatResourceCurrent(unit, 'pp')}`,
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

  renderCharacterPanel(units[0], leftX, columnY, columnWidth, columnHeight);
  renderCharacterPanel(units[1], rightX, columnY, columnWidth, columnHeight);
}

function renderCharacterPanel(unit, x, y, width, height) {
  const lines = [
    ...formatCharacterStats(unit),
    '',
    ...buildSkillLines(),
    '',
    ...buildGambitLines(),
    '',
    ...buildEquipmentLines()
  ];

  const text = sceneRef.add.text(x, y, lines, smallTextStyle());
  text.setWordWrapWidth(width);
  infoPanelNodes.push(text);
}

function showFloatingEffect(unit, text) {
  const popup = sceneRef.add.text(unit.rect.x, unit.rect.y - UNIT_HEIGHT / 2 - 22, text, {
    fontFamily: 'Arial',
    fontSize: `${FLOATING_EFFECT_FONT_SIZE}px`,
    color: COLORS.text
  }).setOrigin(0.5);

  sceneRef.tweens.add({
    targets: popup,
    alpha: 0,
    duration: FLOATING_EFFECT_DURATION_MS,
    onComplete: () => popup.destroy()
  });
}

function startBattle() {
  appendLog('Round 1 starts.');
  startRound();
  actionTimer = sceneRef.time.addEvent({
    delay: ACTION_DELAY_MS,
    callback: takeNextAction,
    callbackScope: sceneRef,
    loop: true
  });
}

function startRound() {
  round += 1;
  turn = 1;
  action = 1;
  nextActorIndex = 0;

  livingUnits().forEach((unit) => {
    unit.ap = unit.maxAp;
    unit.pp = unit.maxPp;
  });
  refreshInfoPanel();

  if (round > 1) {
    appendLog(`Round ${round} starts.`);
  }
}

function takeNextAction() {
  if (battleEnded) {
    return;
  }

  const living = livingUnits();
  if (living.length < 2) {
    endBattle(living[0], units.find((unit) => unit.hp <= 0));
    return;
  }

  if (living.every((unit) => unit.ap <= 0)) {
    startRound();
    return;
  }

  const attacker = units[nextActorIndex];
  nextActorIndex = (nextActorIndex + 1) % units.length;

  if (attacker.hp <= 0 || attacker.ap <= 0) {
    return takeNextAction();
  }

  const defender = attacker.enemy;
  const tag = `[R${round}T${turn}A${action}]`;
  const selectedAction = ACTIONS.slash;
  const effect = resolveAction(attacker, defender, selectedAction);
  appendLog(`${tag} ${attacker.name} uses ${selectedAction.name} on ${defender.name}.`, effect.logText);

  effect.floatingEffects.forEach((floatingEffect) => {
    showFloatingEffect(floatingEffect.unit, floatingEffect.text);
  });
  refreshInfoPanel();

  if (isBattleOver()) {
    endBattle(attacker, defender);
    return;
  }

  if (action >= living.length) {
    turn += 1;
    action = 1;
  } else {
    action += 1;
  }
}

function resolveAction(attacker, defender, selectedAction) {
  attacker.ap = Math.max(0, attacker.ap - selectedAction.apCost);
  const effects = [formatResourceLoss(attacker.name, selectedAction.apCost, 'ap')];
  const floatingEffects = [
    { unit: attacker, text: formatResourcePopup(selectedAction.apCost, 'ap') }
  ];

  if (defender.sp > 0) {
    const spDamage = Math.min(selectedAction.spDamage, defender.sp);
    defender.sp = Math.max(0, defender.sp - spDamage);
    effects.push(formatResourceLoss(defender.name, spDamage, 'sp'));
    floatingEffects.push({ unit: defender, text: formatResourcePopup(spDamage, 'sp') });
  } else {
    const hpDamage = Math.min(selectedAction.hpDamage, defender.hp);
    defender.hp = Math.max(0, defender.hp - hpDamage);
    effects.push(formatResourceLoss(defender.name, hpDamage, 'hp'));
    floatingEffects.push({ unit: defender, text: formatResourcePopup(hpDamage, 'hp') });
    if (defender.hp <= 0) {
      effects.push(`${defender.name} dies.`);
    }
  }

  return {
    logText: effects.join(' | '),
    floatingEffects
  };
}

function formatResourceLoss(unitName, amount, resourceKey) {
  return `${unitName} -${RESOURCE_ICONS[resourceKey].repeat(amount)}`;
}

function formatResourcePopup(amount, resourceKey) {
  return `-${RESOURCE_ICONS[resourceKey].repeat(amount)}`;
}

function appendLog(actionText, effectText) {
  const line = effectText ? `${actionText} => ${effectText}` : actionText;

  const y = layout.right.y + 78 + logRows.length * LOG_LINE_HEIGHT;
  const row = sceneRef.add.text(layout.right.x + 22, y, line, smallTextStyle());
  row.setWordWrapWidth(layout.right.w - 44);
  logRows.push(row);

  while (logRows.length > LOG_MAX_LINES) {
    logRows.shift().destroy();
    logRows.forEach((row, index) => {
      row.setY(layout.right.y + 78 + index * LOG_LINE_HEIGHT);
    });
  }
}

function isBattleOver() {
  return livingUnits().length < 2;
}

function endBattle(winner, loser) {
  battleEnded = true;
  if (actionTimer) {
    actionTimer.remove(false);
  }
  if (loser) {
    loser.rect.setAlpha(0.35);
    loser.label.setText(`${loser.name} KO`);
  }
  refreshInfoPanel();
  appendLog('Battle ends.');
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
