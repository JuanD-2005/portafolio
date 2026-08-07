'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

// NOTA DE NOMBRE: el nombre pedido era `useTypewriter`, pero ese nombre ya
// existe en hooks/useTypewriter.ts — un hook DISTINTO (tipea una secuencia
// de TerminalLine[] una sola vez al montar, para el boot del Hero). Está
// huérfano hoy (nadie lo importa; useSystemFace tiene su propio setInterval
// independiente), pero no es de esta sección y no lo toco. Este hook nuevo
// vive aparte con otro nombre para no pisarlo ni heredar su forma.

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}
function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
function getReducedMotionServerSnapshot() {
  return false
}

/**
 * Tipea `text` carácter a carácter cada `speedMs`. Reinicia desde cero cada
 * vez que `text` cambia — no acumula ni pega textos distintos, útil para un
 * panel de preview donde el texto entero se reemplaza (no se le agrega).
 * Bajo prefers-reduced-motion devuelve el texto completo de inmediato.
 *
 * Extraído de `useReactiveFace.say()` (misma técnica: setInterval + slice
 * progresivo), sin la lógica de cara/idle/blink/revert que trae ese hook
 * para el personaje JP-OS — esto es solo la técnica de revelado de texto.
 */
export function useTypeReveal(text: string, speedMs = 20): string {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
  const [typed, setTyped] = useState('')
  // Snapshot del render anterior — reinicia `typed` a '' durante el render
  // mismo cuando `text` cambió, en vez de un setState síncrono al inicio
  // del efecto (mismo patrón usado en ProjectCatalog para `focusedIndex`).
  const [prevText, setPrevText] = useState(text)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  if (text !== prevText) {
    setPrevText(text)
    setTyped('')
  }

  useEffect(() => {
    // Reducido: no hay nada que animar, se devuelve `text` directo abajo
    // (sin tocar `typed`) — evita un setState síncrono dentro del efecto.
    if (reduced) return
    if (timer.current) clearInterval(timer.current)

    let i = 0
    timer.current = setInterval(() => {
      i += 1
      setTyped(text.slice(0, i))
      if (i >= text.length && timer.current) clearInterval(timer.current)
    }, speedMs)

    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [text, speedMs, reduced])

  return reduced ? text : typed
}
