'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/animations/variants'
import { makeScrollHandler } from '@/lib/scrollTo'
import { useReactiveFace, useHoverReactions } from '@/hooks/useReactiveFace'
import { useIsMobile } from '@/hooks/useIsMobile'
import ActionCarousel, { type CarouselSlide } from './ActionCarousel'
import s from './ActionSection.module.css'

const STATS = [
  { value: '3+', label: 'AÑOS', face: '( ^ v ^ )', comment: 'full-stack desde 2023' },
  { value: '10+', label: 'PROYECTOS', face: '( ^ o ^ )', comment: 'web, móvil y apis en producción' },
  { value: '2', label: 'PLATAFORMAS', face: '( ^ v ^ )', comment: 'web y móvil, un solo backend' },
]

const TECH_STACK = [
  { name: 'next.js', face: '( ^ v ^ )', comment: 'mi framework de cabecera' },
  { name: 'react', face: '( ^ v ^ )', comment: 'la base de casi todo' },
  { name: 'typescript', face: '( ^ o ^ )', comment: 'tipado estricto, cero sorpresas' },
  { name: 'flutter', face: '( ^ v ^ )', comment: 'un solo código, dos plataformas' },
  { name: 'django', face: '( > _ < )', comment: 'backend robusto y seguro' },
  { name: 'postgresql', face: '( ^ _ ^ )', comment: 'mi base de datos de confianza' }
]

type HoverProps = ReturnType<typeof useHoverReactions>

// ─── Piezas presentacionales compartidas — se llaman una vez para el árbol
// desktop (tal cual siempre) y otra vez dentro de los slides del carrusel
// mobile. Sin estado propio: todo viene de ActionSection. ───────────────────

function IdentityBlock({ hoverProps }: { hoverProps: HoverProps }) {
  return (
    <>
      <span className={s.systemTag}>{'> perfil cargado'}</span>
      <h1 className={s.hugeName} tabIndex={0} {...hoverProps('( O _ O )', 'sí, ¡ese soy yo!')}>Juan Paredes</h1>
      <p className={s.roles}>full-stack · ia · web · móvil</p>
      <p className={s.bio}>Del esquema de base de datos al último pixel de la interfaz.</p>
    </>
  )
}

