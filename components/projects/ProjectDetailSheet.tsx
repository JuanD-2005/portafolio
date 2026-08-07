"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CatalogProject, ProjectCategory } from "@/types";
import ProjectScreenshot from "./ProjectScreenshot";
import AssistantLine from "./AssistantLine";

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  ia: "IA / ML",
  software: "Software",
  design: "Diseño",
};

const IconClose = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 2l10 10M12 2L2 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

interface Props {
  project: CatalogProject | null;
  onClose: () => void;
  assistantFace: string;
  assistantText: string;
}

/**
 * Hoja inferior de detalle — misma mecánica exacta que
 * components/certificates/CertificateSheet.tsx (scrim, slide desde abajo,
 * cierre por scrim/X/Escape, mismos timings/easing/clases). No la importa
 * literal porque esa está acoplada a datos/subcomponentes de certificados
 * (CertificateCard, DEMO_CERTIFICATES); acá se replica la mecánica con
 * datos de proyecto. A diferencia de esa (que es un PICKER con grilla+
 * filtro adentro), esta solo muestra el detalle de un proyecto YA elegido
 * — la fila se toca afuera, en la lista de ProjectCatalog.
 */
export default function ProjectDetailSheet({
  project,
  onClose,
  assistantFace,
  assistantText,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const open = project !== null;

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const link = project?.links.repo ?? project?.links.live;

  return (
    <AnimatePresence>
      {open && project && (
        <motion.div key="project-sheet-root" className="contents">
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle de ${project.title}`}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] flex-col overflow-hidden rounded-t-2xl border-t border-white/10 bg-[#0a0a0a]"
            initial={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{
              duration: shouldReduceMotion ? 0.1 : 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-5 py-4">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                Detalle del proyecto
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar detalle del proyecto"
                className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-white/10 text-zinc-500 transition-all active:scale-[0.93] hover:border-white/25 hover:text-zinc-200"
              >
                <IconClose />
              </button>
            </div>

            {/* Misma escala de espaciado que el panel desktop: 8/16/24/32
                (mb-2 / mb-4 / mb-6 / mb-8), y la captura como ancla arriba,
                a ancho completo — mismo margen izquierdo que el texto. */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="mb-6">
                <AssistantLine face={assistantFace} text={assistantText} />
              </div>
              <div className="mb-6">
                <ProjectScreenshot
                  key={project.id}
                  title={project.title}
                  imageUrl={project.thumbnailUrl}
                  accentColor={project.accentColor}
                />
              </div>
              <p className="mb-2 font-terminal text-xs text-phosphor/60">
                {CATEGORY_LABEL[project.category]} · {project.year}
              </p>
              <h3 className="mb-4 font-heading text-2xl font-bold text-[#f0ede8]">
                {project.title}
              </h3>
              <p className="mb-6 font-terminal text-sm leading-relaxed text-white/70">
                {project.description}
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-wide text-white/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-terminal text-xs text-phosphor/70 transition-colors duration-150 hover:text-phosphor"
                >
                  <span aria-hidden="true">{">"}</span> ver repo ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
