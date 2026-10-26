// Area pickers for qgis2web OpenLayers exports (2026-10-25)
// Pulldowns of area names; choosing one highlights every polygon with that name and
// zooms to them. Load after resources/qgis2web.js (needs `map` and `layersList`).
//   1. Roadless areas (ROADLESSAR)
//   2. Wilderness: designated Wilderness (W), Recommended Wilderness (RW), Wilderness Study Areas (WSA)
(function () {
    function findLayer(test) {
        return layersList.filter(function (lyr) {
            if (!(lyr instanceof ol.layer.Vector)) return false;
            var f = lyr.getSource().getFeatures()[0];
            return f && test(lyr, f);
        })[0];
    }

    // groups: [{label, layer, field, filter, suffix}] -> one <select>
    var PICKERS = [
        {prompt: 'Zoom to roadless area…', groups: [
            {layer: findLayer(function (l, f) { return f.get('ROADLESSAR') !== undefined; }),
             field: 'ROADLESSAR', suffix: ''}]},
        {prompt: 'Zoom to wilderness…', groups: [
            {label: 'Wilderness (W)', field: 'AREANAME', suffix: ' (W)',
             layer: findLayer(function (l) { return l.get('popuplayertitle') === 'Wilderness (W)'; })},
            {label: 'Recommended Wilderness (RW)', field: 'NAME', suffix: ' (RW)',
             filter: function (f) { return f.get('TYPE') === 'WILDERNESS - RECOMMENDED'; },
             layer: findLayer(function (l) { return l.get('popuplayertitle') === 'Recommended Wilderness (RW)'; })},
            {label: 'Wilderness Study Areas (WSA)', field: 'NAME', suffix: ' (WSA)',
             layer: findLayer(function (l) { return l.get('popuplayertitle') === 'Wilderness Study Areas (WSA)'; })}]}
    ];

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

    var selects = [];

    function matches(group, name) {
        return group.layer.getSource().getFeatures().filter(function (f) {
            return f.get(group.field) === name && (!group.filter || group.filter(f));
        });
    }

    function makeSelect(picker) {
        var select = document.createElement('select');
        select.title = picker.prompt;
        var first = document.createElement('option');
        first.value = '';
        first.textContent = picker.prompt;
        select.appendChild(first);

        var groups = picker.groups.filter(function (g) { return g.layer; });
        groups.forEach(function (group, gi) {
            var counts = {};
            group.layer.getSource().getFeatures().forEach(function (f) {
                var name = f.get(group.field);
                if (name && name !== 'Not defined' && (!group.filter || group.filter(f))) counts[name] = (counts[name] || 0) + 1;
            });
            var parent = select;
            if (group.label) {
                parent = document.createElement('optgroup');
                parent.label = group.label;
                select.appendChild(parent);
            }
            Object.keys(counts).sort(function (a, b) { return a.localeCompare(b); }).forEach(function (name) {
                var opt = document.createElement('option');
                opt.value = gi + '|' + name;
                opt.textContent = name.replace(/ Wilderness$/, '') + group.suffix +
                    (counts[name] > 1 ? ' (' + counts[name] + ' polygons)' : '');
                parent.appendChild(opt);
            });
        });

        select.addEventListener('change', function () {
            selects.forEach(function (s) { if (s !== select) s.value = ''; });
            highlight.getSource().clear();
            if (!select.value) return;
            var i = select.value.indexOf('|');
            var group = groups[+select.value.slice(0, i)];
            var extent = ol.extent.createEmpty();
            matches(group, select.value.slice(i + 1)).forEach(function (f) {
                highlight.getSource().addFeature(f.clone());
                ol.extent.extend(extent, f.getGeometry().getExtent());
            });
            map.getView().fit(extent, {padding: [60, 60, 60, 60], maxZoom: 14, duration: 500});
        });
        return select;
    }

    // narrow centred box: title, then the pulldowns stacked
    var element = document.createElement('div');
    element.className = 'roadless-zoom ol-unselectable ol-control';
    element.style.cssText = 'top: 8px; left: 50%; transform: translateX(-50%); padding: 4px 6px; ' +
                            'display: flex; flex-direction: column; gap: 3px; width: 240px; max-width: 45vw;';
    var title = document.createElement('div');
    title.textContent = 'SCYWA Action Area';
    title.style.cssText = 'font: bold 15px Arial, sans-serif; text-align: center; color: #222;';
    element.appendChild(title);
    PICKERS.forEach(function (picker) {
        if (!picker.groups.some(function (g) { return g.layer; })) return;
        var select = makeSelect(picker);
        select.style.cssText = 'font: 13px Arial, sans-serif; width: 100%; padding: 2px;';
        selects.push(select);
        element.appendChild(select);
    });
    map.addControl(new ol.control.Control({element: element}));
})();
