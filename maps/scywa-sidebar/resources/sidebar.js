// Sidebar layout for the SCYWA qgis2web OpenLayers map (2026-11-04)
// Replaces the qgis2web layer switcher and map popup with an icon rail and side panel:
// Legend (visible layers), Details (text in index.html), Layers (on/off and transparency),
// Info (attributes of the clicked features). Load last, after the other add-ons.
(function () {
    var panel = document.getElementById('panel');
    var rail = Array.prototype.slice.call(document.querySelectorAll('#rail button[data-view]'));
    var titles = {legend: 'Legend', details: 'Details', layers: 'Layers', info: 'Info'};

    function resize() { setTimeout(function () { map.updateSize(); }, 0); }
    function show(id) {
        panel.hidden = false;
        rail.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.view === id)); });
        document.querySelectorAll('#panel .view').forEach(function (v) { v.classList.toggle('active', v.id === id); });
        document.getElementById('panelTitle').textContent = titles[id];
        resize();
    }
    function hide() {
        panel.hidden = true;
        rail.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        resize();
    }
    rail.forEach(function (b) {
        b.addEventListener('click', function () {
            if (b.getAttribute('aria-pressed') === 'true' && !panel.hidden) hide(); else show(b.dataset.view);
        });
    });
    document.getElementById('closePanel').addEventListener('click', hide);
    var collapse = document.getElementById('collapse');
    collapse.addEventListener('click', function () {
        var c = document.body.classList.toggle('rail-collapsed');
        collapse.querySelector('.ico').textContent = c ? '»' : '«';
        collapse.querySelector('.lbl').textContent = c ? 'Expand' : 'Collapse';
        resize();
    });

    // the side panel replaces the qgis2web layer switcher
    if (typeof layerSwitcher !== 'undefined') map.removeControl(layerSwitcher);

    // layers shown in the panel, top of the map first; skip empty groups and helper layers
    function listed() {
        return layersList.slice().reverse().filter(function (l) {
            if (!l.get('title')) return false;
            if (l instanceof ol.layer.Group) return l.getLayers().getLength() > 0;
            return true;
        });
    }
    // display names for layers whose qgis2web titles are file names (popuplayertitle is left
    // unchanged because layer-order.js and the other add-ons match on it)
    var NAMES = {
        'SCYWA_ActionArea_mod10.24': 'SCYWA Action Area',
        'bdy_RoadlessInSCYWA10.24.2026': 'Roadless Areas'
    };
    function rename(s) { return NAMES[s] || s; }
    function plainName(l) {
        var div = document.createElement('div');
        div.innerHTML = String(l.get('title')).split(/<br\s*\/?>/i)[0];
        return rename(div.textContent.trim());
    }
    function isBase(l) { return l instanceof ol.layer.Tile; }

    var legendEl = document.getElementById('legend');
    function buildLegend() {
        var html = '';
        listed().forEach(function (l) {
            if (isBase(l) || !l.getVisible()) return;
            var parts = String(l.get('title')).split(/<br\s*\/?>/i);
            var head = parts[0], rows = parts.slice(1);
            html += '<section class="lg"><h3>' + plainName(l) + '</h3>';
            if (rows.length) rows.forEach(function (r) { html += '<div class="lg-row">' + r + '</div>'; });
            else {
                var img = head.match(/<img[^>]*>/i);
                html += '<div class="lg-row">' + (img ? img[0] : '') + '</div>';
            }
            html += '</section>';
        });
        legendEl.innerHTML = html || '<p class="empty">No layers are turned on.</p>';
    }

    var layersEl = document.getElementById('layers');
    function buildLayers() {
        layersEl.innerHTML = '';
        listed().forEach(function (l, i) {
            var row = document.createElement('div');
            row.className = 'ly' + (isBase(l) ? ' base' : '');
            var id = 'ly' + i;
            row.innerHTML =
                '<label for="' + id + '"><input type="checkbox" id="' + id + '"' + (l.getVisible() ? ' checked' : '') + '> ' +
                '<span>' + plainName(l) + (isBase(l) ? ' <em>(basemap)</em>' : '') + '</span></label>' +
                '<div class="op"><span>Transparency</span><input type="range" min="0" max="90" step="10" value="' +
                Math.round((1 - l.getOpacity()) * 100) + '" aria-label="Transparency of ' + plainName(l) + '"></div>';
            row.querySelector('input[type=checkbox]').addEventListener('change', function (e) { l.setVisible(e.target.checked); });
            row.querySelector('input[type=range]').addEventListener('input', function (e) { l.setOpacity(1 - e.target.value / 100); });
            l.on('change:visible', buildLegend);
            layersEl.appendChild(row);
        });
    }

    // clicked-feature attributes go to the Info panel instead of a map popup
    var infoEl = document.getElementById('info-content');
    window.updatePopup = function () {
        container.style.display = 'none';
        if (popupContent) {
            infoEl.innerHTML = popupContent;
            infoEl.querySelectorAll('a > b').forEach(function (b) { b.textContent = rename(b.textContent); });
            show('info');
        } else {
            infoEl.innerHTML = '<p class="empty">No feature here. Click on a mapped area to view its attributes.</p>';
        }
    };

    // splash screen: closes with the button, Escape or a click outside the card
    var splash = document.getElementById('splash');
    if (splash) {
        var closeSplash = function () { splash.hidden = true; };
        document.getElementById('splashClose').addEventListener('click', closeSplash);
        splash.addEventListener('click', function (e) { if (e.target === splash) closeSplash(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !splash.hidden) closeSplash(); });
        document.getElementById('splashClose').focus();
    }

    buildLayers();
    buildLegend();
    resize();
})();
