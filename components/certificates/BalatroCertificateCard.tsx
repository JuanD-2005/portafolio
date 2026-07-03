"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useSpring, useMotionValue, useTransform } from "framer-motion";
import * as THREE from "three";
import { CertificateData } from "../../data/certificates";
import { useCertificateTextures } from "./certificateTexture";
import { cardFaceDims, CARD_DEPTH } from "./cardGeometry";

// ─── Props ────────────────────────────────────────────────────────────────────

interface BalatroCertificateCardProps {
  data: CertificateData;
  position?: [number, number, number];
  scale?: number;
  /** Reporta la altura de cara (sin escala) para posicionar la sombra arriba. */
  onFaceSize?: (h: number) => void;
}

// Las dimensiones de la cara ya NO son constantes de módulo: se derivan por
// instancia del aspecto del escaneo (cardFaceDims). Solo el grosor (CARD_DEPTH)
// es común a todas las cartas.

// ─── Holographic foil overlay ─────────────────────────────────────────────────
// A blended iridescent plane that floats 1mm above the front face.
// iridescenceIOR and iridescenceThicknessRange are driven by sinusoids
// with different frequencies so the rainbow never loops predictably.

function HolographicOverlay({
  flipped,
  accentColor,
  w,
  h,
}: {
  flipped: boolean;
  accentColor: string;
  w: number;
  h: number;
}) {
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null!);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime();

    matRef.current.iridescenceIOR = 1.3 + Math.sin(t * 0.6) * 0.4;

    // iridescenceThicknessRange is not in the R3F prop types but IS valid on
    // the underlying THREE object — cast to avoid TS complaints.
    (matRef.current as any).iridescenceThicknessRange = [
      100 + Math.sin(t * 0.4) * 80,
      400 + Math.cos(t * 0.5) * 120,
    ];

    // Fade out completely when the back face is visible so the glow
    // doesn't bleed through during the flip.
    matRef.current.opacity = flipped
      ? 0
      : 0.18 + Math.abs(Math.sin(t * 0.7)) * 0.12;
  });

  return (
    <mesh position={[0, 0, CARD_DEPTH / 2 + 0.001]}>
      <planeGeometry args={[w, h]} />
      <meshPhysicalMaterial
        ref={matRef}
        transparent
        opacity={0.2}
        roughness={0.05}
        metalness={0}
        iridescence={1}
        iridescenceIOR={1.5}
        iridescenceThicknessRange={[100, 400]}
        clearcoat={1}
        clearcoatRoughness={0.05}
        side={THREE.FrontSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={accentColor}
      />
    </mesh>
  );
}

// ─── Main card component ──────────────────────────────────────────────────────

