const SUPPORTED_LANGUAGES = ["fr", "en", "es"];
const SUPPORTED_MODES = ["corrected", "marketing", "raw"];

const GALLERY_MANIFEST = [
  {
    src: "Ressource/images/enceinte_left_plus_chaise.jpg",
    section: "hero",
    layout: "landscape",
    width: 9632,
    height: 7706,
    alt: "Tabula Rasa près d'une chaise.",
  },
  {
    src: "Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg",
    section: "showcase",
    layout: "landscape",
    width: 6720,
    height: 4480,
    alt: "Paire d'enceintes avec amplificateur.",
  },
  {
    src: "Ressource/images/enceinte_left_back_plus_enceinte_right.jpg",
    section: "showcase",
    layout: "landscape",
    span: "two-thirds",
    width: 5600,
    height: 4480,
    alt: "Face et dos des enceintes.",
  },
  {
    src: "Ressource/images/enceinte_vue.jpg",
    section: "showcase",
    layout: "landscape",
    width: 6720,
    height: 4480,
    alt: "Vue d'ensemble du produit.",
  },
  {
    src: "Ressource/images/enceinte_vue_back_left.jpg",
    section: "details",
    layout: "portrait",
    width: 4480,
    height: 5600,
    alt: "Vue arrière gauche.",
  },
  {
    src: "Ressource/images/enceinte_vue_back_left_close.jpg",
    section: "details",
    layout: "portrait",
    width: 4480,
    height: 5600,
    alt: "Détail arrière gauche.",
  },
  {
    src: "Ressource/images/enceinte_vue_face_left.jpg",
    section: "details",
    layout: "portrait",
    width: 4299,
    height: 5373,
    alt: "Vue avant gauche.",
  },
  {
    src: "Ressource/images/enceinte_vue_super_face_close_left.jpg",
    section: "details",
    layout: "portrait",
    width: 3584,
    height: 4480,
    alt: "Détail frontal gauche.",
  },
  {
    src: "Ressource/images/enceinte_vue_super_face_close_right.jpg",
    section: "details",
    layout: "portrait",
    width: 3584,
    height: 4480,
    alt: "Détail frontal droit.",
  },
  {
    src: "Ressource/images/enceinte_vue_super_face_corner_close_left.jpg",
    section: "details",
    layout: "portrait",
    width: 3584,
    height: 4480,
    alt: "Détail d'angle du haut-parleur.",
  },
  {
    src: "Ressource/images/enceinte_back_little_left.jpg",
    section: "details",
    layout: "landscape",
    span: "two-thirds",
    width: 6286,
    height: 5028,
    alt: "Détail structure arrière.",
  },
];

const UI_TEXT = {
  fr: {
    nav: {
      accueil: "Accueil",
      enceinte: "Enceinte",
      conception: "Conception",
      galerie: "Galerie",
      "fiche-technique": "Fiche technique",
      contact: "Contact",
    },
    labels: {
      language: "Langue",
      mode: "Mode texte",
      debugHint: "Mode debug actif.",
      rawFallback: "Le mode Brut est disponible en français uniquement.",
    },
    modes: { corrected: "Corrigé", marketing: "Marketing", raw: "Brut" },
    sections: {
      design: "Conception acoustique",
      gallery: "Galerie",
      specs: "Fiche technique",
      contact: "Contact",
    },
  },
  en: {
    nav: {
      accueil: "Home",
      enceinte: "Speaker",
      conception: "Design",
      galerie: "Gallery",
      "fiche-technique": "Technical sheet",
      contact: "Contact",
    },
    labels: {
      language: "Language",
      mode: "Text mode",
      debugHint: "Debug mode enabled.",
      rawFallback: "Raw mode is available in French only.",
    },
    modes: { corrected: "Edited", marketing: "Marketing", raw: "Raw" },
    sections: {
      design: "Acoustic design",
      gallery: "Gallery",
      specs: "Technical sheet",
      contact: "Contact",
    },
  },
  es: {
    nav: {
      accueil: "Inicio",
      enceinte: "Altavoz",
      conception: "Diseño",
      galerie: "Galería",
      "fiche-technique": "Ficha técnica",
      contact: "Contacto",
    },
    labels: {
      language: "Idioma",
      mode: "Modo de texto",
      debugHint: "Modo debug activo.",
      rawFallback: "El modo bruto está disponible solo en francés.",
    },
    modes: { corrected: "Corregido", marketing: "Marketing", raw: "Bruto" },
    sections: {
      design: "Diseño acústico",
      gallery: "Galería",
      specs: "Ficha técnica",
      contact: "Contacto",
    },
  },
};

