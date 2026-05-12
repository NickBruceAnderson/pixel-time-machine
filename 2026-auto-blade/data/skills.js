export const ACTIONS = {
  slash: {
    key: 'slash',
    name: 'Slash',
    attackType: 'melee',
    range: 2,
    apCost: 1,
    spDamage: 1,
    hpDamage: 1,
    shortText: '⬤ → 🛡️ or ❤️',
    tooltip: 'Slash costs 1 AP. It deals stance damage first. If stance is broken, it deals HP damage.'
  },

  shiv: {
    key: 'shiv',
    name: 'Shiv',
    attackType: 'melee',
    range: 2,
    apCost: 1,
    spDamage: 1,
    hpDamage: 1,
    shortText: '⬤ → 🛡️ or ❤️',
    tooltip: 'Shiv costs 1 AP. It deals stance damage first. If stance is broken, it deals HP damage.'
  },

  thrust: {
    key: 'thrust',
    name: 'Thrust',
    attackType: 'melee',
    range: 2,
    apCost: 1,
    spDamage: 1,
    hpDamage: 1,
    shortText: '⬤ → 🛡️ or ❤️',
    tooltip: 'Thrust costs 1 AP. It deals stance damage first. If stance is broken, it deals HP damage.'
  },

  arrowShot: {
    key: 'arrowShot',
    name: 'Arrow Shot',
    attackType: 'ranged',
    ranged: true,
    range: 2,
    apCost: 1,
    spDamage: 1,
    hpDamage: 1,
    shortText: '⬤ → 🏹 Back row first',
    tooltip: 'Arrow Shot costs 1 AP. Ranged. Targets the closest reachable occupied row.'
  },

  move: {
    key: 'move',
    name: 'Move',
    actionType: 'utility',
    apCost: 1,
    range: null,
    spDamage: 0,
    hpDamage: 0,
    shortText: 'Move forward',
    tooltip: 'Move costs 1 AP. It advances one row toward the enemy.'
  }
};

export const REACTIONS = {
  block: {
    key: 'block',
    name: 'Block',
    reactionType: 'block',
    rpCost: 1,
    lpCost: 0,
    blockAmount: 1,
    counterSpDamage: 0,
    rpDamage: 0,
    shortText: '⬤ → Blocks 🛡️ or ❤️',
    tooltip: 'Block costs 1 RP. It reduces incoming stance or HP damage.'
  },

  cover: {
    key: 'cover',
    name: 'Cover',
    reactionType: 'cover',
    rpCost: 1,
    lpCost: 0,
    blockAmount: 0,
    counterSpDamage: 0,
    rpDamage: 0,
    isPlaceholder: true,
    shortText: 'Block for Ally',
    tooltip: 'Cover will let this unit block for an ally. Not implemented yet.'
  },

  dodge: {
    key: 'dodge',
    name: 'Dodge',
    reactionType: 'dodge',
    rpCost: 1,
    lpCost: 0,
    blockAmount: 0,
    counterSpDamage: 0,
    rpDamage: 0,
    rpRefund: 1,
    shortText: '⬤ → Miss',
    tooltip: 'Dodge costs 1 RP. It avoids an incoming attack unless Truestrike prevents evasion.'
  },

  truestrike: {
    key: 'truestrike',
    name: 'Truestrike',
    reactionType: 'attackBuff',
    targetScope: 'self',
    rpCost: 1,
    lpCost: 0,
    blockAmount: 0,
    counterSpDamage: 0,
    rpDamage: 0,
    preventsEvade: true,
    preventsBlock: false,
    shortText: 'Self: Cannot miss',
    tooltip: 'Truestrike costs 1 RP. It makes this attack unable to be evaded.'
  },

  truesight: {
    key: 'truesight',
    name: 'Truesight',
    reactionType: 'supportBuff',
    targetScope: 'ally',
    implemented: false,
    rpCost: 1,
    lpCost: 0,
    blockAmount: 0,
    counterSpDamage: 0,
    rpDamage: 0,
    preventsEvade: true,
    preventsBlock: false,
    shortText: 'Ally: Cannot miss',
    tooltip: 'Reserved future support buff. Not currently assigned.'
  }
};

export const LIMITS = {
  parry: {
    key: 'parry',
    name: 'Parry',
    limitType: 'parry',
    rpCost: 1,
    lpCost: 1,
    blockAmount: 0,
    blocksAllDamage: true,
    counterSpDamage: 3,
    rpDamage: 1,
    shortText: '🔷⭐ -> Blocks all, -🛡️🛡️🛡️, -🔷',
    tooltip: 'Parry costs 1 RP and 1 LP. It blocks all melee damage, breaks enemy stance, and drains 1 RP.'
  }
};

export const TRAITS = {
  fastLearner: {
    key: 'fastLearner',
    name: 'Fast Learner',
    shortText: '+50% mastery gain',
    tooltip: 'Fast Learner gives +50% mastery gain from equipped gear skills.',
    masteryGainMultiplier: 1.5
  },

  quick: {
    key: 'quick',
    name: 'Quick',
    shortText: '+🚩',
    tooltip: 'Quick gives +1 initiative.',
    statBonuses: {
      ip: 1,
      maxIp: 1
    }
  },

  fullQuiver: {
    key: 'fullQuiver',
    name: 'Full Quiver',
    shortText: 'No reload',
    tooltip: 'Full Quiver means ranged attacks do not require reload.',
    ignoresReload: true
  },

  marksman: {
    key: 'marksman',
    name: 'Marksman',
    shortText: '+⏹️',
    tooltip: 'Marksman increases Arrow Shot range by 1.',
    actionRangeBonus: { arrowShot: 1 }
  },

  hearty: {
    key: 'hearty',
    name: 'Hearty',
    shortText: '+❤️',
    tooltip: 'Hearty gives this unit +1 HP.',
    statBonuses: {
      hp: 1,
      maxHp: 1
    }
  },

  guardian: {
    key: 'guardian',
    name: 'Guardian',
    shortText: 'Full Block: +⭐',
    tooltip: 'Guardian gives 1 LP when Block prevents all incoming damage.',
    fullBlockLpGain: 1
  }
};

export const PASSIVES = TRAITS;
