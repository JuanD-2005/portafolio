'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bootSequence } from '@/data/terminal'
import { useTypewriter } from '@/hooks/useTypewriter'
import s from './HeroCRT.module.css'

// Register ScrollTrigger once at module level — safe in 'use client'
gsap.registerPlugin(ScrollTrigger)

/**
 * HeroCRT — Sprint 2 complete
 *
 * On load   → monitorWrapper is scaled up so only the green screen fills
 *             the viewport (no bezel, no stand visible — we're "on the glass").
 *
 * On scroll → GSAP ScrollTrigger scrubs the scale from `fromScale → 1`,
 *             revealing the full monitor, bezel and stand, then unpins so
 *             the user continues scrolling to the modern sections.
 *
 * Data attrs:
 *   data-crt-section  → the <section> that ScrollTrigger pins
 *   data-crt-wrapper  → the element GSAP animates (scale)
 *   data-crt-screen   → used to measure the screen rect for scale calculation
 */
export default function HeroCRT() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const screenRef  = useRef<HTMLDivElement>(null)

  const { displayedLines, isComplete } = useTypewriter(bootSequence, 650)

  // ── GSAP ScrollTrigger setup ──────────────────────────────────────────────
  useLayoutEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    const wrapper = wrapperRef.current
    const screen  = screenRef.current
    if (!section || !wrapper || !screen) return

    // Measure the actual screen element (the green area inside the bezel)
    // to compute the exact scale needed to fill the viewport.
    const screenRect = screen.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    //   scaleX = how much to scale so the screen width fills the viewport width
    //   scaleY = same for height
    //   We take the larger of the two so the screen *covers* the viewport
    //   (like CSS background-size: cover) — no letterboxing, no pillarboxing.
    //   The +2% overshoot hides the bezel corners when scaled up.
    const scaleX    = (vw / screenRect.width)  * 0.5
    const scaleY    = (vh / screenRect.height) * 0.5
    const fromScale = Math.max(scaleX, scaleY)

    // Snap to zoomed-in state immediately (no animation, happens before paint)
    gsap.set(wrapper, {
      scale:           fromScale,
      transformOrigin: '50% 50%',
      force3D:         true,
    })

    // Build the scroll-driven zoom-out timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:       section,
        start:         'top top',
        //
        // end defines how much the user scrolls while pinned.
        // '+=130%' = 1.3× viewport heights of scroll travel.
        // Tweak this if the zoom-out feels too fast or too slow.
        //
        end:           '+=130%',
        pin:           true,
        pinSpacing:    true,  // pushes subsequent sections down correctly
        scrub:         1.2,   // slight lag makes it feel more physical
        anticipatePin: 1,     // avoids the half-second flash before pinning
      },
    })

    tl.to(wrapper, {
      scale:  1,
      ease:   'none',   // linear — ScrollTrigger scrub handles easing
    })

    // Cleanup on unmount / HMR
    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-crt-section
      aria-label="Hero — terminal introduction"
      className={s.heroSection}
    >
      {/* Phosphor ambient spill on the room walls */}
      <div className={s.ambientGlow} aria-hidden="true" />

      {/*
       * GSAP animates scale on this div.
       * At fromScale it fills the viewport with just the screen.
       * At scale=1 the full monitor (bezel + stand) is visible.
       */}
      <div
        ref={wrapperRef}
        data-crt-wrapper
        className={s.monitorWrapper}
      >
        {/* ── Monitor outer bezel ──────────────────────────────────── */}
        <div className={s.monitor} data-crt-monitor>

          {/* Power LED */}
          <div className={s.powerLed} aria-hidden="true" />

          {/* ── Inner bezel ────────────────────────────────────────── */}
          <div className={s.bezel}>

            {/* ── Screen ─────────────────────────────────────────── */}
            <div
              ref={screenRef}
              data-crt-screen
              className={[
                s.screen,
                isComplete ? s.hintVisible : '',
              ].join(' ')}
            >
              {/* Visual effect layers — order matches z-index stack */}
              <div className={s.scanlines}       aria-hidden="true" />
              <div className={s.vignette}        aria-hidden="true" />
              <div className={s.rollingScanline} aria-hidden="true" />
              <div className={s.glare}           aria-hidden="true" />

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
                      className={
                        isEmpty ? s.terminalLineEmpty : s.terminalLine
                      }
                    >
                      {isEmpty ? null : line}

                      {/* Active cursor — only on the last line while typing */}
                      {isCurrentLine && !isComplete && !isEmpty && (
                        <span className={s.cursor} aria-hidden="true" />
                      )}
                    </div>
                  )
                })}

                {/* Idle cursor after sequence completes */}
                {isComplete && (
                  <div className={s.terminalLine}>
                    <span className={s.cursor} aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Scroll hint — fades in via CSS transition when isComplete */}
              <div className={s.scrollHint} aria-hidden="true">
                <span className={s.scrollHintText}>
                  ▼&nbsp;&nbsp;SCROLL TO CONTINUE
                </span>
              </div>

            </div>
            {/* /screen */}
          </div>
          {/* /bezel */}

          {/* ── Monitor stand ────────────────────────────────────── */}
          <div className={s.stand} aria-hidden="true">
            <div className={s.standNeck} />
            <div className={s.standBase} />
          </div>

        </div>
        {/* /monitor */}
      </div>
      {/* /wrapper */}
    </section>
  )
}
