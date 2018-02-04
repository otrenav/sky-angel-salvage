
var map;

var terrestres = 0;
var navieros = 0;

var MSK = new Array();
var msk = 0;

var HSD = new Array();
var hsd = 0;

var DMC = new Array();
var dmc = 0;

var NAV = new Array();
var nav = 0;

var DHL = new Array();
var dhl = 0;

var GEO = new Array();
var geo = 0;

var MOL = new Array();
var mol = 0;

var MSC = new Array();
var msc = 0;

var CIS = new Array();
var cis = 0;

var SMT = new Array();
var smt = 0;

var ARC = new Array();
var arc = 0;

var C4 = new Array();
var c4 = 0;

var SSA = new Array();
var ssa = 0;

var DCX = new Array();
var dcx = 0;

var HEL = new Array();
var hel = 0;

var JAH = new Array();
var jah = 0;

var DHLT = new Array();
var dhlt = 0;

var NAVT = new Array();
var navt = 0;

var NTA = new Array();
var nta = 0;

var OIL = new Array();
var oil = 0;

var SUN = new Array();
var sun = 0;

var TER = new Array();
var ter = 0;

var TERR = new Array();
var terr = 0;

var NAVV = new Array();
var navv = 0;

var id_mov = "";
var expo = 0;
var imp = 0;

var TrayIF = new Array();
var Trayecto = new Array();
var Puntos = new Array();

var colo = "";
var latI = 0;
var lonI = 0;
var latF = 0;
var lonF = 0;
var platFF = "";
var contenido = new Array();
var lat = new Array();
var lat = new Array();
var infowindow;

