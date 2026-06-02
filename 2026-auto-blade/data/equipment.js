export const EQUIPMENT = {
  // MAIN-HAND
  broadsword: {
    key: 'broadsword',
    name: 'Broadsword',
    shortLabel: 'BRDS',
    slotType: 'sword',
    grantsActions: ['slash'],
    shortText: 'Grants Slash',
    tooltip: 'Broadsword grants Slash.'
  },
  longsword: {
    key: 'longsword',
    name: 'Longsword',
    shortLabel: 'LONG',
    slotType: 'sword',
    grantsActions: ['slash', 'thrust'],
    shortText: 'Slash +🛡️, Thrust +❤️',
    tooltip: 'Longsword improves basic attacks. Slash deals +1 stance damage. Thrust deals +1 HP damage.',
    actionBonuses: {
      slash: {
        spDamage: 1
      },
      thrust: {
        hpDamage: 1
      }
    }
  },
  dagger: {
    key: 'dagger',
    name: 'Dagger',
    shortLabel: 'DAGR',
    slotType: 'dagger',
    grantsActions: ['shiv'],
    shortText: 'Grants Shiv',
    tooltip: 'Dagger grants Shiv.'
  },
  shortbow: {
    key: 'shortbow',
    name: 'Shortbow',
    shortLabel: 'SBOW',
    slotType: 'bow',
    grantsActions: ['arrowShot'],
    shortText: 'Grants Arrow Shot',
    tooltip: 'Shortbow grants Arrow Shot.'
  },

  // OFF-HAND
  buckler: {
    key: 'buckler',
    name: 'Buckler',
    shortLabel: 'BUCK',
    slotType: 'shield',
    shortText: 'Block +🛡️',
    tooltip: 'Buckler improves Block by 1. It does not grant Block, Cover, or Parry.',
    reactionBonuses: {
      block: {
        blockAmount: 1
      }
    }
  },

  // ARMOR
  chainmail: {
    key: 'chainmail',
    name: 'Chainmail',
    shortLabel: 'CHNM',
    slotType: 'armor',
    armorWeight: 'heavy',
    shortText: '+🛡️',
    tooltip: 'Chainmail gives +1 stance.',
    statBonuses: {
      sp: 1,
      maxSp: 1
    }
  },

  plateMail: {
    key: 'plateMail',
    name: 'Plate Mail',
    shortLabel: 'PLTE',
    slotType: 'armor',
    armorWeight: 'heavy',
    shortText: '+🛡️🛡️',
    tooltip: 'Plate Mail gives +2 stance.',
    statBonuses: {
      sp: 2,
      maxSp: 2
    }
  },

  leather: {
    key: 'leather',
    name: 'Leather',
    shortLabel: 'LTHR',
    slotType: 'armor',
    armorWeight: 'medium',
    moveBonus: 1,
    shortText: '+🥾',
    tooltip: 'Leather lets Move advance 1 extra space.'
  }
};



