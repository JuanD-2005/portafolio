"use client";

// components/certificates/certificateTexture.ts
//
// Enmarca el escaneo REAL del certificado dentro de la cáscara del concepto
// (marco de acento redondeado, mate, ajuste `contain`). Dos cambios respecto a
// la versión anterior:
//
//  1) El canvas ya NO usa constantes fijas: se dimensiona con la FORMA del
//     escaneo vía `texDims(aspect)`, y el hook EXPONE el aspecto medido para
//     que la cara 3D adopte la misma proporción (fuente única: cardGeometry).
//     Insets/radios del marco pasan a ser proporcionales al lado corto, así un
//     retrato no recibe un borde relativamente más grueso que un apaisado.
//
//  2) Las cartas SIN reverso escaneado real (todas menos C1) reciben un DORSO
//     GENERADO — guilloché tintado al acento + emblema de trofeo + sello de
//     verificación — en lugar de un placeholder vacío. C1 conserva su reverso
//     real. El texto se dibuja "normal": la corrección de espejo (repeat.x=-1)
//     lo deja legible tras el giro de 180°.

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import type { CertificateData } from "../../data/certificates";
import { texDims, clampAspect, DEFAULT_ASPECT } from "./cardGeometry";

const CARD_BG = "#0d0d0d";
const MAT_BG = "#090909"; // mat de letterbox, un pelo más oscuro que la carta

// Insets/radios como FRACCIÓN del lado corto del canvas.
const FRAME_INSET_F = 0.046;
const FRAME_R_F = 0.045;
const IMG_INSET_F = 0.075;
const IMG_R_F = 0.024;

// Radio de la SILUETA exterior de la carta (fracción del lado corto). Todo se
// recorta a este rect redondeado; las esquinas quedan transparentes y el
// material las descarta con alphaTest → la carta no tiene puntas, en eco a las
// líneas internas redondeadas del certificado. ~concéntrico al marco interno.
const OUTER_R_F = 0.08;

// Path data del TrophyIcon de CertificatesTeaser.tsx (viewBox 0 0 20 20),
// reusado en el dorso generado para mantener coherencia con el resto de la UI.
const TROPHY_PATHS = [
  "M6 3h8v4a4 4 0 01-4 4 4 4 0 01-4-4V3z",
  "M6 4H3v1a3 3 0 003 3M14 4h3v1a3 3 0 01-3 3",
  "M10 11v3M7 17h6M8 14h4v1a2 2 0 01-2 2 2 2 0 01-2-2v-1z",
];

// ─── Utilidades ───────────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** #rgb | #rrggbb → rgba(r,g,b,a). Fallback a acento sólido si no parsea. */
function hexToRgba(hex: string, a: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return hex;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

/** Código corto estable derivado del id (para el sello del dorso). */
function shortCode(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h.toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
}

// ─── Cara frontal (y reverso real de C1) ──────────────────────────────────────

/** Dibuja la cara: mate → escaneo `contain` → hairline → marco de acento. */
function drawFramed(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  accent: string,
) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const short = Math.min(W, H);

  const frameInset = short * FRAME_INSET_F;
  const frameR = short * FRAME_R_F;
  const imgInset = short * IMG_INSET_F;
  const imgR = short * IMG_R_F;

  // Silueta redondeada: recorta TODO a un rect redondeado (esquinas transparentes).
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  roundRect(ctx, 0, 0, W, H, short * OUTER_R_F);
  ctx.clip();
  ctx.fillStyle = CARD_BG;
  ctx.fillRect(0, 0, W, H);

  const ix = imgInset;
  const iy = imgInset;
  const iw = W - imgInset * 2;
  const ih = H - imgInset * 2;

  // mate + escaneo recortado
  ctx.save();
  roundRect(ctx, ix, iy, iw, ih, imgR);
  ctx.clip();
  ctx.fillStyle = MAT_BG;
  ctx.fillRect(ix, iy, iw, ih);

  if (img && img.naturalWidth > 0) {
    // contain: conserva el certificado completo, sin recorte ni distorsión.
    // Como el canvas YA tiene el aspecto del escaneo, el mat es mínimo.
    const scale = Math.min(iw / img.naturalWidth, ih / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, ix + (iw - dw) / 2, iy + (ih - dh) / 2, dw, dh);
  }
  ctx.restore();

  // hairline alrededor del escaneo
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = Math.max(1, short * 0.0015);
  roundRect(ctx, ix, iy, iw, ih, imgR);
  ctx.stroke();
  ctx.restore();

  // marco de acento con glow — la "forma" del concepto
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = Math.max(2, short * 0.003);
  ctx.shadowColor = accent;
  ctx.shadowBlur = short * 0.042;
  roundRect(
    ctx,
    frameInset,
    frameInset,
    W - frameInset * 2,
    H - frameInset * 2,
    frameR,
  );
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // cierra el clip de silueta redondeada
}

