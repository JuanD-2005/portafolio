'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const IDLE_FACE = '( ^ v ^ )'
const BLINK_FACE = '( - _ - )'
const BLINK_MS = 150
const TYPE_MS = 20

interface ReactiveFace {
  face: string
  text: string
  /** Texto completo para un lector de pantalla — se anuncia una vez, no letra a letra. */
  srText: string
  /** Dispara una reacción con typewriter. Si se pasa revertAfterMs, vuelve sola a idle. */
  say: (face: string, text: string, revertAfterMs?: number) => void
  /** Vuelve a idle de inmediato — para hover/blur, donde tú controlas el momento. */
  reset: () => void
}

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
 * Compañero puramente reactivo: no tiene bucle propio ni fases de arranque
 * (eso es useSystemFace, del hero). Vive en reposo con parpadeo aleatorio y
 * solo habla cuando algo externo llama a say().
 */
export function useReactiveFace(): ReactiveFace {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )
  const [face, setFace] = useState(IDLE_FACE)
  const [text, setText] = useState('')
  const [srText, setSrText] = useState('')

  const typeTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleRef = useRef(true)

  const reset = () => {
    if (typeTimer.current) clearInterval(typeTimer.current)
    if (revertTimer.current) clearTimeout(revertTimer.current)
    idleRef.current = true
    setFace(IDLE_FACE)
    setText('')
    setSrText('')
  }

  const say = (nextFace: string, full: string, revertAfterMs?: number) => {
    if (typeTimer.current) clearInterval(typeTimer.current)
    if (revertTimer.current) clearTimeout(revertTimer.current)
    idleRef.current = false
    setFace(nextFace)
    setSrText(full)

    if (reduced) {
      setText(full)
    } else {
      let i = 0
      setText('')
      typeTimer.current = setInterval(() => {
        i += 1
        setText(full.slice(0, i))
        if (i >= full.length && typeTimer.current) clearInterval(typeTimer.current)
      }, TYPE_MS)
    }

    if (revertAfterMs) {
      revertTimer.current = setTimeout(reset, revertAfterMs)
    }
  }

  // Parpadeo aleatorio, solo mientras está en reposo (no interrumpe una reacción activa).
  useEffect(() => {
    if (reduced) return
    let blinkT: ReturnType<typeof setTimeout>
    let unblinkT: ReturnType<typeof setTimeout>
    const schedule = () => {
      const delay = 3000 + Math.random() * 3000
      blinkT = setTimeout(() => {
        if (idleRef.current) {
          setFace(BLINK_FACE)
          unblinkT = setTimeout(() => {
            if (idleRef.current) setFace(IDLE_FACE)
            schedule()
          }, BLINK_MS)
        } else {
          schedule()
        }
      }, delay)
    }
    schedule()
    return () => {
      clearTimeout(blinkT)
      clearTimeout(unblinkT)
    }
  }, [reduced])

  useEffect(
    () => () => {
      if (typeTimer.current) clearInterval(typeTimer.current)
      if (revertTimer.current) clearTimeout(revertTimer.current)
    },
    [],
  )

  return { face, text, srText, say, reset }
}

interface HoverHandlers {
  onMouseEnter: () => void
  onMouseLeave: () => void
  onFocus: () => void
  onBlur: () => void
}

/**
 * Envuelve say()/reset() para elementos "de paso" (stats, pills, contacto):
 * al entrar habla, al salir vuelve a idle con un pequeño debounce para que
 * moverse entre elementos vecinos no genere parpadeo de mensajes.
 *
 * Para elementos con estado propio (el botón de CV, que además abre un menú)
 * no uses esto — manéjalo a mano para poder respetar ese estado.
 */
export function useHoverReactions(say: ReactiveFace['say'], reset: ReactiveFace['reset']) {
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    },
    [],
  )

  return (face: string, text: string): HoverHandlers => ({
    onMouseEnter: () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
      say(face, text)
    },
    onMouseLeave: () => {
      leaveTimer.current = setTimeout(reset, 200)
    },
    onFocus: () => say(face, text),
    onBlur: reset,
  })
}
