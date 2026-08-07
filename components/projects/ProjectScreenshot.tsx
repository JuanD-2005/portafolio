"use client";

import { useState } from "react";
import ScreenPlaceholder from "./ScreenPlaceholder";

interface Props {
  title: string;
  imageUrl?: string | null;
  /** Ancla el gradiente del placeholder cuando no hay captura. */
  accentColor?: string;
}

/**
 * Área de captura del proyecto — el ancla visual del panel de detalle.
 *
 * Ocupa el ANCHO COMPLETO del contenido (sin `mx-auto`/`max-w`): así
 * comparte margen izquierdo con el título, la descripción y el resto del
 * panel, en vez de flotar centrada con un margen propio.
 *
 * Sin `imageUrl`, o si la carga falla (`onError`), NO desaparece: cae al
 * mismo gradiente de respaldo que usa DeviceMockup (ScreenPlaceholder) con
 * una etiqueta discreta. Un hueco vacío se lee como bug; un placeholder
 * enmarcado se lee como "captura pendiente", que es la intención.
 *
 * `object-contain` (no `cover`): las capturas mezclan formatos — miunet es
 * un móvil vertical (1080×2239) y el resto son apaisadas. `cover` recortaría
 * la vertical hasta dejar una tira inservible; `contain` muestra cada una
 * completa y el fondo oscuro absorbe el letterbox.
 *
 * Montar con `key={project.id}` desde el padre: así React remonta al cambiar
 * de proyecto y `errored` no arrastra el fallo de carga del anterior.
 */
export default function ProjectScreenshot({ title, imageUrl, accentColor }: Props) {
  const [errored, setErrored] = useState(false);
  const safeImageUrl = imageUrl?.trim();
  const showImage = Boolean(safeImageUrl) && !errored;

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-md border border-white/10 bg-black">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- fallback vía onError; no necesita el pipeline de next/image
        <img
          src={safeImageUrl}
          alt={`Captura de ${title}`}
          onError={() => setErrored(true)}
          className="h-full w-full object-contain object-center"
        />
      ) : (
        <>
          <ScreenPlaceholder accentColor={accentColor ?? "#00ff41"} />
          <span className="absolute inset-0 grid place-items-center font-terminal text-[10px] uppercase tracking-[0.2em] text-white/25">
            captura pendiente
          </span>
        </>
      )}
    </div>
  );
}
