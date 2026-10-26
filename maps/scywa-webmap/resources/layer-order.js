// Set the overlay order for qgis2web OpenLayers exports (2026-10-25)
// Layer list (top to bottom): SCYWA action area, Wilderness (W), Recommended Wilderness (RW),
// Wilderness Study Areas (WSA), roadless areas; basemaps stay underneath. Drawing order follows.
// Load after the add-on layers and before resources/qgis2web.js (reorders layersList in place).
(function () {
    var BOTTOM_TO_TOP = [
        /^bdy_Roadless/,
        /^Wilderness Study Areas/,
        /^Recommended Wilderness/,
        /^Wilderness \(W\)/,
        /^SCYWA_ActionArea/
    ];
    function rank(lyr) {
        var t = lyr.get('popuplayertitle') || '';
        for (var i = 0; i < BOTTOM_TO_TOP.length; i++) if (BOTTOM_TO_TOP[i].test(t)) return i;
        return -1;
    }
    var others = layersList.filter(function (l) { return rank(l) < 0; });
    var ordered = layersList.filter(function (l) { return rank(l) >= 0; })
                            .sort(function (a, b) { return rank(a) - rank(b); });
    layersList.splice.apply(layersList, [0, layersList.length].concat(others, ordered));
})();
