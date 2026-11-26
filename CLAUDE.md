# Site de révisions

Site statique (HTML/CSS/JS, sans build) pour réviser. Deux catégories :
- **Raphaël** (`raphael`) : ce que Raphaël doit réviser
- **Snu** (`snu`, écrit S-N-U) : ce que Snu doit réviser

Plus une **Poubelle** : les révisions dont la date de test est passée.

## Ajouter une révision ("rajoute dans Raphaël / Snu")

L'utilisateur fournit des fiches / PDF, une date de test et un prompt disant quoi faire.

1. Créer un dossier `revisions/<categorie>/<AAAA-MM-JJ>-<matiere>-<sujet>/`.
2. Y copier les PDF fournis.
3. Si le prompt demande une fiche, un résumé, un quiz, etc. : créer `index.html` dans ce
   dossier (voir modèle ci-dessous), qui utilise `../../../assets/style.css` et la classe
   `cat-<categorie>` sur `<body>`.
4. Ajouter une entrée dans `data/revisions.js` (champs : `id`, `categorie`, `titre`,
   `matiere`, `dateTest`, `description`, `page`, `fichiers`).
5. Commit + push sur la branche de travail.

## Poubelle

Automatique : `index.html` compare `dateTest` à la date du jour ; une révision passe en
Poubelle le lendemain de son test. Rien à déplacer. Ne jamais supprimer les anciennes
révisions (elles doivent rester consultables).

## Modèle de fiche

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Titre · Révisions</title>
  <link rel="stylesheet" href="../../../assets/style.css">
</head>
<body class="cat-raphael">
  <div class="wrap">
    <a class="back" href="../../../index.html#raphael">← Retour</a>
    <div class="fiche">
      <h1>Titre</h1>
      ...
    </div>
  </div>
</body>
</html>
```
