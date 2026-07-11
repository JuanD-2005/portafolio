'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { staggerContainer, fadeUpSlow } from '@/animations/variants'
import { featuredProjects } from '@/data/projects'
import type { ProjectView } from '@/types'
import ProjectCard from './ProjectCard'
import ProjectsCatalog from './ProjectsCatalog'
import ProjectsViewToggle from './ProjectsViewToggle'
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

        <ProjectsViewToggle view={view} onToggle={setView} />

        <AnimatePresence mode="wait">
          {view === 'destacados' ? (
            <motion.div
              key="destacados"
              className={s.grid}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="todos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
            >
              <ProjectsCatalog />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
