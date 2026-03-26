'use client'

import type { HeroMode } from './LocationHeroControls'

interface LocationHeroModeSwitchProps {
  activeMode: HeroMode
  onModeChange: (mode: HeroMode) => void
}

const SEGMENTED_TRANSITION =
  'motion-reduce:transition-none transition-[transform,background-color,color,opacity,box-shadow,border-color] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]'

export default function LocationHeroModeSwitch({
  activeMode,
  onModeChange,
}: LocationHeroModeSwitchProps) {
  const handleModeChange = (nextMode: HeroMode) => {
    if (nextMode === activeMode) {
      return
    }

    onModeChange(nextMode)
  }

  return (
    <div
      role="tablist"
      aria-label="Search mode"
      className="relative isolate inline-grid w-full max-w-[432px] grid-cols-2 items-center rounded-[24px] border border-white/18 bg-[linear-gradient(180deg,rgba(244,247,252,0.18)_0%,rgba(226,233,244,0.1)_100%)] p-[5px] backdrop-blur-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_58%)] opacity-90"
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-[5px] left-[5px] z-0 w-[calc(50%_-_5px)] rounded-[19px] border border-[#3150f5]/10 bg-[linear-gradient(180deg,#2d48ea_0%,#2140d8_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_16px_rgba(33,64,216,0.2)] ${SEGMENTED_TRANSITION} ${activeMode === 'manual' ? 'translate-x-full' : 'translate-x-0'}`}
      />

      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'ai'}
        onClick={() => handleModeChange('ai')}
        className={`relative z-10 inline-flex min-h-[64px] items-center justify-center px-[34px] text-[17px] font-medium leading-none tracking-[-0.03em] ${SEGMENTED_TRANSITION} focus-visible:outline-none ${activeMode === 'ai' ? 'text-white opacity-100' : 'text-white/[0.72] opacity-100 hover:text-white/[0.88]'}`}
      >
        AI Mode
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'manual'}
        onClick={() => handleModeChange('manual')}
        className={`relative z-10 inline-flex min-h-[64px] items-center justify-center px-[34px] text-[17px] font-medium leading-none tracking-[-0.03em] ${SEGMENTED_TRANSITION} focus-visible:outline-none ${activeMode === 'manual' ? 'text-white opacity-100' : 'text-white/[0.72] opacity-100 hover:text-white/[0.88]'}`}
      >
        Manual Mode
      </button>
    </div>
  )
}