const INTRO_VALUES = {
  fr: [
    "Notre démarche s'inspire de l'art minimal: retirer le superflu pour laisser l'essentiel sonore.",
    "La forme suit la fonction, avec une fidélité rigoureuse et une image sonore précise.",
    "Objectif: reproduire l'oeuvre sans artefacts, avec une écoute fluide et lisible.",
  ],
  en: [
    "Our approach is inspired by minimal art: remove excess to preserve the essential signal.",
    "Form follows function, with rigorous fidelity and precise sound imaging.",
    "Goal: reproduce the musical work without artifacts, with a fluid and readable listening experience.",
  ],
  es: [
    "Nuestra propuesta se inspira en el arte minimal: retirar lo superfluo para conservar lo esencial sonoro.",
    "La forma sigue a la función, con una fidelidad rigurosa y una imagen sonora precisa.",
    "Objetivo: reproducir la obra sin artefactos, con una escucha fluida y legible.",
  ],
};

const COPY = {
  fr: {
    corrected: {
      kicker: "Baffle plan en PMMA",
      title: "tabula rasa",
      subtitle:
        "Une enceinte minimaliste centrée sur la clarté, la vitesse et la présence du médium.",
      quote: "« Ne rien ajouter, ne rien retrancher. »",
      manifesto: [
        "Notre démarche s'inspire de l'art minimal: retirer le superflu pour laisser l'essentiel sonore.",
        "La forme suit la fonction, avec une fidélité rigoureuse et une image sonore précise.",
        "Objectif: reproduire l'oeuvre sans artefacts, avec une écoute fluide et lisible.",
      ],
      design: [
        "Un seul haut-parleur couvre graves, médiums et aigus: source ponctuelle, timbres homogènes.",
        "Sans coffret classique ni filtre complexe, la micro-dynamique reste vivante et rapide.",
        "Le panneau PMMA et le baffle plan limitent fortement les résonances et ondes stationnaires.",
      ],
      galleryLead: "Des vues d'ensemble aux gros plans techniques, chaque image montre un point précis de la conception.",
      specsLead: "Valeurs issues de la ressource d'origine, complétées par les champs standard d'une fiche technique.",
      contactLead: "Pour une écoute ou un conseil d'association ampli/enceinte, écrivez-nous.",
    },
    marketing: {
      kicker: "Design minimal, impact musical",
      title: "tabula rasa",
      subtitle: "Un objet acoustique qui privilégie l'émotion et la lisibilité à la démonstration de puissance.",
      quote: "« Honesty, utility, simplicity. »",
      manifesto: [
        "Tabula Rasa assume une esthétique sobre et une architecture ouverte sans artifice.",
        "La restitution met en avant l'expression du médium, la voix et la cohérence de scène.",
        "Chaque choix sert la musique avant tout.",
      ],
      design: [
        "Le haut-parleur large bande unique assure continuité et focalisation de l'image stéréo.",
        "La structure ouverte libère les transitoires et la sensation de naturel.",
        "Le PMMA fournit une base stable, faible en coloration.",
      ],
      galleryLead: "Parcours visuel progressif: scène complète, architecture, puis détails mécaniques.",
      specsLead: "Une fiche lisible pour comparer rapidement les points techniques clés.",
      contactLead: "Nous pouvons guider l'amplification en cohérence avec l'esprit Tabula Rasa.",
    },
    raw: {
      kicker: "baffle plan",
      title: "tabula rasa",
      subtitle: "une vision minimaliste au profit d'une fidélité rigoureuse",
      quote: "« L'art industialisable »",
      manifesto: [
        "L'essence de nos baffles invite à la foi en une intégtité sonor et une pureté formelle.",
        "Notre approche s'inspire de l'éthique de l'art minimal, reproduire une oeuvre sans artefacts.",
      ],
      design: [
        "Un seul haut parleur, pas de coffret, pas de composants électroniques.",
        "Le pmma est intrinsequement peu résonnant et le baffle plan limite les ondes stationnaires.",
      ],
      galleryLead: "vue d'ensemble puis details de la conception.",
      specsLead: "spécifications issues du texte source.",
      contactLead: "Nous pouvons vous orienter vers des modeles adaptés.",
    },
  },
  en: {
    corrected: {
      kicker: "Open baffle on PMMA panel",
      title: "tabula rasa",
      subtitle: "A minimalist loudspeaker focused on precision, speed and midrange emotion.",
      quote: '"Add nothing, subtract nothing."',
      manifesto: [
        "Our approach follows minimal art: remove distractions and keep the essential signal.",
        "Function drives form, with strict fidelity and coherent sound staging.",
        "Goal: reproduce music without artifacts.",
      ],
      design: [
        "A single full-range driver covers bass, mids and highs from one point source.",
        "No conventional cabinet and no complex crossover keeps dynamics lively.",
        "PMMA panel plus open baffle helps reduce resonance and standing waves.",
      ],
      galleryLead: "From full setups to close technical details, each image supports the narrative.",
      specsLead: "Values from source material plus standard technical-sheet fields.",
      contactLead: "For listening sessions or amplifier pairing, contact us.",
    },
    marketing: {
      kicker: "Minimal design, direct sound",
      title: "tabula rasa",
      subtitle: "A refined acoustic object built for clarity and musical immediacy.",
      quote: '"Honesty, utility, simplicity."',
      manifesto: [
        "Tabula Rasa keeps only what serves listening.",
        "The midrange carries emotion with stable imaging and low fatigue.",
      ],
      design: [
        "Single-driver coherence, open architecture, controlled resonance.",
        "A technical choice made for natural dynamics and vivid expression.",
      ],
      galleryLead: "Visual sequence: complete setup, structure, then precision details.",
      specsLead: "Clean technical overview for quick reading.",
      contactLead: "We can help build a matching amplification chain.",
    },
  },
  es: {
    corrected: {
      kicker: "Baffle abierto sobre panel PMMA",
      title: "tabula rasa",
      subtitle: "Un altavoz minimalista centrado en precisión, velocidad y emoción del rango medio.",
      quote: '"No añadir nada, no quitar nada."',
      manifesto: [
        "Nuestra propuesta sigue el arte minimal: quitar lo accesorio y conservar lo esencial.",
        "La forma sigue a la función, con fidelidad y escena sonora coherente.",
        "Objetivo: reproducir la obra sonora sin artefactos.",
      ],
      design: [
        "Un único transductor cubre graves, medios y agudos como fuente puntual.",
        "Sin caja clásica ni filtro complejo, la microdinámica se mantiene viva.",
        "PMMA y baffle abierto ayudan a limitar resonancias y ondas estacionarias.",
      ],
      galleryLead: "De la vista general a los detalles técnicos, con lectura visual progresiva.",
      specsLead: "Datos de la fuente original más campos técnicos estándar.",
      contactLead: "Para escucha o recomendación de amplificación, contáctanos.",
    },
    marketing: {
      kicker: "Diseño mínimo, presencia máxima",
      title: "tabula rasa",
      subtitle: "Un objeto acústico sobrio y expresivo, pensado para escuchar música de forma directa.",
      quote: '"Honesty, utility, simplicity."',
      manifesto: [
        "Tabula Rasa elimina lo innecesario y prioriza lo musical.",
        "Escena estable, voz presente y escucha cómoda.",
      ],
      design: [
        "Transductor único, arquitectura abierta y control de resonancias.",
        "Un enfoque técnico para mantener dinamismo y naturalidad.",
      ],
      galleryLead: "Recorrido visual: conjunto, estructura y detalles.",
      specsLead: "Ficha técnica clara y compacta.",
      contactLead: "Podemos orientar la combinación con amplificación adecuada.",
    },
  },
};

