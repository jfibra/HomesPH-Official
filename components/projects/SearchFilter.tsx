'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, ChevronDown, Check } from 'lucide-react'

export default function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize from URL search params
  const [q, setQ] = useState(searchParams.get('q') || '')
  
  // Custom dropdown states
  const [typeOpen, setTypeOpen] = useState(false)
  const [bedsOpen, setBedsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  // Type (Residential/Commercial) State
  const [resTab, setResTab] = useState<'Residential' | 'Commercial'>('Residential')
  const [resSelections, setResSelections] = useState<string[]>([])

  // Beds & Baths State
  const [selectedBeds, setSelectedBeds] = useState<string[]>([])
  const [selectedBaths, setSelectedBaths] = useState<string[]>([])

  // More Filter State
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [areaMin, setAreaMin] = useState('')
  const [areaMax, setAreaMax] = useState('')
  const [keywords, setKeywords] = useState('')
  const [agent, setAgent] = useState('')
  const [tourTypes, setTourTypes] = useState<string[]>([])

  const typeRef = useRef<HTMLDivElement>(null)
  const bedsRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  // Sync state with URL when params change (e.g. back button)
  useEffect(() => {
    setQ(searchParams.get('q') || '')
    const typeParam = searchParams.get('type')
    if (typeParam) setResSelections(typeParam.split(','))
    else setResSelections([])

    const bedsParam = searchParams.get('beds')
    if (bedsParam) setSelectedBeds(bedsParam.split(','))
    else setSelectedBeds([])

    const bathsParam = searchParams.get('baths')
    if (bathsParam) setSelectedBaths(bathsParam.split(','))
    else setSelectedBaths([])

    setPriceMin(searchParams.get('priceMin') || '')
    setPriceMax(searchParams.get('priceMax') || '')
    setAreaMin(searchParams.get('areaMin') || '')
    setAreaMax(searchParams.get('areaMax') || '')
    setKeywords(searchParams.get('keywords') || '')
    setAgent(searchParams.get('agent') || '')
    
    const toursParam = searchParams.get('tourTypes')
    if (toursParam) setTourTypes(toursParam.split(','))
    else setTourTypes([])
  }, [searchParams])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeOpen(false)
      }
      if (bedsRef.current && !bedsRef.current.contains(event.target as Node)) {
        setBedsOpen(false)
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateUrl = (overrides = {}) => {
    const params = new URLSearchParams(searchParams.toString())
    
    const state: Record<string, string> = { 
      q, 
      type: resSelections.join(','), 
      beds: selectedBeds.join(','),
      baths: selectedBaths.join(','),
      priceMin,
      priceMax,
      areaMin,
      areaMax,
      keywords,
      agent,
      tourTypes: tourTypes.join(','),
      ...overrides 
    }

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

  const resOptions = ['Apartment', 'Townhouse', 'Villa Compound', 'Land', 'Building', 'Villa', 'Penthouse', 'Hotel Apartment', 'Floor']
  const bedOptions = ['Studio', '1', '2', '3', '4', '5', '6+']
  const bathOptions = ['1', '2', '3', '4', '5', '6+']

  const toggleResSelection = (opt: string) => {
    setResSelections(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])
  }

  const toggleBedSelection = (opt: string) => {
    setSelectedBeds(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])
  }

  const toggleBathSelection = (opt: string) => {
    setSelectedBaths(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])
  }

  const toggleTourType = (opt: string) => {
    setTourTypes(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])
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
        <div className="relative w-[197.04px] lg:w-48 h-[55.29px] shrink-0" ref={typeRef}>
          <button
            type="button"
            onClick={() => { setTypeOpen(!typeOpen); setBedsOpen(false); setMoreOpen(false); }}
            className={`w-full h-full border ${typeOpen ? 'border-[#1428AE]' : 'border-[#D3D3D3]'} rounded-lg px-4 flex items-center justify-between text-[22px] text-[#002143] font-outfit font-light bg-white hover:border-gray-300 transition-colors`}
          >
            <span className="truncate">{resSelections.length > 0 ? resSelections[0] + (resSelections.length > 1 ? ` (+${resSelections.length - 1})` : '') : 'Residential'}</span>
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${typeOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {typeOpen && (
            <div className="absolute top-[calc(100%+20px)] right-0 w-[515px] bg-white rounded-[10px] shadow-[0px_0px_10px_rgba(0,33,67,0.2)] z-50 p-6 flex flex-col">
              {/* Triangle pointer */}
              <div 
                className="absolute -top-[10px] right-[42px] w-[24px] h-[24px] bg-white rounded-[2px] rotate-45" 
                style={{ boxShadow: '-5px -5px 10px -4px rgba(0, 33, 67, 0.15)' }}
              ></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex border-b border-[#F0F0F0] mb-6 relative">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setResTab('Residential'); }}
                    className={`flex-1 pb-3 text-[16px] font-outfit transition-all relative z-10 ${resTab === 'Residential' ? 'text-[#1428AE] font-semibold border-b-2 border-[#1428AE]' : 'text-[#8187B0] font-medium'}`}
                  >
                    Residential
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setResTab('Commercial'); }}
                    className={`flex-1 pb-3 text-[16px] font-outfit transition-all relative z-10 ${resTab === 'Commercial' ? 'text-[#1428AE] font-semibold border-b-2 border-[#1428AE]' : 'text-[#8187B0] font-medium'}`}
                  >
                    Commercial
                  </button>
                </div>
                
                <div className="grid grid-rows-5 grid-flow-col gap-x-4 gap-y-3 mb-[28px] flex-1">
                  {resOptions.map(opt => (
                    <div 
                      key={opt} 
                      onClick={() => toggleResSelection(opt)}
                      className={`flex items-center gap-3 border rounded-[8px] h-[45px] px-4 cursor-pointer transition-all ${resSelections.includes(opt) ? 'border-[#1428AE] bg-[#F4F6FF]' : 'border-[#EAEAEA] hover:border-gray-300'}`}
                    >
                      <div className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center shrink-0 ${resSelections.includes(opt) ? 'bg-[#1428AE] border-[#1428AE]' : 'border-[#D3D3D3]'}`}>
                        {resSelections.includes(opt) && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-[14px] font-outfit font-light ${resSelections.includes(opt) ? 'text-[#1428AE]' : 'text-[#8187B0]'}`}>{opt}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-auto">
                  <button type="button" onClick={() => { setResSelections([]); updateUrl({ type: '' }); }} className="flex-1 h-[42px] border border-[#1428AE] text-[#1428AE] rounded-[8px] font-outfit font-medium text-[16px] hover:bg-[#F4F6FF] transition-colors bg-white">
                    Reset
                  </button>
                  <button type="button" onClick={() => { setTypeOpen(false); updateUrl({ type: resSelections.join(',') }); }} className="flex-1 h-[42px] bg-[#001392] text-white rounded-[8px] font-outfit font-medium text-[16px] hover:bg-[#1428AE] transition-colors border border-[#001392]">
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Beds & Baths Dropdown */}
        <div className="relative w-full lg:w-48 h-[55px] shrink-0" ref={bedsRef}>
           <button
            type="button"
            onClick={() => { setBedsOpen(!bedsOpen); setTypeOpen(false); setMoreOpen(false); }}
            className={`w-full h-full border ${bedsOpen ? 'border-[#1428AE]' : 'border-[#D3D3D3]'} rounded-lg px-4 flex items-center justify-between text-[22px] text-[#002143] font-outfit font-light bg-white hover:border-gray-300 transition-colors`}
          >
            <span className="truncate">
              {selectedBeds.length > 0 || selectedBaths.length > 0 ? 
                [selectedBeds.length ? `${selectedBeds.length} Beds` : null, selectedBaths.length ? `${selectedBaths.length} Baths` : null].filter(Boolean).join(', ')
                : 'Beds & Baths'
              }
            </span>
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${bedsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {bedsOpen && (
            <div className="absolute top-[calc(100%+20px)] right-0 w-[355px] bg-white rounded-[10px] shadow-[0px_0px_10px_rgba(0,33,67,0.2)] z-50 p-6">
               {/* Triangle pointer */}
               <div 
                 className="absolute -top-[10px] right-[41px] w-[24px] h-[24px] bg-white rounded-[2px] rotate-45"
                 style={{ boxShadow: '-5px -5px 10px -4px rgba(0, 33, 67, 0.15)' }}
               ></div>
               
               <div className="relative z-10 space-y-6">
                 <div>
                   <h4 className="text-[16px] font-outfit font-semibold text-[#002143] mb-4">Beds</h4>
                   <div className="flex flex-wrap gap-2">
                     {bedOptions.map(opt => (
                       <button
                         key={opt}
                         type="button"
                         onClick={(e) => { e.preventDefault(); toggleBedSelection(opt); }}
                         className={`h-[40px] min-w-[45px] px-3 rounded-[8px] border font-outfit transition-all text-[14px] ${selectedBeds.includes(opt) ? 'border-[#1428AE] bg-[#F4F6FF] text-[#1428AE] font-semibold' : 'border-[#EAEAEA] text-[#8187B0] font-medium hover:border-gray-300'}`}
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <h4 className="text-[16px] font-outfit font-semibold text-[#002143] mb-4">Baths</h4>
                   <div className="flex flex-wrap gap-2">
                     {bathOptions.map(opt => (
                       <button
                         key={opt}
                         type="button"
                         onClick={(e) => { e.preventDefault(); toggleBathSelection(opt); }}
                         className={`h-[40px] min-w-[45px] px-3 rounded-[8px] border font-outfit transition-all text-[14px] ${selectedBaths.includes(opt) ? 'border-[#1428AE] bg-[#F4F6FF] text-[#1428AE] font-semibold' : 'border-[#EAEAEA] text-[#8187B0] font-medium hover:border-gray-300'}`}
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 <div className="flex gap-4 pt-2">
                   <button type="button" onClick={() => { setSelectedBeds([]); setSelectedBaths([]); updateUrl({ beds: '', baths: '' }); }} className="flex-1 h-[42px] border border-[#1428AE] text-[#1428AE] rounded-[8px] font-outfit font-medium text-[16px] hover:bg-[#F4F6FF] transition-colors bg-white">
                     Reset
                   </button>
                   <button type="button" onClick={() => { setBedsOpen(false); updateUrl({ beds: selectedBeds.join(','), baths: selectedBaths.join(',') }); }} className="flex-1 h-[42px] bg-[#001392] text-white rounded-[8px] font-outfit font-medium text-[16px] hover:bg-[#1428AE] transition-colors border border-[#001392]">
                     Done
                   </button>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* More Filter Dropdown */}
        <div className="relative shrink-0" ref={moreRef}>
          <button 
            type="button" 
            onClick={() => { setMoreOpen(!moreOpen); setTypeOpen(false); setBedsOpen(false); }}
            className={`w-full lg:w-auto h-[55px] flex items-center justify-center gap-3 border ${moreOpen ? 'border-[#1428AE] text-[#1428AE]' : 'border-[#D3D3D3] text-[#002143]'} rounded-lg px-6 text-[22px] font-outfit font-light hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer bg-white`}
          >
            More Filter
            <SlidersHorizontal size={20} className={moreOpen ? 'text-[#1428AE]' : 'text-[#002143]'} />
          </button>

          {moreOpen && (
            <div className="absolute top-[calc(100%+20px)] right-0 w-[379px] bg-white rounded-[10px] shadow-[0px_0px_10px_rgba(0,33,67,0.2)] z-50 p-6">
               {/* Triangle pointer */}
               <div
                 className="absolute -top-[10px] right-[26px] w-[24px] h-[24px] bg-white rounded-[2px] rotate-45"
                 style={{ boxShadow: '-5px -5px 10px -4px rgba(0, 33, 67, 0.15)' }}
               ></div>
               
               <div className="relative z-10 space-y-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                 {/* Price */}
                 <div>
                   <h4 className="text-[16px] font-outfit font-medium text-[#002143] mb-2">Price (PHP)</h4>
                   <div className="flex gap-3">
                     <div className="flex-1">
                       <label className="text-[12px] font-outfit font-light text-[#8187B0] mb-1 block">Minimum</label>
                       <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0" className="w-full h-[40px] border border-[#D3D3D3] rounded-[8px] px-3 text-[14px] focus:outline-none focus:border-[#1428AE] font-outfit font-light text-[#002143]" />
                     </div>
                     <div className="flex-1">
                       <label className="text-[12px] font-outfit font-light text-[#8187B0] mb-1 block">Maximum</label>
                       <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Any" className="w-full h-[40px] border border-[#D3D3D3] rounded-[8px] px-3 text-[14px] focus:outline-none focus:border-[#1428AE] font-outfit font-light text-[#002143]" />
                     </div>
                   </div>
                 </div>

                 {/* Area */}
                 <div>
                   <h4 className="text-[16px] font-outfit font-medium text-[#002143] mb-2">Area (sqm)</h4>
                   <div className="flex gap-3">
                     <div className="flex-1">
                       <label className="text-[12px] font-outfit font-light text-[#8187B0] mb-1 block">Minimum</label>
                       <input type="number" value={areaMin} onChange={e => setAreaMin(e.target.value)} placeholder="0" className="w-full h-[40px] border border-[#D3D3D3] rounded-[8px] px-3 text-[14px] focus:outline-none focus:border-[#1428AE] font-outfit font-light text-[#002143]" />
                     </div>
                     <div className="flex-1">
                       <label className="text-[12px] font-outfit font-light text-[#8187B0] mb-1 block">Maximum</label>
                       <input type="number" value={areaMax} onChange={e => setAreaMax(e.target.value)} placeholder="Any" className="w-full h-[40px] border border-[#D3D3D3] rounded-[8px] px-3 text-[14px] focus:outline-none focus:border-[#1428AE] font-outfit font-light text-[#002143]" />
                     </div>
                   </div>
                 </div>

                 {/* Keywords */}
                 <div>
                   <h4 className="text-[16px] font-outfit font-medium text-[#002143] mb-2">Keywords</h4>
                   <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Add relevant keywords" className="w-full h-[40px] border border-[#D3D3D3] rounded-[8px] px-3 text-[14px] focus:outline-none focus:border-[#1428AE] font-outfit font-light text-[#002143]" />
                 </div>

                 {/* Agent or Agency */}
                 <div>
                   <h4 className="text-[16px] font-outfit font-medium text-[#002143] mb-2">Agent or Agency</h4>
                   <input type="text" value={agent} onChange={e => setAgent(e.target.value)} placeholder="Select an agent or agency" className="w-full h-[40px] border border-[#D3D3D3] rounded-[8px] px-3 text-[14px] focus:outline-none focus:border-[#1428AE] font-outfit font-light text-[#002143]" />
                 </div>

                 {/* Tour Type */}
                 <div>
                   <h4 className="text-[16px] font-outfit font-medium text-[#002143] mb-2">Tour Type</h4>
                   <div className="grid grid-cols-3 gap-2">
                     {['Floor Plans', 'Video Tours', '360° Tours'].map(opt => (
                       <button
                         key={opt}
                         type="button"
                         onClick={(e) => { e.preventDefault(); toggleTourType(opt); }}
                         className={`h-[40px] px-2 rounded-[8px] border font-outfit font-light text-[13px] transition-all truncate ${tourTypes.includes(opt) ? 'border-[#1428AE] bg-[#F4F6FF] text-[#1428AE] font-semibold' : 'border-[#EAEAEA] text-[#8187B0] hover:border-gray-300'}`}
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 <div className="flex gap-4 pt-4 mt-4 border-t border-gray-100">
                   <button type="button" onClick={() => { setPriceMin(''); setPriceMax(''); setAreaMin(''); setAreaMax(''); setKeywords(''); setAgent(''); setTourTypes([]); updateUrl({ priceMin: '', priceMax: '', areaMin: '', areaMax: '', keywords: '', agent: '', tourTypes: '' }); }} className="flex-1 h-[45px] border border-[#1428AE] text-[#1428AE] rounded-[8px] font-outfit font-medium text-[16px] hover:bg-[#F4F6FF] transition-colors">
                     Reset
                   </button>
                   <button type="button" onClick={() => { setMoreOpen(false); updateUrl(); }} className="flex-1 h-[45px] bg-[#1428AE] text-white rounded-[8px] font-outfit font-medium text-[16px] hover:bg-[#001392] transition-colors">
                     Done
                   </button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Action Links */}
      <div className="flex justify-end gap-6 text-xs font-bold text-[#1428ae] mt-1 pr-2">
        <button
          type="button"
          onClick={() => { 
            setQ('')
            setResSelections([])
            setSelectedBeds([])
            setSelectedBaths([])
            setPriceMin('')
            setPriceMax('')
            setAreaMin('')
            setAreaMax('')
            setKeywords('')
            setAgent('')
            setTourTypes([])
            router.push('/projects') 
          }}
          className="font-outfit font-medium text-[16px] text-[#001392] hover:underline transition-all cursor-pointer"
        >
          Clear Filters
        </button>
        <button type="button" className="font-outfit font-medium text-[16px] text-[#001392] hover:underline transition-all cursor-pointer">Save Search</button>
      </div>
    </form>
  )
}
