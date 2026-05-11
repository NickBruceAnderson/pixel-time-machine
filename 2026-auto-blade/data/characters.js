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
    limits: [],
    visual: {
      idle: {
        textureKey: 'squire-idle',
        assetPath: 'assets/squire/squire-idle.png',
        frameWidth: 16,
        frameHeight: 16,
        defaultFrame: 0,
        scale: 8
      },
      animations: {}
    }
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
    limits: ['parry'],
    visual: {
      idle: {
        textureKey: 'knight-idle',
        assetPath: 'assets/knight/Knight-Idle.png',
        frameWidth: 16,
        frameHeight: 16,
        defaultFrame: 0,
        twitchFrame: 1,
        scale: 8
      },
      animations: {
        attack: {
          textureKey: 'knight-attack',
          assetPath: 'assets/knight/Knight-Attack.png',
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
          assetPath: 'assets/knight/Knight-Block-Parry.png',
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
          assetPath: 'assets/knight/Knight-Block-Parry.png',
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
    traits: [],
    equipment: {
      rightHand: null,
      leftHand: null,
      armor: null
    },
    actions: ['arrowShot'],
    reactions: [],
    limits: [],
    visual: {
      idle: {
        textureKey: 'archer-idle',
        assetPath: 'assets/archer/archer-idle.png',
        frameWidth: 16,
        frameHeight: 16,
        defaultFrame: 0,
        scale: 8
      },
      animations: {}
    }
  }
};
