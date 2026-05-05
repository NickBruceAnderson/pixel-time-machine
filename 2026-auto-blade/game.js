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
  lp: '⭐'
};

const ACTIONS = {
  slash: {
    key: 'slash',
    name: 'Slash',
    attackType: 'melee',
    apCost: 1,
    spDamage: 2,
    hpDamage: 1
  },
  thrust: {
    key: 'thrust',
    name: 'Thrust',
    attackType: 'melee',
    apCost: 1,
    spDamage: 1,
    hpDamage: 2
  }
};

const REACTIONS = {
  block: {
    key: 'block',
    name: 'Block',
    rpCost: 1,
    lpCost: 0,
    blockAmount: 3,
    lpGainOnFullBlock: 1,
    counterSpDamage: 0,
    rpDamage: 0
  },
  parry: {
    key: 'parry',
    name: 'Parry',
    rpCost: 1,
    lpCost: 1,
    blockAmount: 8,
    lpGainOnFullBlock: 0,
    counterSpDamage: 3,
    rpDamage: 1
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
    rp: 1,
    maxRp: 1,
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
    rp: 1,
    maxRp: 1,
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

const SP_BLOCK_SIZE = 16;
const HP_BLOCK_SIZE = 16;
const AP_BLOCK_SIZE = 12;
const RP_BLOCK_SIZE = 12;
const LP_BLOCK_SIZE = 12;
const RESOURCE_BLOCK_SPACING = 2;

const ACTION_DELAY_MS = 4000;
const FLOATING_EFFECT_DURATION_MS = 1000;
const FLOATING_EFFECT_FONT_SIZE = 24;
const FLOATING_DAMAGE_DELAY_MS = 450;
const ATTACK_LUNGE_DISTANCE = 26;
const ATTACK_LUNGE_DURATION_MS = 140;
const BLOCK_TILT_ANGLE = 12;
const BLOCK_TILT_DURATION_MS = 140;
const PARRY_SPIN_DURATION_MS = 280;
const DAMAGE_BLINK_ALPHA = 0.4;
const DAMAGE_BLINK_DURATION_MS = 90;
const DAMAGE_BLINK_REPEAT = 1;
const INFO_PANEL_PADDING = 24;
const INFO_COLUMN_GAP = 28;
const INFO_TOOLTIP_HEIGHT = 82;
const INFO_DIVIDER_COLOR = COLORS.panelBorder;
const FONT_SIZE_HEADER = 24;
const FONT_SIZE_BODY = 12;
const FONT_SIZE_SMALL = 12;
const LOG_MAX_LINES = 8;
const LOG_LINE_HEIGHT = 20;

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
    rp: classStats.rp,
    maxRp: classStats.maxRp,
    lp: classStats.lp,
    maxLp: classStats.maxLp,
    rect,
    label
  };
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

  renderCharacterPanel(units[0], leftX, columnY, columnWidth, columnHeight);
  renderCharacterPanel(units[1], rightX, columnY, columnWidth, columnHeight);
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
      iconNode.setAlpha(index < current ? 1 : 0.25);
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
    'P1: Block',
    `(Cost: ${block.rpCost}${RESOURCE_ICONS.rp} | Blocks: ${block.blockAmount}${RESOURCE_ICONS.sp} or ${block.blockAmount}${RESOURCE_ICONS.hp})`
  );
  addSplitLine(
    'P2: Parry',
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

function playAnimationEffect(animationEffect) {
  if (animationEffect.type === 'block') {
    playBlockAnimation(animationEffect.unit);
  } else if (animationEffect.type === 'parry') {
    playParryAnimation(animationEffect.unit);
  } else if (animationEffect.type === 'damage') {
    playDamageBlink(animationEffect.unit);
  }
}

function playAttackLunge(attacker, defender) {
  const direction = defender.rect.x > attacker.rect.x ? 1 : -1;
  const originalRectX = attacker.rect.x;
  const originalLabelX = attacker.label.x;

  sceneRef.tweens.add({
    targets: [attacker.rect, attacker.label],
    x: `+=${ATTACK_LUNGE_DISTANCE * direction}`,
    duration: ATTACK_LUNGE_DURATION_MS,
    yoyo: true,
    onComplete: () => {
      attacker.rect.x = originalRectX;
      attacker.label.x = originalLabelX;
    }
  });
}

function playBlockAnimation(unit) {
  unit.rect.angle = 0;
  sceneRef.tweens.add({
    targets: unit.rect,
    angle: BLOCK_TILT_ANGLE,
    duration: BLOCK_TILT_DURATION_MS,
    yoyo: true,
    onComplete: () => {
      unit.rect.angle = 0;
    }
  });
}

function playParryAnimation(unit) {
  unit.rect.angle = 0;
  sceneRef.tweens.add({
    targets: unit.rect,
    angle: 360,
    duration: PARRY_SPIN_DURATION_MS,
    ease: 'Quad.easeOut',
    onComplete: () => {
      unit.rect.angle = 0;
    }
  });
}

function playDamageBlink(unit) {
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
    unit.rp = unit.maxRp;
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
  const selectedAction = chooseAction(attacker, defender);
  playAttackLunge(attacker, defender);
  const effect = resolveAction(attacker, defender, selectedAction);

  const actionCostText = RESOURCE_ICONS.ap.repeat(selectedAction.apCost);
  appendLog(`${tag} ${attacker.name} uses ${actionCostText}${selectedAction.name}.`, effect.logText);

  effect.floatingEffects.forEach((floatingEffect) => {
    sceneRef.time.delayedCall(floatingEffect.delayMs || 0, () => {
      showFloatingEffect(floatingEffect.unit, floatingEffect.text);
    });
  });
  effect.animationEffects.forEach((animationEffect) => {
    sceneRef.time.delayedCall(animationEffect.delayMs || 0, () => {
      playAnimationEffect(animationEffect);
    });
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

  const effects = [];
  const floatingEffects = [
    {
      unit: attacker,
      text: formatResourcePopup(selectedAction.apCost, 'ap'),
      delayMs: 0
    }
  ];
  const animationEffects = [];

  const damageKey = defender.sp > 0 ? 'sp' : 'hp';
  const damageAmount = damageKey === 'sp' ? selectedAction.spDamage : selectedAction.hpDamage;
  let remainingDamage = damageAmount;

  const reaction = chooseReaction(defender, attacker, selectedAction);

  if (reaction) {
    defender.rp = Math.max(0, defender.rp - reaction.rpCost);
    defender.lp = Math.max(0, defender.lp - reaction.lpCost);

    const blockedAmount = Math.min(reaction.blockAmount, remainingDamage);
    remainingDamage = Math.max(0, remainingDamage - blockedAmount);

    effects.push(`${defender.name} uses ${formatReactionCost(reaction)}${reaction.name}!`);
    animationEffects.push({
      type: reaction.key,
      unit: defender,
      delayMs: FLOATING_DAMAGE_DELAY_MS
    });

    floatingEffects.push({
      unit: defender,
      text: `-${formatReactionCost(reaction)}`,
      delayMs: FLOATING_DAMAGE_DELAY_MS
    });

    if (remainingDamage <= 0) {
      if (reaction.lpGainOnFullBlock > 0) {
        const oldLp = defender.lp;
        defender.lp = Math.min(defender.maxLp, defender.lp + reaction.lpGainOnFullBlock);
        const lpGained = defender.lp - oldLp;

        if (lpGained > 0) {
          effects.push(`${defender.name} gains${RESOURCE_ICONS.lp.repeat(lpGained)}.`);
          floatingEffects.push({
            unit: defender,
            text: `+${RESOURCE_ICONS.lp.repeat(lpGained)}`,
            delayMs: FLOATING_DAMAGE_DELAY_MS * 2
          });
        }
      }

      if (reaction.counterSpDamage > 0) {
        const counterDamage = Math.min(reaction.counterSpDamage, attacker.sp);
        attacker.sp = Math.max(0, attacker.sp - counterDamage);

        if (counterDamage > 0) {
          effects.push(`${attacker.name} -${counterDamage}${RESOURCE_ICONS.sp}.`);
          floatingEffects.push({
            unit: attacker,
            text: formatResourcePopup(counterDamage, 'sp'),
            delayMs: FLOATING_DAMAGE_DELAY_MS * 2
          });
          animationEffects.push({
            type: 'damage',
            unit: attacker,
            delayMs: FLOATING_DAMAGE_DELAY_MS * 2
          });
        }
      }

      if (reaction.rpDamage > 0) {
        const rpDamage = Math.min(reaction.rpDamage, attacker.rp);
        attacker.rp = Math.max(0, attacker.rp - rpDamage);

        if (rpDamage > 0) {
          effects.push(`${attacker.name} -${rpDamage}${RESOURCE_ICONS.rp}.`);
          floatingEffects.push({
            unit: attacker,
            text: formatResourcePopup(rpDamage, 'rp'),
            delayMs: FLOATING_DAMAGE_DELAY_MS * 3
          });
        }
      }

      return {
        logText: effects.join(' '),
        floatingEffects,
        animationEffects
      };
    }
  }

  if (damageKey === 'sp') {
    const spDamage = Math.min(remainingDamage, defender.sp);
    defender.sp = Math.max(0, defender.sp - spDamage);

    effects.push(`${defender.name} -${spDamage}${RESOURCE_ICONS.sp}.`);
    floatingEffects.push({
      unit: defender,
      text: formatResourcePopup(spDamage, 'sp'),
      delayMs: reaction ? FLOATING_DAMAGE_DELAY_MS * 2 : FLOATING_DAMAGE_DELAY_MS
    });
    if (spDamage > 0) {
      animationEffects.push({
        type: 'damage',
        unit: defender,
        delayMs: reaction ? FLOATING_DAMAGE_DELAY_MS * 2 : FLOATING_DAMAGE_DELAY_MS
      });
    }
  } else {
    const hpDamage = Math.min(remainingDamage, defender.hp);
    defender.hp = Math.max(0, defender.hp - hpDamage);

    effects.push(`${defender.name} -${hpDamage}${RESOURCE_ICONS.hp}.`);
    floatingEffects.push({
      unit: defender,
      text: formatResourcePopup(hpDamage, 'hp'),
      delayMs: reaction ? FLOATING_DAMAGE_DELAY_MS * 2 : FLOATING_DAMAGE_DELAY_MS
    });
    if (hpDamage > 0) {
      animationEffects.push({
        type: 'damage',
        unit: defender,
        delayMs: reaction ? FLOATING_DAMAGE_DELAY_MS * 2 : FLOATING_DAMAGE_DELAY_MS
      });
    }

    if (defender.hp <= 0) {
      effects.push(`${defender.name} dies.`);
    }
  }

  return {
    logText: effects.join(' '),
    floatingEffects,
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

function formatResourcePopup(amount, resourceKey) {
  return `-${RESOURCE_ICONS[resourceKey].repeat(amount)}`;
}

function appendLog(actionText, effectText) {
  const line = effectText ? `${actionText} ${effectText}` : actionText;

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
