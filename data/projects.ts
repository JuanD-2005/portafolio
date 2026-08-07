import type { Project, ArchiveProject, CatalogProject } from "@/types";

// ─── Featured projects (the tríada) ──────────────────────────────────────────

export const featuredProjects: Project[] = [
  {
    id: "miunet",
    title: "MIUNET",
    tagline: "App móvil universitaria",
    description:
      "Plataforma móvil para estudiantes de la UNET: consulta de calificaciones, horarios, noticias y servicios académicos. Arquitectura cliente-servidor con autenticación JWT.",
    device: "mobile",
    year: 2025,
    screenshotUrl: "/project/miunet-mobile.jpeg",
    accentColor: "#6366f1", // indigo
    assistantComment: "mi primera app con Flutter, para toda la UNET",
    tech: [
      { label: "Flutter", color: "cyan" },
      { label: "Kotlin", color: "violet" },
      { label: "Django", color: "emerald" },
      { label: "REST API", color: "slate" },
    ],
    links: {
      repo: "https://github.com/JuanD-2005/MiUNET-APP.git",
    },
  },
  {
    id: "evem",
    title: "Portal EVEM & DIM",
    tagline: "Sistema web académico full stack",
    description:
      "Portal institucional para la gestión de eventos, departamentos y módulos académicos. Panel de administración, autenticación por roles y reportes en PDF.",
    device: "laptop",
    year: 2025,
    screenshotUrl: "/project/evem-laptop.png",
    accentColor: "#14b8a6", // teal
    assistantComment: "gestión de eventos, de punta a punta",
    tech: [
      { label: "PHP", color: "violet" },
      { label: "React", color: "blue" },
      { label: "MySQL", color: "amber" },
      { label: "Tailwind", color: "cyan" },
    ],
    links: {
      repo: "https://github.com/JuanD-2005/evem-2025.git",
    },
  },
  {
    id: "django-unetx",
    title: "DJANGO-UNETX",
    tagline: "Red social tipo Twitter",
    description:
      "Clon funcional de Twitter construido con Django y HTMX: publicaciones, follows, likes, feed en tiempo real y notificaciones. Deploy en Railway.",
    device: "laptop",
    year: 2025,
    screenshotUrl: "/project/UNETX_laptop.png",
    accentColor: "#3b82f6", // blue
    assistantComment: "Twitter, pero hecho por mí",
    tech: [
      { label: "Django", color: "emerald" },
      { label: "HTMX", color: "amber" },
      { label: "PostgreSQL", color: "blue" },
      { label: "Railway", color: "slate" },
    ],
    links: {
      repo: "https://github.com/JuanD-2005/DJANGO-UNETX.git",
    },
  },
];

// ─── Archive (full history table) ────────────────────────────────────────────

