"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/* Vocabulario de expresiones del personaje del sistema (kaomojis). */
const FACE = {
  sleep: "( - v - )", // dormido / parpadeo
  wake: "( O _ O )", // despierta sorprendido
  talkClosed: "( ^ _ ^ )", // hablando · boca cerrada
  talkOpen: "( ^ O ^ )", // hablando · boca abierta
  happy: "( ^ v ^ )", // reposo entre líneas
  leaving: "( ; _ ; )/", // el usuario se va (scroll ↓)
  back: "( O _ O )", // el usuario vuelve (scroll ↑)
} as const;

type Phase = "loading" | "wake" | "speaking";
type Reaction = "leaving" | "returning" | null;

const LOADER_MS = 1500;
const WAKE_MS = 500;
const TYPE_MS = 42; // velocidad del typewriter
const MOUTH_MS = 150; // lip-sync
const HOLD_MS = 1600; // pausa entre líneas (la línea queda legible aquí)
const BLINK_MS = 150;

interface Options {
  lines: string[];
  farewell: string;
}

interface SystemFaceState {
  face: string;
  text: string;
  phase: Phase;
  reducedMotion: boolean;
  /** Conéctalo al onUpdate del ScrollTrigger: react(self.direction). */
  react: (direction: number) => void;
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

export function useSystemFace({ lines, farewell }: Options): SystemFaceState {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [phase, setPhase] = useState<Phase>("loading");
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(true);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [blink, setBlink] = useState(false);
  const [reaction, setReaction] = useState<Reaction>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Fase 1 — carga → despierta. Bajo reduced-motion la máquina de fases no
     corre: `effectivePhase` (más abajo) expone 'speaking' directamente. */
  useEffect(() => {
    if (reduced) return;
    if (phase !== "loading") return;
    const t = setTimeout(() => setPhase("wake"), LOADER_MS);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  /* Beat de sorpresa antes de hablar. */
  useEffect(() => {
    if (phase !== "wake") return;
    const t = setTimeout(() => {
      setLineIndex(0);
      setTyped("");
      setTyping(true);
      setPhase("speaking");
    }, WAKE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  /* Habla: teclea la línea actual + lip-sync. */
  useEffect(() => {
    if (reduced || reaction !== null) return;
    if (phase !== "speaking" || !typing) return;
    const full = lines[lineIndex] ?? "";
    let i = 0;
    // `typed` ya llega en '' aquí: lo dejan así los efectos que disparan
    // esta fase (wake → speaking, o el avance de línea más abajo).
    const typer = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(typer);
        clearInterval(mouth);
        setMouthOpen(false);
        setTyping(false);
      }
    }, TYPE_MS);
    const mouth = setInterval(() => setMouthOpen((o) => !o), MOUTH_MS);
    return () => {
      clearInterval(typer);
      clearInterval(mouth);
    };
  }, [phase, typing, lineIndex, reduced, reaction, lines]);

  /* Pausa entre líneas (con un parpadeo) y avanza en bucle. */
  useEffect(() => {
    if (reduced || reaction !== null) return;
    if (phase !== "speaking" || typing) return;
    const blinkT = setTimeout(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), BLINK_MS);
    }, HOLD_MS / 2);
    const nextT = setTimeout(() => {
      setLineIndex((idx) => (idx + 1) % lines.length);
      setTyped("");
      setTyping(true);
    }, HOLD_MS);
    return () => {
      clearTimeout(blinkT);
      clearTimeout(nextT);
    };
  }, [phase, typing, reduced, reaction, lines.length]);

  /* Reacción al scroll: se va → despedida; vuelve → sorpresa. */
  const react = useCallback(
    (direction: number) => {
      if (reduced) return;
      if (direction > 0) {
        setReaction("leaving");
        setTyped(farewell);
      } else if (direction < 0) {
        setReaction("returning");
      } else {
        return;
      }
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
      reactionTimer.current = setTimeout(
        () => {
          // Limpiamos `typed` aquí (no en el efecto de tecleo) para que al
          // reanudar el habla no se vea un frame con el texto del farewell
          // o de la línea interrumpida antes de que el typer la retome.
          setReaction(null);
          setTyped("");
        },
        direction > 0 ? 900 : 500,
      );
    },
    [reduced, farewell],
  );

  useEffect(
    () => () => {
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
    },
    [],
  );

  const resolveFace = (): string => {
    if (reaction === "leaving") return FACE.leaving;
    if (reaction === "returning") return FACE.back;
    if (blink) return FACE.sleep;
    if (reduced) return FACE.happy;
    if (phase === "loading") return FACE.sleep;
    if (phase === "wake") return FACE.wake;
    if (typing) return mouthOpen ? FACE.talkOpen : FACE.talkClosed;
    return FACE.happy;
  };

  // Bajo reduced-motion la máquina de fases se queda en 'loading' (nunca
  // se dispara el efecto de arriba); hacia afuera exponemos 'speaking'
  // directamente para que el consumidor (ej. la clase .hintVisible) lo vea.
  const effectivePhase: Phase = reduced ? "speaking" : phase;

  return {
    face: resolveFace(),
    text: reduced ? "" : typed,
    phase: effectivePhase,
    reducedMotion: reduced,
    react,
  };
}
