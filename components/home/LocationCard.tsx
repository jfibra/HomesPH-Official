'use client'

import { useState, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { serializeSelectedLocationCookie } from '@/lib/selected-location'

export interface Location {
  id: number
  title: string
  slug: string
  logo_url: string | null
  description: string | null
}

// Color-coded gradients cycle per card index
const GRADIENTS = [
  'from-blue-600 to-blue-800',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-700',
  'from-violet-500 to-purple-700',
  'from-rose-500 to-pink-700',
  'from-sky-500 to-cyan-700',
  'from-indigo-500 to-indigo-700',
  'from-lime-500 to-green-700',
  'from-orange-500 to-red-600',
  'from-teal-500 to-emerald-700',
]

export function LocationCard({
  location,
  index = 0,
}: {
  location: Location
  index?: number
}) {
  const [imgErr, setImgErr] = useState(false)
  const showImg = !imgErr && !!location.logo_url
  const initials = location.title.slice(0, 2).toUpperCase()
  const gradient = GRADIENTS[index % GRADIENTS.length]
  const router = useRouter()

  function handleSelect(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    document.cookie = serializeSelectedLocationCookie(location.slug)
    router.push(`/${location.slug}`)
  }

  return (
    <Link
      href={`/${location.slug}`}
      className="group flex flex-col items-center gap-4 p-6 rounded-xl bg-white
                 border border-slate-200 shadow-md shadow-slate-300/50
                 hover:shadow-xl hover:shadow-[#1428ae]/20 hover:-translate-y-1 hover:border-[#1428ae]/30
                 transition-all duration-200 text-center cursor-pointer"
      onClick={handleSelect}
    >
      {/* Icon / logo container */}
      <div
        className={`w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center shrink-0
                    group-hover:scale-110 transition-transform duration-200
                    ${
                      showImg
                        ? 'bg-gray-50 border border-gray-100 p-2'
                        : `bg-gradient-to-br ${gradient}`
                    }`}
      >
        {showImg ? (
          <img
            src={location.logo_url!}
            alt={`${location.title} logo`}
            className="w-full h-full object-contain"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-xl font-bold text-white select-none tracking-wide">
            {initials}
          </span>
        )}
      </div>

      {/* City name */}
      <span className="text-base font-semibold text-gray-800 group-hover:text-[#1428ae] transition-colors leading-tight">
        {location.title}
      </span>

      {/* Philippines sub-label */}
      <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-[#f59e0b] transition-colors">
        <MapPin size={11} strokeWidth={2} />
        Philippines
      </span>
    </Link>
  )
}
