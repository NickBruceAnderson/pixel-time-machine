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
            respawnMs:   3000,
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
            cooldownMs:            650,
            projectileSpeed:       140,
            projectileType:        'enemyBullet',
            projectileSpawnOffsetX: 0,
            projectileSpawnOffsetY: 16,
        },
    }
};

export const ENEMY_SPAWNS = [
    { type: 'slime', x: 600,  y: 150, shootDirection: 'left', ai: { aimMode: 'fixed' } },
    { type: 'slime', x: 600,  y: 300 },
    { type: 'slime', x: 600,  y: 450, ai: { aimMode: 'none' } },
    { type: 'slime', x: 1100, y: 300 },
];
