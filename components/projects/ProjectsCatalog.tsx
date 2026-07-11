'use client'

import { useCallback, useEffect, useState, useSyncExternalStore, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { catalogProjects } from '@/data/projects'
import { resolveQuery, suggestions } from '@/lib/assistant/resolve'
import { FACE, type FaceKey } from '@/lib/systemPersona'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { ProjectCategory } from '@/types'
import ProjectThumb from './ProjectThumb'
import s from './ProjectsCatalog.module.css'

const TYPE_MS = 24
const PER_PAGE = 6
// En móvil la grilla es de 1 columna: 3 tarjetas por página evitan un scroll
// interminable y mantienen visible el paginador Prev/Next sin scrollear.
const MOBILE_PER_PAGE = 3

const shortcuts = [
  { label: 'IA / ML',  query: 'ia' },
  { label: 'Software', query: 'software' },
  { label: 'Diseño',   query: 'design' },
  { label: 'Ver todo', query: 'todo' },
]

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  ia:       'IA / ML',
  software: 'Software',
  design:   'Diseño',
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}
function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
function getReducedMotionServerSnapshot() {
  return false
}

/**
 * Tipea `text` carácter a carácter (mismo TYPE_MS que la voz del hero).
 * Bajo prefers-reduced-motion muestra el texto completo de inmediato.
 * No reusa `useTypewriter` porque ese hook tipea una secuencia una sola vez
 * al montar — acá el mensaje cambia en cada consulta del usuario.
 */
function useTypedLine(text: string) {
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot)
  const [prevText, setPrevText] = useState(text)
  const [typed, setTyped] = useState('')

  if (text !== prevText) {
    setPrevText(text)
    setTyped('')
  }

  useEffect(() => {
    if (reduced) return
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setTyped(text.slice(0, i))
      if (i >= text.length) clearInterval(timer)
    }, TYPE_MS)
    return () => clearInterval(timer)
  }, [text, reduced])

  return reduced ? text : typed
}

/**
 * ProjectsCatalog — búsqueda global sobre `catalogProjects` (cerezas +
 * archivo fundidos) más una grilla de 3 columnas paginada. Clic en tarjeta
 * abre un detalle en el mismo contenedor (no navega). Los atajos de
 * categoría son toggle buttons (`aria-pressed`, no `role="tab"`): filtran
 * el mismo espacio de búsqueda que el texto libre, no reparten contenido
 * en paneles mutuamente excluyentes.
 */
