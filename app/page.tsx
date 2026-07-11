/**
 * app/page.tsx — Sprint 3 complete
 *
 * Narrative order:
 *  1. HeroCRT              — retro CRT terminal + GSAP zoom-out
 *  2. ActionSection        — modern bridge: headline + CTAs + stats
 *  2.5. CertificatesTeaser — badge divider that expands in-place (antesala)
 *  3. ProjectsSection      — tabs: featured tríada + category archive tables
 *  4. ContactSection       — contact form + JSON links
 *
 * ─── Critical architecture note ─────────────────────────────────────────────
 * <Navbar> is rendered OUTSIDE <main>, directly in the root fragment.
 *
 * Why: GSAP ScrollTrigger sets `pin: true` on #hero (a child of <main>),
 * which inserts a spacer div into the DOM to preserve scroll height while
 * the section is pinned. If the Navbar were inside <main>, it would be
 * displaced by that spacer. Outside <main> and with `position: fixed`,
 * it sits in a completely separate stacking context — zero interference.
 */

import HeroWrapper        from '@/components/hero/HeroWrapper'
import Navbar             from '@/components/layout/Navbar'
import ActionSection      from '@/components/sections/ActionSection'
import ProjectsSection    from '@/components/projects/ProjectsSection'
import CertificatesTeaser from '@/components/certificates/CertificatesTeaser'
import ContactSection     from '@/components/contact/ContactSection'

export default function Home() {
  return (
    <>
      {/* Fixed pill navbar — outside <main> to avoid GSAP pin interference */}
      <Navbar />

      <main>
        {/* ── 1. CRT Hero (Renderizado solo en el cliente) ────────── */}
        <HeroWrapper />

        {/* ── 2. Action / bridge ───────────────────────────────────── */}
        <ActionSection />

        {/* ── 2.5. Logros y Certificaciones — in-place expandable ──── */}
        <CertificatesTeaser />

        {/* ── 3. Projects: tabs (Destacado + categorías) ────────────── */}
        <ProjectsSection />

        {/* ── 4. Contact ───────────────────────────────────────────── */}
        { <ContactSection /> }
      </main>
    </>
  )
}

