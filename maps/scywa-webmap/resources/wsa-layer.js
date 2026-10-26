// "Wilderness Study Areas (WSA)" layer for qgis2web OpenLayers exports (2026-10-26)
// Data: wsa-data.js (3 BLM wilderness study areas). Labels "Name (WSA)" at 1:250,000 and closer.
// Load after layers/layers.js and before layer-order.js / resources/qgis2web.js (adds to layersList).
(function () {
    var TITLE = 'Wilderness Study Areas (WSA)';
    var COLOR = [106, 81, 163];
    var LABEL_MAX_RES = 66.15;  // labels at 1:250,000 and closer, same as the other layers

    var fill = new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(' + COLOR.join(',') + ',0.8)', width: 1}),
        fill: new ol.style.Fill({color: 'rgba(' + COLOR.join(',') + ',0.3)'})
    });

    function labelFor(feature, resolution) {
        var name = feature.get('NAME');
        if (!name || resolution > LABEL_MAX_RES) return null;
        return new ol.style.Style({
            text: new ol.style.Text({
                text: name + ' (WSA)',
                font: 'italic bold 14px Arial, sans-serif',
                fill: new ol.style.Fill({color: 'rgb(64,49,98)'}),
                stroke: new ol.style.Stroke({color: 'rgba(255,255,255,0.9)', width: 3}),
                offsetY: 30,  // below a roadless label at the same spot, so both survive declutter
                overflow: true
            })
        });
    }

    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'><rect x='1' y='1' width='12' height='12' " +
              "fill='rgba(" + COLOR.join(',') + ",0.45)' stroke='rgb(" + COLOR.join(',') + ")' stroke-width='1'/></svg>";

    var source = new ol.source.Vector({attributions: ' '});
    source.addFeatures(new ol.format.GeoJSON().readFeatures(json_wsa,
        {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'}));

    var layer = new ol.layer.Vector({
        source: source,
        declutter: true,
        style: function (feature, resolution) {
            var label = labelFor(feature, resolution);
            return label ? [fill, label] : fill;
        },
        popuplayertitle: TITLE,
        interactive: true,
        title: '<img src="data:image/svg+xml,' + encodeURIComponent(svg) + '" /> ' + TITLE
    });
    layer.set('fieldAliases', {'NAME': 'Name', 'BLM_RECOMMENDATION': 'BLM recommendation', 'STATE': 'State',
                               'CASEFILE': 'BLM case file', 'ACRES': 'Acres (calculated)'});
    layer.set('fieldImages', {'NAME': 'TextEdit', 'BLM_RECOMMENDATION': 'TextEdit', 'STATE': 'TextEdit',
                              'CASEFILE': 'TextEdit', 'ACRES': 'TextEdit'});
    layer.set('fieldLabels', {'NAME': 'header label - visible with data',
                              'BLM_RECOMMENDATION': 'inline label - always visible', 'STATE': 'inline label - always visible',
                              'CASEFILE': 'inline label - always visible', 'ACRES': 'inline label - always visible'});

    layersList.splice(1, 0, layer);  // final position is set by layer-order.js
})();
