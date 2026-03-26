/**
 * scrollTo
 *
 * Shared smooth-scroll utility. Centralises the logic so every CTA button
 * in the app (Navbar, ActionSection, ProjectArchive, etc.) behaves identically.
 *
 * Why not CSS `scroll-behavior: smooth` alone?
 * Because the GSAP ScrollTrigger pin spacer adds synthetic height to the page
 * that confuses the browser's native scroll calculation. This function targets
 * the actual DOM element and lets the browser figure out the correct offset.
 *
 * Usage (client components):
 *   import { scrollTo } from '@/lib/scrollTo'
 *   <button onClick={() => scrollTo('#contact')}>Contactar</button>
 *
 * Or as an anchor onClick handler:
 *   onClick={(e) => { e.preventDefault(); scrollTo(href) }}
 */
export function scrollTo(selector: string): void {
  const el = document.querySelector(selector)
  if (!el) return

  el.scrollIntoView({
    behavior: 'smooth',
    block:    'start',
  })
}

/**
 * makeScrollHandler
 *
 * Returns a click handler for anchor elements that prevents default
 * navigation and calls scrollTo instead.
 *
 * Usage:
 *   <a href="#contact" onClick={makeScrollHandler('#contact')}>
 */
export function makeScrollHandler(
  selector: string,
): React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> {
  return (e) => {
    e.preventDefault()
    scrollTo(selector)
  }
}
