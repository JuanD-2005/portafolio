'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import s from './ActionCarousel.module.css'

export interface CarouselSlide {
  id: string
  label: string
  face: string
  comment: string
  content: ReactNode
}

interface ActionCarouselProps {
  slides: CarouselSlide[]
  say: (face: string, text: string) => void
}

/**
 * Carrusel mobile-only de ActionSection (Embla). Solo se monta en la rama
 * mobile — desktop nunca ve este componente ni su CSS de peek/slides.
 *
 * El personaje reacciona al slide activo: dispara say() en el slide 0 al
 * montar y en cada cambio real de slide (emblaApi.on('select')).
 */
export default function ActionCarousel({ slides, say }: ActionCarouselProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    duration: reducedMotion ? 0 : 25,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  // slides/say son una nueva referencia en cada render del padre (arrays y
  // closures inline) — leerlas desde un ref evita que este efecto se vuelva
  // a montar (y re-anuncie el slide actual) en cada render ajeno al carrusel.
  const slidesRef = useRef(slides)
  useEffect(() => {
    slidesRef.current = slides
  })
  const sayRef = useRef(say)
  useEffect(() => {
    sayRef.current = say
  })

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap()
      setSelectedIndex(index)
      const slide = slidesRef.current[index]
      if (slide) sayRef.current(slide.face, slide.comment)
    }

    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className={s.carousel}>
      <div className={s.viewport} ref={emblaRef}>
        <div className={s.container}>
          {/* Embla mantiene TODOS los slides en el DOM siempre (solo mueve el
              scroll/transform) — sin esto, Tab alcanzaría los links de
              cv/redes aunque esos slides no estén a la vista. inert los
              saca del orden de tabulación y de lectores de pantalla
              mientras no sean el slide activo. */}
          {slides.map((slide, i) => (
            <div className={s.slide} key={slide.id} inert={i !== selectedIndex}>
              {slide.content}
            </div>
          ))}
        </div>
      </div>

      <div className={s.controls}>
        <button
          type="button"
          className={s.arrow}
          onClick={scrollPrev}
          aria-label="Slide anterior"
        >
          ‹
        </button>

        {/* aria-pressed en vez de role="tab" — el mismo patrón que ya usa
            FilterChip en CertificateGallery.tsx. role="tab" prometería
            navegación por flechas entre pestañas (ARIA Authoring Practices)
            que no implementamos; aria-pressed no carga esa expectativa y
            sigue siendo perfectamente anunciable/operable. */}
        <div className={s.dots} aria-label="Secciones del carrusel">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-pressed={i === selectedIndex}
              aria-label={`Ir a ${slide.label}`}
              className={`${s.dot} ${i === selectedIndex ? s.dotActive : ''}`}
              onClick={() => scrollTo(i)}
            >
              {slide.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={s.arrow}
          onClick={scrollNext}
          aria-label="Siguiente slide"
        >
          ›
        </button>
      </div>
    </div>
  )
}
