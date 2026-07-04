import s from './HeroCRT.module.css'

export default function RoomBackdrop() {
  return (
    <div className={s.roomBackdrop} aria-hidden="true">
      <svg viewBox="0 0 680 440" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="jpBulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff41" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#00ff41" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Bombillo colgante - Envuelto en un grupo padre para no pisar la animación .bulb */}
        <g className={s.bulbGroup}>
          <g className={s.bulb} stroke="#00ff41" strokeOpacity="0.2" strokeWidth="1.5" fill="none">
            <line x1="565" y1="0" x2="565" y2="74" />
            <circle cx="565" cy="90" r="15" fill="url(#jpBulbGlow)" />
            <circle cx="565" cy="90" r="15" />
            <path d="M558 96 q7 8 14 0" strokeOpacity="0.32" />
            <rect x="559" y="103" width="12" height="6" rx="1" />
          </g>
        </g>

        {/* Estantería con libros y planta */}
        <g className={s.shelfGroup} stroke="#00ff41" strokeOpacity="0.22" strokeWidth="1.5" fill="none">
          <line x1="48" y1="152" x2="212" y2="152" />
          <line x1="52" y1="156" x2="208" y2="156" strokeOpacity="0.12" />
          <line x1="60" y1="152" x2="60" y2="166" />
          <line x1="200" y1="152" x2="200" y2="166" />
          <rect x="72" y="120" width="11" height="32" />
          <rect x="86" y="124" width="9" height="28" />
          <rect x="98" y="114" width="12" height="38" />
          <rect x="113" y="128" width="9" height="24" />
          <rect x="128" y="122" width="10" height="30" />
          <rect x="170" y="134" width="22" height="18" rx="1" />
          <path d="M176 134 q-6 -14 4 -20 M184 134 q8 -12 2 -22 M181 134 q1 -10 0 -16" strokeOpacity="0.3" />
        </g>

        {/* Escritorio + taza */}
        <g className={s.deskGroup} stroke="#00ff41" strokeOpacity="0.14" strokeWidth="1.5" fill="none">
          <line x1="30" y1="360" x2="650" y2="360" />
          <rect x="486" y="338" width="20" height="20" rx="2" strokeOpacity="0.2" />
          <path d="M506 342 q9 2 0 12" strokeOpacity="0.2" />
        </g>
      </svg>
    </div>
  )
}
