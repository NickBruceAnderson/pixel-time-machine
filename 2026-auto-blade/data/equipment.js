export const EQUIPMENT = {
  longsword: {
    key: 'longsword',
    name: 'Longsword',
    slot: 'rightHand',
    actionBonuses: {
      slash: {
        spDamage: 1
      },
      thrust: {
        hpDamage: 1
      }
    }
  },
  buckler: {
    key: 'buckler',
    name: 'Buckler',
    slot: 'leftHand',
    reactionBonuses: {
      block: {
        blockAmount: 1
      }
    },
    limitBonuses: {
      parry: {
        blockAmount: 1
      }
    }
  },
  plateMail: {
    key: 'plateMail',
    name: 'Plate Mail',
    slot: 'armor',
    statBonuses: {
      sp: 2,
      maxSp: 2
    }
  },
  chainmail: {
    key: 'chainmail',
    name: 'Chainmail',
    slot: 'armor',
    statBonuses: {
      sp: 1,
      maxSp: 1
    }
  }
};
