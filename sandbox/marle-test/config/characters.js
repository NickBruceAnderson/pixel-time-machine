export const ACTIVE_CHARACTER = 'marle';

export const CHARACTERS = {
    marle: {
        // --- Identity / asset ---
        assetKey: 'marle',
        assetPath: 'assets/marle6.png',
        frameWidth: 32,
        frameHeight: 48,
        framesPerRow: 22,

        // --- Spawn ---
        startX: 400,
        startY: 300,

        // --- Bounds / collision ---
        bounds: {
            paddingX: 16,
            paddingY: 24,
        },

        hitbox: {
            width: 10,
            height: 32,
            offsetX: 0,
            offsetY: 8,
            debug: false,
            debugColorCss: '#ff0000',
        },

        // --- HUD assets ---
        hud: {
            heartKey: 'playerHeart',
            heartPath: 'assets/player-heart.png',
        },

        // --- Resources ---
        resources: {
            healthMax: 3,
            healthStart: 3,

            staminaMax: 100,
            staminaStart: 100,
            staminaDrainPerSecond: 25,
            staminaRegenPerSecond: 20,
            staminaRunMin: 5,

            manaMax: 100,
            manaStart: 100,
            manaRegenPerSecond: 20,
        },

        // --- Movement ---
        movement: {
            moveSpeed: 300,
            runMultiplier: 2,
            runToggleMode: false,
        },

        // --- Basic combat ---
        combat: {
            basicShotDamage: 1,
            projectileType: 'basic',
            shootCooldownMs: 200,
            projectileSpawnOffsetX: 0,
            projectileSpawnOffsetY: 8,
        },

        // --- Dodge ---
        dodge: {
            key: 'SPACE',
            distance: 250,
            durationMs: 250,
            cooldownMs: 500,
            staminaCost: 20,
            invulnMs: 250,
        },

        // --- Hurt / invulnerability ---
        hurt: {
            frame: 17,
            durationMs: 150,
            knockbackDistance: 18,
            knockbackMs: 100,
            invulnMs: 600,
            invulnBlinkIntervalMs: 80,
        },

        // --- Block / parry ---
        block: {
            frame: 20,
            parryFrame: 21,
            parryWindowMs: 170,
            parryFlashMs: 340,
            staminaDrainPerSecond: 1,
            hitStaminaCost: 20,
            minStaminaToBlock: 20,
            moveSpeedMultiplier: 0.25,

            reflectedProjectile: {
                colorCss: '#ffee00',
                speedMultiplier: 8,
                damageMultiplier: 1,
                lifetimeMs: 1400,
            },
        },

        // --- Spells ---
        spells: {
            aura: {
                healAmount: 1,
                manaCost: 50,
                cooldownMs: 800,
            },

            ice: {
                manaCost: 50,
                cooldownMs: 1000,
                projectileType: 'ice',
                damage: 5,
            },

            haste: {
                manaCost: 100,
                durationMs: 10000,
                shootDivisor: 3,
                outlineColorCss: '#ff9900',
                outlineAlpha: 0.8,
                outlineSize: 4,
                flashStartMs: 3000,
                fastFlashStartMs: 1000,
                flashSlowMs: 300,
                flashFastMs: 100,
            },
        },

        // --- Animation frames ---
        animations: {
            rows: {
                up: 0,
                left: 1,
                down: 2,
                right: 3,
            },

            idleFrame: 0,
            idleFrameRate: 1,

            walkStart: 1,
            walkEnd: 6,
            walkFrameRate: 8,

            runSequence: [1, 2, 7, 7, 4, 5, 8, 8],
            runFrameRate: 12,

            shootReadyFrame: 9,
            shootFireFrame: 10,
            shootFrameRate: 10,

            castStart: 11,
            castEnd: 16,
            castFrameRate: 10,
            castReleaseFrame: 16,
            castCancelsOnShoot: false,

            dodgeSequence: [18, 19],
            dodgeFrameRate: 12,
        },
    },
};