export const ACTIONS = {
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

export const REACTIONS = {
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
