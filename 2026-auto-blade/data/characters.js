export const BASE_UNIT_STATS = {
  hp: 1,
  maxHp: 1,
  sp: 1,
  maxSp: 1,
  ap: 1,
  maxAp: 1,
  rp: 1,
  maxRp: 1,
  lp: 0,
  maxLp: 0,
  ip: 1,
  maxIp: 1
};

export const PROMOTION_STAT_BONUSES = {
  promoted: {
    ap: 1,
    maxAp: 1,
    rp: 1,
    maxRp: 1,
    maxLp: 1
  }
};

export const CHARACTER_CLASSES = {
  squire: {
    key: 'squire',
    name: 'Squire',
    cpCost: 1,
    promoted: false,
    statBonuses: {},
    traits: [],
    equipment: {
      rightHand: null,
      leftHand: null,
      armor: 'chainmail'
    },
    actions: ['slash'],
    reactions: ['block'],
    limits: []
  },
  knight: {
    key: 'knight',
    name: 'Knight',
    cpCost: 2,
    promoted: true,
    statBonuses: {},
    traits: ['hearty', 'guardian'],
    equipment: {
      rightHand: 'longsword',
      leftHand: 'buckler',
      armor: 'plateMail'
    },
    actions: ['slash', 'thrust'],
    reactions: ['block', 'cover'],
    limits: ['parry']
  }
};
