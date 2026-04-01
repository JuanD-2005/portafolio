import type { TerminalLine } from '@/types'

export const bootSequence: TerminalLine[] = [
  { text: 'JP-OS BIOS v2.4.1  —  Copyright (C) 2026', speed: 28, delay: 0   },
  { text: 'RAM test: 655360 bytes OK',                 speed: 28, delay: 50  },
  { text: 'Detecting hardware...',                     speed: 28, delay: 100 },
  { text: '',                                          speed: 1,  delay: 350 },

  { text: 'C:\\SYSTEM> load profile.exe',              speed: 42, delay: 200 },
  { text: '',                                          speed: 1,  delay: 120 },

  { text: '  ┌─────────────────────────────────┐',    speed: 18, delay: 0   },
  { text: '  │   IDENTIFICANDO USUARIO...      │',    speed: 18, delay: 0   },
  { text: '  └─────────────────────────────────┘',    speed: 18, delay: 0   },
  { text: '',                                          speed: 1,  delay: 80  },

  { text: '  NOMBRE   :  Juan Paredes',                speed: 38, delay: 0   },
  { text: '  ROL      :  Full Stack Developer',        speed: 38, delay: 80  },
  { text: '  STACK    :  Web  ·  Mobile  ·  Cloud',   speed: 38, delay: 80  },
  { text: '  ESTADO   :  Disponible para contratar',  speed: 38, delay: 80  },
  { text: '',                                          speed: 1,  delay: 250 },

  { text: 'C:\\SYSTEM> echo STATUS',                   speed: 42, delay: 200 },
  { text: '',                                          speed: 1,  delay: 80  },
  { text: 'SISTEMA LISTO  ▼  SCROLL PARA CONTINUAR', speed: 32, delay: 120 },
]
