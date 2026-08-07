"use client";

import { useState } from "react";

interface Props {
  title: string;
  imageUrl?: string | null;
}

/**
 * Marco "ventana de terminal" para la captura de un proyecto: punto verde
 * + nombre de archivo — el lenguaje visual fósforo/terminal que ya usa
 * todo el catálogo (ProjectCatalog/ProjectDetailSheet), NO el chrome de
 * navegador de 3 puntos de DeviceMockup (esa es la familia visual del
 * mockup de dispositivo de las 3 destacadas — no existe hoy un chrome de
 * "punto verde + filename" en el repo; este es nuevo, construido para
 * encajar con el resto del catálogo en vez de con DeviceMockup).
 *
 * Sin `thumbnailUrl`, o si la imagen falla al cargar (`onError`), cae al
 * MISMO gradiente que ya usa DeviceMockup (ScreenPlaceholder, extraído)
 * — el mismo respaldo se ve intencional en cualquiera de los dos lugares.
 *
 * Renderizar con `key={slug}` desde el padre: así React remonta el
 * componente al cambiar de proyecto y `errored` no arrastra el fallo de
 * carga de un proyecto anterior al siguiente.
 */
export default function ProjectScreenshot({ title, imageUrl }: Props) {
  const [errored, setErrored] = useState(false);
  const safeImageUrl = imageUrl?.trim();

  if (!safeImageUrl || errored) return null;

  return (
    <div className="mx-auto mb-4 w-full max-w-[460px]">
      {/* eslint-disable-next-line @next/next/no-img-element -- usa URL directa definida en el dataset */}
      <img
        src={safeImageUrl}
        alt={`Captura de ${title}`}
        onError={() => setErrored(true)}
        className="mx-auto block h-auto w-auto max-h-52 max-w-full object-contain object-center"
      />
    </div>
  );
}
