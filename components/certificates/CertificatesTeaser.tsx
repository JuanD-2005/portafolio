'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { DEMO_CERTIFICATES } from '@/data/certificates'
import { useReactiveFace, useHoverReactions } from '@/hooks/useReactiveFace'
import s from './CertificatesTeaser.module.css'

// Heavy client-only bundle (three.js + @react-three/fiber + HDRI). Deferred so
// it never weighs on the home's initial load — only fetched when the section is
// expanded. Same rationale/pattern as components/hero/HeroWrapper.tsx.
const CertificateGallery = dynamic(() => import('./CertificateGallery'), {
  ssr: false,
  loading: () => <div className={s.loading} aria-hidden="true" />,
})

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6 3h8v4a4 4 0 01-4 4 4 4 0 01-4-4V3z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6 4H3v1a3 3 0 003 3M14 4h3v1a3 3 0 01-3 3"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v3M7 17h6M8 14h4v1a2 2 0 01-2 2 2 2 0 01-2-2v-1z"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * CertificatesTeaser
 *
 * Trigger: a `~/logros` terminal row (same treatment as `~/curriculum` /
 * `~/navegación` in ActionSection) that expands IN-PLACE into the
 * certificate gallery, pushing the sections below it down — no portal, no
 * overlay, no modal. The row folds its own open/close state (label text +
 * arrow rotation) instead of a separate caption crossfade.
 *
 * Expand choreography (self-contained — no longer depends on the external
 * `archiveExpand` variant): height 0 → auto with a soft ease-out, a thin
 * "power-on" sweep line that crosses the panel on open (a nod to the CRT
 * language used in HeroCRT, now folded into this section instead of a
 * literal curtain that would fight the in-place growth).
 *
 * The heavy 3D gallery mounts only once the expand animation settles
 * (`onAnimationComplete === 'visible'` flips `revealed`), so three.js init
 * never competes with the height tween.
 */
export default function CertificatesTeaser() {
  const [open, setOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)
  const shouldReduceMotion = useReducedMotion()

  const { face, text, srText, say, reset } = useReactiveFace()
  const hoverProps = useHoverReactions(say, reset)

  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])

  // Esc collapses the section while it's open.
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Move focus into the region on open; restore it to the badge on close.
  // (No focus trap — it's a region in the flow, not a modal; focus must be
  // able to leave to the rest of the page.)
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      requestAnimationFrame(() => {
        panelRef.current?.focus({ preventScroll: true })
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    } else if (wasOpen.current) {
      wasOpen.current = false
      triggerRef.current?.focus()
    }
  }, [open])

  const panelVariants = {
    hidden: { height: 0, opacity: 0.4 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0.2, ease: 'easeOut' }
        : {
            height: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.4, ease: 'easeOut' },
          },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: shouldReduceMotion
        ? { duration: 0.15, ease: 'easeIn' }
        : {
            height: { duration: 0.45, ease: [0.7, 0, 0.84, 0] },
            opacity: { duration: 0.25 },
          },
    },
  }

  const sweepVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <div className={s.section}>
      <div className={s.trophyBlock}>
        <span className={s.pathLabel}>~/logros</span>

        <button
          ref={triggerRef}
          type="button"
          className={s.trophyRow}
          onClick={toggle}
          aria-expanded={open}
          aria-controls="certificates-panel"
          {...hoverProps('( ^ o ^ )', 'mira todo lo que he certificado')}
        >
          <span className={s.trophyRowInfo}>
            <TrophyIcon />
            <span className={s.trophyRowText}>
              {open
                ? 'Cerrar panel'
                : `${DEMO_CERTIFICATES.length} credenciales verificadas`}
            </span>
          </span>
          <span
            className={`${s.trophyRowArrow} ${open ? s.trophyRowArrowOpen : ''}`}
            aria-hidden="true"
          >
            →
          </span>
        </button>

        <span className={s.rowHint} aria-hidden="true">
          {text ? `${face} ${text}` : ''}
        </span>
        <span className="sr-only" aria-live="polite">{srText}</span>
      </div>

      <AnimatePresence initial={false} onExitComplete={() => setRevealed(false)}>
        {open && (
          <motion.div
            id="certificates-panel"
            className={s.panel}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onAnimationComplete={(def) => {
              if (def === 'visible') setRevealed(true)
            }}
          >
            <div
              ref={panelRef}
              role="region"
              aria-label="Logros y Certificaciones"
              tabIndex={-1}
              className={s.panelInner}
            >
              {!shouldReduceMotion && (
                <motion.div
                  className={s.sweep}
                  variants={sweepVariants}
                  initial="hidden"
                  animate="visible"
                  aria-hidden="true"
                />
              )}

              {revealed ? (
                <CertificateGallery onClose={close} />
              ) : (
                <div className={s.loading} aria-hidden="true" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
