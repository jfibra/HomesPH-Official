'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'

interface PopularLocationCardData {
  imageSrc: string
  slug: string
  title: string
}

interface LocationPopularSearchesCarouselProps {
  cards: PopularLocationCardData[]
}

type PopularLocationPanelLayout = 'featured' | 'stack'

interface PopularLocationPanel {
  cards: PopularLocationCardData[]
  id: string
  layout: PopularLocationPanelLayout
}

const PANEL_PATTERN: PopularLocationPanelLayout[] = [
  'featured',
  'stack',
  'stack',
  'featured',
  'stack',
]

const PANEL_WIDTH_CLASSES: Record<PopularLocationPanelLayout, string> = {
  featured:
    'basis-[84%] sm:basis-[52%] lg:basis-[31%] xl:basis-[27%] 2xl:basis-[24%]',
  stack:
    'basis-[74%] sm:basis-[42%] lg:basis-[22%] xl:basis-[19%] 2xl:basis-[17%]',
}

const IMAGE_POSITION_BY_SLUG: Record<string, string> = {
  bacolod: 'object-center',
  baguio: 'object-center',
  batangas: 'object-center',
  bgc: 'object-center',
  bohol: 'object-center',
  cebu: 'object-center',
  'cagayan-de-oro': 'object-center',
  cavite: 'object-center',
  davao: 'object-center',
  dumaguete: 'object-center',
  iloilo: 'object-center',
  makati: 'object-center',
  manila: 'object-center',
  palawan: 'object-center',
  pampanga: 'object-center',
  'quezon-city': 'object-center',
  siargao: 'object-center',
  tagaytay: 'object-center',
}

function buildPanels(cards: PopularLocationCardData[]) {
  const panels: PopularLocationPanel[] = []
  let cardIndex = 0
  let patternIndex = 0

  while (cardIndex < cards.length) {
    const preferredLayout = PANEL_PATTERN[patternIndex % PANEL_PATTERN.length]
    const requestedCount = preferredLayout === 'featured' ? 1 : 2
    const panelCards = cards.slice(cardIndex, cardIndex + requestedCount)

    if (!panelCards.length) break

    const layout =
      panelCards.length === 1 ? 'featured' : preferredLayout

    panels.push({
      cards: panelCards,
      id: `${layout}-${panelCards.map((card) => card.slug).join('-')}`,
      layout,
    })

    cardIndex += panelCards.length
    patternIndex += 1
  }

  return panels
}

function PopularLocationCard({
  card,
  className,
  featured = false,
}: {
  card: PopularLocationCardData
  className: string
  featured?: boolean
}) {
  const imagePositionClass = IMAGE_POSITION_BY_SLUG[card.slug] ?? 'object-center'

  return (
    <Link
      href={`/${card.slug}`}
      className={`group relative block min-w-0 overflow-hidden rounded-[26px] border border-[#edf2fa] bg-white shadow-[0_6px_16px_rgba(12,28,63,0.035)] transition-[transform,box-shadow,border-color] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-[#e3ebf8] hover:shadow-[0_14px_28px_rgba(12,28,63,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2140d8]/20 ${className}`}
    >
      <img
        src={card.imageSrc}
        alt={`${card.title} real estate`}
        decoding="async"
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover ${imagePositionClass} transition-transform duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]`}
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,42,0.06)_0%,rgba(8,20,42,0.1)_34%,rgba(8,20,42,0.74)_100%)]"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_42%)]"
      />

      <div className="relative flex h-full min-w-0 flex-col justify-end p-[16px] sm:p-[18px]">
        {featured ? (
          <>
            <span className="text-[10px] font-medium uppercase leading-[1.2] tracking-[0.14em] text-white/82 sm:text-[10.5px]">
              Looking for Property in
            </span>
            <span className="mt-[6px] text-[32px] font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-[35px]">
              {card.title}
            </span>
          </>
        ) : (
          <span className="text-[21px] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-[22px]">
            {card.title}
          </span>
        )}
      </div>
    </Link>
  )
}

function PopularLocationPanel({
  panel,
}: {
  panel: PopularLocationPanel
}) {
  if (panel.layout === 'featured') {
    return (
      <PopularLocationCard
        card={panel.cards[0]}
        featured
        className="h-[348px] sm:h-[370px] lg:h-[394px]"
      />
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-[18px]">
      {panel.cards.map((card) => (
        <PopularLocationCard
          key={card.slug}
          card={card}
          className="h-[165px] sm:h-[176px] lg:h-[188px]"
        />
      ))}
    </div>
  )
}

function formatCounterValue(value: number) {
  return String(value).padStart(2, '0')
}

export default function LocationPopularSearchesCarousel({
  cards,
}: LocationPopularSearchesCarouselProps) {
  const panels = useMemo(() => buildPanels(cards), [cards])
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [activeSnap, setActiveSnap] = useState(0)
  const [snapCount, setSnapCount] = useState(panels.length)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(panels.length > 1)

  useEffect(() => {
    if (!carouselApi) return

    const syncCarouselState = () => {
      setActiveSnap(carouselApi.selectedScrollSnap())
      setSnapCount(carouselApi.scrollSnapList().length)
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }

    syncCarouselState()
    carouselApi.on('select', syncCarouselState)
    carouselApi.on('reInit', syncCarouselState)

    return () => {
      carouselApi.off('select', syncCarouselState)
      carouselApi.off('reInit', syncCarouselState)
    }
  }, [carouselApi])

  if (!panels.length) return null

  return (
    <div className="w-full min-w-0 bg-transparent">
      <div className="relative bg-transparent px-[2px] py-[6px] sm:py-[8px]">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'start',
            dragFree: true,
            loop: panels.length > 1,
            skipSnaps: false,
          }}
          className="w-full cursor-grab active:cursor-grabbing select-none"
        >
          <CarouselContent className="-ml-[18px]">
            {panels.map((panel) => (
              <CarouselItem
                key={panel.id}
                className={`pl-[18px] ${PANEL_WIDTH_CLASSES[panel.layout]}`}
              >
                <PopularLocationPanel panel={panel} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="mt-[18px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-[14px]">
          <div className="flex items-center gap-[10px] text-[11px] font-medium uppercase tracking-[0.18em] text-[#173260]/76">
            <span>{formatCounterValue(Math.min(activeSnap + 1, snapCount))}</span>
            <span className="h-px w-[54px] bg-[#d7e2f1]" />
            <span>{formatCounterValue(snapCount)}</span>
          </div>
          <span className="hidden text-[12px] font-medium tracking-[-0.01em] text-[#173260]/60 sm:inline">
            Drag to explore more places
          </span>
        </div>

        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            aria-label="Previous locations"
            disabled={!canScrollPrev}
            onClick={() => carouselApi?.scrollPrev()}
            className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#d8e2f1] bg-white text-[#173260] transition-[transform,border-color,color,background-color,opacity] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-[#c5d3eb] hover:bg-[#f8faff] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            <ChevronLeft size={18} strokeWidth={2.1} />
          </button>
          <button
            type="button"
            aria-label="Next locations"
            disabled={!canScrollNext}
            onClick={() => carouselApi?.scrollNext()}
            className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#d8e2f1] bg-white text-[#173260] transition-[transform,border-color,color,background-color,opacity] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-[#c5d3eb] hover:bg-[#f8faff] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            <ChevronRight size={18} strokeWidth={2.1} />
          </button>
        </div>
      </div>
    </div>
  )
}
