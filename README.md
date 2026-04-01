# Juan Paredes - Portfolio 2026

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2.1-111111?logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19.2.4-20232A?logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4.x-0B1120?logo=tailwindcss&logoColor=38BDF8" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3.14.2-0A0A0A?logo=greensock&logoColor=88CE02" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-12.38.0-0F172A?logo=framer&logoColor=white" />
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/Status-Production_Ready-14532D" />
  <img alt="License" src="https://img.shields.io/badge/License-Personal_Portfolio-334155" />
  <img alt="Year" src="https://img.shields.io/badge/Edition-2026-7C3AED" />
</p>

<p align="center">
  <strong>Full Stack Web & Mobile Developer</strong><br/>
  Next.js + TypeScript + GSAP + Framer Motion + Server Actions
</p>

<p align="center">
  <a href="#espanol">Espanol</a> ·
  <a href="#english">English</a>
</p>

---

## Espanol

### Indice (ES)

1. [Resumen](#resumen)
2. [Demo y enfoque visual](#demo-y-enfoque-visual)
3. [Stack tecnico](#stack-tecnico)
4. [Arquitectura del proyecto](#arquitectura-del-proyecto)
5. [Estructura de carpetas](#estructura-de-carpetas)
6. [Sistema de animaciones](#sistema-de-animaciones)
7. [Contacto y Server Actions](#contacto-y-server-actions)
8. [Instalacion y ejecucion](#instalacion-y-ejecucion)
9. [Scripts](#scripts)
10. [Roadmap](#roadmap)

### Resumen

Portfolio personal 2026 orientado a reclutamiento internacional y clientes freelance.

- Narrativa visual en 5 bloques: Hero CRT, Action bridge, Proyectos destacados, Archivo expandible, Contacto.
- Marca personal combinando retro terminal + capa moderna de producto.
- Formularios con validacion real y envio de correo desde Server Actions.
- Animaciones separadas por responsabilidad: CSS, hook custom, GSAP y Framer Motion.

### Demo y enfoque visual

- Hero tipo monitor CRT con secuencia de terminal.
- Transicion cinematica hacia secciones modernas.
- Tarjetas de proyecto con mockups de dispositivo y microinteracciones.
- Seccion de contacto con interfaz estilo JSON + formulario funcional.

### Stack tecnico

#### Core

- Next.js 16.2.1
- React 19.2.4
- TypeScript 5

#### UI, estilos y movimiento

- Tailwind CSS 4
- CSS Modules
- GSAP 3.14.2 + @gsap/react
- Framer Motion 12.38.0

#### Backend ligero y validacion

- Next.js Server Actions
- Zod 4.3.6
- Resend 6.9.4

### Arquitectura del proyecto

- `app/layout.tsx`: metadata, viewport y fuentes globales (VT323, Syne, DM Sans).
- `app/page.tsx`: composicion principal de secciones y orden narrativo.
- Navbar fijo renderizado fuera de `main` para evitar interferencias de pinning con ScrollTrigger.
- Hero cargado con import dinamico client-only (`ssr: false`) por uso de APIs del navegador en animaciones.

### Estructura de carpetas

```text
portfolio/
├─ app/
│  ├─ actions/
│  │  └─ sendEmail.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ animations/
│  └─ variants.ts
├─ components/
│  ├─ contact/
│  │  ├─ ContactSection.module.css
│  │  └─ ContactSection.tsx
│  ├─ hero/
│  │  ├─ HeroCRT.module.css
│  │  ├─ HeroCRT.tsx
│  │  └─ HeroWrapper.tsx
│  ├─ layout/
│  │  ├─ Navbar.module.css
│  │  └─ Navbar.tsx
│  ├─ projects/
│  │  ├─ DeviceMockup.module.css
│  │  ├─ DeviceMockup.tsx
│  │  ├─ ProjectArchive.module.css
│  │  ├─ ProjectArchive.tsx
│  │  ├─ ProjectCard.module.css
│  │  ├─ ProjectCard.tsx
│  │  ├─ ProjectsSection.module.css
│  │  └─ ProjectsSection.tsx
│  ├─ sections/
│  │  ├─ ActionSection.module.css
│  │  └─ ActionSection.tsx
│  └─ ui/
│     └─ ClientOnly.tsx
├─ data/
│  ├─ projects.ts
│  └─ terminal.ts
├─ hooks/
│  ├─ useScrollThreshold.ts
│  └─ useTypewriter.ts
├─ lib/
│  └─ scrollTo.ts
├─ public/
│  └─ project/
├─ types/
│  └─ index.ts
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ tailwind.config.ts
└─ tsconfig.json
```

### Sistema de animaciones

| Responsabilidad | Tecnologia |
|---|---|
| Encendido CRT, scanlines, flicker, vignette | CSS puro |
| Efecto typewriter de terminal | Hook custom (`useTypewriter`) |
| Zoom/pinning del hero y transiciones de scroll | GSAP + ScrollTrigger |
| Entradas de secciones, stagger y hover | Framer Motion |

### Contacto y Server Actions

El formulario de contacto valida datos con Zod y envia correo via Resend desde `app/actions/sendEmail.ts`.

Variables de entorno requeridas:

```bash
RESEND_API_KEY=tu_api_key
```

Notas:

- `from` usa dominio de onboarding de Resend para entorno base.
- Respuesta visual de estado: `idle`, `success`, `error`, `validation_error`.

### Instalacion y ejecucion

```bash
# 1) Instalar dependencias
npm install

# 2) Crear archivo de entorno
# .env.local
RESEND_API_KEY=tu_api_key

# 3) Ejecutar en desarrollo
npm run dev
```

### Scripts

```bash
npm run dev    # levantar entorno local
npm run build  # build de produccion
npm run start  # correr build
npm run lint   # linting del proyecto
```

### Roadmap

- [x] Sprint 1 - Hero CRT + typewriter
- [x] Sprint 2 - Scroll transitions con GSAP
- [x] Sprint 3 - Proyectos destacados + archivo expandible
- [x] Sprint 4 - Contacto funcional con Server Actions + Resend
- [ ] Sprint 5 - Optimizacion final (SEO avanzado, analitica y CI/CD)

---

## English

### Index (EN)

1. [Overview](#overview)
2. [Visual direction](#visual-direction)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [Folder structure](#folder-structure)
6. [Animation system](#animation-system)
7. [Contact and Server Actions](#contact-and-server-actions)
8. [Setup](#setup)
9. [Scripts](#scripts-1)
10. [Roadmap](#roadmap-1)

### Overview

This is my 2026 personal portfolio, designed to present full stack web/mobile work to recruiters and freelance clients.

- 5-part narrative: CRT Hero, Action bridge, Featured projects, Expandable archive, Contact.
- Visual identity blends retro terminal aesthetics with a modern product-style interface.
- Real contact workflow with form validation and email delivery.
- Motion system split by responsibility for maintainability and performance.

### Visual direction

- CRT-style hero with terminal boot sequence.
- Scroll-based transition into modern content sections.
- Project cards with device mockups and interaction details.
- Contact section styled like a JSON block with a working form.

### Tech stack

#### Core

- Next.js 16.2.1
- React 19.2.4
- TypeScript 5

#### UI and motion

- Tailwind CSS 4
- CSS Modules
- GSAP 3.14.2 + @gsap/react
- Framer Motion 12.38.0

#### Validation and delivery

- Next.js Server Actions
- Zod 4.3.6
- Resend 6.9.4

### Architecture

- `app/layout.tsx`: global metadata, viewport and font strategy.
- `app/page.tsx`: page composition and section order.
- Fixed navbar rendered outside `main` to avoid ScrollTrigger pin spacing issues.
- Hero loaded with dynamic import (`ssr: false`) because animation logic depends on browser APIs.

### Folder structure

The current source tree is documented in the Spanish section under [Estructura de carpetas](#estructura-de-carpetas).

### Animation system

| Responsibility | Library |
|---|---|
| CRT effects (scanlines, flicker, vignette) | Pure CSS |
| Terminal typing sequence | Custom hook (`useTypewriter`) |
| Hero pin/zoom and scroll transitions | GSAP + ScrollTrigger |
| Reveal, stagger and hover interactions | Framer Motion |

### Contact and Server Actions

The contact form validates inputs with Zod and sends emails through Resend from `app/actions/sendEmail.ts`.

Required environment variable:

```bash
RESEND_API_KEY=your_api_key
```

### Setup

```bash
npm install
npm run dev
```

For email delivery, add `RESEND_API_KEY` to `.env.local`.

### Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

### Roadmap

- [x] Sprint 1 - CRT Hero + typewriter
- [x] Sprint 2 - GSAP scroll transitions
- [x] Sprint 3 - Featured projects + expandable archive
- [x] Sprint 4 - Functional contact form with Server Actions + Resend
- [ ] Sprint 5 - Final polish (advanced SEO, analytics, CI/CD)

---

## Author

Juan Paredes

- GitHub: https://github.com/juanparedes
- LinkedIn: https://linkedin.com/in/juanparedes
- Email: hello@juanparedes.dev
