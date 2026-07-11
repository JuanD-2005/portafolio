/**
 * Vocabulario de expresiones del personaje del sistema (kaomojis).
 * Compartido entre el hero (`useSystemFace`) y el asistente de proyectos
 * (`ProjectsCatalog`) para que ambos hablen con la misma "cara".
 */
export const FACE = {
  sleep:      '( - v - )',   // dormido / parpadeo
  wake:       '( O _ O )',   // despierta sorprendido
  talkClosed: '( ^ _ ^ )',   // hablando · boca cerrada
  talkOpen:   '( ^ O ^ )',   // hablando · boca abierta
  happy:      '( ^ v ^ )',   // reposo entre líneas
  thinking:   '( o _ o )?',  // procesando una consulta
  notFound:   '( ~ _ ~ )',   // consulta sin match
  leaving:    '( ; _ ; )/',  // el usuario se va (scroll ↓)
  back:       '( O _ O )',   // el usuario vuelve (scroll ↑)
} as const

export type FaceKey = keyof typeof FACE