export default function ProjectsCatalog() {
  const projects = catalogProjects

  const [visibleIds, setVisibleIds] = useState<string[] | null>(null)
  const [line, setLine] = useState('sistema listo. ¿qué querés ver del trabajo de Juan?')
  const [face, setFace] = useState<FaceKey>('happy')
  const [input, setInput] = useState('')
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const typedLine = useTypedLine(line)

  const run = useCallback(async (query: string) => {
    setFace('thinking')
    const res = await resolveQuery(query, projects)
    setVisibleIds(res.matchedIds)
    setPage(0)
    setLine(res.message)
    setFace(res.matchedIds !== null && res.matchedIds.length === 0 ? 'notFound' : 'happy')
  }, [projects])

  function runShortcut(query: string) {
    setActiveShortcut(query)
    run(query)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (input.trim()) {
      setActiveShortcut(null)
      run(input)
      setInput('')
    }
  }

  // Esc cierra el detalle. El foco al abrir se maneja con un ref callback
  // (ver más abajo) porque AnimatePresence mode="wait" monta el panel de
  // detalle recién cuando termina de salir la grilla — un useEffect atado
  // a `selectedId` dispara antes de que el botón exista en el DOM.
  useEffect(() => {
    if (!selectedId) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  const focusOnMount = useCallback((el: HTMLButtonElement | null) => {
    el?.focus()
  }, [])

  const isMobile = useIsMobile()
  const perPage = isMobile ? MOBILE_PER_PAGE : PER_PAGE
  const filtered = projects.filter(p => visibleIds === null || visibleIds.includes(p.id))
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  // `page` puede quedar fuera de rango al cambiar perPage (rotar el móvil,
  // cruzar el breakpoint). Clampeamos para pintar y sincronizamos el estado.
  const currentPage = Math.min(page, totalPages - 1)
  const pageItems = filtered.slice(currentPage * perPage, currentPage * perPage + perPage)
  const selected = selectedId ? projects.find(p => p.id === selectedId) ?? null : null

  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1)
  }, [page, totalPages])

  return (
    <div className={s.wrapper}>
      {/* ── Barra del asistente ─────────────────────────────── */}
      <div className={s.assistantBar}>
        <div className={s.assistantHead}>
          <span className={s.faceGlyph} aria-hidden="true">{FACE[face]}</span>
          <span className={s.assistantLine} aria-live="polite">{typedLine}</span>
        </div>

        <div className={s.shortcuts} role="group" aria-label="Categorías">
          {shortcuts.map((sc) => (
            <button
              key={sc.query}
              type="button"
              className={s.shortcut}
              aria-pressed={activeShortcut === sc.query}
              onClick={() => runShortcut(sc.query)}
            >
              {sc.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={s.advancedToggle}
          aria-expanded={advancedOpen}
          aria-controls="catalog-advanced-chips"
          onClick={() => setAdvancedOpen((v) => !v)}
        >
          {'>'} {advancedOpen ? '- ocultar' : '+ opciones_avanzadas'}
        </button>

        <div
          id="catalog-advanced-chips"
          className={`${s.chips} ${advancedOpen ? '' : s.chipsCollapsed}`}
          role="group"
          aria-label="Sugerencias"
        >
          {suggestions.map((sug) => (
            <button
              key={sug.query}
              type="button"
              className={s.chip}
              onClick={() => { setActiveShortcut(null); run(sug.query) }}
            >
              {sug.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className={s.inputRow}>
          <span className={s.prompt} aria-hidden="true">{'>'}</span>
          <div className={s.inputWrap}>
            <input
              className={s.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Preguntar al asistente sobre los proyectos: ej. ¿qué usaste con Firebase?"
            />
            {input === '' && (
              <span className={s.fakePlaceholder} aria-hidden="true">
                preguntá algo… ej: ¿qué usaste con Firebase?
                <span className={s.blinkCursor} />
              </span>
            )}
          </div>
        </form>
      </div>

      {/* ── Grilla / detalle ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={s.detail}
          >
            <button ref={focusOnMount} type="button" className={s.backBtn} onClick={() => setSelectedId(null)}>
              <span aria-hidden="true">‹</span> volver
            </button>

            <div className={s.detailBody}>
              <ProjectThumb thumbnailUrl={selected.thumbnailUrl} accentColor={selected.accentColor} title={selected.title} />

              <div className={s.detailInfo}>
                <p className={s.meta}>
                  {CATEGORY_LABEL[selected.category]} · {selected.year}
                  {selected.featured && <span className={s.metaStar} aria-hidden="true"> · ★ destacado</span>}
                </p>
                <h4 className={s.detailTitle}>{selected.title}</h4>
                <p className={s.desc}>{selected.description}</p>
                <div className={s.techRow}>
                  {selected.tech.map((t) => <span key={t} className={s.techChip}>{t}</span>)}
                </div>
                {(selected.links.repo || selected.links.live) && (
                  <a
                    className={s.repoLink}
                    href={selected.links.repo ?? selected.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span aria-hidden="true">{'>'}</span> ver repo ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className={s.grid}>
              {pageItems.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`${s.card} ${s[`card--${p.category}`]} ${p.featured ? s['card--featured'] : ''}`}
                    onClick={() => setSelectedId(p.id)}
                    aria-label={`Ver detalle de ${p.title}`}
                  >
                    {p.featured && <span className={s.star} aria-hidden="true">★</span>}
                    <p className={s.meta}>{CATEGORY_LABEL[p.category]} · {p.year}</p>
                    <h4 className={s.cardTitle}>{p.title}</h4>
                    <div className={s.cardTech}>
                      {p.tech.slice(0, 3).map((t) => <span key={t} className={s.techChip}>{t}</span>)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {filtered.length === 0 && (
              <p className={s.empty}>nada por acá. probá otra búsqueda.</p>
            )}

            {totalPages > 1 && (
              <>
                <nav className={s.pagination} aria-label="Paginación">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={s.pageBtn}
                      aria-current={currentPage === i ? 'page' : undefined}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>

                <nav className={s.paginationMobile} aria-label="Paginación">
                  <button
                    type="button"
                    className={s.pageNavBtn}
                    onClick={() => setPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    aria-label="Página anterior"
                  >
                    [ {'<'} ANT ]
                  </button>
                  <span className={s.pageCounter} aria-live="polite">
                    {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className={s.pageNavBtn}
                    onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    aria-label="Página siguiente"
                  >
                    [ SIG {'>'} ]
                  </button>
                </nav>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
