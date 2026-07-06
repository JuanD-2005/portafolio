"use client";

import { Suspense, useCallback, useMemo, useRef } from "react";
import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Preload,
  Bounds,
} from "@react-three/drei";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { BalatroCertificateCard } from "./BalatroCertificateCard";
import { cardFaceDims, DEFAULT_ASPECT } from "./cardGeometry";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileCertificateViewer from "./MobileCertificateViewer";
import CertificateSheet from "./CertificateSheet";
import {
  DEMO_CERTIFICATES,
  CertificateData,
  CertificateCategory,
  CATEGORY_ORDER,
  getCertificatesByCategory,
} from "../../data/certificates";

// ─── Etiquetas cortas para los chips de filtro ─────────────────────────────
// Exportado — lo reutiliza MobileCertificateViewer/CertificateSheet.
export const CATEGORY_LABEL: Record<CertificateCategory, string> = {
  "Reconocimientos y Premios": "Premios",
  "Cursos y Capacitaciones": "Cursos",
};

// El menú de filtro (pestañas TODOS/PREMIOS/CURSOS, más abajo en FilterChip)
// usa un verde fósforo fijo #00ff41 — las cartas individuales (riel, panel
// de lectura, luz 3D) usan el accentColor propio de cada certificado.

export type FilterValue = "TODOS" | CertificateCategory;

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

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2 2l10 10M12 2L2 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Iluminación — el aro (rim light) toma el acento de la carta activa ──
function CleanLights({ accent }: { accent: string }) {
  const keyRef = useRef<THREE.DirectionalLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    keyRef.current.position.set(
      Math.cos(t * 0.2) * 5,
      4,
      Math.sin(t * 0.2) * 5,
    );
  });

  return (
    <>
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight
        ref={keyRef}
        position={[5, 4, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-5, 3, -5]} intensity={1.4} color={accent} />
    </>
  );
}

// Escala de la carta y holgura entre su borde inferior y el plano de sombra.
const CARD_SCALE = 1.3;
const SHADOW_GAP = 0.15;

export function CardScene({ cert }: { cert: CertificateData }) {
  const accent = cert.accentColor ?? "#10b981";

  // Altura de cara (sin escala) reportada por la carta. Arranca en la del
  // aspecto declarado del cert → la sombra ya está bien ubicada al primer frame.
  const [faceH, setFaceH] = useState(
    () => cardFaceDims(cert.aspectRatio ?? DEFAULT_ASPECT).h,
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={42} />
      <CleanLights accent={accent} />
      <Environment preset="city" background={false} />
      <ContactShadows
        // Sigue el borde inferior de la cara escalada: un retrato (más alto)
        // baja la sombra en vez de quedar flotando sobre el plano.
        position={[0, -(faceH / 2) * CARD_SCALE - SHADOW_GAP, 0]}
        opacity={0.3}
        scale={10}
        blur={2.5}
        far={4}
        color="#000000"
      />
      {/* <Bounds> encuadra la carta a la cámara al montar y al redimensionar
          (observe). Float/tilt/hover son transforms → no disparan refit; el
          cambio de carta remonta el <Canvas> (key=active.id) → reencuadre
          limpio. margin compensa el hit-surface invisible (+0.3 > carta). */}
      <Bounds fit clip observe margin={1.15}>
        <BalatroCertificateCard
          data={cert}
          position={[0, 0, 0]}
          scale={CARD_SCALE}
          onFaceSize={setFaceH}
        />
      </Bounds>
      <Preload all />
    </>
  );
}

