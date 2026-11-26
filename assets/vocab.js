// Entraîneur de vocabulaire réutilisable.
// La page définit window.VOCAB = { mots: [...], phrases: [...] } puis charge ce script,
// avec un <div id="vocab"></div> dans la page.
//
// Mot : { art: "das", de: "Handy", pl: "-s", alt: ["Smartphone"], formes: "…", fr: "le natel" }
//   - art : article (der/die/das) pour les noms, sinon absent
//   - alt : autres réponses acceptées (sans article)
//   - formes : formes du verbe (affichées seulement)
// Phrase : { avant: "Sie ", mot: "chattet", apres: " jeden Sonntag…", fr: "Elle chatte…", aide: "chatten" }
(function () {
  const V = window.VOCAB || { mots: [], phrases: [] };
  const mots = V.mots;
  const phrases = V.phrases || [];
  const racine = document.getElementById("vocab");

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const melange = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const norm = s => String(s).toLowerCase().replace(/[.,!?;:()]/g, " ").replace(/\s+/g, " ").trim();
  const sansAccents = s => s.replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");
  const affDe = m => (m.art ? m.art + " " : "") + m.de + (m.pl ? ", " + m.pl : "");
  const affComplet = m => affDe(m) + (m.formes ? ` <span class="formes">(${esc(m.formes)})</span>` : "");

  // Vérifie une réponse en allemand. Renvoie { ok, presque, msg }
  function verifierDe(m, saisie) {
    const s = norm(saisie);
    if (!s) return { ok: false, msg: "Écris une réponse." };
    const acceptes = [m.de, ...(m.alt || [])].map(norm);
    let art = "", reste = s;
    const premier = s.split(" ")[0];
    if (["der", "die", "das"].includes(premier)) { art = premier; reste = s.slice(premier.length).trim(); }
    const bonMot = acceptes.includes(reste) || acceptes.includes(s);
    const motSansUml = acceptes.map(sansAccents).includes(sansAccents(reste));
    const bonne = `<b>${esc(affDe(m))}</b>`;
    if (m.art) {
      if (bonMot && art === m.art) return { ok: true, msg: "✔ Juste ! " + bonne };
      if (bonMot && !art) return { ok: false, presque: true, msg: `Presque ! N'oublie pas l'article : ${bonne}` };
      if (bonMot) return { ok: false, presque: true, msg: `Mauvais article : c'est ${bonne}` };
      if (motSansUml) return { ok: false, presque: true, msg: `Presque ! Attention aux trémas (ä, ö, ü) : ${bonne}` };
    } else {
      if (bonMot) return { ok: true, msg: "✔ Juste ! " + bonne };
      if (motSansUml) return { ok: false, presque: true, msg: `Presque ! Attention aux trémas (ä, ö, ü) : ${bonne}` };
    }
    return { ok: false, msg: `✘ La réponse était : ${bonne}` };
  }

  const MODES = [
    { id: "liste", nom: "📋 Liste" },
    { id: "cartes", nom: "🃏 Cartes" },
    { id: "qcm", nom: "🔘 QCM" },
    { id: "ecrire", nom: "⌨️ Écrire en allemand" },
    ...(mots.some(m => m.art) ? [{ id: "articles", nom: "der / die / das" }] : []),
    ...(phrases.length ? [{ id: "phrases", nom: "🧩 Phrases à trous" }] : []),
  ];

  racine.innerHTML = `<nav class="subtabs vocab-modes">${MODES.map(m => `<a href="#" data-mode="${m.id}">${m.nom}</a>`).join("")}</nav><div id="zone"></div>`;
  const zone = racine.querySelector("#zone");
  racine.querySelectorAll(".vocab-modes a").forEach(a => a.addEventListener("click", e => { e.preventDefault(); lancer(a.dataset.mode); }));

  function onglet(id) { racine.querySelectorAll(".vocab-modes a").forEach(a => a.classList.toggle("active", a.dataset.mode === id)); }

  // Série de questions générique : gère le score et « refaire les erreurs ».
  function serie(mode, items, rendreQuestion) {
    let file = melange(items), i = 0, justes = 0, erreurs = [];
    function suivante() {
      if (i >= file.length) {
        const pct = Math.round(100 * justes / file.length);
        zone.innerHTML = `<div class="carte-vocab fin"><h3>${pct === 100 ? "🎉 Parfait !" : pct >= 70 ? "👍 Bien joué !" : "💪 Continue !"}</h3>
          <p class="gros">${justes} / ${file.length}</p>
          ${erreurs.length ? `<p>À revoir :</p><ul>${erreurs.map(m => `<li>${m.de ? affComplet(m) + " = " + esc(m.fr) : esc(m.avant + m.mot + m.apres)}</li>`).join("")}</ul>` : ""}
          <div class="boutons">${erreurs.length ? `<button id="refaire">Refaire mes erreurs (${erreurs.length})</button>` : ""}<button id="encore" class="secondaire">Tout recommencer</button></div></div>`;
        const r = zone.querySelector("#refaire"); if (r) r.onclick = () => serie(mode, erreurs, rendreQuestion);
        zone.querySelector("#encore").onclick = () => serie(mode, items, rendreQuestion);
        return;
      }
      const item = file[i];
      rendreQuestion(item, `${i + 1} / ${file.length}`, ok => {
        if (ok) justes++; else erreurs.push(item);
        i++; suivante();
      });
    }
    suivante();
  }

  // Bouton « Suivant » + touche Entrée
  function attendreSuivant(fn) {
    const b = zone.querySelector(".suivant");
    b.focus();
    b.onclick = fn;
  }

  function lancer(mode) {
    onglet(mode);
    if (mode === "liste") {
      zone.innerHTML = `<p class="meta">Tout le vocabulaire. Clique sur « Cacher l'allemand » ou « Cacher le français » pour te tester.</p>
        <div class="boutons"><button class="secondaire" data-c="de">Cacher l'allemand</button><button class="secondaire" data-c="fr">Cacher le français</button><button class="secondaire" data-c="">Tout montrer</button></div>
        <div class="tablewrap"><table class="liste-vocab"><tr><th>Allemand</th><th>Français</th></tr>
        ${mots.map(m => `<tr><td class="c-de">${affComplet(m)}</td><td class="c-fr">${esc(m.fr)}</td></tr>`).join("")}</table></div>`;
      zone.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
        zone.querySelector("table").dataset.cache = b.dataset.c;
      });
      zone.querySelector("table").addEventListener("click", e => { const td = e.target.closest("td"); if (td) td.classList.toggle("vu"); });
    }
    if (mode === "cartes") {
      let sens = "fr";
      const go = () => serie("cartes", mots, (m, pos, fini) => {
        const recto = sens === "fr" ? esc(m.fr) : affComplet(m);
        const verso = sens === "fr" ? affComplet(m) : esc(m.fr);
        zone.innerHTML = `<div class="boutons sens"><button class="secondaire ${sens === "fr" ? "actif" : ""}" data-s="fr">Français → Allemand</button><button class="secondaire ${sens === "de" ? "actif" : ""}" data-s="de">Allemand → Français</button></div>
          <div class="carte-vocab"><span class="pos">${pos}</span><p class="gros">${recto}</p><p class="verso" hidden>${verso}</p>
          <div class="boutons"><button class="retourner">Retourner la carte</button></div>
          <div class="boutons juger" hidden><button class="ok-btn">✔ Je savais</button><button class="ko-btn">✘ Je ne savais pas</button></div></div>`;
        zone.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { sens = b.dataset.s; go(); });
        zone.querySelector(".retourner").onclick = () => {
          zone.querySelector(".verso").hidden = false; zone.querySelector(".retourner").hidden = true; zone.querySelector(".juger").hidden = false;
        };
        zone.querySelector(".ok-btn").onclick = () => fini(true);
        zone.querySelector(".ko-btn").onclick = () => fini(false);
      });
      go();
    }
    if (mode === "qcm") {
      let sens = "de";
      const go = () => serie("qcm", mots, (m, pos, fini) => {
        const autres = melange(mots.filter(x => x !== m)).slice(0, 3);
        const options = melange([m, ...autres]);
        const q = sens === "de" ? affComplet(m) : esc(m.fr);
        const rep = x => sens === "de" ? esc(x.fr) : esc(affDe(x));
        zone.innerHTML = `<div class="boutons sens"><button class="secondaire ${sens === "de" ? "actif" : ""}" data-s="de">Allemand → Français</button><button class="secondaire ${sens === "fr" ? "actif" : ""}" data-s="fr">Français → Allemand</button></div>
          <div class="carte-vocab"><span class="pos">${pos}</span><p class="gros">${q}</p>
          <div class="options">${options.map((o, k) => `<button class="option" data-k="${k}">${rep(o)}</button>`).join("")}</div>
          <p class="retour"></p><div class="boutons"><button class="suivant" hidden>Suivant →</button></div></div>`;
        zone.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { sens = b.dataset.s; go(); });
        zone.querySelectorAll(".option").forEach(b => b.onclick = () => {
          const ok = options[+b.dataset.k] === m;
          zone.querySelectorAll(".option").forEach(x => { x.disabled = true; if (options[+x.dataset.k] === m) x.classList.add("bonne"); });
          if (!ok) b.classList.add("mauvaise");
          zone.querySelector(".retour").innerHTML = ok ? "✔ Juste !" : `✘ C'était : <b>${rep(m)}</b>`;
          const s = zone.querySelector(".suivant"); s.hidden = false; attendreSuivant(() => fini(ok));
        });
      });
      go();
    }
    if (mode === "ecrire") {
      serie("ecrire", mots, (m, pos, fini) => {
        zone.innerHTML = `<div class="carte-vocab"><span class="pos">${pos}</span><p class="meta">Écris en allemand${m.art ? " <b>avec l'article</b> (der, die, das)" : ""} :</p>
          <p class="gros">${esc(m.fr)}</p>
          <form class="saisie"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ta réponse…"><button>Vérifier</button></form>
          <div class="claviers">${["ä", "ö", "ü", "ß"].map(c => `<button type="button" class="lettre">${c}</button>`).join("")}</div>
          <p class="retour"></p><div class="boutons"><button class="suivant" hidden>Suivant →</button></div></div>`;
        const inp = zone.querySelector("input"); inp.focus();
        zone.querySelectorAll(".lettre").forEach(b => b.onclick = () => { inp.value += b.textContent; inp.focus(); });
        zone.querySelector("form").onsubmit = e => {
          e.preventDefault();
          if (!inp.value.trim()) return;
          const r = verifierDe(m, inp.value);
          inp.disabled = true; zone.querySelector("form button").disabled = true;
          const ret = zone.querySelector(".retour");
          ret.innerHTML = r.msg + (m.formes ? `<br><span class="formes">${esc(m.formes)}</span>` : "");
          ret.className = "retour " + (r.ok ? "ok" : r.presque ? "presque" : "ko");
          const s = zone.querySelector(".suivant"); s.hidden = false; attendreSuivant(() => fini(r.ok));
        };
      });
    }
    if (mode === "articles") {
      serie("articles", mots.filter(m => m.art), (m, pos, fini) => {
        zone.innerHTML = `<div class="carte-vocab"><span class="pos">${pos}</span><p class="meta">Quel est le bon article ?</p>
          <p class="gros">… ${esc(m.de)}</p><p class="meta">${esc(m.fr)}</p>
          <div class="options art">${["der", "die", "das"].map(a => `<button class="option" data-a="${a}">${a}</button>`).join("")}</div>
          <p class="retour"></p><div class="boutons"><button class="suivant" hidden>Suivant →</button></div></div>`;
        zone.querySelectorAll(".option").forEach(b => b.onclick = () => {
          const ok = b.dataset.a === m.art;
          zone.querySelectorAll(".option").forEach(x => { x.disabled = true; if (x.dataset.a === m.art) x.classList.add("bonne"); });
          if (!ok) b.classList.add("mauvaise");
          zone.querySelector(".retour").innerHTML = (ok ? "✔ Juste ! " : "✘ ") + `<b>${esc(affDe(m))}</b>`;
          const s = zone.querySelector(".suivant"); s.hidden = false; attendreSuivant(() => fini(ok));
        });
      });
    }
    if (mode === "phrases") {
      serie("phrases", phrases, (p, pos, fini) => {
        zone.innerHTML = `<div class="carte-vocab"><span class="pos">${pos}</span><p class="meta">Complète la phrase${p.aide ? ` (verbe : <b>${esc(p.aide)}</b>)` : ""} :</p>
          <p class="gros phrase">${esc(p.avant)}<span class="trou">____</span>${esc(p.apres)}</p><p class="meta">${esc(p.fr)}</p>
          <form class="saisie"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="le mot manquant…"><button>Vérifier</button></form>
          <div class="claviers">${["ä", "ö", "ü", "ß"].map(c => `<button type="button" class="lettre">${c}</button>`).join("")}</div>
          <p class="retour"></p><div class="boutons"><button class="suivant" hidden>Suivant →</button></div></div>`;
        const inp = zone.querySelector("input"); inp.focus();
        zone.querySelectorAll(".lettre").forEach(b => b.onclick = () => { inp.value += b.textContent; inp.focus(); });
        zone.querySelector("form").onsubmit = e => {
          e.preventDefault();
          if (!inp.value.trim()) return;
          const ok = norm(inp.value) === norm(p.mot);
          const presque = !ok && sansAccents(norm(inp.value)) === sansAccents(norm(p.mot));
          inp.disabled = true; zone.querySelector("form button").disabled = true;
          zone.querySelector(".trou").textContent = p.mot; zone.querySelector(".trou").classList.add(ok ? "ok" : "ko");
          const ret = zone.querySelector(".retour");
          ret.innerHTML = ok ? "✔ Juste !" : presque ? `Presque ! Attention aux trémas : <b>${esc(p.mot)}</b>` : `✘ C'était : <b>${esc(p.mot)}</b>`;
          ret.className = "retour " + (ok ? "ok" : presque ? "presque" : "ko");
          const s = zone.querySelector(".suivant"); s.hidden = false; attendreSuivant(() => fini(ok));
        };
      });
    }
  }

  lancer("cartes");
})();
