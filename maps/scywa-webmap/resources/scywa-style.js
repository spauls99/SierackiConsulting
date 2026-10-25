// SCYWA action area outline that thins as the map zooms out (2026-10-25)
// Replaces the qgis2web style (red, 4.8 px at every scale). Full width at 1:150,000
// and closer (resolution <= 40 m/px), tapering to MIN_WIDTH when zoomed out.
// Load after layers/layers.js and before resources/qgis2web.js.
(function () {
    var COLOR = 'rgba(227,26,28,1)';
    var MAX_WIDTH = 4.8, MIN_WIDTH = 1.5, FULL_RES = 40;

    var aa = layersList.filter(function (lyr) {
        return /^SCYWA_ActionArea/.test(lyr.get('popuplayertitle') || '');
    })[0];
    if (!aa) return;

    var cache = {};
    aa.setStyle(function (feature, resolution) {
        var w = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, MAX_WIDTH * FULL_RES / resolution));
        var key = w.toFixed(1);
        if (!cache[key]) {
            cache[key] = new ol.style.Style({
                stroke: new ol.style.Stroke({color: COLOR, width: +key, lineCap: 'round', lineJoin: 'round'})
            });
        }
        return cache[key];
    });
})();