function StatsBlock({ hoverProps }: { hoverProps: HoverProps }) {
  return (
    <div className={s.statsBlock}>
      {STATS.map((stat) => (
        <div key={stat.label} className={s.statItem} tabIndex={0} {...hoverProps(stat.face, stat.comment)}>
          <span className={s.statValue}>{stat.value}</span>
          <span className={s.statLabel}>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

function ModulesBlock({ hoverProps }: { hoverProps: HoverProps }) {
  return (
    <div className={s.modulesList}>
      <span className={s.modulesTag} tabIndex={0} {...hoverProps('( ^ _ ^ )', 'mi arsenal de desarrollo')}>MÓDULOS</span>
      <div className={s.modulesTech}>
        {TECH_STACK.map((tech, i) => (
          <span key={tech.name} style={{ display: 'inline-flex', gap: '0.5rem' }}>
            <span className={s.techItem} tabIndex={0} {...hoverProps(tech.face, tech.comment)}>
              {tech.name}
            </span>
            {i < TECH_STACK.length - 1 && <span className={s.techSeparator}>·</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

function CvBlock({ hoverProps, onDownload }: { hoverProps: HoverProps; onDownload: (lang: 'es' | 'en') => void }) {
  return (
    <div className={s.actionBlock}>
      <span className={s.pathLabel}>~/curriculum</span>
      <div className={s.cvCards}>
        <a href="/Juan_Paredes_CV.pdf" download="Juan_Paredes_CV.pdf" onClick={() => onDownload('es')} className={s.cvCard} {...hoverProps('( ^ v ^ )', 'versión en español')}>
          <div className={s.cvCardInfo}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2v12a1 1 0 001 1h6a1 1 0 001-1V5L8 2H5a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1.5"/></svg>
            <div>
              <p className={s.cvCardTitle}>cv_es.pdf</p>
              <p className={s.cvCardMeta}>español · 214 KB</p>
            </div>
          </div>
          <div className={s.downloadBtn}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v9M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        </a>

        <a href="/Resume JuanParedes.pdf" download="Resume JuanParedes.pdf" onClick={() => onDownload('en')} className={s.cvCard} {...hoverProps('( ^ v ^ )', 'english version')}>
          <div className={s.cvCardInfo}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2v12a1 1 0 001 1h6a1 1 0 001-1V5L8 2H5a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1.5"/></svg>
            <div>
              <p className={s.cvCardTitle}>cv_en.pdf</p>
              <p className={s.cvCardMeta}>english · 209 KB</p>
            </div>
          </div>
          <div className={s.downloadBtn}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v9M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        </a>
      </div>
    </div>
  )
}

function NavBlock({ hoverProps }: { hoverProps: HoverProps }) {
  return (
    <div className={s.actionBlock}>
      <span className={s.pathLabel}>~/navegación</span>
      <div className={s.navButtons}>
        <a href="https://linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer" className={s.navBtn} {...hoverProps('( ^ _ ^ )', 'conecta conmigo en linkedin')}>
          <span className={s.navBtnArrow}>{'>'}</span> linkedin
        </a>
        <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className={s.navBtn} {...hoverProps('( 0 _ 0 )', 'revisa mi código fuente')}>
          <span className={s.navBtnArrow}>{'>'}</span> github
        </a>
      </div>
    </div>
  )
}

function CliBar({ face, text }: { face: string; text: string }) {
  return (
    <div className={s.cliBox}>
      <div className={s.cliLeft}>
        <span className={s.cliFace}>{face}</span>
        <span className={s.cliText}>{text || 'esperando input...'}</span>
        <span className={s.cliCursor}>█</span>
      </div>
      <span className={s.cliRight}>JP-OS · asistente</span>
    </div>
  )
}

export default function ActionSection() {
  const { face, text, srText, say, reset } = useReactiveFace()
  const hoverProps = useHoverReactions(say, reset)
  const isMobile = useIsMobile()
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done'>('idle')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  function handleDownload(lang: 'es' | 'en') {
    say('( ^ o ^ )', lang === 'es' ? '¡listo! disfruta la lectura' : 'enjoy the read!', 2200)
    setStatus('downloading')
    timers.current.push(setTimeout(() => {
      setStatus('done')
      timers.current.push(setTimeout(() => setStatus('idle'), 1400))
    }, 550))
  }

  const carouselSlides: CarouselSlide[] = [
    {
      id: 'metricas',
      label: 'métricas',
      face: '( ^ _ ^ )',
      comment: '3 años y mi arsenal completo',
      content: (
        <div className={s.actionBlock}>
          <span className={s.pathLabel}>~/métricas</span>
          <StatsBlock hoverProps={hoverProps} />
          <ModulesBlock hoverProps={hoverProps} />
        </div>
      ),
    },
    {
      id: 'cv',
      label: 'cv',
      face: '( ^ v ^ )',
      comment: 'descarga mi CV, elige idioma',
      content: <CvBlock hoverProps={hoverProps} onDownload={handleDownload} />,
    },
    {
      id: 'redes',
      label: 'redes',
      face: '( ^ o ^ )',
      comment: 'conecta conmigo',
      content: <NavBlock hoverProps={hoverProps} />,
    },
  ]

  return (
    <section id="action" className={s.section}>
      <motion.div className={s.inner} variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>

        {/* 1. TOP BAR — compacta a una línea en mobile (nombre/roles ya
            aparecen abajo en el bloque de identidad, no hace falta
            repetirlos aquí); desktop se queda exactamente igual. */}
        {isMobile ? (
          <div className={s.topBarMobile}>
            <span className={s.osLabel}>JP-OS</span>
            <span className={s.statusDivider}>·</span>
            <div className={s.statusBadge}>
              <span className={s.statusDot} />
              Open to work
            </div>
          </div>
        ) : (
          <div className={s.topBar}>
            <span className={s.osLabel}>JP-OS · SESIÓN INICIADA</span>
            <div className={s.statusBadge}>
              <span className={s.statusLabel}>usuario: </span>
              <span className={s.statusUser}>juan paredes</span>
              <span className={s.statusDivider}>·</span>
              <span className={s.statusDot} />
              Open to work · Remoto · Full-Stack
            </div>
          </div>
        )}

        {isMobile ? (
          <>
            {/* 2. FIJO — Identidad (no entra al carrusel) */}
            <div className={s.mobileIdentity}>
              <IdentityBlock hoverProps={hoverProps} />
            </div>

            {/* 3. CARRUSEL — métricas · cv · redes */}
            <ActionCarousel slides={carouselSlides} say={say} />

            {/* 4. FIJO — barra del asistente, debajo del carrusel */}
            <div className={s.bottomCli}>
              <CliBar face={face} text={text} />
            </div>

            {/* 5. Pista al fondo — los certificados viven en otra sección */}
            <p className={s.mobileHint}>↓ ~/logros · sección aparte</p>
          </>
        ) : (
          <>
            {/* 2. MAIN GRID (2 Columns) — idéntico a como estaba */}
            <div className={s.mainGrid}>

              {/* Left Column: Identity & Stats */}
              <div className={s.leftCol}>
                <IdentityBlock hoverProps={hoverProps} />
                <StatsBlock hoverProps={hoverProps} />
              </div>

              {/* Right Column: Actions (CV & Nav) */}
              <div className={s.rightCol}>
                <CvBlock hoverProps={hoverProps} onDownload={handleDownload} />
                <NavBlock hoverProps={hoverProps} />
              </div>
            </div>

            {/* 3. BOTTOM CLI PANEL */}
            <div className={s.bottomCli}>
              <CliBar face={face} text={text} />
              <ModulesBlock hoverProps={hoverProps} />
            </div>
          </>
        )}

        <span className="sr-only" aria-live="polite">{srText}</span>
      </motion.div>
    </section>
  )
}
