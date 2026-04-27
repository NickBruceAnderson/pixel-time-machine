export const ACTIVE_CHARACTER = 'marle';

export const CHARACTERS = {
    marle: {
        assetKey:     'marle',
        assetPath:    'assets/marle5.png',
        frameWidth:   32,
        frameHeight:  48,
        framesPerRow: 17,
        startX:       400,
        startY:       300,

        movement: {
            moveSpeed:      300,
            runMultiplier:  2,
            runToggleMode:  false,
        },

        hitbox: {
            width:         10,
            height:        32,
            offsetX:       0,
            offsetY:       8,
            debug:         false,
            debugColorCss: '#ff0000',
        },

        animations: {
            rows: {
                up:    0,
                left:  1,
                down:  2,
                right: 3,
            },
            idleFrame:         0,
            walkStart:         1,
            walkEnd:           6,
            runSequence:       [1, 2, 7, 7, 4, 5, 8, 8],
            shootReadyFrame:   9,
            shootFireFrame:    10,
            shootFrameRate:    10,
            castStart:         11,
            castEnd:           16,
            castFrameRate:     10,
            castReleaseFrame:  16,
            castCancelsOnShoot: false,
        },

        combat: {
            basicShotDamage:        1,
            projectileType:         'basic',
            shootCooldownMs:        200,
            projectileSpawnOffsetX: 0,
            projectileSpawnOffsetY: 8,
        },

        resources: {
            healthMax:             3,
            healthStart:           3,
            staminaMax:            100,
            staminaStart:          100,
            staminaDrainPerSecond: 25,
            staminaRegenPerSecond: 20,
            staminaRunMin:         5,
            manaMax:               100,
            manaStart:             100,
            manaRegenPerSecond:    20,
        },

        spells: {
            aura: {
                healAmount: 1,
                manaCost:   50,
                cooldownMs: 800,
            },
            ice: {
                manaCost:      50,
                cooldownMs:    1000,
                projectileType: 'ice',
                damage:        5,
            },
            haste: {
                manaCost:         100,
                durationMs:       10000,
                shootDivisor:     3,
                outlineColorCss:  '#ff9900',
                outlineAlpha:     0.8,
                outlineSize:      4,
                flashStartMs:     3000,
                fastFlashStartMs: 1000,
                flashSlowMs:      300,
                flashFastMs:      100,
            },
        },
    },
};
