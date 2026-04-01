'use client'

import { useActionState, useEffect, useRef } from 'react'
import { motion }                         from 'framer-motion'
import { sendEmail, type ActionState }    from '@/app/actions/sendEmail'
import { staggerContainer, fadeUp, fadeUpSlow } from '@/animations/variants'
import s from './ContactSection.module.css'

// ─── Contact links data ───────────────────────────────────────────────────────

const LINKS = [
  {
    key:   'github',
    label: '"github.com/JuanD-2005"',
    href:  'https://github.com/JuanD-2005',
    display: 'github.com/JuanD-2005',
  },
  {
    key:   'linkedin',
    label: '"linkedin.com/in/juan-diego-paredes-gámez"',
    href:  'https://www.linkedin.com/in/juan-diego-paredes-g%C3%A1mez-21415338a/',
    display: 'linkedin.com/in/juan-diego-paredes-gámez',
  },
  {
    key:   'email',
    label: '"jdpgparedes@gmail.com"',
    href:  'mailto:jdpgparedes@gmail.com',
    display: 'jdpgparedes@gmail.com',
  },
] as const

// ─── Icons ───────────────────────────────────────────────────────────────────

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12.5 1.5L6 8M12.5 1.5L8.5 12.5L6 8M12.5 1.5L1.5 5.5L6 8"
        stroke="currentColor" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className={s.checkSvg} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="8" stroke="#34d399" strokeWidth="1.2" opacity="0.4"/>
      <path
        className={s.checkPath}
        d="M5.5 9L7.8 11.5L12.5 6.5"
        stroke="#34d399" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// ─── ContactForm ──────────────────────────────────────────────────────────────

const INITIAL_STATE: ActionState = {
  status:  'idle',
  message: '',
}

/**
 * ContactForm — the right column.
 *
 * Uses React 19's `useActionState` (re-exported from Next.js) to wire the
 * Server Action directly to the form. This means:
 *  - Zero client-side fetch boilerplate
 *  - Works even if JS fails to hydrate (progressive enhancement)
 *  - `isPending` state from `useFormStatus` or `useActionState`'s 3rd return
 *
 * For Next.js 14 (React 18): replace `useActionState` with `useFormState`
 * from `react-dom`. The API is identical.
 */
