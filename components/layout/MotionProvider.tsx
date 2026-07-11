'use client'

import { MotionConfig } from 'framer-motion'

/**
 * Root-level opt-in to the OS-level prefers-reduced-motion preference.
 * framer-motion does NOT read this media query on its own — without this,
 * every `motion.*` entrance/stagger animation in the app (ActionSection,
 * ProjectsSection, ContactSection, Navbar, etc.) plays in
 * full regardless of the user's setting.
 *
 * reducedMotion="user" makes framer-motion disable transform/layout
 * animations (keeping instant opacity crossfades) automatically for any
 * `motion.*` element, without touching each component individually.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
