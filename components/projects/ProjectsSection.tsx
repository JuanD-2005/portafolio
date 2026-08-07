'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeUpSlow } from '@/animations/variants'
import { featuredProjects, archiveProjects } from '@/data/projects'
import type { ProjectView } from '@/types'
import ProjectCard from './ProjectCard'
import ProjectsSegmentedToggle from './ProjectsSegmentedToggle'
import ProjectCatalog from './ProjectCatalog'
import s from './ProjectsSection.module.css'

export default function ProjectsSection() {
  const [view, setView] = useState<ProjectView>('destacados')

  return (
    <section id="projects" aria-label="Proyectos" className={s.section}>
      <div className={s.inner}>

        <motion.p
          className={s.eyebrow}
          variants={fadeUpSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          ~/proyectos
        </motion.p>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 sm:mb-14">
          <h2 className="font-heading text-[clamp(1.8rem,4.5vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#f0ede8]">
            Proyectos
          </h2>
          <ProjectsSegmentedToggle
            view={view}
            onChange={setView}
            archiveCount={archiveProjects.length}
          />
        </div>

        <AnimatePresence>
          {view === 'destacados' ? (
            <motion.div
              key="destacados"
              id="projects-view-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className={s.grid}
            >
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="todos"
              id="projects-view-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCatalog />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
