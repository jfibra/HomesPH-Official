'use client'

import { useState } from 'react'
import LocationHeroModeSwitch from './LocationHeroModeSwitch'
import LocationHeroSearchCard from './LocationHeroSearchCard'

interface HeroQuickLink {
  label: string
  href: string
}

export type HeroMode = 'ai' | 'manual'

interface LocationHeroControlsProps {
  locationName: string
  locationSlug: string
  quickLinks: HeroQuickLink[]
}

export default function LocationHeroControls({
  locationName,
  locationSlug,
  quickLinks,
}: LocationHeroControlsProps) {
  const [activeMode, setActiveMode] = useState<HeroMode>('manual')

  return (
    <>
      <div className="mt-[24px] sm:mt-[30px]">
        <LocationHeroModeSwitch activeMode={activeMode} onModeChange={setActiveMode} />
      </div>

      <div className="mt-[18px] w-full max-w-[1060px] sm:mt-[24px]">
        <LocationHeroSearchCard
          locationName={locationName}
          locationSlug={locationSlug}
          quickLinks={quickLinks}
          mode={activeMode}
        />
      </div>
    </>
  )
}
