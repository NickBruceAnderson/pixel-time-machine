export const ENEMY_TYPES = {
    slime: {
        assetKey:    'slime',
        assetPath:   'assets/slime.png',
        frameWidth:  32,
        frameHeight: 48,

        animations: {
            idleKey:       'slime-idle',
            idleFrames:    [0, 1, 2, 1, 0],
            idleFrameRate: 6,

            attackKey:       'slime-attack',
            attackFrames:    [4, 5, 6, 7, 8],
            attackFrameRate: 8,
            shootFrame:      7,
        },

        stats: {
            maxHealth:   3,
            damage:      1,
            armor:       0,
            moveSpeed:   25,
            respawnMs:   0,
            hitManaGain: 5,
        },

        ai: {
            moveMode:     'slowChase',
            aimMode:      'towardPlayer',
            aggroRange:   300,
            stopDistance: 140,
        },

        hitbox: {
            width:         26,
            height:        22,
            offsetX:       0,
            offsetY:       13,
            debug:         false,
            debugColorCss: '#ff0000',
            debugAlpha:    0,
            debugLineWidth: 1,
        },

        healthBar: {
            width:        36,
            height:       5,
            yOffset:      0,
            bgColorCss:   '#331111',
            fillColorCss: '#00cc44',
        },

        attack: {
            cooldownMs:            1000,
            projectileSpeed:       250,
            projectileType:        'enemyBullet',
            projectileSpawnOffsetX: 0,
            projectileSpawnOffsetY: 16,
        },
    }
};

export const ENEMY_SPAWNS = [
    //{ type: 'slime', x: 1000, y: 150, shootDirection: 'left', ai: { aimMode: 'fixed' } },
    //{ type: 'slime', x: 950, y: 450, ai: { aimMode: 'none' } },
    { type: 'slime', x: 790, y: 430 },
    { type: 'slime', x: 865, y: 555 },
    { type: 'slime', x: 1140, y: 610 },
    { type: 'slime', x: 980, y: 120 },
    { type: 'slime', x: 1130, y: 185 },
];
