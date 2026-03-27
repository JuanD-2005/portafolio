'use client'

import dynamic from 'next/dynamic'

/*
 * HeroWrapper
 *
 * Dynamic import with ssr:false — HeroCRT uses GSAP + window APIs that
 * don't exist on the server, so it must be client-only.
 *
 * The loading placeholder reserves 100vh so the rest of the page doesn't
 * jump when HeroCRT hydrates.
 *
 * NOTE: ScrollTrigger.refresh() is intentionally NOT called here.
 * HeroCRT calls it once after its own setup is complete. Calling it from
 * HeroWrapper too caused a race condition: the wrapper's refresh fired
 * before GSAP had initialised the timeline, producing incorrect pin
 * calculations and the black-screen glitch.
 */
const HeroCRT = dynamic(() => import('./HeroCRT'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height:          '100vh',
        width:           '100%',
        backgroundColor: '#020202',
      }}
      aria-hidden="true"
    />
  ),
})

export default function HeroWrapper() {
  return <HeroCRT />
}
