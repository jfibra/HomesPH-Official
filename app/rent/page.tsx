import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { getSiteSettings } from '@/lib/site-settings'
import { MOCK_LISTINGS } from '@/lib/mock-data'
import AdBanner from '@/components/ui/AdBanner'

const fmt = (n: number) => `₱ ${n.toLocaleString()}`

export default async function RentPage(
  props: { searchParams?: Promise<{ q?: string; minPrice?: string; maxPrice?: string; beds?: string; sort?: string }> }
) {
  const searchParams = (await props.searchParams) ?? {}
  const { q, minPrice, maxPrice, beds, sort } = searchParams
  const settings = await getSiteSettings()

  let listings = MOCK_LISTINGS.filter(l => l.listing_type === 'rent')

  if (q) listings = listings.filter(l => l.title.toLowerCase().includes(q.toLowerCase()) || l.projects?.city_municipality?.toLowerCase().includes(q.toLowerCase()))
  if (minPrice) listings = listings.filter(l => l.price >= Number(minPrice))
  if (maxPrice) listings = listings.filter(l => l.price <= Number(maxPrice))
  if (beds && beds !== 'any') listings = listings.filter(l => (l.project_units?.bedrooms ?? 0) >= Number(beds))
  if (sort === 'price-asc') listings = listings.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') listings = listings.sort((a, b) => b.price - a.price)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />

      {/* ── Page Hero ── */}
      <div className="bg-[#0c1f4a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.6em] text-amber-400 mb-2">Rental Properties</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Properties for Rent</h1>
          <p className="text-blue-200 text-sm max-w-xl">
            Discover {listings.length} rental listings across the Philippines. Condos, houses, townhomes, and more.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Filters ── */}
        <form method="GET" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Project name, city…"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Min Rent / mo</label>
            <select name="minPrice" defaultValue={minPrice} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30">
              <option value="">Any</option>
              <option value="10000">₱ 10k</option>
              <option value="20000">₱ 20k</option>
              <option value="40000">₱ 40k</option>
              <option value="80000">₱ 80k</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Max Rent / mo</label>
            <select name="maxPrice" defaultValue={maxPrice} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30">
              <option value="">Any</option>
              <option value="20000">₱ 20k</option>
              <option value="40000">₱ 40k</option>
              <option value="80000">₱ 80k</option>
              <option value="150000">₱ 150k</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bedrooms</label>
            <select name="beds" defaultValue={beds} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30">
              <option value="any">Any</option>
              <option value="0">Studio</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sort By</label>
            <select name="sort" defaultValue={sort} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30">
              <option value="">Newest</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-[#1428ae] text-white rounded-xl text-sm font-semibold hover:bg-amber-500 transition-colors">
            Apply
          </button>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{listings.length}</span> rental properties
              </p>
              <div className="flex gap-3">
                <Link href="/buy" className="text-sm text-[#1428ae] font-medium hover:text-amber-500 transition-colors">
                  Switch to Buy →
                </Link>
              </div>
            </div>

            {/* ── Listings Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => {
            const img = listing.property_listing_galleries?.[0]?.image_url
            return (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {img && (
                    <img src={img} alt={listing.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  {listing.is_featured && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">Featured</span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">For Rent</span>
                  <h3 className="font-semibold text-sm text-gray-900 mt-2 leading-snug line-clamp-2 group-hover:text-[#1428ae] transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{listing.projects?.city_municipality}, {listing.projects?.province}</p>
                  <p className="font-bold text-[#1428ae] mt-2 text-base">{fmt(listing.price)}<span className="text-xs text-gray-400 font-normal">/mo</span></p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 border-t border-gray-50 pt-2">
                    {listing.project_units?.bedrooms != null && (
                      <span>{listing.project_units.bedrooms === 0 ? 'Studio' : `${listing.project_units.bedrooms} Bed`}</span>
                    )}
                    {listing.project_units?.bathrooms && <span>{listing.project_units.bathrooms} Bath</span>}
                    {listing.project_units?.floor_area_sqm && <span>{listing.project_units.floor_area_sqm} sqm</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{listing.project_units?.is_furnished}</p>
                </div>
              </Link>
            )
          })}

            {listings.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                <div className="text-6xl mb-6 opacity-80">🔑</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching rentals found</h3>
                <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters to see more available rentals.</p>
              </div>
            )}
            </div>
          </div>

          {/* ── Sidebar Ads ── */}
          <div className="hidden xl:flex flex-col gap-6 w-[300px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <AdBanner sizes={['300x250']} />
              <AdBanner sizes={['160x600']} />
            </div>
          </div>
        </div>

        {/* ── Rental Tips ── */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Renting in the Philippines — What You Need to Know</h2>
          <p className="text-sm text-gray-500 mb-6">Make informed decisions with our quick renter's guide.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📋', title: 'Rental Agreement', desc: 'Always sign a formal lease contract. Minimum 1-year term is standard in most condo developments.' },
              { icon: '💸', title: 'Security Deposit', desc: 'Typically 2 months advance + 2 months deposit (total 4 months) required upfront.' },
              { icon: '🔧', title: 'Who Pays for Repairs?', desc: "Minor repairs (below ₱10,000) are usually the tenant's responsibility. Major structural repairs fall on the owner." },
              { icon: '📅', title: 'Notice Period', desc: 'Give at least 30-60 days written notice before moving out. Check your contract for the exact terms.' },
            ].map(tip => (
              <div key={tip.title} className="flex gap-3">
                <span className="text-xl">{tip.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{tip.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AdBanner />

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
