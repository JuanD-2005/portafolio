interface Props {
  face: string
  text: string
}

/**
 * Mini-panel del personaje JP-OS: cara + línea con typewriter + cursor —
 * mismo lenguaje visual que CliBar (ActionSection). El tipeo en sí lo
 * maneja useReactiveFace.say() internamente; este componente solo pinta
 * el `face`/`text` que ya vienen del hook. Compartido entre el panel de
 * detalle desktop (ProjectCatalog) y la hoja inferior mobile
 * (ProjectDetailSheet) — ambos reciben el mismo estado desde el único
 * `useReactiveFace` que vive en ProjectCatalog.
 */
export default function AssistantLine({ face, text }: Props) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-md border border-white/10 bg-black/40 px-3 py-2 font-terminal text-xs">
      <span className="shrink-0 text-phosphor">{face}</span>
      <span className="min-w-0 flex-1 truncate text-white/70">{text}</span>
      <span
        aria-hidden="true"
        className="inline-block h-[1em] w-[0.4em] shrink-0 animate-cursor-blink bg-phosphor"
      />
    </div>
  )
}
