// data/certificates.ts
//
// Reconstruido a partir de los 13 escaneos reales:
//  - Los 4 Cuadros de Honor quedan como cartas SEPARADAS (índice/lapso reales).
//  - Se conservan los DOS certificados de inglés (Suficiencia 2021 + C1 2024).
//  - Se corrigen fechas/emisores que el placeholder tenía mal (HWC y Rotary son
//    2025, Photoshop 2020, Festival 2025, etc.).
//  - `backImage` es OPCIONAL: solo C1 tiene reverso escaneado; el resto recibe
//    un dorso GENERADO en canvas (ver certificateTexture.ts).
//  - `frontImage`/`backImage` apuntan a los escaneos REALES en public/certificates.
//  - `aspectRatio` (ancho/alto) va prefilled con la dimensión medida de cada
//    escaneo, para encuadre perfecto en el primer frame (sin micro-reflow). El
//    hook lo remide en el onload; al coincidir, no hay re-render.

export type CertificateCategory =
  | "Reconocimientos y Premios"
  | "Cursos y Capacitaciones";

export interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  category: CertificateCategory;
  frontImage: string;
  /** Solo presente si existe un reverso escaneado real (hoy: solo C1). */
  backImage?: string;
  /** ancho / alto del escaneo frontal. Opcional: si falta, se mide en runtime. */
  aspectRatio?: number;
  accentColor?: string;
  verifyUrl?: string;
}

