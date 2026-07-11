import s from './ProjectThumb.module.css'

interface ProjectThumbProps {
  thumbnailUrl?: string
  accentColor?: string
  title: string
}

/** Gradient placeholder shown when no real screenshot is available */
function ThumbPlaceholder({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        width:    '100%',
        height:   '100%',
        background: `
          radial-gradient(
            ellipse 80% 60% at 30% 30%,
            ${accentColor}22 0%,
            ${accentColor}08 50%,
            transparent 80%
          ),
          #0a0a0a
        `,
      }}
    />
  )
}

/**
 * ProjectThumb
 *
 * Marco "ventana" liviano para el desplegado del índice de proyectos
 * secundarios. Deliberadamente más simple que DeviceMockup — las 3
 * cerezas destacadas deben seguir sintiéndose superiores.
 */
export default function ProjectThumb({ thumbnailUrl, accentColor = '#585450', title }: ProjectThumbProps) {
  return (
    <div className={s.window} role="img" aria-label={`Miniatura de ${title}`}>
      <div className={s.chrome} aria-hidden="true">
        <span className={`${s.dot} ${s.dotRed}`} />
        <span className={`${s.dot} ${s.dotYellow}`} />
        <span className={`${s.dot} ${s.dotGreen}`} />
        <span className={s.bar} />
      </div>
      <div className={s.screen}>
        {thumbnailUrl
          ? <img
              src={thumbnailUrl}
              alt=""
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            />
          : <ThumbPlaceholder accentColor={accentColor} />
        }
      </div>
    </div>
  )
}
