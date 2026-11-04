// Open the qgis2web OpenLayers map zoomed to the SCYWA action area (2026-10-25)
// Load after resources/qgis2web.js (needs `map` and `layersList`).
(function () {
    var aa = layersList.filter(function (lyr) {
        return /^SCYWA_ActionArea/.test(lyr.get('popuplayertitle') || '');
    })[0];
    if (!aa) return;
    map.getView().fit(aa.getSource().getExtent(), {size: map.getSize(), padding: [40, 40, 40, 40]});
})();