const SPECS = {
  fr: [
    ["Sensibilité", "96 dB (1 W / 1 m)"],
    ["Réponse en fréquence", "70 Hz - 20 000 Hz"],
    ["Impédance nominale", "8 ohms"],
    ["Puissance max", "50 W"],
    ["Rodage", "50 h"],
    ["Amplification recommandée", "2 x 2 W à 2 x 3 W (indicatif)"],
    ["Transducteur", "Large bande unique, haut rendement"],
    ["Charge", "Baffle plan"],
    ["Matériau", "PMMA (verre acrylique)"],
    ["Dimensions", "N.C. / à confirmer"],
    ["Poids", "N.C. / à confirmer"],
    ["Production annuelle", "À confirmer (50-80 paires/an selon source)"],
  ],
  en: [
    ["Sensitivity", "96 dB (1 W / 1 m)"],
    ["Frequency response", "70 Hz - 20,000 Hz"],
    ["Nominal impedance", "8 ohms"],
    ["Max power", "50 W"],
    ["Break-in", "50 h"],
    ["Recommended amplification", "2 x 2 W to 2 x 3 W (indicative)"],
    ["Driver", "Single high-efficiency full-range"],
    ["Loading", "Open baffle"],
    ["Material", "PMMA (acrylic glass)"],
    ["Dimensions", "TBD / not confirmed"],
    ["Weight", "TBD / not confirmed"],
    ["Annual production", "To be confirmed (50-80 pairs/year in source)"],
  ],
  es: [
    ["Sensibilidad", "96 dB (1 W / 1 m)"],
    ["Respuesta en frecuencia", "70 Hz - 20.000 Hz"],
    ["Impedancia nominal", "8 ohms"],
    ["Potencia máx", "50 W"],
    ["Rodaje", "50 h"],
    ["Amplificación recomendada", "2 x 2 W a 2 x 3 W (orientativo)"],
    ["Transductor", "Banda ancha único, alta eficiencia"],
    ["Carga", "Baffle abierto"],
    ["Material", "PMMA (vidrio acrílico)"],
    ["Dimensiones", "N/D / por confirmar"],
    ["Peso", "N/D / por confirmar"],
    ["Producción anual", "Por confirmar (50-80 pares/año en la fuente)"],
  ],
};

