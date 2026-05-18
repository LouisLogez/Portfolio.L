// Système de gestion du mode sombre
(function() {
  const THEME_KEY = 'portfolio-theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  // Initialiser le thème au chargement
  function initTheme() {
    // Vérifier la préférence sauvegardée
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    // Si pas de préférence sauvegardée, utiliser la préférence système
    let theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME);
    
    applyTheme(theme);
  }

  // Appliquer le thème
  function applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === DARK_THEME) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, DARK_THEME);
      updateToggleButton('☀️');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, LIGHT_THEME);
      updateToggleButton('🌙');
    }
  }

  // Mettre à jour l'icône du bouton
  function updateToggleButton(icon) {
    const button = document.querySelector('.dark-mode-toggle');
    if (button) {
      button.textContent = icon;
    }
  }

  // Basculer entre les thèmes
  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === DARK_THEME;
    const newTheme = isDark ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
  }

  // Créer le bouton de toggle
  function createToggleButton() {
    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.setAttribute('aria-label', 'Basculer le mode sombre');
    button.setAttribute('title', 'Basculer le mode sombre');
    
    // Définir l'icône initiale
    const isDark = localStorage.getItem(THEME_KEY) === DARK_THEME || 
                   (!localStorage.getItem(THEME_KEY) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    button.textContent = isDark ? '☀️' : '🌙';
    
    button.addEventListener('click', toggleTheme);
    document.body.appendChild(button);
  }

  // Écouter les changements de préférence système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Ne changer que si l'utilisateur n'a pas sauvegardé de préférence
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
    }
  });

  // Initialiser au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initTheme();
      createToggleButton();
    });
  } else {
    initTheme();
    createToggleButton();
  }
})();
