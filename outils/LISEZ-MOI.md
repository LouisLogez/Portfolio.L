# Coffres : contenus confidentiels du portfolio

Certains éléments du portfolio décrivent l'environnement technique réel
(adresses IP, fichiers de configuration, failles connues, documents internes
de l'entreprise). Ils **ne sont jamais publiés en clair** :

- leur version lisible reste sur ton ordinateur, dans `prive/` (exclu de git) ;
- les pages ne contiennent qu'une version **chiffrée** (AES-256) ;
- le navigateur les déchiffre uniquement après saisie du mot de passe.

Un simple flou CSS ou un mot de passe vérifié en JavaScript ne protégerait
rien : le texte resterait lisible dans le code source de la page. Ici, sans
le mot de passe, il n'y a rien à lire.

## Contenu du dossier `prive/` (jamais publié)

| Chemin | Rôle |
|---|---|
| `prive/coffres/<id>.html` | Version en clair du coffre `<div class="vault" data-vault="<id>">` |
| `prive/docs/<fichier>.pdf` | Document protégé, publié chiffré dans `assets/docs/<fichier>.pdf.enc` |

**Sauvegarde ce dossier** (clé USB, disque externe) : c'est la seule copie
lisible de ces contenus.

## Chiffrer ou changer le mot de passe

Dans un terminal, à la racine du portfolio :

```powershell
powershell -ExecutionPolicy Bypass -File outils\chiffrer-coffres.ps1
```

Le script demande le mot de passe deux fois (rien ne s'affiche à la saisie),
puis rechiffre tous les coffres et tous les documents. Choisis une phrase
longue : les données chiffrées sont publiques, seule la longueur du mot de
passe protège contre une attaque par force brute.

À relancer après chaque modification d'un fichier de `prive/`.

## Ajouter un nouveau coffre

1. Écrire le contenu HTML dans `prive/coffres/mon-coffre.html`.
2. Placer dans la page, à l'endroit voulu :
   ```html
   <div class="vault" data-vault="mon-coffre" data-label="Titre affiché"
        data-style="text" data-lines="6" data-payload=""></div>
   ```
   (`data-style="code"` pour un aspect de bloc de code.)
3. Relancer le script de chiffrement.

## Pendant l'oral

Saisir le mot de passe dans n'importe quel coffre : tous les coffres de toutes
les pages s'ouvrent jusqu'à la fermeture de l'onglet. Le bouton
« Coffres ouverts · Verrouiller » (en bas à gauche) referme tout.

Et si quelqu'un se trompe de mot de passe… Wazuh veille.