const CONTACT = {
  fr: {
    address: ["Contrepoint acoustique", "54 route de Mur de Sologne", "41230 Veilleins", "Loir-et-Cher, France"],
  },
  en: {
    address: ["Contrepoint acoustique", "54 route de Mur de Sologne", "41230 Veilleins", "Loir-et-Cher, France"],
  },
  es: {
    address: ["Contrepoint acoustique", "54 route de Mur de Sologne", "41230 Veilleins", "Loir-et-Cher, Francia"],
  },
};

const state = {
  lang: "fr",
  mode: "corrected",
  debug: false,
};

const refs = {
  languageSelect: document.getElementById("language-select"),
  modeSelect: document.getElementById("mode-select"),
  debugControls: document.getElementById("debug-controls"),
  debugMessage: document.getElementById("debug-message"),
  languageLabel: document.getElementById("language-label"),
  modeLabel: document.getElementById("mode-label"),
  introValues: document.getElementById("intro-values"),
  speakerTitle: document.getElementById("speaker-title"),
  speakerSubtitle: document.getElementById("speaker-subtitle"),
  speakerQuote: document.getElementById("speaker-quote"),
  speakerTitle5: document.getElementById("speaker-title-5"),
  speakerSubtitle5: document.getElementById("speaker-subtitle-5"),
  speakerQuote5: document.getElementById("speaker-quote-5"),
  speakerTitle6: document.getElementById("speaker-title-6"),
  speakerSubtitle6: document.getElementById("speaker-subtitle-6"),
  speakerQuote6: document.getElementById("speaker-quote-6"),
  heroMedia: document.getElementById("hero-media"),
  heroMedia5Right: document.getElementById("hero-media-5-right"),
  heroMedia6: document.getElementById("hero-media-6"),
  speakerFollowCopy: document.getElementById("speaker-follow-copy"),
  heroMediaSecondary: document.getElementById("hero-media-secondary"),
  heroMediaTertiary: document.getElementById("hero-media-tertiary"),
  speakerFollowCopy2: document.getElementById("speaker-follow-copy-2"),
  designTitle: document.getElementById("design-title"),
  designContent: document.getElementById("design-content"),
  galleryTitle: document.getElementById("gallery-title"),
  galleryLead: document.getElementById("gallery-lead"),
  showcaseGallery: document.getElementById("showcase-gallery"),
  detailsGallery: document.getElementById("details-gallery"),
  specsTitle: document.getElementById("specs-title"),
  specsLead: document.getElementById("specs-lead"),
  specsBody: document.getElementById("specs-body"),
  contactTitle: document.getElementById("contact-title"),
  contactLead: document.getElementById("contact-lead"),
  contactAddress: document.getElementById("contact-address"),
};

