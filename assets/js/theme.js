/* =========================================================================
   Gestion du thème clair / sombre
   - mémorise le choix dans localStorage
   - retombe sur la préférence système si aucun choix n'a été fait
   ========================================================================= */
(function () {
  'use strict';

  var KEY = 'portfolio-theme';
  var DARK = 'dark';
  var LIGHT = 'light';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var SUN = SVG + '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = SVG + '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function remember(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) { /* mode privé */ }
  }

  function apply(theme, persist) {
    if (theme === DARK) {
      document.documentElement.setAttribute('data-theme', DARK);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    if (persist) { remember(theme); }
    updateButton(theme);
  }

  function updateButton(theme) {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) { return; }
    var isDark = theme === DARK;
    btn.innerHTML = isDark ? SUN : MOON;
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute(
      'aria-label',
      isDark ? 'Passer en mode clair' : 'Passer en mode sombre'
    );
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') === DARK ? DARK : LIGHT;
  }

  function createButton() {
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.addEventListener('click', function () {
      apply(current() === DARK ? LIGHT : DARK, true);
    });
    var host = document.querySelector('.site-header');
    if (host) { host.insertBefore(btn, host.querySelector('.nav-burger')); }
    else { document.body.appendChild(btn); }
    updateButton(current());
  }

  // Applique le thème le plus tôt possible pour éviter un flash de couleur.
  apply(stored() || (media.matches ? DARK : LIGHT), false);

  media.addEventListener('change', function (e) {
    if (!stored()) { apply(e.matches ? DARK : LIGHT, false); }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }
})();
