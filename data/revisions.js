// Liste de toutes les révisions du site.
//
// Chaque révision est un objet :
// {
//   id:        "raphael-2026-12-03-maths-fractions", // unique, sert à l'URL
//   categorie: "raphael",                             // "raphael" ou "snu"
//   titre:     "Les fractions",
//   matiere:   "Maths",
//   dateTest:  "2026-12-03",                          // AAAA-MM-JJ
//   description: "Contrôle sur le chapitre 4.",
//   page:      "revisions/raphael/2026-12-03-maths-fractions/index.html", // fiche (optionnel)
//   fichiers:  [ { nom: "Cours (PDF)", chemin: "revisions/raphael/2026-12-03-maths-fractions/cours.pdf" } ]
// }
//
// Une révision passe automatiquement dans la Poubelle le lendemain de sa date de test.

window.REVISIONS = [];
