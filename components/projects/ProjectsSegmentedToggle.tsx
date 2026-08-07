'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ProjectView } from '@/types'

interface Props {
  view: ProjectView
  onChange: (next: ProjectView) => void
  archiveCount: number
}

const PILL_SPRING = { type: 'spring', stiffness: 500, damping: 32 } as const

/**
 * Pill deslizante Destacados / Todos · N — el mecanismo que Navbar.module.css
 * dejó descrito pero nunca conectado (`.activeIndicator`, comentario "layoutId
 * drives Framer Motion's layout animation"): un span con `layoutId` compartido
 * entre los dos botones, así Framer Motion anima el salto de posición solo con
 * que el span activo cambie de padre en el render.
 *
 * Segmento activo: opaco/alto contraste (fondo fósforo sólido, texto negro).
 * Inactivo: translúcido/atenuado (texto fósforo al 50%, sin fondo propio).
 *
 * Dos botones nativos con aria-pressed (no role="tab"): cada uno es su propio
 * tab-stop y Enter/Space alcanza para cambiar de vista — sin necesidad de
 * reimplementar navegación por flechas con tabindex-roving.
 */
export default function ProjectsSegmentedToggle({ view, onChange, archiveCount }: Props) {
  const reduced = useReducedMotion()
  const transition = reduced ? { duration: 0 } : PILL_SPRING

  return (
    <div
      role="group"
      aria-label="Vista de proyectos"
      className="inline-flex items-center gap-1 rounded-full border border-phosphor/30 bg-zinc-950 p-1 font-terminal text-sm"
    >
      <button
        type="button"
        aria-pressed={view === 'destacados'}
        onClick={() => onChange('destacados')}
        className="relative rounded-full px-4 py-1.5"
      >
        {view === 'destacados' && (
          <motion.span
            layoutId="projects-toggle-pill"
            className="absolute inset-0 rounded-full bg-phosphor"
            transition={transition}
          />
        )}
        <span className={`relative z-10 ${view === 'destacados' ? 'font-bold text-black' : 'text-phosphor/50'}`}>
          Destacados
        </span>
      </button>

      <button
        type="button"
        aria-pressed={view === 'todos'}
        onClick={() => onChange('todos')}
        className="relative rounded-full px-4 py-1.5"
      >
        {view === 'todos' && (
          <motion.span
            layoutId="projects-toggle-pill"
            className="absolute inset-0 rounded-full bg-phosphor"
            transition={transition}
          />
        )}
        <span className={`relative z-10 ${view === 'todos' ? 'font-bold text-black' : 'text-phosphor/50'}`}>
          Todos · {archiveCount}
        </span>
      </button>
    </div>
  )
}
