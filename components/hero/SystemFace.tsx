import s from './HeroCRT.module.css'

interface Props {
  face: string
  text: string
  showCursor?: boolean
}

/**
 * UI pura. Todo el "cerebro" vive en useSystemFace; esto solo pinta el kaomoji
 * y la línea de diálogo, heredando el verde y el glow de la terminal.
 */
export default function SystemFace({ face, text, showCursor = true }: Props) {
  return (
    <div className={s.faceStage} aria-hidden="true">
      <div className={s.faceGlyph}>{face}</div>
      <div className={s.dialogueLine}>
        {text}
        {showCursor && <span className={s.cursor} />}
      </div>
    </div>
  )
}
