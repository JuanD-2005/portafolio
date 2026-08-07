"use client";

import { useMemo, useRef, useState } from "react";
import { catalogProjects } from "@/data/projects";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTypeReveal } from "@/hooks/useTypeReveal";
import { useReactiveFace } from "@/hooks/useReactiveFace";
import type { CatalogProject, ProjectCategory } from "@/types";
import ProjectDetailSheet from "./ProjectDetailSheet";
import ProjectScreenshot from "./ProjectScreenshot";
import AssistantLine from "./AssistantLine";

// Umbral PROPIO de este catálogo — más ancho que el 768px general del
// sitio (useIsMobile). Por debajo: hoja inferior. Desde acá: panel dividido.
const DESKTOP_QUERY = "(min-width: 1024px)";

// Altura fija de la lista (ambos layouts): no crece con la cantidad de
// proyectos de la categoría activa — scrollea adentro, nunca empuja la
// altura de la sección. Ver "Manejo de desbordamiento" en el prompt.
const LIST_HEIGHT = 420;

type CategoryFilter = "todos" | ProjectCategory;

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  ia: "IA / ML",
  software: "Software",
  design: "Diseño",
};

const CATEGORY_ORDER: ProjectCategory[] = ["ia", "software", "design"];

// Cara del personaje por categoría — no hay un campo de datos por proyecto
// para esto (el prompt solo pidió `assistantComment`), así que varía un
// poco por categoría en vez de usar siempre la misma cara.
const CATEGORY_FACE: Record<ProjectCategory, string> = {
  ia: "( ^ o ^ )",
  software: "( ^ v ^ )",
  design: "( ^ _ ^ )",
};

// Fallback si un proyecto no tiene `assistantComment` propio todavía
// (hoy: las 3 destacadas, que llegan al catálogo sin ese campo).
const CATEGORY_FALLBACK_COMMENT: Record<ProjectCategory, string> = {
  ia: "otro experimento con datos",
  software: "construido con cuidado",
  design: "con atención al detalle",
};

function assistantReaction(project: CatalogProject): {
  face: string;
  comment: string;
} {
  return {
    face: CATEGORY_FACE[project.category],
    comment:
      project.assistantComment ?? CATEGORY_FALLBACK_COMMENT[project.category],
  };
}

// Abreviaturas conocidas; lo que no está acá cae al fallback (iniciales de
// cada palabra, o primeras letras si es una sola palabra).
const TECH_ABBR: Record<string, string> = {
  python: "PY",
  javascript: "JS",
  typescript: "TS",
  php: "PHP",
  kotlin: "KT",
  flutter: "FL",
  django: "DJ",
  matlab: "ML",
  esp32: "ESP",
  html5: "HTML",
};

function techAbbr(tech: string): string {
  const key = tech.toLowerCase();
  if (TECH_ABBR[key]) return TECH_ABBR[key];
  const words = tech.trim().split(/\s+/).filter(Boolean);
  if (words.length > 1)
    return words
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);
  return tech
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 3)
    .toUpperCase();
}

