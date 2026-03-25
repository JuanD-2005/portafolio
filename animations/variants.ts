import type { Variants } from 'framer-motion'

// ─── Spring config — shared by most transitions ───────────────────────────────
const spring = { ease: [0.16, 1, 0.3, 1] as const }

// ─── Fade + slide up ──────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ...spring } },
}

// ─── Fade up — slower for section headings ────────────────────────────────────
export const fadeUpSlow: Variants = {
  hidden:  { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ...spring } },
}

// ─── Stagger container ────────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
}

// ─── Stagger container — faster, for archive rows ────────────────────────────
export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
}

// ─── Scale in ────────────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ...spring } },
}

// ─── Slide from left ──────────────────────────────────────────────────────────
export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ...spring } },
}

// ─── Slide from right ─────────────────────────────────────────────────────────
export const slideRight: Variants = {
  hidden:  { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ...spring } },
}

// ─── Navbar pill drop ─────────────────────────────────────────────────────────
export const navbarDrop: Variants = {
  hidden:  { opacity: 0, y: -60, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ...spring },
  },
}

// ─── Project card float up (used in whileInView stagger) ─────────────────────
export const cardFloat: Variants = {
  hidden:  { opacity: 0, y: 64, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ...spring },
  },
}

// ─── Archive row reveal (subtle, tight) ───────────────────────────────────────
export const archiveRow: Variants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

// ─── Archive expand/collapse (height AnimatePresence wrapper) ────────────────
export const archiveExpand: Variants = {
  hidden:  { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.35, ease: 'easeIn' },
  },
}

// ─── Char reveal (for dramatic headings) ─────────────────────────────────────
export const charReveal: Variants = {
  hidden:  { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: '0%', transition: { duration: 0.5, ...spring } },
}

// ─── Modern section reveal (after GSAP hands off) ────────────────────────────
export const modernReveal: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut', delay: 0.2 } },
}
