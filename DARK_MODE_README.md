# Mode Sombre - Guide d'Utilisation et Documentation

## 🌙 Vue d'ensemble

Votre portfolio dispose désormais d'un **système complet de mode sombre** qui permet aux visiteurs de basculer facilement entre le mode clair (par défaut) et le mode sombre pour une meilleure expérience visuelle selon leurs préférences.

## ✨ Fonctionnalités

### 1. **Toggle Button (Bouton de Basculement)**
- Un bouton circulaire **fixe dans le coin supérieur droit** de chaque page
- Affiche 🌙 en mode clair (pour activer le mode sombre)
- Affiche ☀️ en mode sombre (pour revenir au mode clair)
- Entièrement accessible et responsive
- Hover effect avec agrandissement (scale 1.1)

### 2. **Détection Automatique**
- Respecte la préférence système de l'utilisateur (`prefers-color-scheme`)
- Si l'utilisateur a une préférence système pour le mode sombre, le portfolio l'appliquera automatiquement au premier chargement
- Bascule progressive si la préférence système change

### 3. **Persistance**
- Le choix de l'utilisateur est **sauvegardé dans localStorage**
- La clé utilisée : `portfolio-theme` (valeurs : `"light"` ou `"dark"`)
- Persiste sur tous les appareils et sessions

### 4. **Transitions Lisses**
- Tous les changements de couleur utilisent des **transitions CSS fluides** (0.3s)
- Pas de scintillement lors du basculement
- Performance optimisée

## 🎨 Palette de Couleurs

### Mode Clair (Par défaut)
| Élément | Couleur | Utilisation |
|---------|---------|-------------|
| Arrière-plan | #f5f3ee | Fond principal dégradé |
| Accent primaire | #f57c00 | Titres, boutons, liens |
| Accent secondaire | #b45309 | Navigation, éléments secondaires |
| Texte primaire | #222e3a | Texte principal |
| Sections | rgba(255,255,255,0.97) | Containers des sections |
| Bordures | #e6cfa3 | Séparations et bordures |

### Mode Sombre
| Élément | Couleur | Utilisation |
|---------|---------|-------------|
| Arrière-plan | #0f0f0f - #1a1a1a | Fond principal très foncé |
| Accent primaire | #ff9800 | Titres, boutons, liens (plus clair) |
| Accent secondaire | #ffb74d | Navigation, éléments secondaires |
| Texte primaire | #e0e0e0 | Texte principal clair |
| Sections | rgba(30,30,30,0.95) | Containers gris foncé |
| Bordures | #333333 | Séparations visibles |

## 📁 Fichiers Concernés

### Nouveaux fichiers créés :
1. **dark-mode.css** - Feuille de styles CSS avec :
   - Déclaration des variables CSS pour les deux thèmes
   - Styles de base utilisant les variables
   - Styles spécifiques au mode sombre avec `!important`

2. **dark-mode.js** - Script JavaScript qui :
   - Détecte la préférence système
   - Gère le basculement de thème
   - Sauvegarde la préférence dans localStorage
   - Crée et gère le bouton de toggle

### Fichiers modifiés :
- **index.html**
- **apropos.html**
- **contact.html**
- **projets.html**
- **stages.html**
- **patrimoine.html**
- **veille.html**

**Modifications apportées :**
- Ajout du lien CSS : `<link rel="stylesheet" href="../dark-mode.css" />`
- Ajout du script JS : `<script src="../dark-mode.js"></script>` (avant `</body>`)

## 🔧 Comment ça Marche

### 1. Système de Variables CSS
```css
/* Mode clair (par défaut) */
:root {
  --bg-primary: #f5f3ee;
  --text-primary: #222e3a;
  --accent-primary: #f57c00;
  /* ... autres variables */
}

/* Mode sombre */
:root[data-theme="dark"] {
  --bg-primary: #0f0f0f;
  --text-primary: #e0e0e0;
  --accent-primary: #ff9800;
  /* ... autres variables */
}
```

### 2. Application du Thème
- L'attribut `data-theme="dark"` est ajouté à l'élément `<html>`
- Les variables CSS changent selon cet attribut
- Les styles s'appliquent via les variables

### 3. Gestion du Basculement
```javascript
function toggleTheme() {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
}
```

## 🚀 Utilisation

Aucune action requise de votre part ! Le mode sombre fonctionne automatiquement :

1. **Visiteur ouvre le portfolio** → Détection de sa préférence système
2. **Clique sur le bouton** → Thème bascule et est sauvegardé
3. **Revisit le portfolio** → La préférence est restaurée

## 📝 Code Source

### dark-mode.js - Structure principale
```javascript
initTheme()           // Initialise au chargement
applyTheme(theme)     // Applique le thème
toggleTheme()         // Bascule le thème
createToggleButton()  // Crée le bouton UI
```

### dark-mode.css - Variables
- **40+ variables CSS** pour une couverture complète
- Styles pour : header, nav, sections, cartes, formulaires, etc.
- Optimisé pour la performance

## ✅ Tests Recommandés

1. ✓ Vérifier le toggle button (coin supérieur droit)
2. ✓ Basculer entre mode clair/sombre
3. ✓ Rafraîchir la page (la préférence persiste)
4. ✓ Changer la préférence système et recharger
5. ✓ Vérifier la lisibilité du texte en mode sombre
6. ✓ Tester sur mobile (responsive)

## 🎯 Points Forts

- ✨ **Totalement automatique** - Aucun configuration nécessaire
- 🌓 **Respect des préférences** - Détecte la préférence système
- 💾 **Persistant** - Sauvegarde la préférence utilisateur
- 🎨 **Cohérent** - Palette adaptée et harmonieuse
- ⚡ **Performant** - Transitions fluides sans scintillement
- ♿ **Accessible** - Bouton avec aria-label et title
- 📱 **Responsive** - Fonctionne sur tous les appareils

## 🔄 Maintenance Futur

Si vous devez ajouter :
- **Nouvelles couleurs** : Ajoutez-les dans les variables CSS
- **Nouveaux éléments** : Utilisez les variables existantes
- **Personnalisation** : Modifiez `dark-mode.css`

---

**Mode sombre intégré avec succès ! 🎉**
