import { motion }    from 'framer-motion'
import DeviceMockup  from './DeviceMockup'
import { cardFloat } from '@/animations/variants'
import type { Project } from '@/types'
import s from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  index:   number
}

/**
 * ProjectCard
 *
 * Self-contained card: renders the CSS device mockup + project metadata.
 * Framer Motion `cardFloat` variant is applied here; the parent
 * `staggerContainer` drives the timing offset between cards.
 */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { title, tagline, description, device, accentColor,
          screenshotUrl, tech, links } = project

  return (
    <motion.article
      className={s.card}
      variants={cardFloat}
      aria-label={`Proyecto: ${title}`}
    >
      {/* Device frame */}
      <DeviceMockup
        type={device}
        accentColor={accentColor}
        screenshotUrl={screenshotUrl}
      />

      {/* Info panel */}
      <div className={s.info}>
        <span className={s.index} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3 className={s.title}>{title}</h3>
        <p  className={s.tagline}>{tagline}</p>
        <p  className={s.description}>{description}</p>

        {/* Tech badges */}
        <div className={s.badges} aria-label="Tecnologías">
          {tech.map(({ label, color }) => (
            <span
              key={label}
              className={`${s.badge} ${s[`badge--${color}`]}`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className={s.links}>
          {links.repo && (
            <a
              href={links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              <span className={s.linkArrow}>{'>'}</span> github
            </a>
          )}
          {links.live && (
            <a
              href={links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              <span className={s.linkArrow}>{'>'}</span> ver en vivo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