export function BalatroCertificateCard({
  data,
  position = [0, 0, 0],
  scale = 1,
  onFaceSize,
}: BalatroCertificateCardProps) {
  // Front/back are the REAL scans framed on a canvas (see certificateTexture.ts),
  // not the raw images mapped onto the box. The -Z back-face mirror correction
  // lives inside the hook. The 3rd value is the measured aspect (w/h).
  const [frontTex, backTex, aspect] = useCertificateTextures(data);

  // La FORMA de la carta la define su escaneo (fuente única: cardGeometry), así
  // un retrato se ve retrato y un apaisado apaisado — sin letterbox.
  const { w: CARD_W, h: CARD_H } = cardFaceDims(aspect);
  const CARD_D = CARD_DEPTH;

  // Sube la altura de cara (sin escala) a la escena para que la sombra siga al
  // borde inferior de un retrato en vez de quedar el retrato flotando.
  useEffect(() => {
    onFaceSize?.(CARD_H);
  }, [CARD_H, onFaceSize]);

  // ── Flip ─────────────────────────────────────────────────────────────────
  const [flipped, setFlipped] = useState(false);

  const flipAngle = useMotionValue(0);
  const flipSpring = useSpring(flipAngle, {
    stiffness: 200,
    damping: 22,
    mass: 1.2,
  });

  const handleClick = useCallback(() => {
    setFlipped((prev) => {
      const next = !prev;
      flipAngle.set(next ? Math.PI : 0);
      return next;
    });
  }, [flipAngle]);

  // ── Tilt / parallax ───────────────────────────────────────────────────────
  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);

  const tiltX = useSpring(rawTiltX, { stiffness: 120, damping: 18, mass: 0.8 });
  const tiltY = useSpring(rawTiltY, { stiffness: 120, damping: 18, mass: 0.8 });

  // Framer Motion v11 derived value syntax — no array form needed.
  const combinedRotY = useTransform(() => flipSpring.get() + tiltY.get());

  // ── Hover scale ───────────────────────────────────────────────────────────
  const scaleSpring = useSpring(scale, {
    stiffness: 300,
    damping: 20,
    mass: 0.9,
  });

  // ── Breathe / float ───────────────────────────────────────────────────────
  const floatY = useMotionValue(position[1]);

  useFrame(({ clock }) => {
    floatY.set(
      flipped
        ? position[1]
        : position[1] + Math.sin(clock.getElapsedTime() * 0.9) * 0.04,
    );
  });

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const handlePointerEnter = useCallback(() => {
    scaleSpring.set(scale * 1.07);
  }, [scale, scaleSpring]);

  const handlePointerLeave = useCallback(() => {
    scaleSpring.set(scale);
    rawTiltX.set(0);
    rawTiltY.set(0);
  }, [scale, scaleSpring, rawTiltX, rawTiltY]);

  const handlePointerMove = useCallback(
    (e: { point: THREE.Vector3 }) => {
      if (flipped) return;
      const lx = THREE.MathUtils.clamp(
        (e.point.x - position[0]) / (CARD_W * 0.5 * scale),
        -1,
        1,
      );
      const ly = THREE.MathUtils.clamp(
        (e.point.y - position[1]) / (CARD_H * 0.5 * scale),
        -1,
        1,
      );
      rawTiltX.set(-ly * 0.3);
      rawTiltY.set(lx * 0.3);
    },
    [flipped, position, scale, rawTiltX, rawTiltY, CARD_W, CARD_H],
  );

  const accent = data.accentColor ?? "#22c55e";

  return (
    <motion.group
      position-x={position[0]}
      position-y={floatY}
      position-z={position[2]}
      rotateX={tiltX}
      rotateY={combinedRotY}
      scale={scaleSpring}
    >
      {/* ── Bulletproof hit surface ──────────────────────────────────────── */}
      {/* colorWrite + depthWrite = false → invisible to camera AND depth     */}
      {/* buffer, but THREE's raycaster still hits it perfectly.              */}
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
      >
        <boxGeometry args={[CARD_W + 0.3, CARD_H + 0.3, CARD_D + 0.2]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>

      {/* ── Card body — 6 independent face materials ─────────────────────── */}
      {/* Edges (0-3) are tinted with the certificate's own accent color —   */}
      {/* a matte, low-metalness border instead of chrome, echoing the      */}
      {/* `var(--card-accent)` inset ring on the CSS reference card.         */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />

        {/* 0 Right (+X) */}
        <meshPhysicalMaterial
          attach="material-0"
          color={accent}
          roughness={0.65}
          metalness={0.04}
        />
        <meshPhysicalMaterial
          attach="material-1"
          color={accent}
          roughness={0.65}
          metalness={0.04}
        />
        <meshPhysicalMaterial
          attach="material-2"
          color={accent}
          roughness={0.65}
          metalness={0.04}
        />
        <meshPhysicalMaterial
          attach="material-3"
          color={accent}
          roughness={0.65}
          metalness={0.04}
        />

        {/* 4 Front (+Z) — certificate front image, matte paper/laminate       */}
        {/* look instead of chrome: metalness 0, modest clearcoat only.        */}
        <meshPhysicalMaterial
          attach="material-4"
          map={frontTex}
          transparent
          alphaTest={0.5}
          roughness={0.22}
          metalness={0}
          clearcoat={0.5}
          clearcoatRoughness={0.25}
          reflectivity={0.35}
          envMapIntensity={0.7}
        />

        {/* 5 Back  (-Z) — certificate back image                          */}
        {/* The hook sets repeat.x = -1 on this texture to undo the mirror */}
        {/* that a 180° Y rotation would otherwise introduce.              */}
        <meshPhysicalMaterial
          attach="material-5"
          map={backTex}
          transparent
          alphaTest={0.5}
          roughness={0.25}
          metalness={0}
          clearcoat={0.45}
          clearcoatRoughness={0.3}
          reflectivity={0.3}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Nota: el "edge glow" (box BackSide +0.007) se quitó — era un rectángulo
          de esquinas rectas que sobresalía de la cara redondeada. El acento y su
          glow ya viven en el marco redondeado dibujado en la textura. */}

      {/* ── Holographic foil (front only, fades on flip) ─────────────────── */}
      <HolographicOverlay flipped={flipped} accentColor={accent} w={CARD_W} h={CARD_H} />
    </motion.group>
  );
}
