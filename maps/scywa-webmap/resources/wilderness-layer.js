// "Wilderness (W)" layer for qgis2web OpenLayers exports (2026-10-25)
// Data: wilderness-data.js (3 selected designated wilderness polygons).
// Load after layers/layers.js and before resources/qgis2web.js (adds to layersList).
(function () {
    var TITLE = 'Wilderness (W)';
    var COLOR = [0, 90, 50];
    var LABEL_MAX_RES = 66.15;  // labels at 1:250,000 and closer, same as the other layers

    var fill = new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(' + COLOR.join(',') + ',1)', width: 2.5}),
        fill: new ol.style.Fill({color: 'rgba(' + COLOR.join(',') + ',0.35)'})
    });

    function labelFor(feature, resolution) {
        var name = feature.get('AREANAME');
        if (!name || resolution > LABEL_MAX_RES) return null;
        return new ol.style.Style({
            text: new ol.style.Text({
                text: name.replace(/ Wilderness$/, '') + ' (W)',
                font: 'italic bold 14px Arial, sans-serif',
                fill: new ol.style.Fill({color: 'rgb(0,60,30)'}),
                stroke: new ol.style.Stroke({color: 'rgba(255,255,255,0.9)', width: 3}),
                offsetY: 30,  // below a roadless label at the same spot, so both survive declutter
                overflow: true
            })
        });
    }

    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'><rect x='1' y='1' width='12' height='12' " +
              "fill='rgba(" + COLOR.join(',') + ",0.5)' stroke='rgb(" + COLOR.join(',') + ")' stroke-width='2'/></svg>";

    var source = new ol.source.Vector({attributions: ' '});
    source.addFeatures(new ol.format.GeoJSON().readFeatures(json_wilderness,
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
    layer.set('fieldAliases', {'AREANAME': 'Name', 'AREATYPE': 'Type', 'ACTIONDATE': 'Designated',
                               'OFFICIALAC': 'Official acres', 'GIS_ACRES': 'GIS acres'});
    layer.set('fieldImages', {'AREANAME': 'TextEdit', 'AREATYPE': 'TextEdit', 'ACTIONDATE': 'TextEdit',
                              'OFFICIALAC': 'TextEdit', 'GIS_ACRES': 'TextEdit'});
    layer.set('fieldLabels', {'AREANAME': 'header label - visible with data',
                              'AREATYPE': 'inline label - always visible', 'ACTIONDATE': 'inline label - always visible',
                              'OFFICIALAC': 'inline label - always visible', 'GIS_ACRES': 'inline label - always visible'});

    // draw just above the basemap, below the other overlay layers
    layersList.splice(1, 0, layer);
})();
