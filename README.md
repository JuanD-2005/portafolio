# Juan Paredes — Portfolio

Full Stack Web & Mobile Developer portfolio. Built with Next.js 14, Tailwind CSS, GSAP + ScrollTrigger, and Framer Motion.

---

## Quickstart

```bash
# 1. Create the Next.js project (if you haven't already)
npx create-next-app@latest portfolio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd portfolio

# 2. Install animation dependencies
npm install gsap framer-motion

# 3. Copy the files from this bundle into your project root

# 4. Start the dev server
npm run dev
```

---

## File map

```
app/
  layout.tsx          ← Root layout, fonts (VT323 · Syne · DM Sans), metadata
  page.tsx            ← Composes all sections
  globals.css         ← Design tokens, reset, base typography

components/
  hero/
    HeroCRT.tsx       ← CRT monitor + typewriter terminal (Sprint 1 ✅)
    HeroCRT.module.css← All CRT visual effects (scanlines, flicker, vignette)
  layout/             ← (Sprint 2) SmoothScroller, Navbar
  projects/           ← (Sprint 3) ProjectsSection, DeviceMockup
  contact/            ← (Sprint 4) TerminalForm, CVButton

hooks/
  useTypewriter.ts    ← Sequential typing animation hook

data/
  terminal.ts         ← Boot sequence lines
  projects.ts         ← (Sprint 3) Project data

animations/
  variants.ts         ← Framer Motion reusable variants
  gsap.ts             ← (Sprint 2) GSAP ScrollTrigger helpers

types/
  index.ts            ← Shared TypeScript interfaces
```

---

## Animation responsibility split

| What                        | Library         |
|-----------------------------|-----------------|
| CRT power-on / scanlines    | Pure CSS        |
| Typewriter text             | Custom hook     |
| Scroll zoom-out (CRT → modern) | GSAP ScrollTrigger |
| Horizontal project scroll   | GSAP ScrollTrigger |
| Section entrance reveals    | Framer Motion   |
| Hover micro-interactions    | Framer Motion   |
| Terminal form interactions  | Framer Motion   |

---

## Sprint roadmap

- [x] Sprint 1 — Hero CRT + typewriter
- [ ] Sprint 2 — GSAP scroll zoom-out transition
- [ ] Sprint 3 — Projects section (horizontal scroll + CSS device mockups)
- [ ] Sprint 4 — Contact terminal form + CV download