// ─── Chip de filtro — exportado, lo reutiliza CertificateSheet ─────────────
export function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border transition-colors duration-150 ${
        active
          ? "bg-[#00ff41] border-[#00ff41] text-zinc-900 font-bold"
          : "border-white/10 text-zinc-500 hover:text-zinc-200 hover:border-white/25"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Tarjeta de certificado — riel horizontal en desktop (layout="rail"),
// grilla de 2 columnas en la hoja inferior mobile (layout="grid"). Mismo
// componente, mismo look; solo el ancho cambia según dónde vive. ──────────
export function CertificateCard({
  cert,
  index,
  active,
  reduceMotion,
  onSelect,
  layout = "rail",
}: {
  cert: CertificateData;
  index: number;
  active: boolean;
  reduceMotion: boolean;
  onSelect: () => void;
  layout?: "rail" | "grid";
}) {
  const accent = cert.accentColor ?? "#10b981";

  return (
    <motion.button
      type="button"
      layout
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.3,
        delay: reduceMotion ? 0 : index * 0.035,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      onClick={onSelect}
      aria-current={active}
      className={`relative text-left rounded-lg border overflow-hidden px-3.5 pt-3.5 pb-4 transition-colors duration-200 ${
        layout === "rail" ? "shrink-0 w-[128px]" : "w-full"
      }`}
      style={{
        borderColor: active ? accent : "rgba(255,255,255,0.09)",
        background: "#0d0d0d",
        boxShadow: active
          ? `0 12px 30px -12px ${accent}99, 0 0 20px -6px ${accent}80`
          : "none",
      }}
    >
      <span
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-lg"
        style={{ background: accent, opacity: active ? 0.9 : 0.35 }}
        aria-hidden="true"
      />
      <span
        className="block text-[9px] font-mono tracking-[0.16em] uppercase mt-2"
        style={{ color: accent }}
      >
        {CATEGORY_LABEL[cert.category] ?? cert.category}
      </span>
      <span className="block font-diploma text-[17px] leading-[1.05] text-zinc-100 mt-2 line-clamp-2">
        {cert.title}
      </span>
      <span className="block text-[9px] font-mono tracking-[0.08em] uppercase text-zinc-500 mt-1.5 truncate">
        {cert.issuer}
      </span>
    </motion.button>
  );
}

// ─── Componente principal ───────────────────────────────────────────────────
export function CertificateGallery({ onClose }: { onClose?: () => void }) {
  const grouped = getCertificatesByCategory();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [filter, setFilter] = useState<FilterValue>("TODOS");
  const [activeId, setActiveId] = useState<string>(DEMO_CERTIFICATES[0].id);
  const [sheetOpen, setSheetOpen] = useState(false);

  const visible = useMemo(
    () => (filter === "TODOS" ? DEMO_CERTIFICATES : (grouped.get(filter) ?? [])),
    [filter, grouped],
  );

  const active = useMemo(
    () => visible.find((c) => c.id === activeId) ?? visible[0] ?? DEMO_CERTIFICATES[0],
    [visible, activeId],
  );

  const handleFilter = useCallback(
    (value: FilterValue) => {
      setFilter(value);
      setActiveId((prev) => {
        const nextVisible =
          value === "TODOS" ? DEMO_CERTIFICATES : (grouped.get(value as CertificateCategory) ?? []);
        return nextVisible.some((c) => c.id === prev) ? prev : (nextVisible[0]?.id ?? prev);
      });
    },
    [grouped],
  );

  const accent = active.accentColor ?? "#10b981";

  // ── Rama mobile: certificado a la vez + swipe + hoja de selección.
  // Completamente separada del árbol desktop de abajo — cero riesgo de
  // que un cambio aquí afecte el layout de escritorio. El índice activo
  // (activeId) es el mismo estado que ya existe arriba; el carrusel mobile
  // y la hoja inferior solo lo leen/escriben, no duplican la fuente de
  // verdad — igual que el riel de desktop hace con setActiveId. ───────────
  if (isMobile) {
    return (
      <div className="relative w-full flex flex-col text-zinc-200">
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-50"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.22) 3px)",
            mixBlendMode: "multiply",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 shrink-0">
            <span className="text-[11px] font-mono text-zinc-500">~/logros</span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar salón de trofeos"
                className="ml-auto grid place-items-center w-8 h-8 rounded-full border border-white/10 text-zinc-500 hover:text-zinc-200 hover:border-white/25 active:scale-[0.93] transition-all duration-150"
              >
                <IconClose />
              </button>
            )}
          </div>

          <MobileCertificateViewer
            certificates={DEMO_CERTIFICATES}
            activeId={active.id}
            onActiveChange={setActiveId}
            onOpenSheet={() => setSheetOpen(true)}
          />
        </div>

        <CertificateSheet
          open={sheetOpen}
          activeId={active.id}
          onSelect={setActiveId}
          onClose={() => setSheetOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col text-zinc-200">
      {/* CRT scanline texture — sits behind all content, echoes HeroCRT */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.22) 3px)",
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col">
        {/* ── Cabecera: nombre + filtros + cierre, una sola fila ── */}
        <div className="order-1 flex items-center gap-x-5 gap-y-3 px-6 py-4 border-b border-white/10 flex-wrap shrink-0">
          <h1 className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-zinc-500 whitespace-nowrap">
            Logros y Certificaciones
          </h1>
          <div className="flex gap-2 flex-wrap ml-auto">
            <FilterChip
              label="Todos"
              active={filter === "TODOS"}
              onClick={() => handleFilter("TODOS")}
            />
            {CATEGORY_ORDER.map((cat) => (
              <FilterChip
                key={cat}
                label={CATEGORY_LABEL[cat] ?? cat}
                active={filter === cat}
                onClick={() => handleFilter(cat)}
              />
            ))}
          </div>
          {onClose && (
            <span className="hidden sm:block w-px h-5 bg-white/10" aria-hidden="true" />
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar salón de trofeos"
              className="grid place-items-center w-[2.1rem] h-[2.1rem] rounded-full border border-white/10 text-zinc-500 hover:text-zinc-200 hover:border-white/25 active:scale-[0.93] transition-all duration-150"
            >
              <IconClose />
            </button>
          )}
        </div>

        {/* ── Escenario 3D | Lectura de terminal — columnas hermanas, nunca se tapan ──
             En mobile va DESPUÉS del riel (order-3): el riel es la navegación entre
             certificados y no debería quedar al final de un scroll largo. Desktop
             no cambia (order-2, su posición natural de siempre). */}
        <div className="order-3 lg:order-2 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          {/* Escenario anclado al aspecto de la carta (17/12 ≈ 1.417) — la fila
              se auto-dimensiona, sin negro sobrante ni alto fijo */}
          <div className="relative min-h-[340px] lg:min-h-0 lg:aspect-[17/12] border-b lg:border-b-0 lg:border-r border-white/10">
            <div
              className="absolute inset-0 transition-colors duration-500"
              style={{
                background: `radial-gradient(60% 55% at 50% 45%, ${accent}14, transparent 70%)`,
              }}
              aria-hidden="true"
            />
            <Canvas
              key={active.id}
              shadows
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <CardScene cert={active} />
              </Suspense>
            </Canvas>
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                Clic en la carta para <span style={{ color: accent }}>girar</span>
              </p>
            </div>
          </div>

          {/* Lectura de terminal — reemplaza la ficha flotante que tapaba la carta */}
          <div className="relative overflow-y-auto p-6 lg:p-8 flex flex-col justify-center gap-4">
            <p className="text-[11px] font-mono" style={{ color: accent }}>
              &gt; trofeo --inspect
              <span
                className="inline-block w-[6px] h-[1em] ml-1 align-middle animate-pulse"
                style={{ background: accent }}
                aria-hidden="true"
              />
            </p>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                <div className="text-[10px] font-mono leading-relaxed text-zinc-600">
                  <span className="text-zinc-700">├─ id:</span>{" "}
                  <span className="text-zinc-400">{active.id}</span>
                  <br />
                  <span className="text-zinc-700">└─ emisor:</span>{" "}
                  <span className="text-zinc-400">{active.issuer}</span>
                </div>

                <h2 className="font-diploma text-[2.4rem] leading-[1] text-zinc-100 mt-0.5">
                  {active.title}
                </h2>

                <p className="text-sm leading-relaxed text-zinc-400">
                  {active.description}
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-zinc-800" />
                  <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-zinc-500">
                    {active.date}
                  </p>
                </div>

                {active.verifyUrl && (
                  <a
                    href={active.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group self-start mt-1 inline-flex w-max items-center gap-2 px-5 py-3 text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-900 transition-transform hover:scale-[1.03] active:scale-[0.97] rounded-sm"
                    style={{ backgroundColor: accent }}
                  >
                    Verificar Credencial
                    <IconLink />
                  </a>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Riel de cartas: ES la navegación, no un sidebar aparte ──
             En mobile va justo después del header (order-2) — es como se navega
             entre certificados, no debería estar al final de un scroll largo.
             Desktop no cambia (order-3, al final, como siempre). El borde se
             voltea de arriba a abajo para separar del bloque que ahora sigue. */}
        <div className="order-2 lg:order-3 shrink-0 border-b lg:border-b-0 lg:border-t border-white/10 px-6 py-4 flex gap-3 overflow-x-auto">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((cert, i) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                index={i}
                active={cert.id === active.id}
                reduceMotion={!!shouldReduceMotion}
                onSelect={() => setActiveId(cert.id)}
                layout="rail"
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default CertificateGallery;
