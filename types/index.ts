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

export interface ArchiveProject {
  year: number
  title: string
  description: string
  tech: string[]
  links: {
    repo?: string
    live?: string
  }
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
