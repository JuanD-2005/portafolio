interface Props {
  accentColor: string
}

/**
 * Gradiente de respaldo cuando no hay screenshot real — extraído de
 * DeviceMockup.tsx (donde vivía como función local, solo para las 3
 * tarjetas destacadas) para reutilizarse tal cual también en el catálogo
 * (ProjectScreenshot). Misma lógica visual exacta, sin duplicarla.
 */
export default function ScreenPlaceholder({ accentColor }: Props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(
            ellipse 80% 60% at 30% 30%,
            ${accentColor}22 0%,
            ${accentColor}08 50%,
            transparent 80%
          ),
          #0a0a0a
        `,
      }}
    />
  )
}
