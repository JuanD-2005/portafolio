'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Media query genérica — mismo mecanismo que useIsMobile (768px fijo, para
 * el resto del sitio), pero con el query como parámetro para features con
 * un umbral propio. `serverSnapshot` decide qué rama renderiza el server
 * (y el primer paint antes de hidratar) — pásalo en `true` cuando la rama
 * "true" sea la que debe indexarse (todo el texto visible), igual que
 * useIsMobile lo hace fijo para su propio caso.
 */
export function useMediaQuery(query: string, serverSnapshot = false): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', callback)
      return () => mq.removeEventListener('change', callback)
    },
    [query],
  )
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
