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
    if (typeof window === 'undefined') return

    const initAnimation = () => {
      const section = sectionRef.current
      const wrapper = wrapperRef.current
      const screen  = screenRef.current
      if (!section || !wrapper || !screen) return

      // Kill any existing ScrollTrigger on this section to prevent duplicates
      // on HMR or React StrictMode double-invoke
      ScrollTrigger.getAll()
        .filter(st => st.trigger === section)
        .forEach(st => st.kill())

      const screenRect = screen.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      const safeWidth  = screenRect.width  > 10 ? screenRect.width  : 800
      const safeHeight = screenRect.height > 10 ? screenRect.height : 600

      const scaleX    = (vw / safeWidth)  * 1.02
      const scaleY    = (vh / safeHeight) * 1.02
      const fromScale = Math.max(scaleX, scaleY)

      // Set initial scale before paint — no will-change in CSS, GSAP force3D
      // handles GPU promotion on its own without double-promoting
      gsap.set(wrapper, {
        scale:           fromScale,
        transformOrigin: '50% 50%',
        force3D:         true,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       section,
          start:         'top top',
          end:           '+=130%',
          pin:           true,
          pinSpacing:    true,
          scrub:         1.2,
          anticipatePin: 1,
          // Invalidate on resize so scale recalculates on orientation change
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            // Recalculate fromScale after resize
            const r = screen.getBoundingClientRect()
            const w = r.width  > 10 ? r.width  : 800
            const h = r.height > 10 ? r.height : 600
            const sx = (window.innerWidth  / w) * 1.02
            const sy = (window.innerHeight / h) * 1.02
            gsap.set(wrapper, { scale: Math.max(sx, sy) })
          },
        },
      })

      tl.to(wrapper, { scale: 1, ease: 'none' })

      // Single refresh after setup — not in HeroWrapper
      ScrollTrigger.refresh()
    }

    if (document.readyState === 'complete') {
      initAnimation()
    } else {
      window.addEventListener('load', initAnimation, { once: true })
    }

    // useGSAP handles cleanup via scope — no manual kill needed here
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
