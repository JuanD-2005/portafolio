'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ProjectView } from '@/types'
import s from './ProjectsViewToggle.module.css'

const TYPE_MS = 28

const COPY: Record<ProjectView, { title: string; destLabel: string; destView: ProjectView }> = {
  destacados: { title: 'Destacados',          destLabel: 'Todos los proyectos', destView: 'todos' },
  todos:      { title: 'Todos los proyectos', destLabel: 'Destacados',          destView: 'destacados' },
}

interface Props {
  view: ProjectView
  onToggle: (next: ProjectView) => void
}

/**
 * El encabezado ES el control: un título serif que se des-tipea y re-tipea
 * entre "Destacados" ↔ "Todos los proyectos". El título animado y la
 * flecha son aria-hidden — el lector de pantalla no debe leer letras a
 * medio escribir, solo el aria-label del botón (que cambia atómicamente
 * cuando la vista cambia, no durante la animación).
 */
export default function ProjectsViewToggle({ view, onToggle }: Props) {
  const reduced = usePrefersReducedMotion()
  const cur = COPY[view]

  const [displayed, setDisplayed] = useState(cur.title)
  const [busy, setBusy] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sincronización idle: si no hay animación en curso, el texto mostrado
  // siempre refleja la vista actual (derivado en render, no en efecto).
  if (!busy && displayed !== cur.title) {
    setDisplayed(cur.title)
  }

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  function handleClick() {
    if (busy) return
    const from = cur.title
    const to = COPY[cur.destView].title
    const nextView = cur.destView

    if (reduced) {
      onToggle(nextView)
      return
    }

    setBusy(true)
    let i = from.length

    timer.current = setInterval(() => {
      i -= 1
      setDisplayed(from.slice(0, Math.max(i, 0)))
      if (i <= 0) {
        clearInterval(timer.current!)
        let j = 0
        timer.current = setInterval(() => {
          j += 1
          setDisplayed(to.slice(0, j))
          if (j >= to.length) {
            clearInterval(timer.current!)
            onToggle(nextView)
            setBusy(false)
          }
        }, TYPE_MS)
      }
    }, TYPE_MS)
  }

  return (
    <div className={s.header}>
      <button
        type="button"
        className={s.control}
        aria-label={`Cambiar a ${cur.destLabel}`}
        onClick={handleClick}
      >
        <span className={s.title} aria-hidden="true">
          <span className={s.prompt}>~/</span>
          <span className={s.animated}>{displayed}</span>
          <span className={s.cursor} />
        </span>
        <span className={s.dest} aria-hidden="true">
          {cur.destLabel}
          <svg
            className={s.arrow}
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </button>
    </div>
  )
}
