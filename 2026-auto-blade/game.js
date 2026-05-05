const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

const COLORS = {
  background: 0x050506,
  panel: 0x111116,
  panelBorder: 0x2e2e38,
  sky: 0x91c9ee,
  grass: 0x358f3d,
  infoPanel: 0x16161d,
  text: '#f5f5f5',
  mutedText: '#b9bbc8',
  redKnight: 0xd84343,
  blueKnight: 0x3f6fd9,
  spent: 0x555862,
  sp: 0x2e8fe8,
  hp: 0xe04444,
  ap: 0xf06a9a,
  pp: 0x58a6ff,
  lp: 0xf2cf45,
  emptyLp: 0x5f5524
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

const SP_BLOCK_SIZE = 16;
const HP_BLOCK_SIZE = 16;
const AP_BLOCK_SIZE = 14;
const PP_BLOCK_SIZE = 14;
const LP_BLOCK_SIZE = 14;
const RESOURCE_BLOCK_SPACING = 5;

const ACTION_DELAY_MS = 3000;
const FONT_SIZE_HEADER = 24;
const FONT_SIZE_BODY = 15;
const FONT_SIZE_SMALL = 13;
const LOG_MAX_LINES = 16;

const INFO_TEXT = [
  'Key Stats:',
  'HP: 1',
  'SP: 3',
  'AP: 2',
  'PP: 1',
  'LP: starts at 0 during combat and caps at 1',
  '',
  'Skills:',
  'A1: Slash',
  'Cost: 1 AP',
  'Damage: 2 SP or 1 HP',
  'A2:',
  'P1:',
  'P2:',
  '',
  'Gambits:',
  'Slash | enemy has 2+ SP',
  'Slash',
  '',
  'Equipment:',
  'RH: Broadsword (Grants Thrust)',
  'LH: Buckler (Grants Parry)',
  '',
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

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: COLORS.background,
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

  sceneRef.add.rectangle(layout.battle.x, layout.battle.y, layout.battle.w, layout.battle.h, COLORS.sky)
    .setOrigin(0);
  sceneRef.add.rectangle(layout.grass.x, layout.grass.y, layout.grass.w, layout.grass.h, COLORS.grass)
    .setOrigin(0);
  sceneRef.add.rectangle(layout.battle.x, layout.battle.y, layout.battle.w, layout.battle.h)
    .setOrigin(0)
    .setStrokeStyle(2, COLORS.panelBorder);

  sceneRef.add.rectangle(layout.info.x, layout.info.y, layout.info.w, layout.info.h, COLORS.infoPanel)
    .setOrigin(0)
    .setStrokeStyle(2, COLORS.panelBorder);
  sceneRef.add.text(layout.info.x + 24, layout.info.y + 22, INFO_TEXT, smallTextStyle());

  drawPanel(layout.right, 'Combat Log');
}

function drawPanel(rect, title) {
  sceneRef.add.rectangle(rect.x, rect.y, rect.w, rect.h, COLORS.panel)
    .setOrigin(0)
    .setStrokeStyle(2, COLORS.panelBorder);
  sceneRef.add.text(rect.x + 28, 26, title, headerTextStyle());
}

function createUnits() {
  units = [
    createKnight('K1', COLORS.redKnight, layout.battle.x + layout.battle.w * UNIT_LEFT_X_RATIO),
    createKnight('K2', COLORS.blueKnight, layout.battle.x + layout.battle.w * UNIT_RIGHT_X_RATIO)
  ];

  units[0].enemy = units[1];
  units[1].enemy = units[0];
  units.forEach(drawUnitResources);
}

function createKnight(name, color, x) {
  const baseY = layout.battle.y + layout.battle.h * UNIT_BASE_Y_RATIO;
  const rect = sceneRef.add.rectangle(x, baseY - UNIT_HEIGHT / 2, UNIT_WIDTH, UNIT_HEIGHT, color)
    .setStrokeStyle(3, 0x161616);
  const label = sceneRef.add.text(x, baseY - UNIT_HEIGHT / 2, name, {
    fontFamily: 'monospace',
    fontSize: '20px',
    color: COLORS.text
  }).setOrigin(0.5);

  return {
    name,
    color,
    hp: 1,
    maxHp: 1,
    sp: 3,
    maxSp: 3,
    ap: 2,
    maxAp: 2,
    pp: 1,
    maxPp: 1,
    lp: 0,
    maxLp: 1,
    rect,
    label,
    resourceNodes: []
  };
}

function drawUnitResources(unit) {
  const x = unit.rect.x;
  const topY = unit.rect.y - UNIT_HEIGHT / 2 - 54;
  const secondY = topY + 25;
  unit.resourceNodes = [];

  addResourceRow(unit, 'sp', unit.maxSp, SP_BLOCK_SIZE, COLORS.sp, x - 46, topY);
  addResourceRow(unit, 'hp', unit.maxHp, HP_BLOCK_SIZE, COLORS.hp, x + 20, topY);
  addResourceRow(unit, 'ap', unit.maxAp, AP_BLOCK_SIZE, COLORS.ap, x - 38, secondY);
  addResourceRow(unit, 'pp', unit.maxPp, PP_BLOCK_SIZE, COLORS.pp, x + 4, secondY);
  addResourceRow(unit, 'lp', unit.maxLp, LP_BLOCK_SIZE, COLORS.lp, x + 26, secondY);
  refreshUnitResources(unit);
}

function addResourceRow(unit, key, count, size, color, startX, y) {
  for (let index = 0; index < count; index += 1) {
    const node = sceneRef.add.rectangle(
      startX + index * (size + RESOURCE_BLOCK_SPACING),
      y,
      size,
      size,
      color
    ).setOrigin(0);

    unit.resourceNodes.push({ key, index, node, color });
  }
}

function refreshUnitResources(unit) {
  unit.resourceNodes.forEach((resource) => {
    const value = unit[resource.key];
    const filled = resource.index < value;
    const emptyColor = resource.key === 'lp' ? COLORS.emptyLp : COLORS.spent;
    resource.node.setFillStyle(filled ? resource.color : emptyColor);
  });

  if (unit.hp <= 0) {
    unit.rect.setAlpha(0.35);
    unit.label.setText(`${unit.name} KO`);
  }
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
    refreshUnitResources(unit);
  });

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
  const effectText = resolveSlash(attacker, defender);
  appendLog(`${tag} ${attacker.name} slashes ${defender.name}.`, effectText);

  refreshUnitResources(attacker);
  refreshUnitResources(defender);

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

function resolveSlash(attacker, defender) {
  attacker.ap -= 1;
  const effects = [`${attacker.name} -1 AP`];

  if (defender.sp > 0) {
    const spDamage = Math.min(2, defender.sp);
    defender.sp -= spDamage;
    effects.push(`${defender.name} -${spDamage} SP`);
  } else {
    defender.hp = Math.max(0, defender.hp - 1);
    effects.push(`${defender.name} -1 HP`);
    if (defender.hp <= 0) {
      effects.push(`${defender.name} dies.`);
    }
  }

  return `Effect: ${effects.join(' | ')}`;
}

function appendLog(actionText, effectText) {
  const lines = effectText ? [actionText, effectText] : [actionText];
  lines.forEach((line) => {
    const y = layout.right.y + 78 + logRows.length * 31;
    const row = sceneRef.add.text(layout.right.x + 22, y, line, smallTextStyle());
    row.setWordWrapWidth(layout.right.w - 44);
    logRows.push(row);
  });

  while (logRows.length > LOG_MAX_LINES) {
    logRows.shift().destroy();
    logRows.forEach((row, index) => {
      row.setY(layout.right.y + 78 + index * 31);
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
  refreshUnitResources(loser);
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
