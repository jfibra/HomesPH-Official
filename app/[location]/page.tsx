import type { Metadata } from 'next'
import Link from 'next/link'
import SiteFooter from '../../components/layout/SiteFooter'
import SiteHeader from '../../components/layout/SiteHeader'
import { getSiteSettings } from '../../lib/site-settings'
import { MOCK_PROJECTS, MOCK_LISTINGS, MOCK_DEVELOPERS, MOCK_TOURISM, MOCK_RESTAURANTS } from '../../lib/mock-data'

interface LocationPageParams {
  location?: string
}

interface LocationPageProps {
  params: LocationPageParams | Promise<LocationPageParams>
}

const formatLocationName = (value: string) =>
  decodeURIComponent(value)
    .split('-')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
    .join(' ')

const normalizeSlug = (value?: string) => {
  if (!value) return 'location'
  const c = value.trim().toLowerCase()
  if (c === 'undefined' || c === 'null') return 'location'
  return c
}

const fmtPrice = (n?: number | null) => n ? `₱ ${Number(n).toLocaleString()}` : null

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const rp = await params
  const slug = normalizeSlug(rp.location)
  const name = formatLocationName(slug)
  return {
    title: `${name} Real Estate | HomesPH`,
    description: `Explore properties, homes, and investment opportunities in ${name}, Philippines.`,
  }
}

