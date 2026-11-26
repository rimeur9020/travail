// Liste de toutes les révisions du site.
//
// Chaque révision est un objet :
// {
//   id:        "raphael-2026-12-03-maths-fractions", // unique, sert à l'URL
//   categorie: "raphael",                             // "raphael" ou "snu"
//   titre:     "Les fractions",
//   matiere:   "maths",   // id de la sous-catégorie (voir CATS dans index.html)
//   dateTest:  "2026-12-03",                          // AAAA-MM-JJ
//   description: "Contrôle sur le chapitre 4.",
//   page:      "revisions/raphael/2026-12-03-maths-fractions/index.html", // fiche (optionnel)
//   fichiers:  [ { nom: "Cours (PDF)", chemin: "revisions/raphael/2026-12-03-maths-fractions/cours.pdf" } ]
// }
//
// Une révision passe automatiquement dans la partie « Archivé » de sa matière le lendemain de sa date de test.

window.REVISIONS = [
  {
    id: "raphael-2026-11-30-physique-resistance-equivalente",
    categorie: "raphael",
    titre: "Résistance équivalente & lignes à haute tension",
    matiere: "physique",
    dateTest: "2026-11-30",
    description: "Série, parallèle, circuits mixtes, lois de Kirchhoff, lignes HT, réseau électrique et tension triphasée (cours p. 23 à 28).",
    page: "revisions/raphael/2026-11-30-physique-resistance-equivalente/index.html",
    fichiers: [
      { nom: "Photos du cours", chemin: "revisions/raphael/2026-11-30-physique-resistance-equivalente/index.html#photos" }
    ]
  },
];
