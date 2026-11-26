# Site de révisions

Site statique (HTML/CSS/JS, sans build) pour réviser. Deux catégories :
- **Raphaël** (`raphael`) : ce que Raphaël doit réviser
- **Snu** (`snu`, écrit S-N-U) : ce que Snu doit réviser

Chaque catégorie a des **sous-catégories (matières)**, définies dans `CATS` en haut du
script de `index.html`. Le champ `matiere` d'une révision = l'`id` de la matière.
- Raphaël : anglais, allemand, physique, histoire, geographie, maths, musique-os,
  informatique, sport, musique-df, chimie, biologie
- Snu : allemand, francais, sciences, maths, histoire, informatique, musique, geographie,
  japonais

Dans chaque matière (et dans « Toutes »), une partie **📦 Archivé** contient les anciens
thèmes : les révisions dont la date de test est passée.

## Ajouter une révision ("rajoute dans Raphaël / Snu")

L'utilisateur fournit des fiches / PDF, une date de test et un prompt disant quoi faire.

1. Créer un dossier `revisions/<categorie>/<AAAA-MM-JJ>-<matiere>-<sujet>/`.
2. Y copier les PDF fournis.
3. Si le prompt demande une fiche, un résumé, un quiz, etc. : créer `index.html` dans ce
   dossier (voir modèle ci-dessous), qui utilise `../../../assets/style.css` et la classe
   `cat-<categorie>` sur `<body>`.
4. Ajouter une entrée dans `data/revisions.js` (champs : `id`, `categorie`, `titre`,
   `matiere`, `dateTest`, `description`, `page`, `fichiers`).
5. Commit + push sur la branche de travail, puis aussi sur `main` (`git push origin HEAD:main`) :
   le site en ligne (GitHub Pages, https://rimeur9020.github.io/travail/) est servi depuis `main`.

## Règle : fiches de révision

- Cours / test « de contenu » (physique, histoire, géo, chimie, bio, maths, sciences,
  français, etc.) : **toujours** créer une fiche de révision (`index.html` dans le dossier
  de la révision), même si le prompt ne le demande pas.
  + **toujours** une page `exercices.html` d'entraînement : exercices simples et progressifs
  pour apprendre à utiliser les formules, réponses vérifiables, indice + correction
  (modèle : `revisions/raphael/2026-11-30-physique-resistance-equivalente/exercices.html`).
  Lier depuis la fiche et dans `fichiers` de l'entrée.
- Liste de vocabulaire (voc d'allemand, d'anglais, de japonais…) : **pas de fiche**, mais
  **toujours** une page `exercices.html` qui utilise l'entraîneur `assets/vocab.js`
  (cartes, QCM, écrire, der/die/das, phrases à trous) : il suffit de remplir `window.VOCAB`
  (modèle : `revisions/snu/2026-11-27-allemand-wir-und-die-medien/exercices.html`).
  Recopier tout le voc (articles, pluriels, formes des verbes) et les phrases d'exemple.

## Archivé

Automatique : `index.html` compare `dateTest` à la date du jour ; une révision passe dans
la partie Archivé de sa matière le lendemain de son test. Rien à déplacer. Ne jamais supprimer les anciennes
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