export default async function LocationPage({ params }: LocationPageProps) {
  const resolvedParams = await params
  const locationSlug = normalizeSlug(resolvedParams.location)
  const locationName = formatLocationName(locationSlug)
  const settings = await getSiteSettings()

  const matchLoc = (str?: string | null) => str?.toLowerCase().includes(locationSlug.replace(/-/g, ' ')) ?? false

  const featuredProjects = MOCK_PROJECTS.filter(p =>
    p.is_featured && (matchLoc(p.province) || matchLoc(p.city_municipality) || matchLoc(p.barangay) || matchLoc(p.island_group))
  ).slice(0, 6)

  const allLocationProjects = MOCK_PROJECTS.filter(p =>
    matchLoc(p.province) || matchLoc(p.city_municipality) || matchLoc(p.barangay)
  )

  const projectIds = allLocationProjects.map(p => p.id)
  const saleListings = MOCK_LISTINGS.filter(l => l.listing_type === 'sale' && projectIds.includes(l.project_id ?? -1)).slice(0, 12)
  const rentListings = MOCK_LISTINGS.filter(l => l.listing_type === 'rent' && projectIds.includes(l.project_id ?? -1)).slice(0, 12)

  const devIds = Array.from(new Set(allLocationProjects.map(p => p.developer_id).filter(Boolean)))
  const featuredDevelopers = MOCK_DEVELOPERS.filter(d => devIds.includes(d.id))

  const tourismSpots = MOCK_TOURISM.filter(t => t.location.toLowerCase().includes(locationSlug.replace(/-/g, ' ')))
  const restaurants = MOCK_RESTAURANTS.filter(r => r.location.toLowerCase().includes(locationSlug.replace(/-/g, ' ')))

  const totalCount = allLocationProjects.length + saleListings.length + rentListings.length

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#0c1f4a] to-[#1428ae] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/lochero/1200/400')] bg-cover bg-center" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-amber-400 mb-3">Properties in</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">{locationName}</h1>
          <p className="text-blue-200 text-base mb-8 max-w-xl">
            Explore homes, condos, and investment properties in {locationName}.
            {totalCount > 0 && ` Browse ${totalCount}+ listings curated for this area.`}
          </p>
          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <input type="hidden" name="location" value={locationSlug} />
            <input name="q" placeholder={`Search in ${locationName}…`}
              className="flex-1 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white shadow focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <button type="submit" className="rounded-xl bg-amber-400 text-[#0c1f4a] font-bold text-sm px-6 py-3 hover:bg-amber-300 transition-colors shrink-0">
              Search
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-6 text-xs">
            <Link href={`/buy?location=${locationSlug}`} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">🏠 Buy</Link>
            <Link href={`/rent?location=${locationSlug}`} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">🔑 Rent</Link>
            <Link href={`/projects?location=${locationSlug}`} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">🏗️ Projects</Link>
            <Link href="/developers" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">🏢 Developers</Link>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* ── Featured Projects ── */}
        {featuredProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">Highlighted</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Featured Projects in {locationName}</h2>
              </div>
              <Link href="/projects" className="text-sm font-semibold text-[#1428ae] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProjects.map(p => (
                <Link key={p.id} href={`/projects/${p.slug}`}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-44 bg-gray-100 overflow-hidden relative">
                    {p.main_image_url
                      ? <img src={p.main_image_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="h-full flex items-center justify-center text-sm text-gray-400">No image</div>}
                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">Featured</span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold text-sm text-gray-900">{p.name}</h3>
                    {p.province && <p className="text-xs text-gray-400">📍 {p.city_municipality}, {p.province}</p>}
                    <p className="text-sm font-bold text-[#1428ae]">{[fmtPrice(p.price_range_min), fmtPrice(p.price_range_max)].filter(Boolean).join(' – ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── All Location Projects (fallback) ── */}
        {featuredProjects.length === 0 && allLocationProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">Available</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Projects in {locationName}</h2>
              </div>
              <Link href="/projects" className="text-sm font-semibold text-[#1428ae] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allLocationProjects.slice(0, 6).map(p => (
                <Link key={p.id} href={`/projects/${p.slug}`}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    {p.main_image_url
                      ? <img src={p.main_image_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                      : <div className="h-full flex items-center justify-center text-sm text-gray-400">No image</div>}
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold text-sm text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-400">{p.city_municipality}, {p.province}</p>
                    <p className="text-sm font-bold text-[#1428ae]">{[fmtPrice(p.price_range_min), fmtPrice(p.price_range_max)].filter(Boolean).join(' – ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Properties for Sale ── */}
        {saleListings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">Real Estate</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Properties for Sale in {locationName}</h2>
              </div>
              <Link href="/buy" className="text-sm font-semibold text-[#1428ae] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {saleListings.map(l => {
                const thumb = l.property_listing_galleries?.sort((a, b) => a.display_order - b.display_order)?.[0]?.image_url
                return (
                  <Link key={l.id} href={`/listings/${l.id}`}
                    className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-44 bg-gray-100 overflow-hidden relative">
                      {thumb
                        ? <img src={thumb} alt={l.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="h-full flex items-center justify-center text-sm text-gray-400">No image</div>}
                      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-600 text-white">For Sale</span>
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-2">{l.title}</p>
                      <p className="text-sm font-bold text-[#1428ae]">{fmtPrice(l.price) ?? 'Price on request'}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Properties for Rent ── */}
        {rentListings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">Rentals</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Properties for Rent in {locationName}</h2>
              </div>
              <Link href="/rent" className="text-sm font-semibold text-[#1428ae] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rentListings.map(l => {
                const thumb = l.property_listing_galleries?.sort((a, b) => a.display_order - b.display_order)?.[0]?.image_url
                return (
                  <Link key={l.id} href={`/listings/${l.id}`}
                    className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-44 bg-gray-100 overflow-hidden relative">
                      {thumb
                        ? <img src={thumb} alt={l.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className="h-full flex items-center justify-center text-sm text-gray-400">No image</div>}
                      <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">For Rent</span>
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-2">{l.title}</p>
                      <p className="text-sm font-bold text-[#1428ae]">{fmtPrice(l.price) ? `${fmtPrice(l.price)} / mo` : 'Price on request'}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Featured Developers ── */}
        {featuredDevelopers.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">In this area</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Developers in {locationName}</h2>
              </div>
              <Link href="/developers" className="text-sm font-semibold text-[#1428ae] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredDevelopers.map(d => (
                <Link key={d.id} href={`/developers/${d.id}`}
                  className="flex flex-col items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow text-center">
                  {d.logo_url
                    ? <img src={d.logo_url} alt={d.developer_name} className="h-14 w-14 object-contain rounded-lg" />
                    : <div className="h-14 w-14 bg-[#1428ae]/10 rounded-lg flex items-center justify-center text-xl font-bold text-[#1428ae]">{d.developer_name?.[0]}</div>}
                  <p className="text-sm font-semibold text-gray-900">{d.developer_name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Tourism Spots ── */}
        {tourismSpots.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">Explore</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Tourism in {locationName}</h2>
              </div>
              <Link href="/tourism" className="text-sm font-semibold text-[#1428ae] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tourismSpots.map(t => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    {t.image_url
                      ? <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" />
                      : <div className="h-full flex items-center justify-center text-3xl">🏖️</div>}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.type} · {t.location}</p>
                    {t.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{t.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Restaurants ── */}
        {restaurants.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">Dine</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Restaurants in {locationName}</h2>
              </div>
              <Link href="/restaurant" className="text-sm font-semibold text-[#1428ae] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map(r => (
                <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    {r.image_url
                      ? <img src={r.image_url} alt={r.name} className="h-full w-full object-cover" />
                      : <div className="h-full flex items-center justify-center text-3xl">🍽️</div>}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{r.cuisine} · {r.price_range}</p>
                    {r.rating && <p className="text-xs text-amber-500 mt-1">{'★'.repeat(Math.floor(r.rating))} {r.rating}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Living Here ── */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1428ae]">Lifestyle</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-0.5">Living in {locationName}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🏫', title: 'Schools & Universities', desc: 'Quality education institutions serving families in this area.' },
              { icon: '🚌', title: 'Commute & Transport', desc: 'Well-connected via major highways, public transport, and airports.' },
              { icon: '🛒', title: 'Shopping & Malls', desc: 'Major malls and local markets within easy reach.' },
            ].map(item => (
              <div key={item.title} className="bg-[#f8f9ff] rounded-xl p-5 border border-[#1428ae]/10">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Empty State ── */}
        {allLocationProjects.length === 0 && saleListings.length === 0 && rentListings.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🏙️</div>
            <p className="font-semibold text-gray-600">Expanding to {locationName} soon</p>
            <p className="text-sm mt-1">No listings yet — but our team is actively sourcing properties here.</p>
            <Link href="/" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#1428ae] text-white text-sm font-semibold hover:bg-amber-500 hover:text-[#1428ae] transition-colors">Browse Locations</Link>
          </div>
        )}
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
