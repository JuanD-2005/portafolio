'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/animations/variants'
import { makeScrollHandler } from '@/lib/scrollTo'
import { useReactiveFace, useHoverReactions } from '@/hooks/useReactiveFace'
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

export default function ActionSection() {
  const { face, text, srText, say, reset } = useReactiveFace()
  const hoverProps = useHoverReactions(say, reset)
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

  return (
    <section id="action" className={s.section}>
      <motion.div className={s.inner} variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        
        {/* 1. TOP BAR */}
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

        {/* 2. MAIN GRID (2 Columns) */}
        <div className={s.mainGrid}>
          
          {/* Left Column: Identity & Stats */}
          <div className={s.leftCol}>
            <span className={s.systemTag}>{'> perfil cargado'}</span>
            <h1 className={s.hugeName} tabIndex={0} {...hoverProps('( O _ O )', 'sí, ¡ese soy yo!')}>Juan Paredes</h1>
            <p className={s.roles}>full-stack · ia · web · móvil</p>
            <p className={s.bio}>Del esquema de base de datos al último pixel de la interfaz.</p>
            
            <div className={s.statsBlock}>
              {STATS.map((stat) => (
                <div key={stat.label} className={s.statItem} tabIndex={0} {...hoverProps(stat.face, stat.comment)}>
                  <span className={s.statValue}>{stat.value}</span>
                  <span className={s.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Actions (CV & Nav) */}
          <div className={s.rightCol}>
            
            <div className={s.actionBlock}>
              <span className={s.pathLabel}>~/curriculum</span>
              <div className={s.cvCards}>
                <a href="/Juan_Paredes_CV.pdf" download="Juan_Paredes_CV.pdf" onClick={() => handleDownload('es')} className={s.cvCard} {...hoverProps('( ^ v ^ )', 'versión en español')}>
                  <div className={s.cvCardInfo}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2v12a1 1 0 001 1h6a1 1 0 001-1V5L8 2H5a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1.5"/></svg>
                    <div>
                      <p className={s.cvCardTitle}>cv_es.pdf</p>
                      <p className={s.cvCardMeta}>español · 214 KB</p>
                    </div>
                  </div>
                  <div className={s.downloadBtn}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v9M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                </a>
                
                <a href="/Resume JuanParedes.pdf" download="Resume JuanParedes.pdf" onClick={() => handleDownload('en')} className={s.cvCard} {...hoverProps('( ^ v ^ )', 'english version')}>
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

          </div>
        </div>

        {/* 3. BOTTOM CLI PANEL */}
        <div className={s.bottomCli}>
          <div className={s.cliBox}>
            <div className={s.cliLeft}>
              <span className={s.cliFace}>{face}</span>
              <span className={s.cliText}>{text || 'esperando input...'}</span>
              <span className={s.cliCursor}>█</span>
            </div>
            <span className={s.cliRight}>JP-OS · asistente</span>
          </div>
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
        </div>

        <span className="sr-only" aria-live="polite">{srText}</span>
      </motion.div>
    </section>
  )
}