export const DEMO_CERTIFICATES: CertificateData[] = [
  // ─── Reconocimientos y Premios ────────────────────────────────────────────

  {
    id: "award-cuadro-2025-1",
    title: "Cuadro de Honor — 1.er Lugar (Ciclo Profesional)",
    issuer: "Universidad Nacional Experimental del Táchira",
    date: "Lapso 2025-1",
    description:
      "Primer lugar del Cuadro de Honor por carrera en el Ciclo Profesional (lapso 2025-1), con un índice acumulado de 8,30 en Ingeniería en Informática.",
    category: "Reconocimientos y Premios",
    frontImage: "/certificates/CuadroDeHonor_Lapso4.jpeg",
    aspectRatio: 1.616,
    accentColor: "#f59e0b", // Oro — 1.er lugar
  },
  {
    id: "award-cuadro-2024-3",
    title: "Cuadro de Honor — 1.er Lugar (Ciclo Profesional)",
    issuer: "Universidad Nacional Experimental del Táchira",
    date: "Lapso 2024-3",
    description:
      "Primer lugar del Cuadro de Honor por carrera en el Ciclo Profesional (lapso 2024-3), con un índice total de 8,36 — el más alto de la serie — en Ingeniería en Informática.",
    category: "Reconocimientos y Premios",
    frontImage: "/certificates/CuadroDeHonor_Lapso3.jpeg",
    aspectRatio: 1.622,
    accentColor: "#f59e0b", // Oro
  },
  {
    id: "award-cuadro-2024-1",
    title: "Cuadro de Honor — 1.er Lugar (Ciclo Básico)",
    issuer: "Universidad Nacional Experimental del Táchira",
    date: "Lapso 2024-1",
    description:
      "Primer lugar del Cuadro de Honor por carrera en el Ciclo Básico (lapso 2024-1), con un índice total de 8,25 en Ingeniería en Informática.",
    category: "Reconocimientos y Premios",
    frontImage: "/certificates/CuadroDeHonor_Lapso2.jpeg",
    aspectRatio: 1.572,
    accentColor: "#f59e0b", // Oro
  },
  {
    id: "award-cuadro-2022-3",
    title: "Cuadro de Honor — 2.do Lugar (Ciclo Básico)",
    issuer: "Universidad Nacional Experimental del Táchira",
    date: "Lapso 2022-3",
    description:
      "Segundo lugar del Cuadro de Honor por carrera en el Ciclo Básico (lapso 2022-3), con un índice total de 8,00 en Ingeniería en Informática.",
    category: "Reconocimientos y Premios",
    frontImage: "/certificates/CuadroDeHonor_Lapso1.jpeg",
    aspectRatio: 1.494,
    accentColor: "#a1a1aa", // Plata — 2.do lugar
  },
  {
    id: "award-rotary-web",
    title: "Reconocimiento al Diseño y Desarrollo Web",
    issuer: "Rotary Club San Cristóbal — Distrito 4380",
    date: "Octubre 2025",
    description:
      "Reconocimiento del Rotary Club San Cristóbal por el diseño y desarrollo de la página web oficial de la campaña «Uno Cambia el Mundo», por su creatividad, dedicación y visión estratégica.",
    category: "Reconocimientos y Premios",
    frontImage: "/certificates/Reconocimiento_Rotary.jpeg",
    aspectRatio: 1.297,
    accentColor: "#22c55e", // Verde terminal
  },
  {
    id: "award-hwc-ponente",
    title: "Ponente — Hello World Cup",
    issuer: "Hello World Cup — UNET 2025",
    date: "Agosto 2025",
    description:
      "Seleccionado como ponente en la Hello World Cup UNET 2025, impartiendo conocimientos a otros participantes y demostrando compromiso, innovación y excelencia.",
    category: "Reconocimientos y Premios",
    frontImage: "/certificates/Ponencia_HelloWorldCup.jpeg",
    aspectRatio: 1.294,
    accentColor: "#6366f1", // Índigo
  },
  {
    id: "award-hwc-participante",
    title: "Participante — Hello World Cup",
    issuer: "Hello World Cup — UNET 2025",
    date: "Agosto 2025",
    description:
      "Participante en la categoría avanzada de la Hello World Cup UNET 2025, destacando sus habilidades de programación junto al equipo Picnic Dinámico.",
    category: "Reconocimientos y Premios",
    frontImage: "/certificates/Participacion_HelloWorldCup.jpeg",
    aspectRatio: 1.286,
    accentColor: "#06b6d4", // Cian
  },
  {
    id: "award-festival-ciencias",
    title: "Reconocimiento por Proyecto Científico",
    issuer: "Fundacite Táchira — Ministerio de Ciencia y Tecnología",
    date: "Julio 2025",
    description:
      "Reconocimiento por la destacada participación en el Festival de la Ciencia UNET 2025, presentando un proyecto científico de alta calidad, otorgado por el Ministerio del Poder Popular para Ciencia y Tecnología (Fundacite Táchira).",
    category: "Reconocimientos y Premios",
    frontImage: "/certificates/Reconocimiento_Festival.jpeg",
    aspectRatio: 1.297,
    accentColor: "#10b981", // Esmeralda
  },

  // ─── Cursos y Capacitaciones ─────────────────────────────────────────────

  {
    id: "course-english-c1",
    title: "Proficiencia en Inglés — C1",
    issuer: "Universidad Nacional Experimental del Táchira",
    date: "Mayo 2024",
    description:
      "Certificación de suficiencia lingüística nivel C1 (Avanzado) del Marco Común Europeo de Referencia, cubriendo los módulos avanzados y conversacionales del programa de inglés para adultos.",
    category: "Cursos y Capacitaciones",
    frontImage: "/certificates/C1-Certificate-Front.jpeg",
    backImage: "/certificates/C1-Certificate-Back.jpeg", // ← único reverso real
    aspectRatio: 1.294,
    accentColor: "#f43f5e", // Rosa vibrante
  },
  {
    id: "course-english-suficiencia",
    title: "Suficiencia en el Idioma Inglés",
    issuer: "Universidad Nacional Experimental del Táchira",
    date: "Noviembre 2021",
    description:
      "Certificado de suficiencia en el idioma inglés otorgado por la UNET, acreditando el cumplimiento de los requisitos académicos y legales del programa de idiomas para adultos.",
    category: "Cursos y Capacitaciones",
    frontImage: "/certificates/Certificado_Ingles.jpeg",
    aspectRatio: 1.302,
    accentColor: "#0ea5e9", // Azul secundario
  },
  {
    id: "course-c-programming",
    title: "Programación en Lenguaje C",
    issuer: "UNET — Coordinación de Formación Permanente",
    date: "Junio 2022",
    description:
      "Capacitación en fundamentos y paradigmas de programación estructurada mediante el lenguaje C, cubriendo gestión de memoria, punteros y estructuras de datos.",
    category: "Cursos y Capacitaciones",
    frontImage: "/certificates/Certificado_C.jpeg",
    aspectRatio: 0.784,
    accentColor: "#22c55e",
  },
  {
    id: "course-intro-programming",
    title: "Introducción a la Programación",
    issuer: "UNET — Coordinación de Formación Permanente",
    date: "Junio 2022",
    description:
      "Formación en pensamiento computacional, algoritmos y estructuras de control como base para el desarrollo de software moderno (45 horas).",
    category: "Cursos y Capacitaciones",
    frontImage: "/certificates/Certificado_Introduccion_Programacion.jpeg",
    aspectRatio: 0.773,
    accentColor: "#a78bfa", // Lavanda
  },
  {
    id: "course-photoshop-social",
    title: "Photoshop para Redes Sociales",
    issuer: "Oratorio Centro Juvenil Táriba",
    date: "Septiembre 2020",
    description:
      "Curso de Adobe Photoshop aplicado a la creación de contenido visual optimizado para redes sociales (106 horas): herramientas de retoque, máscaras, teoría del color y lenguaje visual.",
    category: "Cursos y Capacitaciones",
    frontImage: "/certificates/Curso_Photoshop_RedesSociales.jpeg",
    aspectRatio: 1.265,
    accentColor: "#fb923c", // Naranja
  },
];

/** Devuelve los certificados agrupados por categoría, preservando el orden de inserción. */
export function getCertificatesByCategory(): Map<
  CertificateCategory,
  CertificateData[]
> {
  const map = new Map<CertificateCategory, CertificateData[]>();
  for (const cert of DEMO_CERTIFICATES) {
    if (!map.has(cert.category)) map.set(cert.category, []);
    map.get(cert.category)!.push(cert);
  }
  return map;
}

export const CATEGORY_ORDER: CertificateCategory[] = [
  "Reconocimientos y Premios",
  "Cursos y Capacitaciones",
];
