'use client'

import { useState } from 'react'
import { ChevronDown, Mic, Search } from 'lucide-react'
import type { HeroMode } from './LocationHeroControls'

interface HeroQuickLink {
  label: string
  href: string
}

interface LocationHeroSearchCardProps {
  locationName: string
  locationSlug: string
  quickLinks: HeroQuickLink[]
  mode: HeroMode
}

const CONTENT_TRANSITION =
  'transition-[background-color,border-color,color,opacity,transform] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]'

const MANUAL_SEGMENT_TRANSITION =
  'transition-[transform,background-color,color,opacity] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]'

const MODE_PANEL_TRANSITION =
  'motion-reduce:animate-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 duration-300'

const MANUAL_PROPERTY_OPTIONS = [
  { value: 'residential', label: 'Residential' },
  { value: 'condominium', label: 'Condominium' },
  { value: 'house-and-lot', label: 'House & Lot' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial' },
]

const MANUAL_BED_OPTIONS = [
  { value: '', label: 'Beds & Baths' },
  { value: '1', label: '1+ Bed / 1+ Bath' },
  { value: '2', label: '2+ Beds / 2+ Baths' },
  { value: '3', label: '3+ Beds / 3+ Baths' },
  { value: '4', label: '4+ Beds / 4+ Baths' },
]

const MANUAL_PRICE_OPTIONS = [
  { value: '', label: 'Price (PhP)' },
  { value: '3000000', label: 'Up to PHP 3M' },
  { value: '5000000', label: 'Up to PHP 5M' },
  { value: '10000000', label: 'Up to PHP 10M' },
  { value: '20000000', label: 'Up to PHP 20M' },
]

const AI_PROMPT_SUGGESTIONS_BY_SLUG: Record<string, string[]> = {
  cebu: [
    'Condominium in Cebu City',
    'Studio Apartment in Cebu',
    'Apartment Near IT Park',
    'Studio Condo in Mandaue',
  ],
  bgc: [
    'Condo in BGC',
    'Apartment Near Uptown',
    'Studio Near High Street',
    '2 Bedroom in Taguig',
  ],
  makati: [
    'Condo in Makati',
    'Apartment Near Ayala Avenue',
    'Studio in Legazpi Village',
    '1 Bedroom Near Salcedo',
  ],
  manila: [
    'Condo in Manila',
    'Apartment Near Taft',
    'Studio in Ermita',
    'Affordable Condo in Manila',
  ],
}

function buildAiSuggestions(
  locationName: string,
  locationSlug: string,
  quickLinks: HeroQuickLink[]
) {
  const predefinedSuggestions = AI_PROMPT_SUGGESTIONS_BY_SLUG[locationSlug]

  if (predefinedSuggestions) {
    return predefinedSuggestions
  }

  const fallbackLabel = locationName.trim()
  const quickLinkLabels = quickLinks.map((item) => item.label.toLowerCase())

  return [
    `Condominium in ${fallbackLabel}`,
    `Studio Apartment in ${fallbackLabel}`,
    `${quickLinkLabels.includes('projects') ? 'Projects' : 'Homes'} in ${fallbackLabel}`,
    `1 Bedroom in ${fallbackLabel}`,
  ]
}

function AIActionGlyph() {
  return (
    <span aria-hidden className="flex items-end gap-[2px]">
      <span className="h-[8px] w-[2px] rounded-full bg-white" />
      <span className="h-[14px] w-[2px] rounded-full bg-white" />
      <span className="h-[18px] w-[2px] rounded-full bg-white" />
      <span className="h-[11px] w-[2px] rounded-full bg-white" />
    </span>
  )
}

function ManualFilterSelect({
  ariaLabel,
  defaultValue,
  name,
  options,
}: {
  ariaLabel: string
  defaultValue: string
  name: string
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        className="h-[56px] w-full appearance-none rounded-[14px] border border-[#d7deef] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] px-[16px] pr-[44px] text-[15px] font-medium tracking-[-0.03em] text-[#173260] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition-[border-color,box-shadow,background-color] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#c7d2eb] focus:border-[#b9c7ea] sm:h-[58px] sm:px-[18px] sm:text-[17px]"
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((option) => (
          <option key={`${name}-${option.value || 'default'}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        size={18}
        strokeWidth={2.25}
        className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2 text-[#173260]"
      />
    </div>
  )
}

export default function LocationHeroSearchCard({
  locationName,
  locationSlug,
  quickLinks,
  mode,
}: LocationHeroSearchCardProps) {
  const [manualListingType, setManualListingType] = useState<'sale' | 'rent'>('sale')
  const [aiQuery, setAiQuery] = useState('')
  const isAiMode = mode === 'ai'
  const aiSuggestions = buildAiSuggestions(locationName, locationSlug, quickLinks)
  const placeholder = isAiMode
    ? `Try "Apartment in ${locationName}"`
    : 'City, community or building'
  const submitLabel = isAiMode ? 'Search with AI' : 'Search manually'

  return (
    <form
      action="/search"
      method="GET"
      className="mx-auto w-full max-w-[1060px] overflow-hidden rounded-[22px] border border-white/82 bg-white px-[14px] py-[14px] text-left text-[#11204b] shadow-[0_22px_50px_rgba(8,23,56,0.2)] sm:px-[18px] sm:py-[16px] xl:h-[188px]"
    >
      <input type="hidden" name="location" value={locationSlug} />
      <input type="hidden" name="mode" value={mode} />
      {!isAiMode ? <input type="hidden" name="type" value={manualListingType} /> : null}

      <div key={mode} className={`${MODE_PANEL_TRANSITION} xl:flex xl:h-full xl:flex-col xl:justify-center`}>
        {isAiMode ? (
          <div className="space-y-[14px] xl:space-y-[16px]">
            <div className="grid h-[56px] grid-cols-[18px_minmax(0,1fr)_18px_44px] items-center gap-[12px] rounded-[15px] border border-[#3150f5] bg-white px-[16px] shadow-[0_0_0_1px_rgba(49,80,245,0.03)] sm:h-[58px] sm:grid-cols-[18px_minmax(0,1fr)_20px_46px] sm:px-[18px]">
              <Search size={18} strokeWidth={2} className="shrink-0 text-[#173260]" />
              <input
                aria-label="Search properties"
                name="q"
                placeholder={placeholder}
                type="search"
                value={aiQuery}
                onChange={(event) => setAiQuery(event.target.value)}
                className={`min-w-0 border-0 bg-transparent text-[15px] leading-6 tracking-[-0.02em] text-[#173260] placeholder:text-[#42577c] focus:outline-none sm:text-[16px] ${CONTENT_TRANSITION}`}
              />

              <button
                type="button"
                aria-label="Voice search"
                className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[#2140d8] transition hover:text-[#1b35b8] sm:h-[20px] sm:w-[20px]"
              >
                <Mic size={17} />
              </button>

              <button
                type="submit"
                aria-label={submitLabel}
                className={`inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#2140d8] text-white hover:bg-[#1b35b8] sm:h-[46px] sm:w-[46px] ${CONTENT_TRANSITION}`}
              >
                <AIActionGlyph />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-[12px] min-[560px]:grid-cols-2 lg:grid-cols-4 xl:gap-[10px]">
              {aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setAiQuery(suggestion)}
                  className="inline-flex h-[40px] min-w-0 items-center justify-center rounded-[11px] border border-[#3150f5] bg-white px-[14px] text-center text-[13px] font-medium tracking-[-0.02em] text-[#2140d8] transition-[border-color,background-color,color,transform] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-[#2342df] hover:bg-[#f5f8ff] sm:text-[13.5px]"
                >
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-[14px] xl:space-y-[16px]">
            <div className="flex min-h-[56px] items-center gap-[14px] rounded-[14px] border border-[#d8dfef] bg-white px-[16px] sm:min-h-[58px] sm:px-[18px]">
              <Search size={18} strokeWidth={2.1} className="shrink-0 text-[#173260]" />
              <input
                aria-label="Search manually"
                name="q"
                placeholder={placeholder}
                type="search"
                className={`min-w-0 flex-1 border-0 bg-transparent text-[15px] leading-6 tracking-[-0.02em] text-[#173260] placeholder:text-[#5c6d8a] focus:outline-none sm:text-[17px] ${CONTENT_TRANSITION}`}
              />

              <button
                type="submit"
                aria-label="Search manually"
                className={`inline-flex h-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[#2140d8] px-[22px] text-[15px] font-semibold tracking-[-0.02em] text-white hover:bg-[#1b35b8] sm:h-[44px] sm:px-[26px] sm:text-[16px] ${CONTENT_TRANSITION}`}
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-[194px_repeat(3,minmax(0,1fr))]">
              <div className="relative isolate grid grid-cols-2 rounded-[14px] border border-[#d7deef] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-y-[3px] left-[3px] z-0 w-[calc(50%_-_3px)] rounded-[11px] bg-[#dfe5ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ${MANUAL_SEGMENT_TRANSITION} ${manualListingType === 'rent' ? 'translate-x-full' : 'translate-x-0'}`}
                />

                <button
                  type="button"
                  aria-pressed={manualListingType === 'sale'}
                  onClick={() => setManualListingType('sale')}
                  className={`relative z-10 inline-flex h-[50px] items-center justify-center rounded-[11px] px-[18px] text-[15px] font-semibold tracking-[-0.03em] ${MANUAL_SEGMENT_TRANSITION} ${manualListingType === 'sale' ? 'text-[#2140d8]' : 'text-[#173260]'}`}
                >
                  Buy
                </button>

                <button
                  type="button"
                  aria-pressed={manualListingType === 'rent'}
                  onClick={() => setManualListingType('rent')}
                  className={`relative z-10 inline-flex h-[50px] items-center justify-center rounded-[11px] px-[18px] text-[15px] font-semibold tracking-[-0.03em] ${MANUAL_SEGMENT_TRANSITION} ${manualListingType === 'rent' ? 'text-[#2140d8]' : 'text-[#173260]'}`}
                >
                  Rent
                </button>
              </div>

              <ManualFilterSelect
                ariaLabel="Property type"
                defaultValue="residential"
                name="propertyCategory"
                options={MANUAL_PROPERTY_OPTIONS}
              />

              <ManualFilterSelect
                ariaLabel="Bedrooms and bathrooms"
                defaultValue=""
                name="beds"
                options={MANUAL_BED_OPTIONS}
              />

              <ManualFilterSelect
                ariaLabel="Maximum price"
                defaultValue=""
                name="max"
                options={MANUAL_PRICE_OPTIONS}
              />
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
