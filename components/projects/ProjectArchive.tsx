'use client'

import { useState }            from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { archiveProjects }         from '@/data/projects'
import { archiveRow, staggerFast, archiveExpand } from '@/animations/variants'
import s from './ProjectArchive.module.css'

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    >
      <path
        d="M2 12L12 2M12 2H7M12 2v5"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * ProjectArchive
 *
 * A ghost button toggles a table of all projects.
 * AnimatePresence + archiveExpand variant handles the height animation.
 * Inside, staggerFast staggers each row into view after the container opens.
 */
export default function ProjectArchive() {
  const [open, setOpen] = useState(false)

  return (
    <div className={s.wrapper}>

      {/* Toggle button */}
      <button
        className={s.toggleBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="archive-table"
      >
        {open ? 'Ocultar archivo' : 'Ver archivo completo de proyectos'}
        <span className={`${s.chevron} ${open ? s.chevronOpen : ''}`}>
          <ChevronIcon />
        </span>
      </button>

      {/* Animated table */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="archive-table"
            className={s.tableWrapper}
            variants={archiveExpand}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <table className={s.table} aria-label="Archivo completo de proyectos">
              <thead className={s.thead}>
                <tr>
                  <th scope="col">Año</th>
                  <th scope="col">Proyecto</th>
                  <th scope="col">Stack</th>
                  <th scope="col">
                    <span className="sr-only">Enlace</span>
                  </th>
                </tr>
              </thead>

              {/* tbody is also a motion component so we can stagger rows */}
              <motion.tbody
                variants={staggerFast}
                initial="hidden"
                animate="visible"
              >
                {archiveProjects.map((project) => (
                  <motion.tr
                    key={project.title}
                    className={s.row}
                    variants={archiveRow}
                  >
                    {/* Year */}
                    <td className={s.year}>{project.year}</td>

                    {/* Title + description */}
                    <td>
                      <p className={s.projectTitle}>{project.title}</p>
                      <p className={s.projectDesc}>{project.description}</p>
                    </td>

                    {/* Tech chips */}
                    <td>
                      <div className={s.techList}>
                        {project.tech.map((t) => (
                          <span key={t} className={s.techChip}>{t}</span>
                        ))}
                      </div>
                    </td>

                    {/* External link */}
                    <td>
                      {(project.links.repo || project.links.live) && (
                        <a
                          href={project.links.repo ?? project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={s.iconLink}
                          aria-label={`Ver proyecto ${project.title}`}
                        >
                          <ExternalLinkIcon />
                        </a>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
