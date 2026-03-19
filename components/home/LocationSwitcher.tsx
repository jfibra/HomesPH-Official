"use client"

import { useEffect, useState } from 'react'
import { useSelectedLocation } from '@/hooks/use-selected-location'
import { useRouter } from 'next/navigation'

export default function LocationSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { selectedLocation, setSelectedLocation } = useSelectedLocation()
  const [locations, setLocations] = useState<{ title: string; slug: string }[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/site-locations')
        if (!res.ok) return
        const data = await res.json()
        if (mounted) setLocations(data)
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  function handleSelect(slug: string) {
    setSelectedLocation(slug)
    setOpen(false)
    router.push(`/${slug}`)
  }

  const isDark = variant === 'dark'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className={`uppercase font-bold text-xs px-2.5 py-1 rounded-md border transition-colors ${
          isDark
            ? 'border-white/20 bg-white/10 text-blue-100 hover:bg-white/20 hover:text-white'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        📍 {selectedLocation ?? 'Select location'} ▼
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-56 bg-white border border-gray-100 rounded-md shadow-lg">
          <div className="max-h-64 overflow-auto">
            {locations.map((l) => (
              <button
                key={l.slug}
                onClick={() => handleSelect(l.slug)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 uppercase font-semibold"
              >
                {l.title}
              </button>
            ))}
            {locations.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">No locations</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
