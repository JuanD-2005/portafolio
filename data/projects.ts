import type { Project, ArchiveProject } from '@/types'

// ─── Featured projects (the tríada) ──────────────────────────────────────────

export const featuredProjects: Project[] = [
  {
    id:          'miunet',
    title:       'MIUNET',
    tagline:     'App móvil universitaria',
    description: 'Plataforma móvil para estudiantes de la UNET: consulta de calificaciones, horarios, noticias y servicios académicos. Arquitectura cliente-servidor con autenticación JWT.',
    device:      'mobile',
    accentColor: '#6366f1', // indigo
    tech: [
      { label: 'Flutter',  color: 'cyan'    },
      { label: 'Kotlin',   color: 'violet'  },
      { label: 'Django',   color: 'emerald' },
      { label: 'REST API', color: 'slate'   },
    ],
    links: {
      repo: 'https://github.com/juanparedes',
    },
  },
  {
    id:          'evem',
    title:       'Portal EVEM & DIM',
    tagline:     'Sistema web académico full stack',
    description: 'Portal institucional para la gestión de eventos, departamentos y módulos académicos. Panel de administración, autenticación por roles y reportes en PDF.',
    device:      'laptop',
    accentColor: '#14b8a6', // teal
    tech: [
      { label: 'PHP',       color: 'violet'  },
      { label: 'React',     color: 'blue'    },
      { label: 'MySQL',     color: 'amber'   },
      { label: 'Tailwind',  color: 'cyan'    },
    ],
    links: {
      repo: 'https://github.com/juanparedes',
    },
  },
  {
    id:          'django-unetx',
    title:       'DJANGO-UNETX',
    tagline:     'Red social tipo Twitter',
    description: 'Clon funcional de Twitter construido con Django y HTMX: publicaciones, follows, likes, feed en tiempo real y notificaciones. Deploy en Railway.',
    device:      'laptop',
    accentColor: '#3b82f6', // blue
    tech: [
      { label: 'Django',    color: 'emerald' },
      { label: 'HTMX',      color: 'amber'   },
      { label: 'PostgreSQL',color: 'blue'    },
      { label: 'Railway',   color: 'slate'   },
    ],
    links: {
      repo: 'https://github.com/juanparedes',
    },
  },
]

// ─── Archive (full history table) ────────────────────────────────────────────

export const archiveProjects: ArchiveProject[] = [
  {
    year:        2024,
    title:       'ImageIdentifier-Test',
    description: 'Pipeline de clasificación de imágenes con transfer learning',
    tech:        ['Python', 'TensorFlow', 'OpenCV'],
    links:       { repo: 'https://github.com/juanparedes' },
  },
  {
    year:        2024,
    title:       'REST API Template',
    description: 'Boilerplate production-ready para APIs Django + DRF',
    tech:        ['Django', 'DRF', 'Docker', 'JWT'],
    links:       { repo: 'https://github.com/juanparedes' },
  },
  {
    year:        2023,
    title:       'Hello World Cup Hackathon',
    description: 'App de predicciones del Mundial — 1er lugar hackathon UNET',
    tech:        ['React', 'Node.js', 'Socket.io'],
    links:       { repo: 'https://github.com/juanparedes' },
  },
  {
    year:        2023,
    title:       'ChatBot CLI',
    description: 'Asistente de terminal con integración OpenAI GPT-3.5',
    tech:        ['Python', 'OpenAI API', 'Rich'],
    links:       { repo: 'https://github.com/juanparedes' },
  },
  {
    year:        2022,
    title:       'Portfolio v1',
    description: 'Primera versión del portafolio personal con animaciones CSS',
    tech:        ['HTML', 'CSS', 'Vanilla JS'],
    links:       { live: 'https://juanparedes.dev' },
  },
  {
    year:        2022,
    title:       'Inventory Manager',
    description: 'CRUD de inventario para pequeñas empresas, multi-usuario',
    tech:        ['PHP', 'MySQL', 'Bootstrap'],
    links:       { repo: 'https://github.com/juanparedes' },
  },
]