function openLink(project: CatalogProject | undefined) {
  const url = project?.links.repo ?? project?.links.live;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

// ─── Chip de categoría ──────────────────────────────────────────────────────
function CategoryChip({
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
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 font-terminal text-xs transition-colors duration-150 ${
        active
          ? "border-phosphor bg-phosphor font-bold text-black"
          : "border-phosphor/30 text-phosphor/50 hover:text-phosphor/80"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Fila de la lista ───────────────────────────────────────────────────────
function CatalogRow({
  project,
  active,
  tabIndex,
  rowRef,
  onActivate,
  onSelect,
}: {
  project: CatalogProject;
  active: boolean;
  tabIndex: number;
  rowRef: (el: HTMLDivElement | null) => void;
  /** Hover/foco: solo actualiza cuál fila está "activa" (preview). */
  onActivate: () => void;
  /** Click/tap: la acción "ir" (abre sheet en mobile, abre link en desktop). */
  onSelect: () => void;
}) {
  return (
    <div
      ref={rowRef}
      role="option"
      aria-selected={active}
      tabIndex={tabIndex}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center gap-3 border-l-2 px-3 py-2.5 text-left outline-none transition-colors duration-150 ${
        active
          ? "border-phosphor bg-phosphor/5"
          : "border-transparent hover:bg-white/[0.03]"
      }`}
    >
      <span className="w-10 shrink-0 rounded border border-white/10 py-0.5 text-center font-terminal text-[9px] uppercase text-phosphor/70">
        {techAbbr(project.tech[0] ?? "")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-sm font-semibold text-[#f0ede8]">
          {project.title}
        </span>
        <span className="block truncate font-terminal text-xs text-white/40">
          {project.description}
        </span>
      </span>
    </div>
  );
}

// ─── Panel de detalle (desktop) ─────────────────────────────────────────────
function DetailPanel({
  project,
  assistantFace,
  assistantText,
}: {
  project: CatalogProject | null;
  assistantFace: string;
  assistantText: string;
}) {
  const typedDesc = useTypeReveal(project?.description ?? "", 18);

  if (!project) {
    return (
      <p className="font-terminal text-sm text-white/40">
        sin proyectos en esta categoría.
      </p>
    );
  }

  const link = project.links.repo ?? project.links.live;

  return (
    <div className="flex h-full flex-col">
      <AssistantLine face={assistantFace} text={assistantText} />
      <p className="mb-1 font-terminal text-xs text-phosphor/60">
        {CATEGORY_LABEL[project.category]} · {project.year}
      </p>
      <h3 className="mb-3 font-heading text-2xl font-bold text-[#f0ede8]">
        {project.title}
      </h3>
      <p className="mb-4 min-h-[4.5rem] font-terminal text-sm leading-relaxed text-white/70">
        {typedDesc}
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block animate-cursor-blink text-phosphor"
        >
          ▍
        </span>
      </p>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-wide text-white/50"
          >
            {t}
          </span>
        ))}
      </div>
      <ProjectScreenshot
        key={project.id}
        title={project.title}
        imageUrl={project.thumbnailUrl}
      />
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto self-start font-terminal text-xs text-phosphor/70 transition-colors duration-150 hover:text-phosphor"
        >
          <span aria-hidden="true">{">"}</span> ver repo ↗
        </a>
      )}
      <p className="mt-4 border-t border-white/5 pt-3 font-terminal text-[10px] uppercase tracking-widest text-white/25">
        ↑↓ navegar · enter abrir
      </p>
    </div>
  );
}

// ─── Catálogo — orquestador ─────────────────────────────────────────────────
export default function ProjectCatalog() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);

  // Instancia PROPIA — no se comparte con la de ActionSection. Cada hook
  // llamado en un componente distinto tiene su propio estado independiente.
  const { face, text, srText, say } = useReactiveFace();

  const [category, setCategory] = useState<CategoryFilter>("todos");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [sheetProject, setSheetProject] = useState<CatalogProject | null>(null);
  // Snapshot de la categoría del render anterior — permite resetear
  // `focusedIndex` durante el render mismo (patrón que React recomienda
  // para "resetear estado cuando cambia otro valor"), sin un useEffect
  // que dispare un setState síncrono extra.
  const [prevCategory, setPrevCategory] = useState(category);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filtered = useMemo(
    () =>
      category === "todos"
        ? catalogProjects
        : catalogProjects.filter((p) => p.category === category),
    [category],
  );

  if (category !== prevCategory) {
    setPrevCategory(category);
    setFocusedIndex(0);
  }

  const active = filtered[focusedIndex] ?? null;

  // Hover/foco/flechas convergen acá: mueve la selección Y dispara el
  // comentario del personaje sobre ESE proyecto — nunca uno genérico.
  function activate(index: number) {
    setFocusedIndex(index);
    const project = filtered[index];
    if (project) {
      const { face: f, comment } = assistantReaction(project);
      say(f, comment);
    }
  }

  function handleRowSelect(index: number) {
    activate(index);
    const project = filtered[index];
    if (!project) return;
    if (isDesktop) {
      openLink(project);
    } else {
      setSheetProject(project);
    }
  }

  function handleListKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(focusedIndex + 1, filtered.length - 1);
      activate(next);
      rowRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(focusedIndex - 1, 0);
      activate(prev);
      rowRefs.current[prev]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      openLink(filtered[focusedIndex]);
    }
  }

  const list = (
    <div
      role="listbox"
      aria-label="Lista de proyectos"
      onKeyDown={handleListKeyDown}
      style={{ maxHeight: LIST_HEIGHT }}
      className="overflow-y-auto"
    >
      {filtered.map((project, i) => (
        <CatalogRow
          key={project.id}
          project={project}
          active={i === focusedIndex}
          tabIndex={i === focusedIndex ? 0 : -1}
          rowRef={(el) => {
            rowRefs.current[i] = el;
          }}
          onActivate={() => activate(i)}
          onSelect={() => handleRowSelect(i)}
        />
      ))}
      {filtered.length === 0 && (
        <p className="py-8 text-center font-terminal text-sm text-white/40">
          sin proyectos en esta categoría.
        </p>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryChip
          label="Todos"
          active={category === "todos"}
          onClick={() => setCategory("todos")}
        />
        {CATEGORY_ORDER.map((cat) => (
          <CategoryChip
            key={cat}
            label={CATEGORY_LABEL[cat]}
            active={category === cat}
            onClick={() => setCategory(cat)}
          />
        ))}
      </div>

      {isDesktop ? (
        <div className="grid h-fit min-h-[500px] grid-cols-[240px_1fr] gap-8">
          <div className="h-full border-r border-white/10 pr-2">{list}</div>
          <div className="pl-2">
            <DetailPanel
              project={active}
              assistantFace={face}
              assistantText={text}
            />
          </div>
        </div>
      ) : (
        <>
          {list}
          <ProjectDetailSheet
            project={sheetProject}
            onClose={() => setSheetProject(null)}
            assistantFace={face}
            assistantText={text}
          />
        </>
      )}

      <span className="sr-only" aria-live="polite">
        {srText}
      </span>
    </div>
  );
}
