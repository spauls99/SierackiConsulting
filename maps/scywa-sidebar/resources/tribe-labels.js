// Label the tribal exclusions (holes) in the SCYWA action area (2026-10-25)
// Each hole in the SCYWA polygon is matched to the nearest reference point below (within
// 25 km); each tribe is labelled once, on its largest hole. Unmatched holes get no label.
// Load after resources/qgis2web.js (needs `map` and `layersList`).
(function () {
    var TRIBES = [
        {name: 'Kalispel Tribe', lonlat: [-117.29, 48.36]},   // near Cusick, WA
        {name: 'Kootenai Tribe', lonlat: [-116.38, 48.72]}    // near Bonners Ferry, ID
    ];
    var MAX_DIST = 25000;  // metres (EPSG:3857 units, close enough at this latitude for matching)
    var LABEL_MAX_RES = 66.15;  // labels at 1:250,000 and closer, same as the other layers

    var aa = layersList.filter(function (lyr) {
        return /^SCYWA_ActionArea/.test(lyr.get('popuplayertitle') || '');
    })[0];
    if (!aa) return;

    // collect interior rings of every polygon part as polygons
    var holes = [];
    aa.getSource().getFeatures().forEach(function (f) {
        var g = f.getGeometry();
        var polys = g.getType() === 'MultiPolygon' ? g.getPolygons() : [g];
        polys.forEach(function (p) {
            p.getLinearRings().slice(1).forEach(function (ring) {
                holes.push(new ol.geom.Polygon([ring.getCoordinates()]));
            });
        });
    });

    var best = {};
    holes.forEach(function (hole) {
        var c = hole.getInteriorPoint().getCoordinates();
        TRIBES.forEach(function (t) {
            var ref = ol.proj.fromLonLat(t.lonlat);
            var d = Math.sqrt(Math.pow(c[0] - ref[0], 2) + Math.pow(c[1] - ref[1], 2));
            if (d <= MAX_DIST && (!best[t.name] || hole.getArea() > best[t.name].getArea())) best[t.name] = hole;
        });
    });

    var source = new ol.source.Vector();
    Object.keys(best).forEach(function (name) {
        var pt = best[name].getInteriorPoint().getCoordinates();
        source.addFeature(new ol.Feature({geometry: new ol.geom.Point([pt[0], pt[1]]), label: name + '\n- excluded'}));
    });

    var layer = new ol.layer.Vector({
        source: source,
        zIndex: 900,
        interactive: false,
        style: function (feature, resolution) {
            if (resolution > LABEL_MAX_RES) return null;
            return new ol.style.Style({
                text: new ol.style.Text({
                    text: feature.get('label'),
                    font: 'bold 14px Arial, sans-serif',
                    fill: new ol.style.Fill({color: 'rgb(170,20,20)'}),
                    stroke: new ol.style.Stroke({color: 'rgba(255,255,255,0.95)', width: 3}),
                    textAlign: 'center',
                    overflow: true
                })
            });
        }
    });
    layer.set('title', null);
    map.addLayer(layer);
})();
