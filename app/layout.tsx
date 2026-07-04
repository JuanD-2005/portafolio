import type { Metadata, Viewport } from 'next'
import { VT323, Syne, DM_Sans, Instrument_Serif } from 'next/font/google'
import MotionProvider from '@/components/layout/MotionProvider'
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
 *
 * Instrument Serif → Diploma-style display serif, used only for certificate
 *               titles in Logros y Certificaciones (mirrors the reference
 *               contrast between mono terminal chrome and an elegant serif).
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

const instrumentSerif = Instrument_Serif({
  weight:   '400',
  style:    ['normal', 'italic'],
  subsets:  ['latin'],
  variable: '--font-serif',
  display:  'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Juan Paredes | Full-Stack Web & Mobile Developer',
  description: 'Ingeniero Informático especializado en desarrollo Full-Stack con Next.js, Django y Flutter. Del esquema de base de datos al último pixel de la interfaz.',
  openGraph: {
    title: 'Juan Paredes | Full-Stack Developer',
    description: 'Ingeniero Informático especializado en desarrollo Full-Stack. Explora mis proyectos, casos de estudio y código fuente.',
    url: 'https://tudominio.com', // TODO: Actualizar con el dominio final en producción
    siteName: 'Juan Paredes - Portafolio',
    images: [
      {
        url: '/og-image.png', // TODO: Crear y guardar una captura del Hero en public/og-image.png
        width: 1200,
        height: 630,
        alt: 'Terminal de Juan Paredes - Full-Stack Developer',
      },
    ],
    locale: 'es_VE',
    type: 'website',
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
      className={`${vt323.variable} ${syne.variable} ${dmSans.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
