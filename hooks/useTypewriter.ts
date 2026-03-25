'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { TerminalLine } from '@/types'

interface TypewriterState {
  /** Lines accumulated so far, including the one currently being typed */
  displayedLines: string[]
  /** True once every line has finished typing */
  isComplete: boolean
  /** Index of the line currently being typed */
  currentLineIndex: number
}

/**
 * Sequentially "types" an array of TerminalLines, respecting per-line speed
 * and inter-line delays. Respects `prefers-reduced-motion` by skipping straight
 * to the final state so the experience is still accessible.
 *
 * @param sequence   - Array of TerminalLine objects to type out
 * @param startDelay - Global delay (ms) before the first character appears
 */
export function useTypewriter(
  sequence: TerminalLine[],
  startDelay = 700,
): TypewriterState {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [isComplete, setIsComplete]         = useState(false)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)

  // Use a ref so the closure always sees the latest mutable state
  // without triggering re-renders on every character
  const stateRef = useRef({
    lineIdx: 0,
    charIdx: 0,
    lines:   [] as string[],
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    // ── Accessibility: skip animation for motion-sensitive users ──────────────
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplayedLines(sequence.map((l) => l.text))
      setCurrentLineIndex(sequence.length - 1)
      setIsComplete(true)
      return
    }

    const s = stateRef.current

    const tick = () => {
      const { lineIdx, charIdx } = s

      // All lines typed → done
      if (lineIdx >= sequence.length) {
        setIsComplete(true)
        return
      }

      const line      = sequence[lineIdx]
      const charSpeed = line.speed ?? 40

      // ── Start a new line ───────────────────────────────────────────────────
      if (charIdx === 0) {
        s.lines = [...s.lines, '']
        setDisplayedLines([...s.lines])
        setCurrentLineIndex(lineIdx)
      }

      if (charIdx < line.text.length) {
        // Type the next character
        s.lines[s.lines.length - 1] = line.text.slice(0, charIdx + 1)
        s.charIdx++
        setDisplayedLines([...s.lines])
        timerRef.current = setTimeout(tick, charSpeed)
      } else {
        // Line complete → advance and apply inter-line delay
        s.lineIdx++
        s.charIdx = 0
        const nextDelay = sequence[s.lineIdx]?.delay ?? 80
        timerRef.current = setTimeout(tick, nextDelay)
      }
    }

    timerRef.current = setTimeout(tick, startDelay)

    return clear
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally run once on mount

  return { displayedLines, isComplete, currentLineIndex }
}
