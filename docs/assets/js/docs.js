/* ══════════════════════════════════════════════════════════════════
   Xpress Suite — Documentación
   Navegación, índice lateral y revelado al hacer scroll
   ══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── Menú móvil ─── */
    var nav = document.getElementById('main-nav');
    if (nav) {
        var toggle = nav.querySelector('.nav-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                nav.classList.toggle('nav-open');
            });
        }
        nav.querySelectorAll('.nav-popover a').forEach(function (a) {
            a.addEventListener('click', function () { nav.classList.remove('nav-open'); });
        });

        window.addEventListener('scroll', function () {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ─── Revelado de secciones al entrar en pantalla ─── */
    var revealables = document.querySelectorAll('.reveal');
    if (revealables.length) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    revealObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });
        revealables.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ─── El índice va siempre abierto en escritorio y plegable en móvil ─── */
    var tocBoxes = document.querySelectorAll('.doc-toc-box');
    if (tocBoxes.length) {
        var wasWide = null;
        var syncToc = function () {
            var wide = window.innerWidth > 900;
            if (wide === wasWide) return;
            wasWide = wide;
            tocBoxes.forEach(function (d) {
                if (wide) d.setAttribute('open', '');
                else d.removeAttribute('open');
            });
        };
        syncToc();
        window.addEventListener('resize', syncToc);
    }

    /* ─── Índice lateral: marcar la sección visible ─── */
    var tocLinks = document.querySelectorAll('.doc-toc a');
    var sections = document.querySelectorAll('.doc-section[id]');

    if (tocLinks.length && sections.length) {
        var linkFor = {};
        tocLinks.forEach(function (a) {
            var id = a.getAttribute('href');
            if (id && id.charAt(0) === '#') linkFor[id.slice(1)] = a;
        });

        var visible = {};

        var tocObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                visible[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
            });

            var bestId = null, best = -1;
            Object.keys(visible).forEach(function (id) {
                if (visible[id] > best) { best = visible[id]; bestId = id; }
            });

            if (bestId && best > 0) {
                tocLinks.forEach(function (a) { a.classList.remove('active'); });
                if (linkFor[bestId]) {
                    linkFor[bestId].classList.add('active');
                    scrollTocIntoView(linkFor[bestId]);
                }
            }
        }, { threshold: [0, .05, .25, .5, .75, 1], rootMargin: '-80px 0px -55% 0px' });

        sections.forEach(function (s) { tocObserver.observe(s); });

        // Mantiene visible el enlace activo dentro del índice con scroll propio
        var tocBox = document.querySelector('.doc-toc');
        function scrollTocIntoView(link) {
            if (!tocBox || window.innerWidth <= 900) return;
            if (tocBox.scrollHeight <= tocBox.clientHeight) return;
            var top = link.offsetTop, h = link.offsetHeight;
            if (top < tocBox.scrollTop) tocBox.scrollTop = top - 8;
            else if (top + h > tocBox.scrollTop + tocBox.clientHeight) {
                tocBox.scrollTop = top + h - tocBox.clientHeight + 8;
            }
        }

        // En móvil, al pulsar una entrada se cierra el desplegable del índice
        var tocBox2 = document.querySelector('.doc-toc-box');
        if (tocBox2) {
            tocLinks.forEach(function (a) {
                a.addEventListener('click', function () {
                    if (window.innerWidth <= 900) tocBox2.removeAttribute('open');
                });
            });
        }
    }

    /* ─── Portada: la nav marca la sección por la que vas pasando ─── */
    var navSectionLinks = document.querySelectorAll('.nav-links a[data-section]');
    var appSections = document.querySelectorAll('.app-section[id], .hero[id]');
    if (navSectionLinks.length && appSections.length) {
        var ratios = {};
        var homeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { ratios[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
            var bestId = null, best = 0;
            Object.keys(ratios).forEach(function (id) {
                if (ratios[id] > best) { best = ratios[id]; bestId = id; }
            });
            navSectionLinks.forEach(function (l) {
                l.classList.toggle('active', l.dataset.section === bestId);
            });
        }, { threshold: [0, .1, .2, .3, .4, .5] });
        appSections.forEach(function (s) { homeObserver.observe(s); });
    }
})();