function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, isPending] = useActionState(sendEmail, INITIAL_STATE)

  // Clear form on successful submission AFTER render
  useEffect(() => {
    if (state.status === 'success' && formRef.current) {
      formRef.current.reset();
    }
  }, [state.status])

  return (
    <form ref={formRef} action={action} className={s.form} noValidate>

      {/* Name */}
      <div className={s.field}>
        <label htmlFor="cf-name" className={s.fieldLabel}>Nombre</label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Juan García"
          disabled={isPending}
          aria-describedby={state.errors?.name ? 'cf-name-error' : undefined}
          aria-invalid={!!state.errors?.name}
          className={s.fieldInput}
        />
        <span className={s.fieldUnderline} aria-hidden="true" />
        {state.errors?.name && (
          <span id="cf-name-error" role="alert" className={s.fieldError}>
            {state.errors.name[0]}
          </span>
        )}
      </div>

      {/* Email */}
      <div className={s.field}>
        <label htmlFor="cf-email" className={s.fieldLabel}>Email</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="juan@ejemplo.com"
          disabled={isPending}
          aria-describedby={state.errors?.email ? 'cf-email-error' : undefined}
          aria-invalid={!!state.errors?.email}
          className={s.fieldInput}
        />
        <span className={s.fieldUnderline} aria-hidden="true" />
        {state.errors?.email && (
          <span id="cf-email-error" role="alert" className={s.fieldError}>
            {state.errors.email[0]}
          </span>
        )}
      </div>

      {/* Message */}
      <div className={s.field}>
        <label htmlFor="cf-message" className={s.fieldLabel}>Mensaje</label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          placeholder="Cuéntame sobre tu proyecto…"
          disabled={isPending}
          aria-describedby={state.errors?.message ? 'cf-message-error' : undefined}
          aria-invalid={!!state.errors?.message}
          className={s.fieldTextarea}
        />
        <span className={s.fieldUnderline} aria-hidden="true" />
        {state.errors?.message && (
          <span id="cf-message-error" role="alert" className={s.fieldError}>
            {state.errors.message[0]}
          </span>
        )}
      </div>

      {/* Submit row */}
      <div className={s.submitRow}>
        <motion.button
          type="submit"
          disabled={isPending || state.status === 'success'}
          className={s.submitBtn}
          whileHover={{ scale: isPending ? 1 : 1.03 }}
          whileTap={{  scale: 0.97 }}
          transition={{ duration: 0.15 }}
          aria-label="Enviar mensaje de contacto"
        >
          <span className={s.submitBtnFill} aria-hidden="true" />

          {isPending ? (
            <>
              <span className={s.submitBtnText}>Enviando</span>
              <span className={s.spinner} aria-hidden="true" />
            </>
          ) : state.status === 'success' ? (
            <>
              <span className={s.submitBtnText}>¡Enviado!</span>
              <CheckIcon />
            </>
          ) : (
            <>
              <span className={s.submitBtnText}>Enviar mensaje</span>
              <span className={s.submitBtnIcon}>
                <SendIcon />
              </span>
            </>
          )}
        </motion.button>

        {/* Status feedback message */}
        {state.status === 'success' && (
          <p role="status" className={`${s.status} ${s['status--success']}`}>
            <CheckIcon />
            {state.message}
          </p>
        )}
        {state.status === 'error' && (
          <p role="alert" className={`${s.status} ${s['status--error']}`}>
            {state.message}
          </p>
        )}
        {state.status === 'validation_error' && (
          <p role="alert" className={`${s.status} ${s['status--error']}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  )
}

// ─── ContactSection ───────────────────────────────────────────────────────────

/**
 * ContactSection
 *
 * id="contact" — matches the href="#contact" used by Navbar, ActionSection,
 * and the "Hablemos" CTA. scrollTo('#contact') in lib/scrollTo.ts lands here.
 */
export default function ContactSection() {
  return (
    <section id="contact" aria-label="Contacto" className={s.section}>

      <div className={s.inner}>

        {/* ── Left column ──────────────────────────────────────────── */}
        <motion.div
          className={s.left}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Label */}
          <motion.p className={s.label} variants={fadeUp}>
            CONTACTO
          </motion.p>

          {/* Big headline */}
          <motion.h2 className={s.headline} variants={fadeUpSlow}>
            Construyamos<br />
            algo{' '}
            <span className={s.headlineAccent}>juntos.</span>
          </motion.h2>

          {/* JSON contact block */}
          <motion.div
            className={s.jsonBlock}
            variants={fadeUp}
            aria-label="Datos de contacto"
          >
            <div><span className={s.jsonBrace}>{'{'}</span></div>

            {LINKS.map((link, i) => (
              <div key={link.key}>
                <span className={s.jsonKey}>{link.key}</span>
                <span className={s.jsonColon}>: </span>
                <a
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={s.jsonValue}
                  aria-label={`${link.key}: ${link.display}`}
                >
                  {link.label}
                </a>
                {i < LINKS.length - 1 && (
                  <span className={s.jsonComma}>,</span>
                )}
              </div>
            ))}

            <div>
              <span className={s.jsonBrace}>{'}'}</span>
              <span className={s.jsonCursor} aria-hidden="true" />
            </div>
          </motion.div>

          {/* Availability note */}
          <motion.div className={s.availNote} variants={fadeUp}>
            <span className={s.availDot} aria-hidden="true" />
            Disponible para trabajo freelance e internacional
          </motion.div>
        </motion.div>

        {/* ── Right column (form) ──────────────────────────────────── */}
        <motion.div
          className={s.right}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <ContactForm />
        </motion.div>

      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <motion.div
        className={s.footer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <span className={s.footerName}>Juan Paredes</span>
        <span className={s.footerMeta}>
          © {new Date().getFullYear()} — Todos los derechos reservados
        </span>
        <span className={s.footerStack} aria-hidden="true">
          Next.js · GSAP · Framer Motion
        </span>
      </motion.div>

    </section>
  )
}
