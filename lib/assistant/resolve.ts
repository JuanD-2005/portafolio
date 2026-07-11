import type { CatalogProject, AssistantResponse, AssistantSuggestion } from '@/types'

/**
 * Chips de sugerencia. Las categorías (ia/software/diseño) y "ver todo"
 * viven como atajos aparte en ProjectsLab — no se repiten acá.
 */
export const suggestions: AssistantSuggestion[] = [
  { label: 'lo más reciente',                 query: 'reciente' },
  { label: 'algo con visión por computadora', query: 'vision' },
  { label: 'sorpréndeme',                     query: 'random' },
]

/** Matching genérico: cualquier tech suelta o palabra del título. */
function techMatch(q: string, projects: CatalogProject[]) {
  return projects.filter(p =>
    p.tech.some(t => t.toLowerCase().includes(q)) ||
    p.title.toLowerCase().includes(q)
  )
}

/**
 * Resolver guionizado (versión A). Determinista, sin red, nunca falla.
 * `projects` es `catalogProjects` — el universo completo de búsqueda
 * (cerezas + archivo fundidos) — los intents de categoría (ia/software/
 * design) son los atajos de ProjectsCatalog, y el texto libre puede pedir
 * lo mismo.
 *
 * Para migrar a B: reemplazar el cuerpo por un fetch al route handler
 * y conservar la firma. Nada más en la app cambia.
 */
export async function resolveQuery(
  input: string,
  projects: CatalogProject[],
): Promise<AssistantResponse> {
  const q = input.toLowerCase().trim()

  if (/vision|visión|imagen|cnn|opencv/.test(q)) {
    const ids = projects.filter(p => /vision|opencv|cnn/i.test(p.tech.join(' ') + p.title)).map(p => p.id)
    return { message: `visión por computadora — ${ids.length} resultado${ids.length === 1 ? '' : 's'}.`, matchedIds: ids }
  }
  if (/\bia\b|ml|machine|red neuronal|deep/.test(q)) {
    const ids = projects.filter(p => p.category === 'ia').map(p => p.id)
    return { message: `filtrando por IA/ML — ${ids.length} proyecto${ids.length === 1 ? '' : 's'}. mi especialidad, de hecho.`, matchedIds: ids }
  }
  if (/software|backend|app|fullstack|full stack/.test(q)) {
    const ids = projects.filter(p => p.category === 'software').map(p => p.id)
    return { message: `software & apps — ${ids.length} proyecto${ids.length === 1 ? '' : 's'}.`, matchedIds: ids }
  }
  if (/diseño|frontend|ui|web|css/.test(q)) {
    const ids = projects.filter(p => p.category === 'design').map(p => p.id)
    return { message: `frontend & diseño — ${ids.length} proyecto${ids.length === 1 ? '' : 's'}.`, matchedIds: ids }
  }
  if (/reciente|nuevo|último|2025/.test(q)) {
    const ids = projects.filter(p => p.year >= 2025).map(p => p.id)
    return { message: `lo último — ${ids.length} proyecto${ids.length === 1 ? '' : 's'} de 2025.`, matchedIds: ids }
  }
  if (/random|sorprend|dado|azar/.test(q)) {
    if (projects.length === 0) {
      return { message: 'no hay nada por acá para sorprenderte todavía.', matchedIds: [] }
    }
    const pick = projects[Math.floor(Math.random() * projects.length)]
    return { message: `probá esto → ${pick.title}.`, matchedIds: [pick.id] }
  }
  if (/todo|todos|reset|limpiar/.test(q)) {
    return { message: `mostrando los ${projects.length}. explorá libre.`, matchedIds: null }
  }

  // Red de seguridad: cualquier tecnología suelta (React, Godot, Firebase,
  // MATLAB, ESP32...) sin necesidad de una regex por cada una.
  const generic = techMatch(q, projects)
  if (generic.length > 0) {
    return {
      message: `"${input.trim()}" — ${generic.length} coincidencia${generic.length === 1 ? '' : 's'}:`,
      matchedIds: generic.map(p => p.id),
    }
  }

  // Fallback con gracia (importante en A): la voz del sistema, no un error seco.
  return {
    message: `"${input.trim()}" no está en mi stack (todavía). mientras tanto, esto sí construí:`,
    matchedIds: null,
  }
}
