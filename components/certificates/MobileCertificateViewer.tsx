"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CardScene, CATEGORY_LABEL } from "./CertificateGallery";
import { CertificateData } from "../../data/certificates";
import { DEFAULT_ASPECT } from "./cardGeometry";

// ─── Íconos ─────────────────────────────────────────────────────────────────
const IconLink = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      d="M1 9L9 1M9 1H3M9 1V7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconGrid = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

// ─── Guarda de touch: el tilt de la carta (onPointerMove en
// BalatroCertificateCard) usa Pointer Events, que SÍ disparan con touch.
// Sin esto, arrastrar el dedo para deslizar entre certificados también
// inclinaría la carta 3D, compitiendo con el swipe de Embla. No podemos
// tocar BalatroCertificateCard.tsx (migración GSAP ya cerrada), así que
// interceptamos en la fase de CAPTURA desde este wrapper: solo cuando el
// movimiento supera un umbral (~8px, mismo espíritu que el dragThreshold
// interno de Embla) cortamos la propagación hacia el Canvas — un tap corto
// (flip) nunca llega a moverse lo suficiente y pasa intacto. ────────────────
const DRAG_THRESHOLD = 8;

function CanvasStage({ cert }: { cert: CertificateData }) {
  const dragRef = useRef({ down: false, startX: 0, startY: 0, dragging: false });

  const onPointerDownCapture = useCallback((e: React.PointerEvent) => {
    dragRef.current = { down: true, startX: e.clientX, startY: e.clientY, dragging: false };
  }, []);

  const onPointerMoveCapture = useCallback((e: React.PointerEvent) => {
    const st = dragRef.current;
    if (!st.down) return;
    if (!st.dragging) {
      const dx = e.clientX - st.startX;
      const dy = e.clientY - st.startY;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) st.dragging = true;
    }
    if (st.dragging) e.stopPropagation();
  }, []);

  const onPointerUpCapture = useCallback((e: React.PointerEvent) => {
    if (dragRef.current.dragging) e.stopPropagation();
    dragRef.current.down = false;
    dragRef.current.dragging = false;
  }, []);

  return (
    <div
      className="absolute inset-0"
      onPointerDownCapture={onPointerDownCapture}
      onPointerMoveCapture={onPointerMoveCapture}
      onPointerUpCapture={onPointerUpCapture}
    >
      <Canvas key={cert.id} shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <CardScene cert={cert} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ─── Placeholder 2D — lo que asoma en el peek para los slides vecinos.
// Deliberadamente neutro (sin accentColor): el peek ya lleva máscara de
// desvanecimiento, así que cualquier color aquí competiría sin necesidad.
// Sin aspectRatio propio: el contenedor (más abajo) ya fija un aspecto
// constante para los 13 slides — ver nota junto a SLIDE_ASPECT. ───────────
function PlaceholderCard({ cert }: { cert: CertificateData }) {
  return (
    <div
      className="w-full h-full rounded-lg border border-white/[0.06] bg-[#0a0a0a] flex items-end p-3"
      aria-hidden="true"
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-zinc-700 line-clamp-1">
        {cert.title}
      </span>
    </div>
  );
}

// El escenario de desktop usa un aspecto FIJO (17/12, ≈ DEFAULT_ASPECT) para
// los 13 certificados por igual — <Bounds fit clip> ya se encarga de encajar
// cada carta (tenga el aspecto real que tenga) dentro de esa caja constante,
// sin dejar espacio muerto. Antes, este visor mobile calculaba un aspecto
// DISTINTO por certificado (`clampAspect(cert.aspectRatio)`) para cada slide
// — y como los 13 conviven en una misma fila flex sin altura fija, la fila
// terminaba estirándose a la altura del hermano MÁS ALTO (un certificado
// vertical, medido en 351px) aunque ese hermano solo estuviera asomando
// fuera de vista. La carta activa (167px) quedaba con ~183px de vacío
// debajo, antes del hint — confirmado midiendo el DOM, no a ojo. Reusar el
// mismo aspecto fijo que desktop elimina la causa de raíz: los 13 slides
// miden lo mismo, así que ningún vecino invisible puede inflar la fila.
const SLIDE_ASPECT = DEFAULT_ASPECT;

interface MobileCertificateViewerProps {
  certificates: CertificateData[];
  activeId: string;
  onActiveChange: (id: string) => void;
  onOpenSheet: () => void;
}

export default function MobileCertificateViewer({
  certificates,
  activeId,
  onActiveChange,
  onOpenSheet,
}: MobileCertificateViewerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    duration: reducedMotion ? 0 : 25,
  });
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.max(0, certificates.findIndex((c) => c.id === activeId)),
  );

  // certificates/onActiveChange son nuevas referencias en cada render del
  // padre — leerlas desde un ref evita reinicializar el listener de Embla
  // (mismo patrón que ActionCarousel).
  const certificatesRef = useRef(certificates);
  useEffect(() => {
    certificatesRef.current = certificates;
  });
  const onActiveChangeRef = useRef(onActiveChange);
  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  });

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
      const cert = certificatesRef.current[index];
      if (cert) onActiveChangeRef.current(cert.id);
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Si activeId cambia por fuera (la hoja inferior eligió un certificado),
  // Embla debe saltar ahí — no llamamos setSelectedIndex aquí: scrollTo()
  // dispara el 'select' de Embla, que ya lo actualiza en el efecto de
  // arriba. Un solo índice de verdad, un solo lugar que lo escribe.
  useEffect(() => {
    if (!emblaApi) return;
    const idx = certificates.findIndex((c) => c.id === activeId);
    if (idx >= 0 && idx !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const active = certificates[selectedIndex] ?? certificates[0];
  const accent = active.accentColor ?? "#10b981";
  const total = certificates.length;

  // El hint alterna "tocar para girar" / "deslizar para más" cada 3s — con
  // reduced motion no ciclamos (queda fijo en el primero), en vez de
  // forzar un cambio de contenido sin la transición que lo hace legible.
  const [hintIndex, setHintIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setHintIndex((i) => (i === 0 ? 1 : 0)), 3000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      {/* ── Carta activa + peek difuminado (mismo tratamiento que el
          carrusel de ActionSection: ~8% de asomo, mask-image en los
          bordes) ──────────────────────────────────────────────────────── */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        }}
        ref={emblaRef}
      >
        <div className="flex gap-3">
          {certificates.map((cert, i) => (
            <div key={cert.id} className="relative" style={{ flex: "0 0 92%", minWidth: 0 }}>
              <div
                className="relative w-full rounded-lg overflow-hidden"
                style={{ aspectRatio: SLIDE_ASPECT }}
              >
                {i === selectedIndex ? <CanvasStage cert={cert} /> : <PlaceholderCard cert={cert} />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {hintIndex === 0 ? (
          <motion.p
            key="hint-flip"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.35 }}
            className="text-center text-[10px] font-mono tracking-widest uppercase text-zinc-500 -mt-3"
          >
            Toca la carta para <span style={{ color: accent }}>girar</span>
          </motion.p>
        ) : (
          <motion.p
            key="hint-swipe"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.35 }}
            className="text-center text-[10px] font-mono tracking-widest uppercase text-zinc-500 -mt-3"
          >
            Desliza para ver más <span style={{ color: accent }}>certificados</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Ficha de lectura del certificado activo ─────────────────────── */}
      <div className="flex flex-col gap-3">
        <span
          className="inline-block w-max text-[9px] font-mono tracking-[0.16em] uppercase px-2.5 py-1 rounded-full border"
          style={{ color: accent, borderColor: `${accent}40` }}
        >
          {CATEGORY_LABEL[active.category] ?? active.category}
        </span>

        <h2 className="font-diploma text-[1.9rem] leading-[1.05] text-zinc-100">{active.title}</h2>

        <p className="text-[10px] font-mono" style={{ color: accent }}>
          &gt; trofeo --inspect
          <span
            className="inline-block w-[6px] h-[1em] ml-1 align-middle animate-pulse"
            style={{ background: accent }}
            aria-hidden="true"
          />
        </p>
        <div className="text-[10px] font-mono leading-relaxed text-zinc-600">
          <span className="text-zinc-700">├─ id:</span> <span className="text-zinc-400">{active.id}</span>
          <br />
          <span className="text-zinc-700">└─ emisor:</span>{" "}
          <span className="text-zinc-400">{active.issuer}</span>
        </div>

        <p className="text-sm leading-relaxed text-zinc-400">{active.description}</p>

        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-zinc-800" />
          <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500">{active.date}</p>
        </div>

        {active.verifyUrl && (
          <a
            href={active.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start mt-1 inline-flex w-max items-center gap-2 px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-900 rounded-sm active:scale-[0.97] transition-transform"
            style={{ backgroundColor: accent }}
          >
            Verificar Credencial
            <IconLink />
          </a>
        )}
      </div>

      {/* ── Navegación: mismo índice que el swipe ───────────────────────── */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Certificado anterior"
          className="grid place-items-center w-9 h-9 rounded-md border border-white/10 text-zinc-500 hover:text-zinc-200 hover:border-white/25 active:scale-[0.93] transition-all"
        >
          ‹
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" aria-hidden="true">
            {certificates.map((cert, i) => (
              <span
                key={cert.id}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ background: i === selectedIndex ? "#00ff41" : "rgba(255,255,255,0.15)" }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
            {String(selectedIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Siguiente certificado"
          className="grid place-items-center w-9 h-9 rounded-md border border-white/10 text-zinc-500 hover:text-zinc-200 hover:border-white/25 active:scale-[0.93] transition-all"
        >
          ›
        </button>
      </div>

      {/* ── Abre la hoja de selección rápida ─────────────────────────────── */}
      <button
        type="button"
        onClick={onOpenSheet}
        className="flex items-center justify-center gap-2 py-3 rounded-lg border border-white/10 text-zinc-400 text-[11px] font-mono uppercase tracking-[0.1em] hover:text-zinc-200 hover:border-white/25 active:scale-[0.98] transition-all"
      >
        <IconGrid />
        Elegir certificado
      </button>
    </div>
  );
}
