var size = 0;
var placement = 'point';

var style_bdy_RoadlessInSCYWA10242026_2 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("");
    var labelFont = "18.2px \'Arial\', sans-serif";
    var labelFill = "#323232";
    var bufferColor = "#f7fcf5";
    var bufferWidth = 3.0;
    var textAlign = 'left';
    var offsetX = 8;
    var offsetY = 3;
    var overflow = true;
    var repeat = 0;
    var placement = 'point';
    if (feature.get("ROADLESSAR") !== null && resolution > 0 && resolution < 70) {
        labelText = String(feature.get("ROADLESSAR"));
    }
    var style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(35,35,35,0.406)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.988}),fill: new ol.style.Fill({color: 'rgba(125,139,143,0.406)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];

    return style;
};
