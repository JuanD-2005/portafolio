import type { Project, ArchiveProject } from '@/types'

// ─── Featured projects (the tríada) ──────────────────────────────────────────

export const featuredProjects: Project[] = [
  {
    id:          'miunet',
    title:       'MIUNET',
    tagline:     'App móvil universitaria',
    description: 'Plataforma móvil para estudiantes de la UNET: consulta de calificaciones, horarios, noticias y servicios académicos. Arquitectura cliente-servidor con autenticación JWT.',
    device:      'mobile',
    screenshotUrl: '/project/miunet-mobile.jpeg',
    accentColor: '#6366f1', // indigo
    tech: [
      { label: 'Flutter',  color: 'cyan'    },
      { label: 'Kotlin',   color: 'violet'  },
      { label: 'Django',   color: 'emerald' },
      { label: 'REST API', color: 'slate'   },
    ],
    links: {
      repo: 'https://github.com/JuanD-2005/MiUNET-APP.git',
    },
  },
  {
    id:          'evem',
    title:       'Portal EVEM & DIM',
    tagline:     'Sistema web académico full stack',
    description: 'Portal institucional para la gestión de eventos, departamentos y módulos académicos. Panel de administración, autenticación por roles y reportes en PDF.',
    device:      'laptop',
    screenshotUrl: '/project/evem-laptop.png',
    accentColor: '#14b8a6', // teal
    tech: [
      { label: 'PHP',       color: 'violet'  },
      { label: 'React',     color: 'blue'    },
      { label: 'MySQL',     color: 'amber'   },
      { label: 'Tailwind',  color: 'cyan'    },
    ],
    links: {
      repo: 'https://github.com/JuanD-2005/evem-2025.git',
    },
  },
  {
    id:          'django-unetx',
    title:       'DJANGO-UNETX',
    tagline:     'Red social tipo Twitter',
    description: 'Clon funcional de Twitter construido con Django y HTMX: publicaciones, follows, likes, feed en tiempo real y notificaciones. Deploy en Railway.',
    device:      'laptop',
    screenshotUrl: '/project/UNETX_laptop.png',
    accentColor: '#3b82f6', // blue
    tech: [
      { label: 'Django',     color: 'emerald' },
      { label: 'HTMX',       color: 'amber'   },
      { label: 'PostgreSQL', color: 'blue'    },
      { label: 'Railway',    color: 'slate'   },
    ],
    links: {
      repo: 'https://github.com/JuanD-2005/DJANGO-UNETX.git',
    },
  },
]

// ─── Archive (full history table) ────────────────────────────────────────────

export const archiveProjects: ArchiveProject[] = [
  {
    year:        2025,
    title:       'CARD-POCALIPSIS',
    description: 'Videojuego híbrido 2D/3D desarrollado en equipo con mecánicas de cartas y estrategia.',
    tech:        ['Godot Engine', 'GDScript', 'Blender'],
    links:       { repo: 'https://github.com/JuanD-2005/CARD-POCALIPSIS' },
  },
  {
    year:        2025,
    title:       'Computer Vision Pipeline',
    description: 'Scripts de automatización y pipeline de clasificación de imágenes usando Machine Learning.',
    tech:        ['Python', 'TensorFlow', 'OpenCV'],
    links:       { repo: 'https://github.com/JuanD-2005/ImageIdentifier-Test' },
  },
  {
    year:        2024,
    title:       'Rotary Club: Uno Cambia El Mundo',
    description: 'Diseño web oficial y maquetación para la campaña de concientización social del Rotary Club.',
    tech:        ['HTML5', 'CSS3', 'JavaScript'],
    links:       { repo: 'https://github.com/gabrielulacio/uno-cambia-el-mundo' },
  },
  {
    year:        2025,
    title:       'Material Didáctico: PyGames',
    description: 'Repositorio educativo estructurado con código y ejemplos para la enseñanza de desarrollo de videojuegos.',
    tech:        ['Python', 'PyGame', 'Educación'],
    links:       { repo: 'https://github.com/JuanD-2005/Curso-PyGames' },
  },
  {
    year:        2022,
    title:       'Archivo Histórico Universitario',
    description: 'Colección de algoritmos, estructuras de datos, juegos de consola y mis primeros pasos en programación.',
    tech:        ['C++', 'Java', 'Estructuras de Datos'],
    links:       { repo: 'https://github.com/JuanD-2005/ProyectosVarios' },
  },
]
