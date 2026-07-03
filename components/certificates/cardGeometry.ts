// components/certificates/cardGeometry.ts
//
// Fuente ÚNICA de verdad para la FORMA de cada carta. La geometría 3D (la cara
// del box) y el canvas de textura se derivan del MISMO aspecto, así sus
// proporciones coinciden por construcción y el marco de acento nunca se estira.
//
// Decisión de diseño: EL FRENTE DEFINE LA FORMA. El reverso — real (solo C1) o
// generado — se dibuja a estas mismas dimensiones.

/**
 * Lado largo de la cara en unidades de mundo. <Bounds> re-encuadra la cámara
 * después del montaje, así que este número es solo la escala base: lo que
 * realmente importa es la RAZÓN entre ancho y alto.
 */
export const CARD_LONG = 3.4;

/** Grosor constante — todas las cartas comparten el mismo canto. */
export const CARD_DEPTH = 0.045;

/**
 * Aspecto por defecto mientras la imagen aún no se ha medido (≈ 1.417, el
 * apaisado histórico). Evita un salto brusco antes del onload de cada escaneo.
 */
export const DEFAULT_ASPECT = 1400 / 988;

/**
 * Recorta aspectos extremos (panorámicas / tiras) para que ninguna carta
 * degenere en algo impracticable de encuadrar o de tintar con el marco.
 */
export const ASPECT_MIN = 0.55;
export const ASPECT_MAX = 1.9;

export function clampAspect(aspect: number): number {
  if (!Number.isFinite(aspect) || aspect <= 0) return DEFAULT_ASPECT;
  return Math.min(Math.max(aspect, ASPECT_MIN), ASPECT_MAX);
}

/** Dimensiones de la CARA del box (mundo 3D) para un aspecto = ancho / alto. */
export function cardFaceDims(aspect: number): { w: number; h: number } {
  const a = clampAspect(aspect);
  return a >= 1
    ? { w: CARD_LONG, h: CARD_LONG / a }
    : { w: CARD_LONG * a, h: CARD_LONG };
}

/**
 * Lado largo del canvas de textura en px. El lado corto se deriva del aspecto,
 * así canvas y cara comparten proporción EXACTA (mismo `clampAspect`).
 */
export const TEX_LONG = 1400;

/** Dimensiones del canvas de textura (px) para un aspecto = ancho / alto. */
export function texDims(aspect: number): { w: number; h: number } {
  const a = clampAspect(aspect);
  return a >= 1
    ? { w: TEX_LONG, h: Math.round(TEX_LONG / a) }
    : { w: Math.round(TEX_LONG * a), h: TEX_LONG };
}
