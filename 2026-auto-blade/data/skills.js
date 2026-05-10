export const ACTIONS = {
  slash: {
    key: 'slash',
    name: 'Slash',
    attackType: 'melee',
    apCost: 1,
    spDamage: 1,
    hpDamage: 1,
    shortText: '⬤ → 🛡️ or ❤️',
    tooltip: 'Slash costs 1 AP. It deals stance damage first. If stance is broken, it deals HP damage.'
  },

  thrust: {
    key: 'thrust',
    name: 'Thrust',
    attackType: 'melee',
    apCost: 1,
    spDamage: 1,
    hpDamage: 1,
    shortText: '⬤ → 🛡️ or ❤️',
    tooltip: 'Thrust costs 1 AP. It deals stance damage first. If stance is broken, it deals HP damage.'
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
  }
};

export const LIMITS = {
  parry: {
    key: 'parry',
    name: 'Parry',
    limitType: 'parry',
    rpCost: 1,
    lpCost: 1,
    blockAmount: 1,
    counterSpDamage: 3,
    rpDamage: 1,
    shortText: '⬤⭐ → ⬤ + 🛡️🛡️🛡️ + Blocks',
    tooltip: 'Parry costs 1 LP. It blocks incoming damage and breaks enemy stance.'
  }
};

export const TRAITS = {
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