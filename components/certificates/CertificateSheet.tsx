"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CertificateCard, FilterChip, CATEGORY_LABEL, type FilterValue } from "./CertificateGallery";
import {
  DEMO_CERTIFICATES,
  CATEGORY_ORDER,
  getCertificatesByCategory,
} from "../../data/certificates";

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

interface CertificateSheetProps {
  open: boolean;
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

/**
 * Hoja inferior de selección rápida. El filtro es LOCAL a la hoja (solo
 * decide qué se ve en la grilla) — el índice activo global sigue viviendo
 * en CertificateGallery. Tocar una tarjeta filtrada mapea igual al
 * certificado correcto en DEMO_CERTIFICATES completo, nunca a un índice
 * relativo a la lista filtrada.
 */
export default function CertificateSheet({ open, activeId, onSelect, onClose }: CertificateSheetProps) {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterValue>("TODOS");
  const grouped = useMemo(() => getCertificatesByCategory(), []);

  const visible = useMemo(
    () => (filter === "TODOS" ? DEMO_CERTIFICATES : (grouped.get(filter) ?? [])),
    [filter, grouped],
  );

  // Cerrar con Escape.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="certificate-sheet-root"
          className="contents"
        >
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
            aria-label="Elegir certificado"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] flex flex-col bg-[#0a0a0a] border-t border-white/10 rounded-t-2xl overflow-hidden"
            initial={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 shrink-0">
              <h2 className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-zinc-500">
                Elegir certificado
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar selección de certificados"
                className="ml-auto grid place-items-center w-8 h-8 rounded-full border border-white/10 text-zinc-500 hover:text-zinc-200 hover:border-white/25 active:scale-[0.93] transition-all"
              >
                <IconClose />
              </button>
            </div>

            <div className="flex gap-2 px-5 py-3 border-b border-white/10 shrink-0 overflow-x-auto">
              <FilterChip label="Todos" active={filter === "TODOS"} onClick={() => setFilter("TODOS")} />
              {CATEGORY_ORDER.map((cat) => (
                <FilterChip
                  key={cat}
                  label={CATEGORY_LABEL[cat] ?? cat}
                  active={filter === cat}
                  onClick={() => setFilter(cat)}
                />
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence initial={false} mode="popLayout">
                  {visible.map((cert, i) => (
                    <CertificateCard
                      key={cert.id}
                      cert={cert}
                      index={i}
                      active={cert.id === activeId}
                      reduceMotion={!!shouldReduceMotion}
                      layout="grid"
                      onSelect={() => {
                        onSelect(cert.id);
                        onClose();
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
