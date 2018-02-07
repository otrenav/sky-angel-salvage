
var CLIENTS = {
    ARC: {
        data: [],
        color: '#fb9678',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    C4: {
        data: [],
        color: '#66ffff',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    CIS: {
        data: [],
        color: '#00c292',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    DCX: {
        data: [],
        color: '#ab8ce4',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    DHL: {
        data: [],
        color: '#ffff99',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    DHLT: {
        data: [],
        color: '#01c0c8',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    DMC: {
        data: [],
        color: '#FFBC67',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    GEO: {
        data: [],
        color: '#DA727E',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    HEL: {
        data: [],
        color: '#AC6C82',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    HSD: {
        data: [],
        color: '#E94858',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    JAH: {
        data: [],
        color: '#82BF6E',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    MOL: {
        data: [],
        color: '#99ff66',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    MSC: {
        data: [],
        color: '#6699ff',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    MSK: {
        data: [],
        color: '#ffa500',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    NAV: {
        data: [],
        color: '#3CB4CB',
        category: 'naviero',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    NAVT: {
        data: [],
        color: '#F0F0F1',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    NTA: {
        data: [],
        color: '#ffffff',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    OIL: {
        data: [],
        color: '#ffccff',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    SMT: {
        data: [],
        color: '#18CDCA',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    SSA: {
        data: [],
        color: '#4F80E1',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    },
    SUN: {
        data: [],
        color: '#66ff99',
        category: 'terrestre',
        visuals: { inactive: [], active: [], future: [], dynamic: [] }
    }
};

var DATA = [
    [1, 1, 17.956162, -102.176213, 19.613204, -99.220851,
     new Date("February 5, 2018 11:13:00"),
     new Date("January 10, 2018 15:00:00"), 'MSK'],
    [2, 1, 17.956162, -102.176213, 19, -99,
     new Date("February 13, 2018 11:13:00"),
     new Date("February 13, 2018 11:13:00"), 'DMC'],
    [3, 1, 17.956162, -102.176213, 20.034639, -99.253462,
     new Date("February 6, 2018 11:13:00"),
     new Date("February 10, 2018 15:00:00"), 'MSK'],
    [4, 1, 17.956162, -102.176213, 20, -100,
     new Date("February 7, 2018 11:13:00"),
     new Date("February 20, 2018 11:13:00"), 'NAV'],
    [8, 1, 19.069289, -104.288456, 19.618499755859, -99.169898986816,
     new Date("February 8, 2018 11:13:00"),
     new Date("February 10, 2018 11:13:00"), 'JAH'],
    [9, 1, 19.069289, -104.288456, 19.709400177002, -99.203399658203,
     new Date("February 7, 2018 11:13:00"),
     new Date("February 15, 2018 15:00:00"), 'HSD'],
    [10, 1, 19.069289, -104.288456, 19, -99,
     new Date("February 7, 2018 11:13:00"),
     new Date("February 28, 2018 11:13:00"), 'MOL'],
    [13, 1, 19.069289, -104.288456, 20.501645, -103.233868,
     new Date("February 8, 2018 11:13:00"),
     new Date("February 10, 2018 11:13:00"), 'MSK'],
    [14, 1, 19.069289, -104.288456, 20.52728843689, -100.86806488037,
     new Date("February 9, 2018 11:13:00"),
     new Date("February 13, 2018 15:00:00"), 'HEL'],
    [15, 1, 19.069289, -104.288456, 21.797752, -102.281645,
     new Date("February 4, 2018 11:13:00"),
     new Date("February 15, 2018 11:13:00"), 'MSK'],
    [16, 1, 19.069289, -104.288456, 25, -100,
     new Date("February 5, 2018 11:13:00"),
     new Date("February 10, 2018 11:13:00"), 'MOL'],
    [17, 1, 19.069289, -104.288456, 25.5138715, -100.9972923,
     new Date("February 5, 2018 11:13:00"),
     new Date("February 20, 2018 11:13:00"), 'MSK'],
    [18, 1, 19.069289, -104.288456, 25.7400771, -100.2023287,
     new Date("February 5, 2018 11:13:00"),
     new Date("February 13, 2018 15:00:00"), 'MSK'],
    [19, 1, 19.069289, -104.288456, 25.760347, -99.987409,
     new Date("February 1, 2018 11:13:00"),
     new Date("February 14, 2018 11:13:00"), 'MSK'],
    [23, 1, 19.069289, -104.288456, 28.712352, -106.12544,
     new Date("February 1, 2018 11:13:00"),
     new Date("February 8, 2018 11:13:00"), 'MSK'],
    [24, 1, 19.080694, -104.299007, 19.709400177002, -99.203399658203,
     new Date("February 2, 2018 11:13:00"),
     new Date("February 7, 2018 11:13:00"), 'HSD'],
    [25, 1, 19.020654, -104.290107, 20, -100,
     new Date("February 2, 2018 11:13:00"),
     new Date("February 20, 2018 11:13:00"), 'MOL'],
    [26, 1, 19.020654, -104.299107, 20.829500198364, -100.43699645996,
     new Date("February 4, 2018 11:13:00"),
     new Date("February 6, 2018 11:13:00"), 'HSD'],
    [27, 1, 22.475037, -97.881372, 23, -99,
     new Date("February 7, 2018 11:13:00"),
     new Date("February 9, 2018 11:13:00"), 'NAV'],
    [28, 1, 22.475037, -97.881372, 23, -99,
     new Date("February 5, 2018 11:13:00"),
     new Date("February 25, 2018 11:13:00"), 'NAV'],
    [34, 2, 18.075127, -96.137147, 19.215121, -96.129162,
     new Date("February 1, 2018 11:13:00"),
     new Date("February 2, 2018 11:13:00"), 'MSK'],
    [35, 2, 18.864099502563, -97.076301574707, 19.215121, -96.129162,
     new Date("February 8, 2018 11:13:00"),
     new Date("February 10, 2018 11:13:00"), 'HSD'],
    [39, 2, 19, -99, 19.215121, -96.129162,
     new Date("February 7, 2018 11:13:00"),
     new Date("February 9, 2018 11:13:00"), 'ARC'],
    [42, 2, 32.492099761963, -115.39700317383, 31.849919, -116.628373,
     new Date("February 8, 2018 11:13:00"),
     new Date("February 8, 2018 14:00:00"),'HSD']
];
