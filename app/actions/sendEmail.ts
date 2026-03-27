'use server'

import { z } from 'zod'
import { Resend } from 'resend'

// ─── Configuración de Resend ──────────────────────────────────────────────────

// ─── Validation schema ────────────────────────────────────────────────────────
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
export async function sendEmail(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
 const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Extraer y validar campos
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

  // 2. Enviar el correo real usando Resend
  try {
    await resend.emails.send({
      from:    'Portafolio Contacto <onboarding@resend.dev>', // ¡NO CAMBIES ESTO! Es requerido por la capa gratuita de Resend
      to:      ['juan.paredes@unet.edu.ve'],                     // Aquí es a donde te llegará el correo
      replyTo: email,                                         // Si le das "Responder" en Gmail, le responderá al reclutador
      subject: `[Portafolio] Nuevo mensaje de ${name}`,
      text:    `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    })
    
    return {
      status:  'success',
      message: '¡Mensaje enviado! Te respondo en menos de 24h.',
    }
  } catch (err) {
    console.error('[sendEmail] Resend error:', err)
    return {
      status:  'error',
      message: 'Error al enviar. Inténtalo de nuevo o escríbeme a jdpgparedes@gmail.com.',
    }
  }
}