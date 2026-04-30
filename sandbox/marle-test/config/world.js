export const WORLD = {
    gameWidth:    1200,
    gameHeight:   800,
    footerHeight: 96,
    scale:        3,

    tilemap: {
        mapKey:  'forestMap',
        mapPath: 'assets/forest-map.tmj',

        groundLayerName:   'ground',
        doodadsLayerName:  'doodads',
        canopyLayerName:   'canopy',
        colliderLayerName: 'colliders',

        colliderDebug:         false,
        colliderDebugColorCss: '#ff00ff',
        colliderDebugAlpha:    0.3,

        tilesets: [
            {
                name: 'grass',
                key:  'grass',
                path: 'assets/grass.png',
            },
            {
                name: 'grass-road-horizontal',
                key:  'grass-road-horizontal',
                path: 'assets/grass-road-horizontal.png',
            },
            {
                name: 'grass-road-bent',
                key:  'grass-road-bent',
                path: 'assets/grass-road-bent.png',
            },
            {
                name: 'grass-road-vertical',
                key:  'grass-road-vertical',
                path: 'assets/grass-road-vertical.png',
            },
            {
                name: 'grass-rock',
                key:  'grass-rock',
                path: 'assets/grass-rock.png',
            },
            {
                name: 'rocks',
                key:  'rocks',
                path: 'assets/rocks.png',
            },
            {
                name: 'tree',
                key:  'tree',
                path: 'assets/tree.png',
            },
        ],
    },
};