'use client'

/**
 * ClientOnly
 *
 * Prevents SSR for children that depend on browser APIs
 * (window dimensions, GSAP, etc.). Renders null on the server,
 * then mounts the children on the first client render.
 *
 * Usage:
 *   <ClientOnly>
 *     <SomeGSAPComponent />
 *   </ClientOnly>
 *
 * Note: HeroCRT already uses 'use client' and useLayoutEffect,
 * so it generally doesn't need this wrapper — but it's here as
 * a safety net for edge-cases (e.g. strict mode double-invoke).
 */

import { useEffect, useState, type ReactNode } from 'react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientOnly({
  children,
  fallback = null,
}: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <>{children}</> : <>{fallback}</>
}