let revealObserver;
let sectionObserver;

function parseInitialState() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  const mode = params.get("mode");
  state.debug = params.get("debug") === "1";

  if (SUPPORTED_LANGUAGES.includes(lang)) {
    state.lang = lang;
  }

  if (state.debug && SUPPORTED_MODES.includes(mode)) {
    state.mode = mode;
  }

  if (state.mode === "raw" && state.lang !== "fr") {
    state.mode = "corrected";
  }
}

function syncUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set("lang", state.lang);

  if (state.debug) {
    params.set("debug", "1");
    if (state.mode !== "corrected") {
      params.set("mode", state.mode);
    } else {
      params.delete("mode");
    }
  } else {
    params.delete("debug");
    params.delete("mode");
  }

  const query = params.toString();
  const next = query ? `${window.location.pathname}?${query}${window.location.hash}` : `${window.location.pathname}${window.location.hash}`;
  window.history.replaceState({}, "", next);
}

function getCopy() {
  const languagePack = COPY[state.lang];
  return languagePack[state.mode] || languagePack.corrected;
}

function setNavLabels() {
  const labels = UI_TEXT[state.lang].nav;
  document.querySelectorAll(".main-nav [data-nav]").forEach((anchor) => {
    const key = anchor.dataset.nav;
    if (labels[key]) {
      anchor.textContent = labels[key];
    }
  });
}

function setControlsLabels() {
  const text = UI_TEXT[state.lang];
  refs.languageLabel.textContent = text.labels.language;
  refs.modeLabel.textContent = text.labels.mode;
  Array.from(refs.modeSelect.options).forEach((option) => {
    option.textContent = text.modes[option.value];
  });
}

function fillParagraphs(container, paragraphs) {
  container.innerHTML = "";
  paragraphs.forEach((content) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    container.appendChild(paragraph);
  });
}

function renderIntro(copy) {
  fillParagraphs(refs.introValues, INTRO_VALUES[state.lang] || INTRO_VALUES.fr);
}

function renderSpeaker(copy) {
  refs.speakerTitle.textContent = copy.title;
  refs.speakerSubtitle.textContent = copy.subtitle;
  refs.speakerQuote.textContent = copy.quote;
  refs.speakerTitle5.textContent = copy.title;
  refs.speakerSubtitle5.textContent = copy.subtitle;
  refs.speakerQuote5.textContent = copy.quote;
  refs.speakerTitle6.textContent = copy.title;
  refs.speakerSubtitle6.textContent = copy.subtitle;
  refs.speakerQuote6.textContent = copy.quote;

  refs.heroMedia.innerHTML = "";
  const image = document.createElement("img");
  image.src = "Ressource/images/enceinte_left_plus_ampli_plus_enceinte_right.jpg";
  image.width = 6720;
  image.height = 4480;
  image.alt = "Paire d'enceintes avec amplificateur.";
  image.loading = "lazy";
  refs.heroMedia.appendChild(image);

  refs.heroMedia5Right.innerHTML = "";
  const image5Right = document.createElement("img");
  image5Right.src = "Ressource/images/enceinte_vue_super_face_close_left.jpg";
  image5Right.width = 3584;
  image5Right.height = 4480;
  image5Right.alt = "Détail frontal gauche.";
  image5Right.loading = "lazy";
  refs.heroMedia5Right.appendChild(image5Right);

  refs.heroMedia6.innerHTML = "";
  const image6 = document.createElement("img");
  image6.src = "Ressource/images/enceinte_vue_super_face_close_right.jpg";
  image6.width = 3584;
  image6.height = 4480;
  image6.alt = "Détail frontal droit.";
  image6.loading = "lazy";
  refs.heroMedia6.appendChild(image6);

  fillParagraphs(refs.speakerFollowCopy, copy.design);

  refs.heroMediaSecondary.innerHTML = "";
  const secondImage = document.createElement("img");
  secondImage.src = "Ressource/images/enceinte_vue.jpg";
  secondImage.width = 5792;
  secondImage.height = 8688;
  secondImage.alt = "Vue complete de l'enceinte.";
  secondImage.loading = "lazy";
  refs.heroMediaSecondary.appendChild(secondImage);

  refs.heroMediaTertiary.innerHTML = "";
  const thirdImage = document.createElement("img");
  thirdImage.src = "Ressource/images/enceinte_vue_back_left_close.jpg";
  thirdImage.width = 4480;
  thirdImage.height = 5600;
  thirdImage.alt = "Detail arriere gauche.";
  thirdImage.loading = "lazy";
  refs.heroMediaTertiary.appendChild(thirdImage);

  fillParagraphs(refs.speakerFollowCopy2, copy.design);
}