function iMap() {

    var flecha = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 1
    };

    var flechaT = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3
    };

    for (var i = 0; i <= tabla.length; i++) {

        latI = 0;
        lonI = 0;
        latF = 0;
        lonF = 0;
        platFF = "";

        lat = tabla[i];
        latI = lat[2];
        lon = tabla[i];
        lonI = lon[3];
        lat = tabla[i];
        latF = lat[4];
        lon = tabla[i];
        lonF = lon[5];
        platFF = tabla[i][6];
        id_mov = tabla[i][0];

        if (platFF == "MSK") {
            MSK[msk] = i;
            msk++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "HSD") {
            HSD[hsd] = i;
            hsd++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "DMC") {
            DMC[dmc] = i;
            dmc++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "NAV") {
            NAV[nav] = i;
            nav++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "DHL") {
            DHL[dhl] = i;
            dhl++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "GEO") {
            GEO[geo] = i;
            geo++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "MOL") {
            MOL[mol] = i;
            mol++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "MSC") {
            MSC[msc] = i;
            msc++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "CIS") {
            CIS[cis] = i;
            cis++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "SMT") {
            SMT[smt] = i;
            smt++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "ARC") {
            ARC[arc] = i;
            arc++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "C4") {
            C4[c4] = i;
            c4++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "SSA") {
            SSA[ssa] = i;
            ssa++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "DCX") {
            DCX[dcx] = i;
            dcx++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "HEL") {
            HEL[hel] = i;
            hel++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "JAH") {
            JAH[jah] = i;
            jah++;
            NAVV[navv] = i;
            navv++;
        } else if (platFF == "DHLT") {
            DHLT[dhlt] = i;
            dhlt++;
            TERR[terr] = i;
            terr++;
        } else if (platFF == "NAVT") {
            NAVT[navt] = i;
            navt++;
            TERR[terr] = i;
            terr++;
        } else if (platFF == "NTA") {
            NTA[nta] = i;
            nta++;
            TERR[terr] = i;
            terr++;
        } else if (platFF == "OIL") {
            OIL[oil] = i;
            oil++;
            TERR[terr] = i;
            terr++;
        } else if (platFF == "SUN") {
            SUN[sun] = i;
            sun++;
            TERR[terr] = i;
            terr++;
        } else if (platFF == "TER") {
            TER[ter] = i;
            ter++;
            TERR[terr] = i;
            terr++;
        }

        contenido[i] = platFF + "- ID: " + tabla[i][0];

        TrayIF[i] = [
            {lat: latI, lng: lonI},
            {lat: latF, lng: lonF}
        ];

        if (platFF == "MSK") {
            colo = coloor[0];
        } else if (platFF == "HSD") {
            colo = coloor[1];
        } else if (platFF == "DMC") {
            colo = coloor[2];
        } else if (platFF == "NAV") {
            colo = coloor[3];
        } else if (platFF == "DHL") {
            colo = coloor[4];
        } else if (platFF == "GEO") {
            colo = coloor[5];
        } else if (platFF == "MOL") {
            colo = coloor[6];
        } else if (platFF == "MSC") {
            colo = coloor[7];
        } else if (platFF == "CIS") {
            colo = coloor[8];
        } else if (platFF == "SMT") {
            colo = coloor[9];
        } else if (platFF == "ARC") {
            colo = coloor[10];
        } else if (platFF == "C4") {
            colo = coloor[11];
        } else if (platFF == "SSA") {
            colo = coloor[12];
        } else if (platFF == "DCX") {
            colo = coloor[13];
        } else if (platFF == "HEL") {
            colo = coloor[14];
        } else if (platFF == "JAH") {
            colo = coloor[15];
        } else if (platFF == "DHLT") {
            colo = coloor[16];
        } else if (platFF == "NAVT") {
            colo = coloor[17];
        } else if (platFF == "NTA") {
            colo = coloor[18];
        } else if (platFF == "OIL") {
            colo = coloor[19];
        } else if (platFF == "SUN") {
            colo = coloor[20];
        } else {
            colo = coloor[21];
        }
        try {
            Trayecto[i] = new google.maps.Polyline({
                path: TrayIF[i],
                geodesic: true,
                strokeColor: colo,
                strokeOpacity: 5.0,
                strokeWeight: 2,
                info: contenido[i],
                icons: [{
                    icon: flecha,
                    offset: '100%'
                }]
            });
            // Puntos[i] = new google.maps.Market({
            //     position: TrayIF[i],
            //     icon: {
            //         path: google.maps.SymbolPath.CIRCLE,
            //         scale: 10,
            //         strokeWeight: 2,
            //         fillColor: '#FFFFFF',
            //         strokeColor: '#FFFFFF',
            //         fillOpacity: 1
            //     }
            // });
        } catch (err) {}

        infowindow = new google.maps.InfoWindow({content: "ID"});

        google.maps.event.addListener(Trayecto[i], 'click', function(event) {
            var latt = event.latLng.lat();
            var lngg = event.latLng.lng();
            infowindow.setContent(this.info);
            infowindow.setPosition({
                lat: latt,
                lng: lngg
            });
            infowindow.open(map, this);
            var inicio = Date.now() - 180 * 60 * 1000;
            var fin = Date.now() + 360 * 60 * 1000;
            var recorrido = Math.floor(((fin - inicio) / fin) * 100);
            var Track = new google.maps.Polyline({
                path: TrayIF[i],
                geodesic: true,
                strokeColor: '#F2F2F2',
                strokeOpacity: 3.0,
                strokeWeight: 1,
                icons: [{
                    icon: flechaT,
                    offset: recorrido + '%'
                }]
            });
            Track.setMap(map);
            // var Point = new google.maps.Market({
            //     position: TrayIF[i],
            //     icon: {
            //         path: google.maps.SymbolPath.CIRCLE,
            //         scale: 10,
            //         strokeWeight: 2,
            //         fillColor: '#FFFFFF',
            //         strokeColor: '#FFFFFF',
            //         fillOpacity: 1
            //     }
            // });
            // Point.setMap(map);
        });

        terrestres = terr + 1;
        navieros = navv + 1;
        Total = terrestres + navieros;
        document.getElementById("ter").innerHTML = terrestres.toLocaleString('en');
        document.getElementById("nav").innerHTML = navieros.toLocaleString('en');
        document.getElementById("tot").innerHTML = Total.toLocaleString('en');
    }
}

var CLIENTS = {
    'MSK': MSK,
    'MOL': MOL,
    'NTA': NTA,
    'DCX': DCX,
    'DHLT': DHLT,
    'MSC': MSC,
    'SMT': SMT,
    'JAH': JAH,
    'SSA': SSA,
    'HSD': HSD,
    'ARC': ARC,
    'DMC': DMC,
    'GEO': GEO,
    'DHL': DHL,
    'NAVT': NAVT,
    'CIS': CIS,
    'OIL': OIL,
    'TER': TER,
    'SUN': SUN,
    'TERR': TERR,
    'NAVV': NAVV,
    'HEL': HEL
};

toggleVectors = function(selector, checkbox) {
    var setTo = checkbox.checked ? map : null;
    for (i = 0; i <= CLIENTS[selector].length; i++) {
        Trayecto[CLIENTS[selector][i]].setMap(setTo);
    }
};

toggleTotal = function(checkbox) {
    var setTo = checkbox.checked ? map : null;
    for (i = 0; i <= Trayecto.length; i++) {
        Trayecto[i].setMap(setTo);
    }
};

//imp = (<?php echo ($imp); ?>);
//expo = (<?php echo ($expo); ?>);

imp = 0;
expo = 0;

// document.getElementById("imp").innerHTML = imp;
// document.getElementById("expo").innerHTML = expo;
