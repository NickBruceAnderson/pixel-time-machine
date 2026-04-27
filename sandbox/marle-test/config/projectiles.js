export const PROJECTILE_TYPES = {
    basic: {
        kind:       'rectangle',
        colorCss:   '#ffffff',
        width:      10,
        height:     10,
        speed:      2000,
        lifetimeMs: 1000,
        damage:     1,
    },

    enemyBullet: {
        kind:       'rectangle',
        colorCss:   '#ff3333',
        width:      10,
        height:     6,
        speed:      220,
        lifetimeMs: 3000,
        damage:     1,
    },

    ice: {
        kind:       'image',
        assetKey:   'iceProjectile',
        assetPath:  'assets/ice-blast.png',
        width:      48,
        height:     48,
        speed:      700,
        lifetimeMs: 1400,
        damage:     5,
        scale:      1,
        angles: {
            up:    0,
            right: 90,
            down:  180,
            left:  270,
        },
    },
};
