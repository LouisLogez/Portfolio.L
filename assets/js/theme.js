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
    btn.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
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
    document.body.appendChild(btn);
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
