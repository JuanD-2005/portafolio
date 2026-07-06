'use client'

import { useSyncExternalStore } from 'react'

const MOBILE_QUERY = '(max-width: 768px)'

function subscribe(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches
}

// El server (y el primer paint del cliente, antes de hidratar) siempre
// renderiza la rama desktop — es la versión con todo el texto visible que
// se indexa para SEO, y evita un salto grid→carrusel: useSyncExternalStore
// ya maneja el guard de hidratación solo, sin un booleano `mounted` aparte.
function getServerSnapshot() {
  return false
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
