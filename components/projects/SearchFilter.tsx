'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Search, SlidersHorizontal } from 'lucide-react'

export default function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize from URL search params
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [contract, setContract] = useState(searchParams.get('contract') || 'Buy')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [beds, setBeds] = useState(searchParams.get('beds') || '')

  // Sync state with URL when params change (e.g. back button)
  useEffect(() => {
    setQ(searchParams.get('q') || '')
    setContract(searchParams.get('contract') || 'Buy')
    setType(searchParams.get('type') || '')
    setBeds(searchParams.get('beds') || '')
  }, [searchParams])

  const handleToggle = (value: string) => {
    setContract(value)
    updateUrl({ contract: value })
  }

  const updateUrl = (overrides = {}) => {
    const params = new URLSearchParams(searchParams.toString())
    const state = { q, contract, type, beds, ...overrides }

    Object.entries(state).forEach(([key, val]) => {
      if (val) params.set(key, val)
      else params.delete(key)
    })

    router.push(`/projects?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Top Row: Search Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Location Input */}
        <div className="flex-1 w-[685px] flex items-center border border-[#001392] rounded-lg pl-4 pr-1.5 h-[55px]">
          <Search size={20} className="text-[#1428ae] mr-3 shrink-0" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="City, community, or building"
            className="w-full text-[22px] focus:outline-none text-[#002143] placeholder-[#002143] font-outfit font-light bg-transparent"
          />
          <button type="submit" className="w-[115px] h-[45px] shrink-0 flex items-center justify-center gap-3 rounded-[10px] px-6 text-[18px] text-[#FFFFFF] font-outfit font-light bg-[#1428AE] cursor-pointer">
            Search
          </button>
        </div>

        {/* Residential Dropdown */}
        <div className="w-[197.04px] lg:w-48 h-[55.29px] shrink-0">
          <select
            value={type}
            onChange={(e) => {
              const val = e.target.value
              setType(val)
              updateUrl({ type: val })
            }}
            className="w-full h-full border border-[#D3D3D3] rounded-lg px-4 text-[22px] text-[#002143] font-outfit font-light focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat cursor-pointer hover:border-gray-300 transition-colors"
          >
            <option value="">Residential</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* Beds & Baths Dropdown */}
        <div className="w-full lg:w-48 h-[55px] shrink-0">
          <select
            value={beds}
            onChange={(e) => {
              const val = e.target.value
              setBeds(val)
              updateUrl({ beds: val })
            }}
            className="w-full h-full border border-[#D3D3D3] rounded-lg px-4 text-[22px] text-[#002143] font-outfit font-light focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat cursor-pointer hover:border-gray-300 transition-colors"
          >
            <option value="">Beds &amp; Baths</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
          </select>
        </div>

        {/* More Filter Button */}
        <button type="submit" className="w-full lg:w-auto h-[55px] shrink-0 flex items-center justify-center gap-3 border border-[#D3D3D3] rounded-lg px-6 text-[22px] text-[#002143] font-outfit font-light hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
          More Filter
          <SlidersHorizontal size={20} className="text-[#002143]" />
        </button>
      </div>

      {/* Bottom Row: Action Links */}
      <div className="flex justify-end gap-6 text-xs font-bold text-[#1428ae] mt-1 pr-2">
        <button
          type="button"
          onClick={() => { setQ(''); setContract('Buy'); setType(''); setBeds(''); router.push('/projects') }}
          className="font-outfit font-medium text-[16px] text-[#001392] hover:underline transition-all cursor-pointer"
        >
          Clear Filters
        </button>
        <button type="button" className="font-outfit font-medium text-[16px] text-[#001392] hover:underline transition-all cursor-pointer">Save Search</button>
      </div>
    </form>
  )
}
