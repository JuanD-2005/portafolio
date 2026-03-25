import type { ReactNode } from 'react'
import s from './DeviceMockup.module.css'

interface DeviceMockupProps {
  type:         'mobile' | 'laptop'
  /** Accent color — used as the screen background gradient anchor */
  accentColor?: string
  /** Screenshot URL (from /public). Falls back to gradient placeholder. */
  screenshotUrl?: string
  /** Custom JSX to render inside the screen instead of the auto-placeholder */
  children?: ReactNode
}

/** Gradient placeholder shown when no real screenshot is available */
function ScreenPlaceholder({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        width:    '100%',
        height:   '100%',
        background: `
          radial-gradient(
            ellipse 80% 60% at 30% 30%,
            ${accentColor}22 0%,
            ${accentColor}08 50%,
            transparent 80%
          ),
          #0a0a0a
        `,
      }}
    />
  )
}

/** Browser chrome strip for laptop screens */
function BrowserChrome() {
  return (
    <div className={s.browserChrome} aria-hidden="true">
      <span className={`${s.chromeDot} ${s.chromeDotRed}`}    />
      <span className={`${s.chromeDot} ${s.chromeDotYellow}`} />
      <span className={`${s.chromeDot} ${s.chromeDotGreen}`}  />
      <span className={s.chromeBar} />
    </div>
  )
}

/**
 * DeviceMockup
 *
 * Renders a CSS-only device frame. No images, no SVG icons — pure CSS shapes.
 *
 * The screen area accepts:
 *  1. `children` — pass custom JSX for full control
 *  2. `screenshotUrl` — renders as background-image
 *  3. Neither — renders a gradient placeholder using `accentColor`
 *
 * Both `mobile` and `laptop` variants are the same component, driven by the
 * `type` prop. Import once, use everywhere.
 */
export default function DeviceMockup({
  type,
  accentColor = '#6366f1',
  screenshotUrl,
  children,
}: DeviceMockupProps) {

  // Resolve what goes inside the screen
  const screenInner = children ?? (
    screenshotUrl
      ? <div style={{ width: '100%', height: '100%', backgroundImage: `url(${screenshotUrl})`, backgroundSize: 'cover', backgroundPosition: 'top' }} />
      : <ScreenPlaceholder accentColor={accentColor} />
  )

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (type === 'mobile') {
    return (
      <div className={s.wrapper}>
        <div className={s.mobile} role="img" aria-label="Smartphone mockup">
          <div className={s.mobileScreen}>
            <span className={s.notch}    aria-hidden="true" />
            <div  className={s.screenContent}>
              {screenInner}
            </div>
            <span className={s.homeBar} aria-hidden="true" />
          </div>
        </div>
      </div>
    )
  }

  // ── Laptop ────────────────────────────────────────────────────────────────
  return (
    <div className={s.wrapper}>
      <div className={s.laptop} role="img" aria-label="Laptop mockup">
        {/* Lid */}
        <div className={s.laptopLid}>
          <span className={s.camera} aria-hidden="true" />
          <div className={s.laptopScreen}>
            <BrowserChrome />
            <div className={s.screenContent}>
              {screenInner}
            </div>
          </div>
        </div>

        {/* Hinge + base */}
        <div className={s.hinge}      aria-hidden="true" />
        <div className={s.laptopBase} aria-hidden="true" />
      </div>
    </div>
  )
}
