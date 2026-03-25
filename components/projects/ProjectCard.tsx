import { motion }    from 'framer-motion'
import DeviceMockup  from './DeviceMockup'
import { cardFloat } from '@/animations/variants'
import type { Project } from '@/types'
import s from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  index:   number
}

// Inline SVG icons — no external icon library needed
function GithubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
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
              <GithubIcon /> GitHub
            </a>
          )}
          {links.live && (
            <a
              href={links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              Ver en vivo <ExternalIcon />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
