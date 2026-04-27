export const WORLD = {
    gameWidth:    1200,
    gameHeight:   800,
    footerHeight: 96,
    scale:        3,

    tilemap: {
        mapKey:         'forestMap',
        mapPath:        'assets/forest-map.tmj',
        worldLayerName: 'ground',

        tilesets: [
            {
                name: 'grass',
                key:  'grass',
                path: 'assets/grass.png',
            },
            {
                name: 'grass-rock',
                key:  'grass-rock',
                path: 'assets/grass-rock.png',
            },
            {
                name: 'grass-road-bent',
                key:  'grass-road-bent',
                path: 'assets/grass-road-bent.png',
            },
            {
                name: 'grass-road-horizontal',
                key:  'grass-road-horizontal',
                path: 'assets/grass-road-horizontal.png',
            },
            {
                name: 'grass-road-vertical',
                key:  'grass-road-vertical',
                path: 'assets/grass-road-vertical.png',
            },
        ],
    }
};
