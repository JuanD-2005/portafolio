'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { speechLines, farewellLine } from '@/data/terminal'
import { useSystemFace } from '@/hooks/useSystemFace'
import SystemFace from './SystemFace'
import RoomBackdrop from './RoomBackdrop'
import s from './HeroCRT.module.css'

gsap.registerPlugin(ScrollTrigger)

const LOADER_CELLS = 8

export default function HeroCRT() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)

  const { face, text, phase, reducedMotion, react } = useSystemFace({
    lines: speechLines,
    farewell: farewellLine,
  })

  // Barra de carga (solo durante 'loading').
  const [loaderFill, setLoaderFill] = useState(0)
  useEffect(() => {
    if (reducedMotion || phase !== 'loading') return
    let n = 0
    const id = setInterval(() => {
      n = Math.min(LOADER_CELLS, n + 1)
      setLoaderFill(n)
      if (n >= LOADER_CELLS) clearInterval(id)
    }, 1500 / LOADER_CELLS)
    return () => clearInterval(id)
  }, [phase, reducedMotion])

  // react se lee desde un ref para no recrear el timeline de GSAP cuando cambia.
  const reactRef = useRef(react)
  useEffect(() => {
    reactRef.current = react
  })

  useGSAP(
    () => {
      if (globalThis.window === undefined) return

      const section = sectionRef.current
      const wrapper = wrapperRef.current
      if (!section || !wrapper) return

      // Limpiamos triggers previos
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === section)
        .forEach((st) => st.kill())

      const mm = gsap.matchMedia()

      // 🖥️ SOLO ESCRITORIO (≥ 768px)
      mm.add('(min-width: 768px)', () => {
        gsap.set(wrapper, {
          scale: 1.1,
          transformOrigin: '50% 50%',
          force3D: true,
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=40%',
            pin: true,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
            // El personaje reacciona a la dirección del scroll (despedida / sorpresa).
            onUpdate: (self) => reactRef.current(self.direction),
          },
        })

        tl.to(wrapper, { scale: 1, ease: 'none' })
      })

      // 📱 SOLO MÓVIL (≤ 767px) — sin ScrollTrigger, scroll natural.
      mm.add('(max-width: 767px)', () => {
        gsap.set(wrapper, { scale: 1, force3D: false })
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-crt-section
      aria-label="Hero — terminal introduction"
      className={s.heroSection}
    >
      <div className={s.ambientGlow} aria-hidden="true" />

      {/* Fondo de sala: hermano del wrapper, detrás del monitor. */}
      <RoomBackdrop />

      <div ref={wrapperRef} data-crt-wrapper className={s.monitorWrapper}>
        <div className={s.monitor} data-crt-monitor>
          <div className={s.powerLed} aria-hidden="true" />

          <div className={s.bezel}>
            <div
              ref={screenRef}
              data-crt-screen
              className={[s.screen, phase === 'speaking' ? s.hintVisible : ''].join(
                ' ',
              )}
            >
              {/* Static overlays */}
              <div className={s.scanlines} aria-hidden="true" />
              <div className={s.vignette} aria-hidden="true" />
              <div className={s.rollingScanline} aria-hidden="true" />
              <div className={s.flickerOverlay} aria-hidden="true" />
              <div className={s.glare} aria-hidden="true" />

              <div className={s.terminal} aria-label="Sistema">
                <div className={s.terminalHeader}>
                  JP-OS&nbsp;&nbsp;▸&nbsp;&nbsp;Phosphor
                  II&nbsp;&nbsp;▸&nbsp;&nbsp;80×25 VGA
                </div>

                {reducedMotion ? (
                  // Fallback estático: la info visible, sin bucle ni animación.
                  <ul className={s.staticInfo}>
                    {speechLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : phase === 'loading' ? (
                  <div className={s.faceStage} aria-hidden="true">
                    <div className={s.loader}>
                      [{'█'.repeat(loaderFill)}
                      {'░'.repeat(LOADER_CELLS - loaderFill)}] Loading...
                    </div>
                  </div>
                ) : (
                  <SystemFace
                    face={face}
                    text={text}
                    showCursor={phase === 'speaking'}
                  />
                )}

                {/* Info accesible: se anuncia una vez, nunca en bucle. */}
                <p className={s.srOnly}>
                  Juan Paredes. Ingeniero informático, IA y fullstack. Web, móvil y
                  cloud. Disponible para contratar.
                </p>
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
