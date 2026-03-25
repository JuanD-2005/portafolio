import type { Metadata, Viewport } from 'next'
import { VT323, Syne, DM_Sans } from 'next/font/google'
import './globals.css'

/*
 * Font strategy
 * ─────────────────────────────────────────────────────────────────────────────
 * VT323       → The CRT terminal. Pixel-perfect monospace. Loaded as a
 *               CSS variable so the CSS module can reference it.
 *
 * Syne        → Headlines in the modern sections. Geometric, designer-y.
 *               Distinctive without being noisy.
 *
 * DM Sans     → Body text and UI copy. Clean, readable, pairs with Syne.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const vt323 = VT323({
  weight:   '400',
  subsets:  ['latin'],
  variable: '--font-terminal',
  display:  'swap',
})

const syne = Syne({
  subsets:  ['latin'],
  variable: '--font-heading',
  display:  'swap',
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       'Juan Paredes — Full Stack Developer',
  description: 'Full Stack Web & Mobile Developer especializado en Next.js, Flutter, Django y React. Disponible para proyectos internacionales.',
  keywords:    ['Full Stack Developer', 'Next.js', 'Flutter', 'Django', 'React', 'Web Developer', 'Mobile Developer'],
  authors:     [{ name: 'Juan Paredes' }],
  openGraph: {
    title:       'Juan Paredes — Full Stack Developer',
    description: 'Full Stack Web & Mobile Developer | Next.js · Flutter · Django · React',
    type:        'website',
  },
}

export const viewport: Viewport = {
  themeColor:          '#050505',
  colorScheme:         'dark',
  width:               'device-width',
  initialScale:        1,
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${vt323.variable} ${syne.variable} ${dmSans.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  )
}