export const archiveProjects: ArchiveProject[] = [
  // ── IA / ML ─────────────────────────────────────────────────────────────
  {
    id: "kan",
    year: 2025,
    title: "KAN Regression Model",
    description:
      "Experimentación con Kolmogorov-Arnold Networks aplicadas a un problema de regresión, explorando una alternativa a los MLP tradicionales.",
    tech: ["Python", "PyTorch", "KAN"],
    category: "ia",
    accentColor: "#10b981",
    thumbnailUrl: "/projects/kan.png",
    assistantComment: "mi experimento favorito con Kolmogorov-Arnold Networks",
    links: { repo: "https://github.com/JuanD-2005/kan-regresion-demo" },
  },
  {
    id: "rnn",
    year: 2025,
    title: "RNN Time Series",
    description:
      "Modelo de red neuronal recurrente para predicción y análisis de datos secuenciales.",
    tech: ["Python", "TensorFlow", "RNN"],
    category: "ia",
    accentColor: "#6366f1",
    thumbnailUrl: "/projects/rnn.png",
    assistantComment: "series de tiempo con memoria propia",
    links: { repo: "https://github.com/JuanD-2005/RN-Recurrente" },
  },
  {
    id: "fuzzy",
    year: 2024,
    title: "Fuzzy Logic Controllers",
    description:
      "Sistemas de inferencia y control basados en reglas, modelados con lógica difusa.",
    tech: ["Python", "Fuzzy Logic"],
    category: "ia",
    accentColor: "#a78bfa",
    thumbnailUrl: "/projects/fuzzy.png",
    assistantComment: 'cuando "sí o no" no alcanza, lógica difusa',
    links: { repo: "https://github.com/JuanD-2005/fuzzy-inference-system" },
  },
  {
    id: "cv-pipeline",
    year: 2025,
    title: "Computer Vision Pipeline",
    description:
      "Scripts de automatización y pipeline de clasificación de imágenes usando Machine Learning.",
    tech: ["Python", "TensorFlow", "OpenCV"],
    category: "ia",
    accentColor: "#22d3ee",
    thumbnailUrl: "/projects/cv-pipeline.png",
    assistantComment: "le enseñé a una máquina a ver",
    links: { repo: "https://github.com/JuanD-2005/ImageIdentifier-Test" },
  },
  {
    id: "matlab-ann",
    year: 2023,
    title: "MATLAB Core ANN",
    description:
      "Fundamentos clásicos de redes neuronales: mapas auto-organizados (SOM), regresión y clasificación en MATLAB.",
    tech: ["MATLAB", "ANN", "Clustering"],
    category: "ia",
    accentColor: "#f59e0b",
    thumbnailUrl: "/projects/matlab-ann.png",
    assistantComment: "redes neuronales desde cero, sin frameworks",
    links: { repo: "https://github.com/JuanD-2005/Implementacion-ANN-MATLAB" },
  },

  // ── Software ────────────────────────────────────────────────────────────
  {
    id: "smartstation",
    year: 2025,
    title: "SmartStation IoT",
    description:
      "Estación de monitoreo IoT de seguridad para hogar inteligente, con sensores y Firebase para alertas y autenticación en tiempo real.",
    tech: ["ESP32", "Firebase", "IoT"],
    category: "software",
    accentColor: "#14b8a6",
    thumbnailUrl: "/projects/smartstation.png",
    assistantComment: "mi casa inteligente, vigilada en tiempo real",
    links: { repo: "https://github.com/JuanD-2005/SmartStation---Auto2025" },
  },
  {
    id: "card-pocalipsis",
    year: 2025,
    title: "Card Pocalipsis",
    description:
      "Videojuego híbrido 2D/3D desarrollado en equipo con mecánicas de cartas y estrategia.",
    tech: ["Godot Engine", "GDScript", "Blender"],
    category: "software",
    accentColor: "#fb7185",
    thumbnailUrl: "/project/CARD-POCALIPSIS.png",
    assistantComment: "cartas y estrategia, hecho en equipo",
    links: { repo: "https://github.com/JuanD-2005/CARD-POCALIPSIS" },
  },
  {
    id: "obsidian-dashboard",
    year: 2026,
    title: "Obsidian Automated Dashboard",
    description:
      "Sistema de gestión de conocimiento personal y dashboard automatizado para rastrear semestres académicos y proyectos.",
    tech: ["Obsidian", "Markdown", "Dataview", "Templater"],
    category: "software",
    accentColor: "#64748b",
    thumbnailUrl: "/project/obsidian.png",
    assistantComment: "mi tablero personal automatizado en Obsidian",
    links: { repo: "https://github.com/JuanD-2005" },
  },
  {
    id: "pygames-course",
    year: 2025,
    title: "Material Didáctico: PyGames",
    description:
      "Repositorio educativo estructurado con código y ejemplos para la enseñanza de desarrollo de videojuegos.",
    tech: ["Python", "PyGame", "Educación"],
    category: "software",
    accentColor: "#60a5fa",
    thumbnailUrl: "/projects/pygames-course.png",
    assistantComment: "enseñando a programar videojuegos",
    links: { repo: "https://github.com/JuanD-2005/Curso-PyGames" },
  },

  // ── Diseño / Frontend ───────────────────────────────────────────────────
  {
    id: "rotary-club",
    year: 2024,
    title: "Rotary Club — Uno Cambia El Mundo",
    description:
      "Diseño web oficial y maquetación para la campaña de concientización social del Rotary Club.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    category: "design",
    accentColor: "#34d399",
    thumbnailUrl: "/project/UNOCAMBIAELMUNDO.png",
    assistantComment: "diseño con causa social",
    links: { repo: "https://github.com/gabrielulacio/uno-cambia-el-mundo" },
  },
  {
    id: "interactive-interfaces",
    year: 2024,
    title: "Interfaces Interactivas",
    description:
      "Colección de landing pages y plantillas interactivas: temporizadores de eventos, animaciones y maquetación 100% responsiva.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    category: "design",
    accentColor: "#f472b6",
    thumbnailUrl: "/project/INteractive.png",
    assistantComment: "landing pages que se sienten vivas",
    // TODO: apuntar a un repo showcase dedicado una vez creado (agrupa giftCousin, TemplateBirthday, SanValentin_Web, Movil-Page...)
    links: { repo: "https://github.com/JuanD-2005" },
  },
];

// ─── Catalog — fuente única para la vista "Todos" ────────────────────────────
// Funde las cerezas (featuredProjects) con el archivo: así son buscables y
// navegables desde el catálogo, marcadas con estrella (`featured: true`).

const featuredAsCatalog: CatalogProject[] = featuredProjects.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  tech: p.tech.map((t) => t.label),
  category: "software",
  year: p.year,
  featured: true,
  thumbnailUrl: p.screenshotUrl,
  accentColor: p.accentColor,
  assistantComment: p.assistantComment,
  links: p.links,
}));

const archiveAsCatalog: CatalogProject[] = archiveProjects.map((p) => ({
  ...p,
  featured: false,
}));

/** Orden: cerezas primero, luego el resto del archivo. */
export const catalogProjects: CatalogProject[] = [
  ...featuredAsCatalog,
  ...archiveAsCatalog,
];
