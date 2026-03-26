'use server'

import { z } from 'zod'

// ─── Validation schema ────────────────────────────────────────────────────────
// Using zod for server-side validation — same schema you'd use client-side.
// Install with: npm install zod

const ContactSchema = z.object({
  name: z
    .string()
    .min(2,  { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(80, { message: 'Nombre demasiado largo.' }),
  email: z
    .string()
    .email({ message: 'Email inválido.' }),
  message: z
    .string()
    .min(10,  { message: 'El mensaje debe tener al menos 10 caracteres.' })
    .max(2000, { message: 'Mensaje demasiado largo (máx. 2000 caracteres).' }),
})

// ─── Return type ──────────────────────────────────────────────────────────────

export interface ActionState {
  status: 'idle' | 'success' | 'error' | 'validation_error'
  message: string
  errors?: {
    name?:    string[]
    email?:   string[]
    message?: string[]
  }
}

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * sendEmail
 *
 * Next.js Server Action. Called directly from the ContactForm client component.
 * Validates input, then sends the email via Resend.
 *
 * ── Setup (choose one) ────────────────────────────────────────────────────────
 *
 * Option A — Resend (recommended, generous free tier, great DX):
 *   npm install resend
 *   Add RESEND_API_KEY to .env.local
 *   Uncomment the Resend block below.
 *
 * Option B — Nodemailer (self-hosted / SMTP):
 *   npm install nodemailer @types/nodemailer
 *   Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to .env.local
 *   Uncomment the Nodemailer block below.
 *
 * The simulated block (currently active) logs to the console and always
 * succeeds — useful for UI development without touching credentials.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function sendEmail(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {

  // 1. Extract and validate fields
  const raw = {
    name:    formData.get('name'),
    email:   formData.get('email'),
    message: formData.get('message'),
  }

  const parsed = ContactSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      status:  'validation_error',
      message: 'Por favor corrige los errores antes de enviar.',
      errors:  parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, message } = parsed.data

  // ── SIMULATED (active by default — no credentials needed) ─────────────────
  // Remove this block and uncomment Resend or Nodemailer below
  await new Promise((resolve) => setTimeout(resolve, 1200)) // simulate network
  console.log('[ContactForm] New message received:', { name, email, message })
  return {
    status:  'success',
    message: '¡Mensaje enviado! Te respondo en menos de 24h.',
  }
  // ── END SIMULATED ──────────────────────────────────────────────────────────


  /* ── OPTION A: Resend ──────────────────────────────────────────────────────
  //
  // import { Resend } from 'resend'
  //
  // const resend = new Resend(process.env.RESEND_API_KEY)
  //
  // try {
  //   await resend.emails.send({
  //     from:    'Portfolio <noreply@yourdomain.com>',
  //     to:      ['juanparedes@example.com'],           // ← tu correo real
  //     replyTo: email,
  //     subject: `[Portfolio] Mensaje de ${name}`,
  //     text:    `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
  //     // html:  (optional) render with @react-email/components
  //   })
  //   return {
  //     status:  'success',
  //     message: '¡Mensaje enviado! Te respondo en menos de 24h.',
  //   }
  // } catch (err) {
  //   console.error('[sendEmail] Resend error:', err)
  //   return {
  //     status:  'error',
  //     message: 'Error al enviar el mensaje. Inténtalo de nuevo o escríbeme directamente.',
  //   }
  // }
  //
  // ── END RESEND ─────────────────────────────────────────────────────────── */


  /* ── OPTION B: Nodemailer ──────────────────────────────────────────────────
  //
  // import nodemailer from 'nodemailer'
  //
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT ?? 587),
  //   secure: false,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // })
  //
  // try {
  //   await transporter.sendMail({
  //     from:    `"Portfolio" <${process.env.SMTP_USER}>`,
  //     to:      'juanparedes@example.com',              // ← tu correo real
  //     replyTo: email,
  //     subject: `[Portfolio] Mensaje de ${name}`,
  //     text:    `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
  //   })
  //   return {
  //     status:  'success',
  //     message: '¡Mensaje enviado! Te respondo en menos de 24h.',
  //   }
  // } catch (err) {
  //   console.error('[sendEmail] Nodemailer error:', err)
  //   return {
  //     status:  'error',
  //     message: 'Error al enviar el mensaje. Inténtalo de nuevo.',
  //   }
  // }
  //
  // ── END NODEMAILER ──────────────────────────────────────────────────────── */
}
