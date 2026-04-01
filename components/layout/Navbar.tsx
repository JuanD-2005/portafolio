'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useScrollThreshold }      from '@/hooks/useScrollThreshold'
import { navbarDrop }              from '@/animations/variants'
import { makeScrollHandler }       from '@/lib/scrollTo'
import s                           from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Inicio',     href: '#hero'     },
  { label: 'Proyectos',  href: '#projects' },
  { label: 'Contacto',   href: '#contact'  },
]

const LINKEDIN_URL = 'https://www.linkedin.com/in/juan-diego-paredes-g%C3%A1mez-21415338a/'

/**
 * Navbar
 *
 * Hidden on load. Appears with a drop-in animation once the user has
 * scrolled past one full viewport height (past the CRT zoom-out zone).
 *
 * Position: fixed — rendered inside a portal-like wrapper in layout.tsx
 * so it sits above all sections without interfering with GSAP pin spacing.
 *
 * Accessibility: nav landmark + aria-label.
 */
export default function Navbar() {
  // Show after the user has scrolled ~1vh (past GSAP CRT pin midpoint)
  const visible = useScrollThreshold(/* 0 = auto: 1 × innerHeight */ 0)

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="navbar"
          aria-label="Main navigation"
          className={s.root}
          variants={navbarDrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          // Keep the pill horizontally centered regardless of viewport width
          style={{ x: '-50%' }}
        >
          <div className={s.pill}>
            {NAV_LINKS.map((link, i) => (
              <div key={link.href} style={{ display: 'contents' }}>
                {i > 0 && (
                  <span className={s.dot} aria-hidden="true" />
                )}
                <a
                  href={link.href}
                  className={s.link}
                  onClick={makeScrollHandler(link.href)}
                >
                  {link.label}
                </a>
              </div>
            ))}

            {/* CTA separado: ir directo a contacto */}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={s.ctaButton}
            >
              Hablemos
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
