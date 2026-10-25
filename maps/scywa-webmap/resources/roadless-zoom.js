// Roadless-area picker for qgis2web OpenLayers exports (2026-10-24)
// Lists every ROADLESSAR name; choosing one highlights all polygons with that
// name and zooms to them. Load after resources/qgis2web.js (needs `map`).
(function () {
    var FIELD = 'ROADLESSAR';

    // find the vector layer whose features carry the name field
    var layer = null;
    map.getAllLayers().forEach(function (lyr) {
        if (layer || !(lyr instanceof ol.layer.Vector)) return;
        var f = lyr.getSource().getFeatures()[0];
        if (f && f.get(FIELD) !== undefined) layer = lyr;
    });
    if (!layer) return;
    var source = layer.getSource();

    // count polygons per name, sort names alphabetically
    var counts = {};
    source.getFeatures().forEach(function (f) {
        var name = f.get(FIELD);
        if (name !== null && name !== undefined) counts[name] = (counts[name] || 0) + 1;
    });
    var names = Object.keys(counts).sort(function (a, b) { return a.localeCompare(b); });

    // highlight layer drawn above everything else
    var highlight = new ol.layer.Vector({
        source: new ol.source.Vector(),
        zIndex: 1000,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({color: '#ffcc00', width: 4}),
            fill: new ol.style.Fill({color: 'rgba(255,204,0,0.15)'})
        })
    });
    highlight.set('title', null);
    map.addLayer(highlight);

    var select = document.createElement('select');
    select.title = 'Zoom to roadless area';
    var first = document.createElement('option');
    first.value = '';
    first.textContent = 'Zoom to roadless area…';
    select.appendChild(first);
    names.forEach(function (name) {
        var opt = document.createElement('option');
        opt.value = name;
        opt.textContent = counts[name] > 1 ? name + ' (' + counts[name] + ' polygons)' : name;
        select.appendChild(opt);
    });

    select.addEventListener('change', function () {
        highlight.getSource().clear();
        if (!select.value) return;
        var extent = ol.extent.createEmpty();
        source.getFeatures().forEach(function (f) {
            if (f.get(FIELD) !== select.value) return;
            highlight.getSource().addFeature(f.clone());
            ol.extent.extend(extent, f.getGeometry().getExtent());
        });
        map.getView().fit(extent, {padding: [60, 60, 60, 60], maxZoom: 14, duration: 500});
    });

    var element = document.createElement('div');
    element.className = 'roadless-zoom ol-unselectable ol-control';
    element.style.cssText = 'top: 8px; left: 50%; transform: translateX(-50%); padding: 2px;';
    select.style.cssText = 'font: 14px Arial, sans-serif; max-width: 70vw; padding: 3px;';
    element.appendChild(select);
    map.addControl(new ol.control.Control({element: element}));
})();
