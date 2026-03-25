/**
 * app/page.tsx — Sprint 3 complete
 *
 * Narrative order:
 *  1. HeroCRT        — retro CRT terminal + GSAP zoom-out
 *  2. ActionSection  — modern bridge: headline + CTAs + stats
 *  3. ProjectsSection — featured tríada with CSS device mockups
 *  4. ProjectArchive — expandable full project history table
 *  5. ContactSection — (Sprint 4)
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

import HeroCRT         from '@/components/hero/HeroCRT'
import Navbar          from '@/components/layout/Navbar'
import ActionSection   from '@/components/sections/ActionSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import ProjectArchive  from '@/components/projects/ProjectArchive'
// import ContactSection from '@/components/contact/ContactSection'  ← Sprint 4

export default function Home() {
  return (
    <>
      {/* Fixed pill navbar — outside <main> to avoid GSAP pin interference */}
      <Navbar />

      <main>
        {/* ── 1. CRT Hero ──────────────────────────────────────────── */}
        <HeroCRT />

        {/* ── 2. Action / bridge ───────────────────────────────────── */}
        <ActionSection />

        {/* ── 3. Featured projects tríada ──────────────────────────── */}
        <ProjectsSection />

        {/* ── 4. Full project archive (expandable) ─────────────────── */}
        <ProjectArchive />

        {/* ── 5. Contact — Sprint 4 ────────────────────────────────── */}
        {/* <ContactSection /> */}
      </main>
    </>
  )
}
