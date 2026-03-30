import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { getSiteSettings } from '@/lib/site-settings'
import { getPublicProjects } from '@/lib/projects-public'
import AdBanner from '@/components/ui/AdBanner'
import { MapPin, BedDouble, Bath, Heart, Share2, Mail, Phone, MessageCircle, ChevronLeft, ChevronRight, LayoutList, Map, ChevronDown, ListFilter, Bell } from 'lucide-react'
import SearchFilter from '@/components/projects/SearchFilter'
import React from 'react'

const fmt = (n?: number | null) => n ? `₱ ${Number(n).toLocaleString()}` : null
const fmtRange = (min?: number | null, max?: number | null) => {
  if (!min && !max) return 'Price on request'
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  return fmt(min ?? max) ?? 'Price on request'
}

export default async function ProjectsPage(
  props: { searchParams?: Promise<{ q?: string; location?: string; status?: string; type?: string; beds?: string; contract?: string; view?: string; sort?: string }> }
) {
  const sp = (await props.searchParams) ?? {}
  const settings = await getSiteSettings()

  const allProjects = await getPublicProjects()

  let projects = [...allProjects]

  if (sp.q) {
    const query = sp.q.toLowerCase().trim()
    projects = projects.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.city_municipality?.toLowerCase().includes(query) ||
      p.province?.toLowerCase().includes(query) ||
      p.project_type?.toLowerCase().includes(query)
    )
  }
  if (sp.location) projects = projects.filter(p => p.province?.toLowerCase().includes(sp.location!.toLowerCase()) || p.city_municipality?.toLowerCase().includes(sp.location!.toLowerCase()))
  if (sp.status) projects = projects.filter(p => p.status === sp.status)

  // Property Type Filtering
  if (sp.type) {
    projects = projects.filter(p => p.project_type?.toLowerCase().includes(sp.type!.toLowerCase()))
  }

  // Beds Filtering
  if (sp.beds) {
    const minBeds = parseInt(sp.beds)
    projects = projects.filter(p =>
      p.project_units?.some(u =>
        minBeds === 3 ? (u.bedrooms || 0) >= 3 : (u.bedrooms || 0) === minBeds
      )
    )
  }

  // Sorting Logic
  if (sp.sort === 'price-low') {
    projects.sort((a, b) => (a.price_range_min || 0) - (b.price_range_min || 0))
  } else if (sp.sort === 'price-high') {
    projects.sort((a, b) => (b.price_range_min || 0) - (a.price_range_min || 0))
  }

  // Calculate top 3 locations for the filter bar
  const locationStats = allProjects.reduce((acc, p) => {
    const loc = p.city_municipality || p.province
    if (loc) acc[loc] = (acc[loc] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topLocations = Object.entries(locationStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // Helper for generating query strings
  const getHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    Object.entries(sp).forEach(([k, v]) => { if (v) params.set(k, v) })
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined) params.delete(k)
      else params.set(k, v)
    })
    return `?${params.toString()}`
  }

  const getSortLabel = (s?: string) => {
    if (s === 'price-low') return 'Price: Low to High'
    if (s === 'price-high') return 'Price: High to Low'
    return 'Popular'
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <SiteHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />

      {/* â”€â”€ Hero â”€â”€ */}
      <div className="bg-[#0c1f4a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.6em] text-amber-400 mb-2">Nationwide Developments</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Property Projects</h1>
          <p className="text-blue-200 text-sm max-w-xl">
            Explore {MOCK_PROJECTS.length} master-planned communities from the Philippines' top developers.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* â”€â”€ Filters â”€â”€ */}
        <form method="GET" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Search Projects</label>
            <input
              name="q"
              defaultValue={sp.q}
              placeholder="Project name, city, developerâ€¦"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Location</label>
            <select name="location" defaultValue={sp.location ?? ''} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30">
              <option value="">All Locations</option>
              {MOCK_LOCATIONS.map(l => (
                <option key={l.slug} value={l.title}>{l.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
            <select name="status" defaultValue={sp.status ?? ''} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30">
              <option value="">All Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type</label>
            <select name="type" defaultValue={sp.type ?? ''} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30">
              <option value="">All Types</option>
              {types.map(t => t && <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-[#1428ae] text-white rounded-xl text-sm font-semibold hover:bg-amber-500 transition-colors">
            Filter
          </button>
        </form>

        {/* ── Main Content Area ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* ── Property Header Section ── */}
            <div className="mb-10">
              <nav className="flex items-center gap-2 text-[13px] text-gray-400 mb-5 font-medium uppercase tracking-wider">
                <span className="text-[#002143]">For Sale:</span>
                <Link href="/projects" className="text-[#002143] hover:text-[#002143] transition-colors">Philippine Properties</Link>
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <h1 className="text-[35px] text-[#002143] tracking-tight font-outfit font-normal">
                  Properties for sale in Philippines
                </h1>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Popular Sort Dropdown */}
                  <button className="flex items-center gap-3 px-5 py-2.5 rounded-lg border border-[#D3D3D3] bg-white text-sm font-light text-[18px] text-[#002143] transition-colors h-[48px]">
                    <ListFilter size={18} className="text-[#002143]" />
                    Popular
                    <ChevronDown size={18} className="text-[#002143] ml-1" />
                  </button>

                  {/* View Toggle */}
                  <div className="flex items-center border border-[#D3D3D3] rounded-lg bg-white shadow-sm h-[48px] p-1 shrink-0">
                    <Link
                      href={{ query: { ...sp, view: 'list' } }}
                      className={`flex items-center justify-center gap-2 w-[105px] h-full text-sm text-[18px] transition-colors rounded-[8px] ${sp.view !== 'map'
                        ? 'bg-[#DFE3FF] text-[#1428ae] font-medium'
                        : 'text-gray-400 font-light hover:text-[#002143] hover:bg-gray-50'
                        }`}
                    >
                      <LayoutList size={18} />
                      List
                    </Link>
                    <Link
                      href={{ query: { ...sp, view: 'map' } }}
                      className={`flex items-center justify-center gap-2 w-[105px] h-full text-sm text-[18px] transition-colors cursor-pointer rounded-[8px] ${sp.view === 'map'
                        ? 'bg-[#DFE3FF] text-[#1428ae] font-medium'
                        : 'text-gray-400 font-light hover:text-[#002143] hover:bg-gray-50'
                        }`}
                    >
                      <Map size={18} />
                      Map
                    </Link>
                  </div>
                </div>
              </div>

              {/* Location Filters Bar */}
              <div className="bg-white rounded-[10px] border border-[#D3D3D3] px-5 flex flex-col md:flex-row items-center justify-between gap-4 h-auto md:h-[65px]">
                <div className="flex flex-wrap items-center gap-x-12 gap-y-2 text-[18px] font-light text-[#1428ae] font-outfit">
                  {topLocations.map(([loc, count]) => (
                    <Link
                      key={loc}
                      href={{ query: { ...sp, location: loc } }}
                      className={`hover:underline ${sp.location === loc ? 'font-medium underline' : ''}`}
                    >
                      {loc} <span className="text-[#002143] ml-1.5">({count.toLocaleString()})</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={{ query: { ...sp, location: undefined } }}
                  className="text-[18px] font-medium text-[#1428ae] hover:underline uppercase tracking-widest shrink-0 font-outfit"
                >
                  VIEW ALL LOCATIONS
                </Link>
              </div>
            </div>

            {/* â”€â”€ Projects Grid â”€â”€ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(p => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    <img
                      src={p.main_image_url ?? `https://picsum.photos/seed/${p.slug}/900/600`}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.status === 'Ready for Occupancy' ? 'bg-green-600 text-white' :
                          p.status === 'Pre-Selling' ? 'bg-amber-500 text-white' :
                            'bg-blue-600 text-white'
                        }`}>
                        {p.status}
                      </span>
                      {p.is_featured && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/90 text-amber-700">â­ Featured</span>
                      )}
                    </div>

                    {/* Right Content Side */}
                    <div className="w-full md:w-[55%] p-8 flex flex-col relative">
                      {/* Dev Logo */}
                      <div className="absolute top-8 right-8 h-8 w-24">
                        <img
                          src={p.developers_profiles?.logo_url || "https://picsum.photos/seed/dev/200/50"}
                          className="h-full w-full object-contain object-right"
                          alt="developer logo"
                        />
                      </div>

                      {/* Name & Type */}
                      <div className="mb-6">
                        <h3 className="text-[#002143] text-[25px] font-medium leading-tight mb-1">{p.name}</h3>
                        <p className="text-[#002143] text-[15px] font-light">{p.project_type}</p>
                      </div>

                      {/* Available Units */}
                      <div className="mb-4">
                        <p className="text-[#002143] text-[15px] font-light mb-2 tracking-wide">Available Units:</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#1428AE] text-[15px] font-light">
                          {p.project_units && p.project_units.length > 0 ? (
                            Array.from(new Set(p.project_units.map(u => u.unit_type))).map((typeName, idx, arr) => {
                              const units = p.project_units?.filter(u => u.unit_type === typeName) || [];
                              const count = units.length;
                              const isPlural = count > 1;
                              const displayType = isPlural && !typeName.toLowerCase().includes('bedroom') && !typeName.toLowerCase().includes('studio') ? `${typeName}s` : typeName;

                              return (
                                <React.Fragment key={typeName}>
                                  <span>{count} {displayType}</span>
                                  {idx < arr.length - 1 && <span className="text-gray-300">|</span>}
                                </React.Fragment>
                              );
                            })
                          ) : (
                            <span className="text-gray-400 italic">No units listed</span>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-[#002143] text-[15px] mb-4 font-light">
                        <MapPin size={22} className="text-[#002143] shrink-0" />
                        <span>{p.city_municipality}, {p.province}, Philippines</span>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-4 mt-2">
                        <button className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-[10px] bg-[#DFE1FF] text-[#1428AE] font-regular text-[18px] hover:bg-[#D8E2FF] transition-colors">
                          <Mail size={18} /> Email
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-[10px] bg-[#DFE3FF] text-[#1428AE] font-regular text-[18px] hover:bg-[#D8E2FF] transition-colors">
                          <Phone size={18} /> Call
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-[10px] bg-[#E1FFDF] text-[#00A629] font-regular text-[18px] hover:bg-[#D8F0DA] transition-colors">
                          <MessageCircle size={18} /> WhatsApp
                        </button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {projects.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">Try adjusting your filters.</p>
              </div>
            )}
          </div>

          {/* ── Sidebar Ads ── */}
          <div className="hidden lg:flex flex-col gap-6 w-[300px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <AdBanner sizes={['300x250']} />
              <AdBanner sizes={['160x600']} />
            </div>
          </div>
        </div>

        {/* â”€â”€ Project Types Info â”€â”€ */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Understanding Development Classifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'Affordable', range: 'Under â‚±4.5M', desc: 'Government-assisted and developer-subsidized units ideal for first-time buyers and families.' },
              { type: 'Mid-Range', range: 'â‚±4.5M â€“ â‚±10M', desc: 'Modern, well-designed homes with standard to upscale amenities. The most popular segment.' },
              { type: 'Premium', range: 'â‚±10M â€“ â‚±30M', desc: 'High-quality finishes, managed concierge, and prime urban locations.' },
              { type: 'Luxury', range: 'â‚±30M and above', desc: 'World-class architecture, bespoke interiors, private services, and exclusive addresses.' },
            ].map(cat => (
              <div key={cat.type} className="space-y-2">
                <p className="font-bold text-[#1428ae] text-sm">{cat.type}</p>
                <p className="text-xs font-semibold text-amber-500">{cat.range}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
        brandName={settings.siteTitle}
      />
    </div>
  )
}
