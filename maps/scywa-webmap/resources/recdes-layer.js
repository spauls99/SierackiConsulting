// Recommended/designated areas layer for qgis2web OpenLayers exports (2026-10-25)
// Data: recdes-data.js (49 selected USFS BdyPlan_LMP_RecommendedDesignatedArea polygons).
// Load after layers/layers.js and before resources/qgis2web.js (adds to layersList).
(function () {
    var COLORS = {
        'WILDERNESS - RECOMMENDED': [51, 160, 44],
        'RESEARCH NATURAL AREA': [255, 127, 0]
    };
    var OTHER = [106, 61, 154];

    var styles = {};
    function styleFor(type) {
        if (!styles[type]) {
            var c = COLORS[type] || OTHER;
            styles[type] = new ol.style.Style({
                stroke: new ol.style.Stroke({color: 'rgba(' + c.join(',') + ',1)', width: 2}),
                fill: new ol.style.Fill({color: 'rgba(' + c.join(',') + ',0.25)'})
            });
        }
        return styles[type];
    }

    function swatch(c) {
        var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'><rect x='1' y='1' width='12' height='12' " +
                  "fill='rgba(" + c.join(',') + ",0.4)' stroke='rgb(" + c.join(',') + ")' stroke-width='2'/></svg>";
        return '<img src="data:image/svg+xml,' + encodeURIComponent(svg) + '" />';
    }

    var source = new ol.source.Vector({attributions: ' '});
    source.addFeatures(new ol.format.GeoJSON().readFeatures(json_recdes,
        {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'}));

    var layer = new ol.layer.Vector({
        source: source,
        style: function (feature) { return styleFor(feature.get('REC_DES_AREA_TYPE')); },
        popuplayertitle: 'Recommended / designated areas (forest plans)',
        interactive: true,
        title: 'Recommended / designated areas (forest plans)<br />' +
               swatch(COLORS['WILDERNESS - RECOMMENDED']) + ' Recommended wilderness<br />' +
               swatch(COLORS['RESEARCH NATURAL AREA']) + ' Research natural area'
    });
    layer.set('fieldAliases', {'REC_DES_AREA_NAME': 'Name', 'REC_DES_AREA_TYPE': 'Type', 'FOREST': 'Forest code',
                               'PLAN_YEAR': 'Plan year', 'GIS_ACRES': 'GIS acres (USFS)'});
    layer.set('fieldImages', {'REC_DES_AREA_NAME': 'TextEdit', 'REC_DES_AREA_TYPE': 'TextEdit', 'FOREST': 'TextEdit',
                              'PLAN_YEAR': 'TextEdit', 'GIS_ACRES': 'TextEdit'});
    layer.set('fieldLabels', {'REC_DES_AREA_NAME': 'header label - visible with data',
                              'REC_DES_AREA_TYPE': 'inline label - always visible', 'FOREST': 'inline label - always visible',
                              'PLAN_YEAR': 'inline label - always visible', 'GIS_ACRES': 'inline label - always visible'});

    // draw just above the basemap, below the action area and roadless layers
    layersList.splice(1, 0, layer);
})();
