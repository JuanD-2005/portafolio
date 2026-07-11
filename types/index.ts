// ─── Terminal / Typewriter ───────────────────────────────────────────────────

export interface TerminalLine {
  text: string
  delay?: number
  speed?: number
}

// ─── Projects — featured tríada ──────────────────────────────────────────────

export type DeviceType = 'mobile' | 'laptop'

export interface TechBadge {
  label: string
  color: 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'cyan' | 'slate'
}

export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  device: DeviceType
  year: number
  /**
   * Optional real screenshot — place in /public/screenshots/.
   * If absent, the CSS placeholder renders using accentColor.
   */
  screenshotUrl?: string
  /** Drives the CSS placeholder gradient when no screenshot is set */
  accentColor: string
  tech: TechBadge[]
  links: {
    repo?: string
    live?: string
  }
}

// ─── Projects — archive table ─────────────────────────────────────────────────

export type ProjectCategory = 'ia' | 'software' | 'design'

export interface ArchiveProject {
  /** Stable slug — referenced by the assistant's matchedIds. */
  id: string
  year: number
  title: string
  description: string
  tech: string[]
  category: ProjectCategory
  /** Screenshot/thumbnail en /public/project/. Si falta → placeholder por accent. */
  thumbnailUrl?: string
  /** Ancla del gradiente placeholder cuando no hay thumbnail. */
  accentColor?: string
  links: {
    repo?: string
    live?: string
  }
}

// ─── Projects — catalog (unified spotlight + archive) ─────────────────────────

/** Forma común de tarjeta para el catálogo "Todos" — funde cerezas y archivo. */
export interface CatalogProject {
  id: string
  title: string
  description: string
  tech: string[]
  category: ProjectCategory
  year: number
  /** true = una de las 3 cerezas (spotlight), marcada con estrella en el catálogo. */
  featured: boolean
  thumbnailUrl?: string
  accentColor?: string
  links: {
    repo?: string
    live?: string
  }
}

// ─── Projects — view toggle ────────────────────────────────────────────────────

export type ProjectView = 'destacados' | 'todos'

// ─── Projects — lab assistant ─────────────────────────────────────────────────

export interface AssistantResponse {
  /** Línea que "dice" el sistema (se tipea con la voz del hero). */
  message: string
  /** IDs de proyectos que quedan visibles. null = mostrar todos. */
  matchedIds: string[] | null
}

export interface AssistantSuggestion {
  label: string
  query: string
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string
  email: string
  message: string
}
