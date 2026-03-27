import LocationGrid from '@/components/home/LocationGrid'
import HomeFooter from '@/components/home/HomeFooter'
import HomeHeader from '@/components/home/HomeHeader'
import NationwideShowcase from '@/components/home/NationwideShowcase'
import type { Location } from '@/components/home/LocationCard'
import { getSiteSettings } from '@/lib/site-settings'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SELECTED_LOCATION_COOKIE } from '@/lib/selected-location'
import Link from 'next/link'
import {
  MOCK_PROJECTS, MOCK_LISTINGS, MOCK_DEVELOPERS, MOCK_NEWS, SITE_STATS
} from '@/lib/mock-data'
import { getSiteLocations } from '@/lib/db-queries'
import AdBanner from '@/components/ui/AdBanner'
import { GENERAL_NAV_ITEMS } from '@/lib/general-nav'

const fmt = (n: number) => `₱ ${n.toLocaleString()}`

export default async function Home() {
  const cookieStore = await cookies()
  const locationCookie = cookieStore.get(SELECTED_LOCATION_COOKIE)?.value
  if (locationCookie) redirect(`/${locationCookie}`)

  const settings = await getSiteSettings()
  const locations = await getSiteLocations()

  const featuredProjects = MOCK_PROJECTS.filter(p => p.is_featured).slice(0, 6)
  const featuredListings = MOCK_LISTINGS.filter(l => l.is_featured).slice(0, 8)
  const latestNews = MOCK_NEWS.slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Force cache invalidation to resolve Turbopack hydration mismatch */}
      <HomeHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
        navItems={GENERAL_NAV_ITEMS}
      />

      {/* ── Choose a Location ── */}
      <LocationGrid locations={locations} />

      {/* ── Featured Projects ── */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Curated Selection</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Projects</h2>
              <p className="text-gray-500 mt-1 text-sm">Hand-picked developments from top builders across the country.</p>
            </div>
            <Link href="/projects" className="hidden sm:inline-flex text-sm font-semibold text-[#1428ae] hover:text-amber-500 transition-colors">
              View All Projects →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  <img
                    src={project.main_image_url ?? `https://picsum.photos/seed/${project.slug}/900/600`}
                    alt={project.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">
                      Featured
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/90 text-gray-700">
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-1">{project.city_municipality}, {project.province}</p>
                  <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#1428ae] transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{project.developers_profiles?.developer_name}</p>
                  <p className="text-[#1428ae] font-bold mt-3 text-sm">
                    {project.price_range_min
                      ? `${fmt(project.price_range_min)}` + (project.price_range_max ? ` – ${fmt(project.price_range_max)}` : '')
                      : 'Price on request'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/projects" className="text-sm font-semibold text-[#1428ae]">View All Projects →</Link>
          </div>
        </div>
      </section> */}

      {/* ── Featured Listings ── */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Available Now</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Listings</h2>
              <p className="text-gray-500 mt-1 text-sm">Top-picked properties for sale and rent from verified sellers.</p>
            </div>
            <Link href="/buy" className="hidden sm:inline-flex text-sm font-semibold text-[#1428ae] hover:text-amber-500 transition-colors">
              View All Listings →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredListings.map(listing => {
              const img = listing.property_listing_galleries?.[0]?.image_url
              const isRent = listing.listing_type === 'rent'
              return (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    {img && (
                      <img src={img} alt={listing.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isRent ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                      {isRent ? 'For Rent' : 'For Sale'}
                    </span>
                    <h3 className="font-semibold text-sm text-gray-900 mt-2 leading-snug line-clamp-2 group-hover:text-[#1428ae] transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {listing.projects?.city_municipality}, {listing.projects?.province}
                    </p>
                    <p className="font-bold text-[#1428ae] mt-2 text-sm">
                      {fmt(listing.price)}{isRent ? '/mo' : ''}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {listing.project_units?.bedrooms > 0 && (
                        <span>{listing.project_units.bedrooms} Bed</span>
                      )}
                      <span>{listing.project_units?.bathrooms} Bath</span>
                      <span>{listing.project_units?.floor_area_sqm} sqm</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section> */}

      {/* ── How It Works ── */}
      {/* <section className="py-16 bg-gradient-to-br from-[#0c1f4a] to-[#1428ae] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.6em] text-amber-400 mb-2">Simple Process</p>
            <h2 className="text-3xl font-extrabold">How HomesPH Works</h2>
            <p className="text-blue-200 mt-2 text-sm max-w-lg mx-auto">
              From search to signing — we make property buying and renting in the Philippines effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choose Location', desc: 'Select from 82 cities and municipalities nationwide. We cover Metro Manila, Visayas, Mindanao, and all major urban centers.', icon: '📍' },
              { step: '02', title: 'Browse & Filter', desc: 'Filter by price, property type, bedrooms, developer, and status. Save your favorites and compare multiple properties.', icon: '🔍' },
              { step: '03', title: 'Inquire & Visit', desc: 'Send inquiries directly through our platform. Schedule onsite visits or virtual tours at your convenience.', icon: '💬' },
              { step: '04', title: 'Close the Deal', desc: 'Work with verified brokers, process financing through our partner banks, and finalize your dream property.', icon: '🤝' },
            ].map(s => (
              <div key={s.step} className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                  {s.icon}
                </div>
                <p className="text-xs font-bold text-amber-400 tracking-widest">STEP {s.step}</p>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Property Categories ── */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">What Are You Looking For?</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Browse by Property Type</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Condominiums', icon: '🏙️', count: '18,400+', href: '/search?type=sale' },
              { label: 'House & Lot', icon: '🏡', count: '12,200+', href: '/search?type=sale' },
              { label: 'Townhouses', icon: '🏘️', count: '4,800+', href: '/search?type=sale' },
              { label: 'For Rent', icon: '🔑', count: '9,600+', href: '/rent' },
              { label: 'Commercial', icon: '🏢', count: '2,100+', href: '/search?type=sale' },
              { label: 'Lot Only', icon: '🗺️', count: '1,900+', href: '/search?type=sale' },
            ].map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group flex flex-col items-center bg-gray-50 hover:bg-[#1428ae]/5 border border-gray-100 rounded-2xl p-5 transition-colors text-center"
              >
                <span className="text-3xl mb-3">{cat.icon}</span>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#1428ae] transition-colors">{cat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cat.count} listings</p>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Top Developers ── */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Verified Partners</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Top Developers</h2>
            </div>
            <Link href="/developers" className="hidden sm:inline-flex text-sm font-semibold text-[#1428ae] hover:text-amber-500 transition-colors">
              All Developers →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {MOCK_DEVELOPERS.map(dev => (
              <Link
                key={dev.id}
                href={`/developers/${dev.id}`}
                className="flex flex-col items-center bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400 mb-2 overflow-hidden">
                  <img src={dev.logo_url} alt={dev.developer_name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{dev.developer_name}</p>
                <p className="text-[10px] text-[#1428ae] mt-0.5">{dev.projects_count} projects</p>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Latest News ── */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Stay Informed</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Latest Real Estate News</h2>
            </div>
            <Link href="/news" className="hidden sm:inline-flex text-sm font-semibold text-[#1428ae] hover:text-amber-500 transition-colors">
              All News →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map(article => (
              <Link
                key={article.id}
                href={`/news`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#1428ae]">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-2 leading-snug text-sm line-clamp-2 group-hover:text-[#1428ae] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <span>{article.author}</span>
                    <span>·</span>
                    <span>{article.read_time} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Nationwide Showcase ── */}
      <NationwideShowcase />

      {/* ── Why Choose HomesPH ── */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.6em] text-amber-500 mb-2">Our Promise</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Why Filipinos Choose HomesPH</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔒', title: 'Verified Listings', desc: 'Every listing and developer on our platform is verified by our team of real estate professionals. No fake listings, no hidden fees.' },
              { icon: '📊', title: 'Real-Time Market Data', desc: 'Our nationwide field reporters track prices, availability, and market trends in real time so you always have accurate information.' },
              { icon: '⚖️', title: 'Legal Protection', desc: "Backed by a team of real estate lawyers, we ensure every transaction is legally sound — from lot titles to deed of sale review." },
              { icon: '💰', title: 'Best Financing Deals', desc: 'Access to competitive mortgage rates from partner banks and the Pag-IBIG Fund. Our mortgage calculator helps you plan ahead.' },
              { icon: '🌐', title: 'Nationwide Coverage', desc: 'Unlike other portals limited to Metro Manila, HomesPH covers all major cities and provinces across Luzon, Visayas, and Mindanao.' },
              { icon: '🤝', title: '10,000+ Licensed Agents', desc: 'Connect directly with PRC-licensed real estate practitioners who know your preferred location inside and out.' },
            ].map(feat => (
              <div key={feat.title} className="flex gap-5">
                <div className="w-12 h-12 bg-[#1428ae]/8 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{feat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA Banner ── */}
      {/* <section className="bg-amber-500 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Find Your Next Property?</h2>
          <p className="text-amber-100 mb-8 text-lg">Join 125,000+ Filipinos who have found their home through HomesPH.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/buy"
              className="px-8 py-3.5 bg-white text-[#1428ae] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/registration/broker"
              className="px-8 py-3.5 bg-[#1428ae] text-white rounded-xl font-bold text-sm hover:bg-[#0c1f4a] transition-colors"
            >
              Register as a Broker
            </Link>
          </div>
        </div>
      </section> */}

      <HomeFooter
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        links={settings.footerLinks}
      />
    </div>
  )
}
