var wms_layers = [];


        var lyr_ESRITopo_0 = new ol.layer.Tile({
            'title': 'ESRI Topo',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
            })
        });
var format_SCYWA_ActionArea_mod1024_1 = new ol.format.GeoJSON();
var features_SCYWA_ActionArea_mod1024_1 = format_SCYWA_ActionArea_mod1024_1.readFeatures(json_SCYWA_ActionArea_mod1024_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_SCYWA_ActionArea_mod1024_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_SCYWA_ActionArea_mod1024_1.addFeatures(features_SCYWA_ActionArea_mod1024_1);
var lyr_SCYWA_ActionArea_mod1024_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_SCYWA_ActionArea_mod1024_1, 
                style: style_SCYWA_ActionArea_mod1024_1,
                popuplayertitle: 'SCYWA_ActionArea_mod10.24',
                interactive: true,
                title: '<img src="styles/legend/SCYWA_ActionArea_mod1024_1.png" /> SCYWA_ActionArea_mod10.24'
            });
var format_bdy_RoadlessInSCYWA10242026_2 = new ol.format.GeoJSON();
var features_bdy_RoadlessInSCYWA10242026_2 = format_bdy_RoadlessInSCYWA10242026_2.readFeatures(json_bdy_RoadlessInSCYWA10242026_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_bdy_RoadlessInSCYWA10242026_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_bdy_RoadlessInSCYWA10242026_2.addFeatures(features_bdy_RoadlessInSCYWA10242026_2);
var lyr_bdy_RoadlessInSCYWA10242026_2 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_bdy_RoadlessInSCYWA10242026_2, 
                style: style_bdy_RoadlessInSCYWA10242026_2,
                popuplayertitle: 'bdy_RoadlessInSCYWA10.24.2026',
                interactive: true,
                title: '<img src="styles/legend/bdy_RoadlessInSCYWA10242026_2.png" /> bdy_RoadlessInSCYWA10.24.2026'
            });
var group_S_USARangerDistrict = new ol.layer.Group({
                                layers: [],
                                fold: 'close',
                                title: 'S_USA.RangerDistrict'});
var group_BdyPlan_RoadlessArea_2001_ID_CO = new ol.layer.Group({
                                layers: [],
                                fold: 'close',
                                title: 'BdyPlan_RoadlessArea_2001_ID_CO'});

lyr_ESRITopo_0.setVisible(true);lyr_SCYWA_ActionArea_mod1024_1.setVisible(true);lyr_bdy_RoadlessInSCYWA10242026_2.setVisible(true);
var layersList = [lyr_ESRITopo_0,lyr_SCYWA_ActionArea_mod1024_1,lyr_bdy_RoadlessInSCYWA10242026_2];
lyr_SCYWA_ActionArea_mod1024_1.set('fieldAliases', {'Acres': 'Acres', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', 'SqMiles': 'SqMiles', 'HA': 'HA', 'SqKilomete': 'SqKilomete', });
lyr_bdy_RoadlessInSCYWA10242026_2.set('fieldAliases', {'fid': 'fid', 'OBJECTID': 'OBJECTID', 'ROADLESSAR': 'ROADLESSAR', 'RULE': 'RULE', 'REGIONCODE': 'REGIONCODE', 'REGIONNAME': 'REGIONNAME', 'FORESTNAME': 'FORESTNAME', 'STATECODE': 'STATECODE', 'STATENAME': 'STATENAME', 'TOTAL_ACRE': 'TOTAL_ACRE', 'SHAPE_Leng': 'SHAPE_Leng', 'SHAPE_Area': 'SHAPE_Area', 'Acres': 'Acres', 'SqMiles': 'SqMiles', 'HA': 'HA', 'SqKilomete': 'SqKilomete', });
lyr_SCYWA_ActionArea_mod1024_1.set('fieldImages', {'Acres': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', 'SqMiles': 'TextEdit', 'HA': 'TextEdit', 'SqKilomete': 'TextEdit', });
lyr_bdy_RoadlessInSCYWA10242026_2.set('fieldImages', {'fid': 'TextEdit', 'OBJECTID': 'TextEdit', 'ROADLESSAR': 'TextEdit', 'RULE': 'TextEdit', 'REGIONCODE': 'TextEdit', 'REGIONNAME': 'TextEdit', 'FORESTNAME': 'TextEdit', 'STATECODE': 'TextEdit', 'STATENAME': 'TextEdit', 'TOTAL_ACRE': 'TextEdit', 'SHAPE_Leng': 'TextEdit', 'SHAPE_Area': 'TextEdit', 'Acres': 'TextEdit', 'SqMiles': 'TextEdit', 'HA': 'TextEdit', 'SqKilomete': 'TextEdit', });
lyr_SCYWA_ActionArea_mod1024_1.set('fieldLabels', {'Acres': 'inline label - always visible', 'Shape_Leng': 'inline label - always visible', 'Shape_Area': 'inline label - always visible', 'SqMiles': 'inline label - always visible', 'HA': 'inline label - always visible', 'SqKilomete': 'inline label - always visible', });
lyr_bdy_RoadlessInSCYWA10242026_2.set('fieldLabels', {'fid': 'no label', 'OBJECTID': 'no label', 'ROADLESSAR': 'header label - visible with data', 'RULE': 'inline label - always visible', 'REGIONCODE': 'inline label - always visible', 'REGIONNAME': 'inline label - always visible', 'FORESTNAME': 'inline label - always visible', 'STATECODE': 'inline label - always visible', 'STATENAME': 'inline label - always visible', 'TOTAL_ACRE': 'inline label - always visible', 'SHAPE_Leng': 'inline label - always visible', 'SHAPE_Area': 'inline label - always visible', 'Acres': 'inline label - always visible', 'SqMiles': 'inline label - always visible', 'HA': 'inline label - always visible', 'SqKilomete': 'inline label - always visible', });
lyr_bdy_RoadlessInSCYWA10242026_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});