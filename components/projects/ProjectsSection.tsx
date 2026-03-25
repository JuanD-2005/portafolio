'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeUpSlow } from '@/animations/variants'
import { featuredProjects }              from '@/data/projects'
import ProjectCard                       from './ProjectCard'
import s                                 from './ProjectsSection.module.css'

export default function ProjectsSection() {
  return (
    <section id="projects" aria-label="Proyectos destacados" className={s.section}>
      <div className={s.inner}>

        {/* Header */}
        <motion.div
          className={s.header}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div>
            <motion.p className={s.eyebrow} variants={fadeUpSlow}>
              TRABAJO SELECCIONADO
            </motion.p>
            <motion.h2 className={s.title} variants={fadeUpSlow}>
              Proyectos<br />destacados
            </motion.h2>
          </div>
          <motion.p className={s.subtitle} variants={fadeUpSlow}>
            Web, móvil y todo lo que hay en el medio.
            Cada proyecto con su mockup real.
          </motion.p>
        </motion.div>

        {/* Cards — staggerContainer orquesta el float-up */}
        <motion.div
          className={s.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
