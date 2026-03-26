'use client'

import { motion } from 'framer-motion'
import { fadeUp, fadeUpSlow, staggerContainer } from '@/animations/variants'
import { makeScrollHandler }                     from '@/lib/scrollTo'
import s from './ActionSection.module.css'

const TECH_STACK = [
  'Next.js', 'React', 'TypeScript', 'Flutter', 'Django', 'PHP',
  'PostgreSQL', 'Tailwind CSS', 'Docker', 'Railway',
]

const STATS = [
  { value: '3+',  label: 'Años exp.'  },
  { value: '10+', label: 'Proyectos'  },
  { value: '2',   label: 'Plataformas'},
]

// ── Download icon (inline SVG — no external dep) ─────────────────────────────
function DownloadIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    >
      <path d="M8 1v8M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── Arrow right icon ──────────────────────────────────────────────────────────
function ArrowIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    >
      <path d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * ActionSection
 *
 * The first fully modern section — appears after the GSAP CRT zoom-out.
 * Contains the main value proposition headline + CTAs + stats + tech pills.
 *
 * All entrance animations use Framer Motion whileInView so they trigger
 * cleanly even if the user arrives at this section mid-scroll (e.g. deep links).
 */
export default function ActionSection() {
  return (
    <section id="action" aria-label="Presentación" className={s.section}>
      <motion.div
        className={s.inner}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >

        {/* Availability badge */}
        <motion.div variants={fadeUp}>
          <span className={s.badge}>
            <span className={s.badgeDot} aria-hidden="true" />
            Disponible para proyectos
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div className={s.headline} variants={fadeUpSlow}>
          <h1 className={s.headingTop}>
            Construyo&nbsp;
            <span className={s.accent}>experiencias</span>
            <br />
            digitales.
          </h1>
          <p className={s.headingSub}>
            Full Stack Web &amp; Mobile Developer — de la base de datos
            a la interfaz, en web y en móvil.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div className={s.ctaRow} variants={fadeUp}>
          <a
            href="/cv-juan-paredes.pdf"
            download
            className={s.btnPrimary}
            aria-label="Descargar CV de Juan Paredes en PDF"
          >
            <span className={s.btnIcon}>
              <DownloadIcon />
            </span>
            Descargar CV
          </a>

          <a
            href="#contact"
            className={s.btnSecondary}
            onClick={makeScrollHandler('#contact')}
          >
            Contactar
            <ArrowIcon />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div className={s.statsRow} variants={fadeUp}>
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{ display: 'contents' }}>
              {i > 0 && (
                <span className={s.statDivider} aria-hidden="true" />
              )}
              <div className={s.statItem}>
                <span className={s.statValue}>{stat.value}</span>
                <span className={s.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tech pills */}
        <motion.div className={s.techRow} variants={fadeUp}>
          {TECH_STACK.map((tech) => (
            <span key={tech} className={s.techPill}>
              {tech}
            </span>
          ))}
        </motion.div>

      </motion.div>
    </section>
  )
}
