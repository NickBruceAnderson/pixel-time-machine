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
    traits: ['fastLearner'],
    gearSlots: ['sword', 'shield', 'armor'],
    equipment: {
      sword: 'broadsword',
      shield: 'buckler',
      armor: 'chainmail'
    },
    actions: [],
    reactions: ['block'],
    limits: [],
    visual: {
      idle: {
        textureKey: 'squire-idle',
        assetPath: 'assets/squire/squire-idle.png',
        frameWidth: 16,
        frameHeight: 16,
        defaultFrame: 0,
        twitchFrame: 1,
        scale: 8,
        spriteOffsetX: 0,
        spriteOffsetY: 0
      },
      animations: {
        attack: {
          textureKey: 'squire-attack',
          assetPath: 'assets/squire/squire-attack.png',
          frameWidth: 16,
          frameHeight: 16,
          startFrame: 0,
          endFrame: 5,
          frameRate: 12,
          animationKey: 'squire-attack',
          finalPoseHoldMs: 1000
        },
        block: {
          textureKey: 'squire-block-parry',
          assetPath: 'assets/squire/squire-block-parry.png',
          frameWidth: 16,
          frameHeight: 16,
          startFrame: 0,
          endFrame: 2,
          frameRate: 10,
          animationKey: 'squire-block',
          finalPoseHoldMs: 1000
        }
      }
    }
  },
  thief: {
    key: 'thief',
    name: 'Thief',
    cpCost: 1,
    promoted: false,
    statBonuses: {},
    traits: ['quick'],
    gearSlots: ['dagger', 'armor'],
    equipment: {
      dagger: 'dagger',
      armor: 'leather'
    },
    actions: [],
    reactions: ['dodge'],
    limits: [],
    visual: {
      idle: {
        textureKey: 'thief-idle',
        assetPath: 'assets/thief/thief-idle.png',
        frameWidth: 16,
        frameHeight: 16,
        defaultFrame: 0,
        scale: 8,
        spriteOffsetX: -20,
        spriteOffsetY: 0
      },
      animations: {
        attack: {
          textureKey: 'thief-attack',
          assetPath: 'assets/thief/thief-attack.png',
          frameWidth: 16,
          frameHeight: 16,
          startFrame: 0,
          endFrame: 4,
          frameRate: 14,
          animationKey: 'thief-attack',
          finalPoseHoldMs: 100
        }
      }
    }
  },
  knight: {
    key: 'knight',
    name: 'Knight',
    cpCost: 2,
    promoted: true,
    statBonuses: {},
    traits: ['hearty', 'guardian'],
    gearSlots: ['sword', 'shield', 'armor'],
    equipment: {
      sword: 'longsword',
      shield: 'buckler',
      armor: 'plateMail'
    },
    actions: [],
    reactions: ['block', 'cover'],
    limits: ['parry'],
    visual: {
      idle: {
        textureKey: 'knight-idle',
        assetPath: 'assets/knight/knight-idle.png',
        frameWidth: 16,
        frameHeight: 16,
        defaultFrame: 0,
        twitchFrame: 1,
        scale: 8,
        spriteOffsetX: 0,
        spriteOffsetY: 0
      },
      animations: {
        attack: {
          textureKey: 'knight-attack',
          assetPath: 'assets/knight/knight-attack.png',
          frameWidth: 16,
          frameHeight: 16,
          startFrame: 0,
          endFrame: 5,
          frameRate: 12,
          animationKey: 'knight-attack',
          finalPoseHoldMs: 1000
        },
        block: {
          textureKey: 'knight-block-parry',
          assetPath: 'assets/knight/knight-block-parry.png',
          frameWidth: 16,
          frameHeight: 16,
          startFrame: 0,
          endFrame: 2,
          frameRate: 10,
          animationKey: 'knight-block',
          finalPoseHoldMs: 1000
        },
        parry: {
          textureKey: 'knight-block-parry',
          assetPath: 'assets/knight/knight-block-parry.png',
          frameWidth: 16,
          frameHeight: 16,
          startFrame: 0,
          endFrame: 11,
          frameRate: 12,
          animationKey: 'knight-parry',
          finalPoseHoldMs: 1000,
          flourishFrameCount: 7
        }
      }
    }
  },
  archer: {
    key: 'archer',
    name: 'Archer',
    cpCost: 1,
    promoted: false,
    statBonuses: {},
    traits: ['marksman'],
    gearSlots: ['bow', 'armor'],
    equipment: {
      bow: 'shortbow',
      armor: 'leather'
    },
    actions: [],
    reactions: ['truestrike'],
    limits: [],
    visual: {
      idle: {
        textureKey: 'archer-idle',
        assetPath: 'assets/archer/archer-idle.png',
        frameWidth: 16,
        frameHeight: 16,
        defaultFrame: 0,
        scale: 8,
        spriteOffsetX: -36,
        spriteOffsetY: 0
      },
      animations: {}
    }
  }
};