// ─── Dorso generado (cartas sin reverso escaneado) ────────────────────────────

function drawGuilloche(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  accent: string,
) {
  ctx.save();
  ctx.strokeStyle = hexToRgba(accent, 0.16);
  ctx.lineWidth = 1;
  const layers = [
    { k: 5, r: R, amp: 0.34 },
    { k: 7, r: R * 0.78, amp: 0.3 },
    { k: 9, r: R * 0.58, amp: 0.26 },
  ];
  for (const L of layers) {
    ctx.beginPath();
    const steps = 720;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const rr = L.r * (1 - L.amp + L.amp * Math.cos(L.k * t));
      const x = cx + rr * Math.cos(t);
      const y = cy + rr * Math.sin(t);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawTrophy(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  accent: string,
) {
  const s = size / 20; // el path está en un viewBox 0 0 20 20
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.translate(-10, -10);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.4; // ancho del icono original, escalado por `s`
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 6;
  for (const d of TROPHY_PATHS) ctx.stroke(new Path2D(d));
  ctx.restore();
}

function drawScanlines(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
  ctx.restore();
}

/** Dorso "carta de colección": glow → guilloché → medallón+trofeo → sello. */
function drawGeneratedBack(
  ctx: CanvasRenderingContext2D,
  data: CertificateData,
  accent: string,
) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const short = Math.min(W, H);
  const cx = W / 2;
  const cy = H / 2;
  const frameInset = short * FRAME_INSET_F;

  // Silueta redondeada: recorta TODO a un rect redondeado (esquinas transparentes).
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  roundRect(ctx, 0, 0, W, H, short * OUTER_R_F);
  ctx.clip();
  ctx.fillStyle = CARD_BG;
  ctx.fillRect(0, 0, W, H);

  // glow radial de acento
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, short * 0.62);
  g.addColorStop(0, hexToRgba(accent, 0.1));
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // guilloché + medallón + trofeo (centrados)
  drawGuilloche(ctx, cx, cy, short * 0.34, accent);

  ctx.save();
  ctx.strokeStyle = hexToRgba(accent, 0.5);
  ctx.lineWidth = Math.max(1.5, short * 0.0022);
  ctx.beginPath();
  ctx.arc(cx, cy, short * 0.14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  drawTrophy(ctx, cx, cy, short * 0.15, accent);

  // scanlines encima de la gráfica, debajo del texto
  drawScanlines(ctx, W, H);

  // caption superior (mono)
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = hexToRgba(accent, 0.85);
  ctx.font = `600 ${Math.round(short * 0.026)}px ui-monospace, monospace`;
  ctx.fillText("◆ CERTIFICADO VERIFICADO ◆", cx, frameInset + short * 0.09);
  ctx.restore();

  // sello inferior (mono): categoría + código estable
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(235,235,235,0.4)";
  ctx.font = `500 ${Math.round(short * 0.021)}px ui-monospace, monospace`;
  const label = data.category.toUpperCase();
  ctx.fillText(label, cx, H - frameInset - short * 0.115);
  ctx.fillStyle = hexToRgba(accent, 0.9);
  ctx.font = `700 ${Math.round(short * 0.024)}px ui-monospace, monospace`;
  ctx.fillText(`ID · ${shortCode(data.id)}`, cx, H - frameInset - short * 0.07);
  ctx.restore();

  // marco de acento — mismo lenguaje que la cara frontal
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = Math.max(2, short * 0.003);
  ctx.shadowColor = accent;
  ctx.shadowBlur = short * 0.042;
  roundRect(
    ctx,
    frameInset,
    frameInset,
    W - frameInset * 2,
    H - frameInset * 2,
    short * FRAME_R_F,
  );
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // cierra el clip de silueta redondeada
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Devuelve [frontTex, backTex, aspect]. `aspect` (ancho/alto) arranca en el
 * declarado (`data.aspectRatio`) o en DEFAULT_ASPECT, y se actualiza al medir
 * el escaneo frontal — la cara 3D debe consumirlo para adoptar la forma.
 */
export function useCertificateTextures(
  data: CertificateData,
): [THREE.CanvasTexture, THREE.CanvasTexture, number] {
  const initialAspect = clampAspect(data.aspectRatio ?? DEFAULT_ASPECT);
  const [aspect, setAspect] = useState(initialAspect);

  const { front, back, frontTex, backTex } = useMemo(() => {
    const d0 = texDims(initialAspect);
    const front = document.createElement("canvas");
    front.width = d0.w;
    front.height = d0.h;
    const back = document.createElement("canvas");
    back.width = d0.w;
    back.height = d0.h;

    const frontTex = new THREE.CanvasTexture(front);
    const backTex = new THREE.CanvasTexture(back);
    for (const t of [frontTex, backTex]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
    }
    // El reverso vive en -Z: deshace el espejo del giro de 180° en Y.
    backTex.wrapS = THREE.RepeatWrapping;
    backTex.repeat.set(-1, 1);
    backTex.offset.set(1, 0);

    return { front, back, frontTex, backTex };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let alive = true;
    const accent = data.accentColor ?? "#10b981";
    const fctx = front.getContext("2d");
    const bctx = back.getContext("2d");
    let frontImg: HTMLImageElement | null = null;
    let backImg: HTMLImageElement | null = null;

    const sizeCanvases = (a: number) => {
      const d = texDims(a);
      let resized = false;
      if (front.width !== d.w || front.height !== d.h) {
        front.width = d.w;
        front.height = d.h;
        resized = true;
      }
      if (back.width !== d.w || back.height !== d.h) {
        back.width = d.w;
        back.height = d.h;
        resized = true;
      }
      // Al cambiar el TAMAÑO del canvas hay que reasignar la textura entera: con
      // solo needsUpdate, THREE hace un sub-update contra la reserva GPU vieja y,
      // si el canvas CRECIÓ (p.ej. 1079→1080 por redondeo), la textura se queda
      // en su primer upload (la carta sale vacía). dispose() fuerza realloc.
      if (resized) {
        frontTex.dispose();
        backTex.dispose();
      }
    };

    const redrawFront = () => {
      if (fctx) drawFramed(fctx, frontImg, accent);
      frontTex.needsUpdate = true;
    };
    const redrawBack = () => {
      if (!bctx) return;
      if (data.backImage) drawFramed(bctx, backImg, accent);
      else drawGeneratedBack(bctx, data, accent);
      backTex.needsUpdate = true;
    };

    // primer render: tamaño con el aspecto inicial + placeholders/dorso
    sizeCanvases(initialAspect);
    redrawFront();
    redrawBack();

    // frente: al cargar mide el aspecto real, redimensiona y redibuja ambos
    const frontLoader = new Image();
    // Si los escaneos migran a otro origen: frontLoader.crossOrigin="anonymous"
    // + servirlos con CORS, o el canvas se contamina.
    frontLoader.onload = () => {
      if (!alive) return;
      frontImg = frontLoader;
      const a = clampAspect(
        frontLoader.naturalWidth / frontLoader.naturalHeight,
      );
      sizeCanvases(a); // redimensionar limpia ambos canvas…
      redrawFront();
      redrawBack(); // …por eso se redibuja también el reverso
      setAspect(a);
    };
    if (data.frontImage) frontLoader.src = data.frontImage;

    // reverso real (solo C1)
    if (data.backImage) {
      const backLoader = new Image();
      backLoader.onload = () => {
        if (!alive) return;
        backImg = backLoader;
        redrawBack();
      };
      backLoader.src = data.backImage;
    }

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, front, back, frontTex, backTex]);

  return [frontTex, backTex, aspect];
}
