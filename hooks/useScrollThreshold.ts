'use client'

import { useState, useEffect } from 'react'

/**
 * useScrollThreshold
 *
 * Returns `true` once the vertical scroll position exceeds `threshold` px.
 * Used by the Navbar to remain hidden while the GSAP CRT animation plays,
 * then fade in once the user has scrolled into the modern sections.
 *
 * Threshold advice:
 *   The GSAP pin for HeroCRT uses `end: '+=130%'`, meaning the user scrolls
 *   roughly 1.3 × vh while pinned. Setting `threshold = window.innerHeight`
 *   triggers the navbar at the midpoint of the zoom-out — feels natural.
 *   Override per call-site if needed.
 */
export function useScrollThreshold(threshold = 0): boolean {
  const [exceeded, setExceeded] = useState(false)

  useEffect(() => {
    // Use the viewport height as the default threshold if 0 is passed
    const limit = threshold === 0 ? window.innerHeight : threshold

    const onScroll = () => {
      setExceeded(window.scrollY > limit)
    }

    // Passive listener — no need to call preventDefault
    window.addEventListener('scroll', onScroll, { passive: true })

    // Check immediately in case page loads mid-scroll (browser back/forward)
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return exceeded
}
