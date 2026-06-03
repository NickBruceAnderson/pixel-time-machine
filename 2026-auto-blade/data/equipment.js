export const EQUIPMENT = {
  // MAIN-HAND
  broadsword: {
    key: 'broadsword',
    name: 'Broadsword',
    shortLabel: 'BRDS',
    slotType: 'sword',
    grantsActions: ['slash'],
    shortText: 'Grants Slash',
    tooltip: 'Broadsword grants Slash.',
    description: 'Grants Slash. A reliable blade for basic front-line attacks.'
  },
  longsword: {
    key: 'longsword',
    name: 'Longsword',
    shortLabel: 'LONG',
    slotType: 'sword',
    grantsActions: ['slash', 'thrust'],
    shortText: 'Slash +SP, Thrust +HP',
    tooltip: 'Longsword improves basic attacks. Slash deals +1 stance damage. Thrust deals +1 HP damage.',
    description: 'Grants Slash and Thrust. Slash hits +1 SP; Thrust hits +1 HP. A longer reach for harder blows.',
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
    tooltip: 'Dagger grants Shiv.',
    description: 'Grants Shiv. A quick blade suited for close, precise strikes.'
  },
  shortbow: {
    key: 'shortbow',
    name: 'Shortbow',
    shortLabel: 'SBOW',
    slotType: 'bow',
    grantsActions: ['arrowShot'],
    shortText: 'Grants Arrow Shot',
    tooltip: 'Shortbow grants Arrow Shot.',
    description: 'Grants Arrow Shot. Lets the unit attack from range without closing in.'
  },

  // OFF-HAND
  buckler: {
    key: 'buckler',
    name: 'Buckler',
    shortLabel: 'BUCK',
    slotType: 'shield',
    shortText: 'Block +1 SP',
    tooltip: 'Buckler improves Block by 1. It does not grant Block, Cover, or Parry.',
    description: 'Block +1 SP. A light shield made for quick guards.',
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
    shortText: '+1 SP',
    tooltip: 'Chainmail gives +1 stance.',
    description: '+1 SP. Sturdy linked armor that helps hold stance.',
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
    shortText: '+2 SP',
    tooltip: 'Plate Mail gives +2 stance.',
    description: '+2 SP. Heavy full-body armor that forms a thick wall of stance.',
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
    shortText: '+1 MV',
    tooltip: 'Leather lets Move advance 1 extra space.',
    description: '+1 MV. Light armor that keeps the unit mobile.'
  }
};