function renderGallerySection(targetElement, section) {
  targetElement.innerHTML = "";
  GALLERY_MANIFEST.filter((item) => item.section === section).forEach((item) => {
    const figure = document.createElement("figure");
    figure.className = `gallery-item layout-${item.layout} reveal`;
    if (item.span === "two-thirds") {
      figure.classList.add("two-thirds");
    }

    const image = document.createElement("img");
    image.src = item.src;
    image.width = item.width;
    image.height = item.height;
    image.alt = item.alt;
    image.loading = "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = item.alt;

    figure.appendChild(image);
    figure.appendChild(caption);
    targetElement.appendChild(figure);
  });
}

function renderSpecs() {
  refs.specsBody.innerHTML = "";
  SPECS[state.lang].forEach(([key, value]) => {
    const row = document.createElement("tr");
    const head = document.createElement("th");
    const cell = document.createElement("td");
    head.textContent = key;
    cell.textContent = value;
    row.appendChild(head);
    row.appendChild(cell);
    refs.specsBody.appendChild(row);
  });
}

function renderContact(copy) {
  refs.contactLead.textContent = copy.contactLead;
  refs.contactAddress.textContent = CONTACT[state.lang].address.join("\n");
}

function renderTexts(copy) {
  const labels = UI_TEXT[state.lang].sections;
  refs.designTitle.textContent = labels.design;
  refs.galleryTitle.textContent = labels.gallery;
  refs.specsTitle.textContent = labels.specs;
  refs.contactTitle.textContent = labels.contact;
  refs.galleryLead.textContent = copy.galleryLead;
  refs.specsLead.textContent = copy.specsLead;
  fillParagraphs(refs.designContent, copy.design);
}

function applyModeFallback() {
  if (state.mode === "raw" && state.lang !== "fr") {
    state.mode = "corrected";
    return true;
  }
  return false;
}

function updateDebugUI(showFallback) {
  refs.debugControls.hidden = !state.debug;
  refs.modeSelect.value = state.mode;

  if (!state.debug) {
    refs.debugMessage.textContent = "";
    return;
  }

  refs.debugMessage.textContent = showFallback
    ? UI_TEXT[state.lang].labels.rawFallback
    : UI_TEXT[state.lang].labels.debugHint;
}

function renderAll(showFallback = false) {
  const copy = getCopy();
  document.documentElement.lang = state.lang;
  refs.languageSelect.value = state.lang;
  setNavLabels();
  setControlsLabels();
  renderIntro(copy);
  renderSpeaker(copy);
  renderTexts(copy);
  renderGallerySection(refs.showcaseGallery, "showcase");
  renderGallerySection(refs.detailsGallery, "details");
  renderSpecs();
  renderContact(copy);
  updateDebugUI(showFallback);
  observeRevealItems();
  syncUrl();
}

function setupObservers() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  const navLinks = Array.from(document.querySelectorAll(".main-nav [data-nav]"));
  const byId = new Map(navLinks.map((link) => [link.dataset.nav, link]));

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("is-active"));
          const current = byId.get(entry.target.id);
          if (current) {
            current.classList.add("is-active");
          }
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "-40% 0px -45% 0px",
    }
  );

  document.querySelectorAll("#accueil, main > section[id]").forEach((section) => sectionObserver.observe(section));
}

function observeRevealItems() {
  document.querySelectorAll(".reveal").forEach((element) => {
    if (!element.dataset.revealObserved) {
      element.dataset.revealObserved = "1";
      revealObserver.observe(element);
    }
  });
}

function bindEvents() {
  refs.languageSelect.addEventListener("change", (event) => {
    state.lang = event.target.value;
    const fallback = applyModeFallback();
    renderAll(fallback);
  });

  refs.modeSelect.addEventListener("change", (event) => {
    if (!state.debug) {
      return;
    }
    state.mode = event.target.value;
    const fallback = applyModeFallback();
    renderAll(fallback);
  });
}

parseInitialState();
setupObservers();
bindEvents();
renderAll(false);
