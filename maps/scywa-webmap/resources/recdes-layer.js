// "Recommended Wilderness (RW)" layer for qgis2web OpenLayers exports (2026-10-25)
// Recommended wilderness: transparent salmon, no outline. Research natural areas (forest-plan
// and established) are drawn on top in orange so those embedded in RW stay visible.
// Data: recdes-data.js (built by make_recdes_data.py; fields NAME, TYPE, SOURCE, YEAR, GIS_ACRES).
// Load after layers/layers.js and before resources/qgis2web.js (adds to layersList).
(function () {
    var RW = 'WILDERNESS - RECOMMENDED', RNA = 'RESEARCH NATURAL AREA';
    var TITLE = 'Recommended Wilderness (RW)';
    var LABEL_MAX_RES = 66.15;  // labels at 1:250,000 and closer, same as the roadless layer

    var TYPES = {};
    TYPES[RW] = {suffix: ' (RW)', z: 1, labelColor: 'rgb(160,60,45)',
                 fill: 'rgba(250,128,114,0.4)', stroke: null};  // transparent salmon
    TYPES[RNA] = {suffix: ' (RNA)', z: 2, labelColor: 'rgb(153,76,0)',
                  fill: 'rgba(255,127,0,0.45)', stroke: 'rgba(255,127,0,1)'};
    var OTHER = {suffix: '', z: 0, labelColor: 'rgb(64,37,92)',
                 fill: 'rgba(106,61,154,0.3)', stroke: 'rgba(106,61,154,1)'};

    // outline width: 2 px at 1:150,000 and closer (resolution <= 40), thinning to 0.75 px zoomed out
    function strokeWidth(resolution) {
        return Math.max(0.75, Math.min(2, 2 * 40 / resolution));
    }

    var styles = {};
    function styleFor(type, resolution) {
        var t = TYPES[type] || OTHER;
        var w = t.stroke ? strokeWidth(resolution).toFixed(2) : '0';
        var key = type + '|' + w;
        if (!styles[key]) {
            styles[key] = new ol.style.Style({
                zIndex: t.z,
                stroke: t.stroke ? new ol.style.Stroke({color: t.stroke, width: +w}) : undefined,
                fill: new ol.style.Fill({color: t.fill})
            });
        }
        return styles[key];
    }

    function labelFor(feature, resolution) {
        var name = feature.get('NAME');
        if (!name || name === 'Not defined' || resolution > LABEL_MAX_RES) return null;
        var t = TYPES[feature.get('TYPE')] || OTHER;
        return new ol.style.Style({
            zIndex: 10,
            text: new ol.style.Text({
                text: name + t.suffix,
                font: 'italic bold 14px Arial, sans-serif',
                fill: new ol.style.Fill({color: t.labelColor}),
                stroke: new ol.style.Stroke({color: 'rgba(255,255,255,0.9)', width: 3}),
                offsetY: 30,  // below a roadless label (18 px text) at the same spot, so both survive declutter
                overflow: true
            })
        });
    }

    function swatch(t) {
        var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'><rect x='1' y='1' width='12' height='12' " +
                  "fill='" + t.fill + "' stroke='" + (t.stroke || 'none') + "' stroke-width='2'/></svg>";
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
            var fill = styleFor(feature.get('TYPE'), resolution);
            return label ? [fill, label] : fill;
        },
        popuplayertitle: TITLE,
        interactive: true,
        title: TITLE + '<br />' +
               swatch(TYPES[RW]) + ' Recommended wilderness<br />' +
               swatch(TYPES[RNA]) + ' Research natural area'
    });
    layer.set('fieldAliases', {'NAME': 'Name', 'TYPE': 'Type', 'SOURCE': 'Source', 'YEAR': 'Plan / established year',
                               'GIS_ACRES': 'GIS acres (USFS)'});
    layer.set('fieldImages', {'NAME': 'TextEdit', 'TYPE': 'TextEdit', 'SOURCE': 'TextEdit', 'YEAR': 'TextEdit',
                              'GIS_ACRES': 'TextEdit'});
    layer.set('fieldLabels', {'NAME': 'header label - visible with data', 'TYPE': 'inline label - always visible',
                              'SOURCE': 'inline label - always visible', 'YEAR': 'inline label - always visible',
                              'GIS_ACRES': 'inline label - always visible'});

    // draw just above the basemap, below the action area and roadless layers
    layersList.splice(1, 0, layer);
})();
