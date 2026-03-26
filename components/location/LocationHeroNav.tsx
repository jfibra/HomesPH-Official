'use client'

import Link from 'next/link'
import { useSelectedLocation } from '@/hooks/use-selected-location'

interface LocationHeroNavItem {
  label: string
  href: string
  clearLocation?: boolean
}

export default function LocationHeroNav({
  items,
}: {
  items: LocationHeroNavItem[]
}) {
  const { clearSelectedLocation } = useSelectedLocation()

  return (
    <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-[40px] text-[15px] font-medium tracking-[-0.025em] text-white/96 lg:flex">
      {items.map((item) => (
        <Link
          key={`${item.label}-${item.href}`}
          href={item.href}
          onClick={item.clearLocation ? clearSelectedLocation : undefined}
          className="transition hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
