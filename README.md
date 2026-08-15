# Portfolio BTS SIO — Louis LOGEZ

Portfolio de deuxième année de BTS SIO, option SISR.
Site statique en HTML/CSS/JS, sans dépendance ni outil de build.

## Structure

```
portfolio/
├── index.html              Accueil
├── apropos.html            Parcours, formations, CV
├── stages.html             Stage et alternance à la SGNC
├── projets.html            Réalisations
├── competences.html        Vue d'ensemble + tableau de synthèse
│   ├── patrimoine.html     Bloc 1 — Support et patrimoine
│   ├── infrastructure.html Bloc 2 — Systèmes et réseaux
│   └── cybersecurite.html  Bloc 3 — Cybersécurité
├── veille.html             Veille technologique
├── contact.html            Contact
└── assets/
    ├── css/style.css       Feuille de style unique (thèmes clair et sombre)
    ├── js/theme.js         Bascule de thème
    ├── img/                Images
    └── docs/               CV et rapports (PDF)
```

## Choix techniques

- **Feuille de style unique.** Le CSS était auparavant dupliqué en ligne dans chaque
  page (environ 200 lignes par fichier). Il est désormais centralisé : une seule
  modification suffit pour répercuter un changement sur tout le site.
- **Variables CSS pour le thème.** Les couleurs sont définies comme variables sur
  `:root`, redéfinies sur `:root[data-theme="dark"]`. Le mode sombre fonctionne donc
  sur tous les composants, sans surcharge `!important`.
- **Aucune dépendance JavaScript externe.** Seul `theme.js` est chargé, en `defer`.
- **Accessibilité :** lien d'évitement, `aria-current` sur la page active, focus
  visible au clavier, `prefers-reduced-motion` respecté, texte alternatif sur toutes
  les images.
- **Feuille d'impression** pour générer une version papier propre du portfolio.

## Corrections apportées lors de la reprise

| Problème | Correction |
|---|---|
| Liens vers le CV et le rapport de stage cassés (chemin relatif erroné) | Documents regroupés dans `assets/docs/`, liens corrigés |
| `Gestion du patrimoine.pdf` présent mais jamais référencé | Lié depuis la page Bloc 1 |
| Placeholder « Image à insérer » visible en production | Carte supprimée |
| Formulaire de contact en `mailto:` + `POST`, non fonctionnel | Passage à un service de formulaire (identifiant à renseigner) |
| `linear-gradient(180deg,#fff #fff8f0)` invalide (virgule manquante) | Dégradé corrigé |
| `body { width: 100vw }` provoquant une barre de défilement horizontale | Retiré |
| `&` non échappé dans l'URL Google Fonts (HTML invalide) | `&amp;` |
| Balise `</p>` orpheline dans la page patrimoine | Supprimée |
| Noms de fichiers avec espaces et accents | Renommés en minuscules sans accents |
| Images non optimisées (7,4 Mo) | Redimensionnées et recompressées (1,1 Mo) |
| Fautes d'orthographe et de syntaxe | Corrigées |
| Numérotation des compétences non conforme au référentiel | Reprise, activité manquante ajoutée |
| Blocs 2 et 3 du référentiel absents | Pages créées |

## Mise en ligne (GitHub Pages)

```bash
git add .
git commit -m "Refonte de la structure du portfolio"
git push
```

Puis dans le dépôt GitHub : **Settings → Pages → Source : branche `main`, dossier `/ (root)`**.
Le site est publié quelques minutes plus tard sur
`https://louislogez.github.io/<nom-du-depot>/`.

## Reste à faire

Les blocs signalés « à compléter » dans les pages listent précisément ce qui manque.
Ils sont masqués à l'impression et doivent être retirés au fur et à mesure.

1. Faire valider par les tuteurs SGNC ce qui peut être publié (préalable à tout le reste).
2. Rédiger les fiches techniques : conformité NIST, supervision, HIDS TechForm NC.
3. Étoffer la veille : six à huit articles étalés sur les deux années, plus une synthèse.
4. Compléter le tableau de synthèse des compétences.
5. Mettre en ligne.
