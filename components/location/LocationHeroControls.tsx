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
  const [activeMode, setActiveMode] = useState<HeroMode>('ai')

  return (
    <>
      <div className="mt-[34px]">
        <LocationHeroModeSwitch activeMode={activeMode} onModeChange={setActiveMode} />
      </div>

      <div className="mt-[26px] w-full max-w-[1060px] xl:h-[188px]">
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
