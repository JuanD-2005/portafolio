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

    const initAnimation = () => {
      const section = sectionRef.current
      const wrapper = wrapperRef.current
      if (!section || !wrapper) return

      // Limpiamos cualquier ScrollTrigger previo en esta sección
      ScrollTrigger.getAll()
        .filter(st => st.trigger === section)
        .forEach(st => st.kill())

      // 1. Efecto minimo y fijo: empezamos en 1.1 (10% mas grande)
      // en lugar de calcularlo segun el tamano de la pantalla.
      gsap.set(wrapper, {
        scale: 1.1,
        transformOrigin: '50% 50%',
        force3D: true,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       section,
          start:         'top top',
          end:           '+=100%', // Reduje un poco el scroll extra ya que el efecto es menor
          pin:           true,
          pinSpacing:    true,
          scrub:         1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Eliminamos el onRefresh problematico que causaba los saltos
        },
      })

      // 2. Animamos hacia la escala natural (1)
      tl.to(wrapper, { scale: 1, ease: 'none' })

      ScrollTrigger.refresh()
    }

    if (document.readyState === 'complete') {
      initAnimation()
    } else {
      window.addEventListener('load', initAnimation, { once: true })
    }

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
                  const isEmpty       = line === ''
                  return (
                    <div
                      key={idx}
                      className={isEmpty ? s.terminalLineEmpty : s.terminalLine}
                    >
                      {isEmpty ? null : line}
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
