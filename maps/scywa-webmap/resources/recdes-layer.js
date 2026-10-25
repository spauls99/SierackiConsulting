// "Recommended Wilderness" layer for qgis2web OpenLayers exports (2026-10-25)
// Also contains 5 research natural areas, shown in their own legend colour.
// Data: recdes-data.js (49 selected USFS BdyPlan_LMP_RecommendedDesignatedArea polygons).
// Load after layers/layers.js and before resources/qgis2web.js (adds to layersList).
(function () {
    var COLORS = {
        'WILDERNESS - RECOMMENDED': [51, 160, 44],
        'RESEARCH NATURAL AREA': [255, 127, 0]
    };
    var OTHER = [106, 61, 154];

    var TITLE = 'Recommended Wilderness (RW)';
    var SUFFIX = {'WILDERNESS - RECOMMENDED': ' (RW)', 'RESEARCH NATURAL AREA': ' (RNA)'};
    var LABEL_MAX_RES = 66.15;  // labels at 1:250,000 and closer, same as the roadless layer

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

    function labelFor(feature, resolution) {
        var name = feature.get('REC_DES_AREA_NAME');
        if (!name || name === 'Not defined' || resolution > LABEL_MAX_RES) return null;
        var c = COLORS[feature.get('REC_DES_AREA_TYPE')] || OTHER;
        return new ol.style.Style({
            text: new ol.style.Text({
                text: name + (SUFFIX[feature.get('REC_DES_AREA_TYPE')] || ''),
                font: 'italic bold 14px Arial, sans-serif',
                fill: new ol.style.Fill({color: 'rgb(' + c.map(function (v) { return Math.round(v * 0.6); }).join(',') + ')'}),
                stroke: new ol.style.Stroke({color: 'rgba(255,255,255,0.9)', width: 3}),
                offsetY: 30,  // below a roadless label (18 px text) at the same spot, so both survive declutter
                overflow: true
            })
        });
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
        declutter: true,
        style: function (feature, resolution) {
            var label = labelFor(feature, resolution);
            var fill = styleFor(feature.get('REC_DES_AREA_TYPE'));
            return label ? [fill, label] : fill;
        },
        popuplayertitle: TITLE,
        interactive: true,
        title: TITLE + '<br />' +
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
