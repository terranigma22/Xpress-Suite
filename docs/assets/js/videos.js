/* ══════════════════════════════════════════════════════════════════
   Xpress Suite — Documentación
   Carga y reproducción de los videos del catálogo

   Lee la lista de  assets/videos/catalog.js  y rellena solo cualquier
   contenedor que tenga el atributo  data-videos.

       <div data-videos="all"></div>       → todos los videos
       <div data-videos="copier"></div>    → solo los del Copier

   Si el contenedor lleva además  data-video-filters, se dibujan los
   botones para filtrar por aplicación.
   ══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var APPS = {
        copier:       { name: 'Copier',        rgb: '0,180,255',   page: 'copier.html' },
        converter:    { name: 'Converter',     rgb: '160,100,255', page: 'converter.html' },
        controlstats: { name: 'ControlStats',  rgb: '255,136,0',   page: 'controlstats.html' },
        observer:     { name: 'Observer',      rgb: '0,255,136',   page: 'observer.html' },
        inicio:       { name: 'Primeros pasos', rgb: '0,200,200',  page: 'primeros-pasos.html' }
    };

    var BASE = 'assets/videos/';

    /* ─── Normaliza el catálogo y descarta entradas incompletas ─── */
    function readCatalog() {
        var raw = window.XS_VIDEOS;
        if (!Array.isArray(raw)) return [];

        return raw.filter(function (v) {
            return v && typeof v.file === 'string' && v.file.trim() !== '';
        }).map(function (v, i) {
            var app = (v.app || '').toLowerCase();
            if (!APPS[app]) app = 'copier';
            return {
                id: 'v' + i,
                file: BASE + v.file.trim(),
                title: (v.title || v.file).trim(),
                desc: (v.desc || '').trim(),
                app: app,
                thumb: v.thumb ? BASE + v.thumb.trim() : null
            };
        });
    }

    var catalog = readCatalog();

    /* ─── Reproductor modal (uno solo, compartido) ─── */
    var modal, modalVideo, modalTitle, modalDesc;

    function buildModal() {
        if (modal) return;

        modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML =
            '<div class="video-modal-inner">' +
              '<div class="video-modal-bar">' +
                '<div>' +
                  '<h4></h4>' +
                  '<p></p>' +
                '</div>' +
                '<button class="video-close" aria-label="Cerrar video">&#10005;</button>' +
              '</div>' +
              '<video controls playsinline preload="metadata"></video>' +
            '</div>';
        document.body.appendChild(modal);

        modalVideo = modal.querySelector('video');
        modalTitle = modal.querySelector('h4');
        modalDesc = modal.querySelector('.video-modal-bar p');

        modal.querySelector('.video-close').addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });
    }

    function openModal(v) {
        buildModal();
        modal.style.setProperty('--vc-rgb', APPS[v.app].rgb);
        modalTitle.textContent = v.title;
        modalDesc.textContent = v.desc;
        modalDesc.style.display = v.desc ? '' : 'none';
        modalVideo.src = v.file;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        modalVideo.play().catch(function () { /* el navegador pedirá pulsar play */ });
    }

    function closeModal() {
        if (!modal) return;
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.load();
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    /* ─── Tarjeta de un video ─── */
    function buildCard(v) {
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'video-card';
        card.style.setProperty('--vc-rgb', APPS[v.app].rgb);
        card.dataset.app = v.app;

        var thumb = document.createElement('div');
        thumb.className = 'video-thumb';

        if (v.thumb) {
            thumb.style.backgroundImage = 'url("' + v.thumb + '")';
        } else {
            // Sin portada: se usa el primer fotograma del propio video
            var preview = document.createElement('video');
            preview.muted = true;
            preview.playsInline = true;
            preview.preload = 'metadata';
            preview.src = v.file + '#t=0.5';
            preview.style.cssText =
                'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;';
            preview.addEventListener('error', function () { preview.remove(); });
            preview.addEventListener('loadedmetadata', function () {
                if (isFinite(preview.duration) && preview.duration > 0) {
                    dur.textContent = formatTime(preview.duration);
                    dur.style.display = '';
                }
            });
            thumb.appendChild(preview);
        }

        var play = document.createElement('div');
        play.className = 'video-play';
        play.innerHTML = '&#9654;';
        thumb.appendChild(play);

        var dur = document.createElement('span');
        dur.className = 'video-dur';
        dur.style.display = 'none';
        thumb.appendChild(dur);

        var meta = document.createElement('div');
        meta.className = 'video-meta';

        var tag = document.createElement('span');
        tag.className = 'video-app';
        tag.textContent = APPS[v.app].name;

        var h5 = document.createElement('h5');
        h5.textContent = v.title;

        meta.appendChild(tag);
        meta.appendChild(h5);

        if (v.desc) {
            var p = document.createElement('p');
            p.textContent = v.desc;
            meta.appendChild(p);
        }

        card.appendChild(thumb);
        card.appendChild(meta);
        card.addEventListener('click', function () { openModal(v); });

        return card;
    }

    function formatTime(sec) {
        var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    /* ─── Aviso cuando todavía no hay videos ─── */
    function buildEmpty(scope) {
        var box = document.createElement('div');
        box.className = 'video-empty';

        var texto = scope === 'all'
            ? 'Todav&iacute;a no hay videos publicados.'
            : 'Todav&iacute;a no hay videos de esta aplicaci&oacute;n.';

        box.innerHTML =
            '<div class="ve-icon">&#9654;</div>' +
            '<h5>' + texto + '</h5>' +
            '<p>Los videos se colocan en la carpeta <b>assets/videos/</b> y se anotan en el ' +
            'archivo <b>assets/videos/catalog.js</b>. Ese archivo trae dentro las instrucciones ' +
            'y un ejemplo. Al recargar la p&aacute;gina aparecen aqu&iacute; autom&aacute;ticamente.</p>';

        return box;
    }

    /* ─── Botones de filtro (solo en la página de Videos) ─── */
    function buildFilters(host, grid, items) {
        var counts = { all: items.length };
        items.forEach(function (v) { counts[v.app] = (counts[v.app] || 0) + 1; });

        var bar = document.createElement('div');
        bar.className = 'video-filters';

        var opts = [{ key: 'all', name: 'Todos', rgb: '255,215,0' }];
        Object.keys(APPS).forEach(function (k) {
            if (counts[k]) opts.push({ key: k, name: APPS[k].name, rgb: APPS[k].rgb });
        });

        opts.forEach(function (o, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'video-filter' + (i === 0 ? ' active' : '');
            b.style.setProperty('--vf', 'rgb(' + o.rgb + ')');
            b.innerHTML = o.name + '<span class="n">' + (counts[o.key] || 0) + '</span>';
            b.addEventListener('click', function () {
                bar.querySelectorAll('.video-filter').forEach(function (x) { x.classList.remove('active'); });
                b.classList.add('active');
                grid.querySelectorAll('.video-card').forEach(function (c) {
                    c.style.display = (o.key === 'all' || c.dataset.app === o.key) ? '' : 'none';
                });
            });
            bar.appendChild(b);
        });

        host.appendChild(bar);
    }

    /* ─── Rellenar cada contenedor ─── */
    function render() {
        document.querySelectorAll('[data-videos]').forEach(function (host) {
            var scope = (host.dataset.videos || 'all').toLowerCase();
            var items = scope === 'all'
                ? catalog
                : catalog.filter(function (v) { return v.app === scope; });

            host.innerHTML = '';

            if (!items.length) {
                host.appendChild(buildEmpty(scope));
                return;
            }

            var grid = document.createElement('div');
            grid.className = 'video-grid';
            items.forEach(function (v) { grid.appendChild(buildCard(v)); });

            if (host.hasAttribute('data-video-filters') && items.length > 1) {
                buildFilters(host, grid, items);
            }
            host.appendChild(grid);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
