'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { bootSequence } from '@/data/terminal'
import { useTypewriter } from '@/hooks/useTypewriter'
import s from './HeroCRT.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function HeroCRT() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const screenRef  = useRef<HTMLDivElement>(null)

  const { displayedLines, isComplete } = useTypewriter(bootSequence, 650)

  useGSAP(() => {
    if (globalThis.window === undefined) return

    const section = sectionRef.current
    const wrapper = wrapperRef.current
    if (!section || !wrapper) return

    // Limpiamos triggers previos
    ScrollTrigger.getAll()
      .filter(st => st.trigger === section)
      .forEach(st => st.kill())

    // Inicializamos matchMedia de GSAP
    const mm = gsap.matchMedia()

    // 🖥️ SOLO PARA ESCRITORIO (Pantallas de 768px o más)
    mm.add('(min-width: 768px)', () => {
      gsap.set(wrapper, {
        scale: 1.1,
        transformOrigin: '50% 50%',
        force3D: true,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       section,
          start:         'top top',
          end:           '+=40%',
          pin:           true,
          pinSpacing:    true,
          scrub:         true,
          invalidateOnRefresh: true,
        },
      })

      tl.to(wrapper, { scale: 1, ease: 'none' })
    })

    // 📱 SOLO PARA MÓVILES (Pantallas de 767px o menos)
    mm.add('(max-width: 767px)', () => {
      // Forzamos el tamaño normal y NO creamos ningún ScrollTrigger.
      // El usuario simplemente scrolleará la página de forma natural y fluida.
      gsap.set(wrapper, {
        scale: 1,
        force3D: false,
      })
    })

    // Limpiamos matchMedia al desmontar el componente
    return () => mm.revert()

  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-crt-section
      aria-label="Hero — terminal introduction"
      className={s.heroSection}
    >
      <div className={s.ambientGlow} aria-hidden="true" />

      <div
        ref={wrapperRef}
        data-crt-wrapper
        className={s.monitorWrapper}
      >
        <div className={s.monitor} data-crt-monitor>
          <div className={s.powerLed} aria-hidden="true" />

          <div className={s.bezel}>
            <div
              ref={screenRef}
              data-crt-screen
              className={[s.screen, isComplete ? s.hintVisible : ''].join(' ')}
            >
              {/* Static overlays */}
              <div className={s.scanlines}       aria-hidden="true" />
              <div className={s.vignette}        aria-hidden="true" />
              <div className={s.rollingScanline} aria-hidden="true" />

              {/*
               * flickerOverlay: owns the crt-flicker animation.
               * Separated from .screen so the opacity animation doesn't
               * create a new compositor layer on the main screen element
               * while GSAP is scrubbing transforms on the parent.
               */}
              <div className={s.flickerOverlay} aria-hidden="true" />

              <div className={s.glare} aria-hidden="true" />

              {/* Terminal text */}
              <div
                className={s.terminal}
                aria-live="polite"
                aria-label="Boot sequence"
              >
                <div className={s.terminalHeader}>
                  JP-OS&nbsp;&nbsp;▸&nbsp;&nbsp;Phosphor II&nbsp;&nbsp;▸&nbsp;&nbsp;80×25 VGA
                </div>

                {displayedLines.map((line, idx) => {
                  const isCurrentLine = idx === displayedLines.length - 1
                  const isEmpty       = line.text === ''
                  return (
                    <div
                      key={line.id}
                      className={isEmpty ? s.terminalLineEmpty : s.terminalLine}
                    >
                      {isEmpty ? null : line.text}
                      {isCurrentLine && !isComplete && !isEmpty && (
                        <span className={s.cursor} aria-hidden="true" />
                      )}
                    </div>
                  )
                })}

                {isComplete && (
                  <div className={s.terminalLine}>
                    <span className={s.cursor} aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className={s.scrollHint} aria-hidden="true">
                <span className={s.scrollHintText}>
                  ▼&nbsp;&nbsp;SCROLL TO CONTINUE
                </span>
              </div>
            </div>
          </div>

          <div className={s.stand} aria-hidden="true">
            <div className={s.standNeck} />
            <div className={s.standBase} />
          </div>
        </div>
      </div>
    </section>
  )
}
