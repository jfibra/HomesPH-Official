import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { getSiteSettings } from '@/lib/site-settings'
import { MOCK_PROJECTS, MOCK_LOCATIONS } from '@/lib/mock-data'
import AdBanner from '@/components/ui/AdBanner'

const fmt = (n?: number | null) => n ? `₱ ${Number(n).toLocaleString()}` : null
const fmtRange = (min?: number | null, max?: number | null) => {
  if (!min && !max) return 'Price on request'
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  return fmt(min ?? max) ?? 'Price on request'
}

export default async function ProjectsPage(
  props: { searchParams?: Promise<{ q?: string; location?: string; status?: string; type?: string }> }
) {
  const sp = (await props.searchParams) ?? {}
  const settings = await getSiteSettings()

  let projects = [...MOCK_PROJECTS]

  if (sp.q) projects = projects.filter(p => p.name.toLowerCase().includes(sp.q!.toLowerCase()) || p.city_municipality?.toLowerCase().includes(sp.q!.toLowerCase()))
  if (sp.location) projects = projects.filter(p => p.province?.toLowerCase().includes(sp.location!.toLowerCase()) || p.city_municipality?.toLowerCase().includes(sp.location!.toLowerCase()))
  if (sp.status) projects = projects.filter(p => p.status === sp.status)
  if (sp.type) projects = projects.filter(p => p.project_type?.toLowerCase().includes(sp.type!.toLowerCase()))

  const statuses = Array.from(new Set(MOCK_PROJECTS.map(p => p.status)))
  const types = Array.from(new Set(MOCK_PROJECTS.map(p => p.project_type).filter(Boolean)))

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />

      {/* ── Hero ── */}
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
        {/* ── Filters ── */}
        <form method="GET" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Search Projects</label>
            <input
              name="q"
              defaultValue={sp.q}
              placeholder="Project name, city, developer…"
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
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{projects.length}</span> of {MOCK_PROJECTS.length} projects
              </p>
              {/* Status pills */}
              <div className="hidden sm:flex gap-2">
                {statuses.map(s => (
                  <Link
                    key={s}
                    href={`/projects?status=${encodeURIComponent(s)}`}
                    className={`text-xs px-3 py-1.5 rounded-full border text-gray-600 font-medium transition-colors hover:bg-[#1428ae]/5 hover:border-[#1428ae]/20 ${sp.status === s ? 'bg-[#1428ae] text-white border-[#1428ae]' : 'bg-white border-gray-200'}`}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Projects Grid ── */}
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
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/90 text-amber-700">⭐ Featured</span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/90 text-gray-700">
                        {p.project_type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-1">{p.city_municipality}, {p.province}</p>
                    <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-[#1428ae] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{p.developers_profiles?.developer_name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[#1428ae] font-bold text-sm">
                        {fmtRange(p.price_range_min, p.price_range_max)}
                      </p>
                      <p className="text-xs text-gray-400">{p.project_units?.length ?? p.project_units?.length ?? 0} units</p>
                    </div>
                    {p.project_amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.project_amenities.slice(0, 3).map((pa: any) => (
                          <span key={pa.amenities.id} className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-100">
                            {pa.amenities.name}
                          </span>
                        ))}
                        {p.project_amenities.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-100">
                            +{p.project_amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
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
              <AdBanner sizes={['300x600']} />
            </div>
          </div>
        </div>

        {/* ── Project Types Info ── */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Understanding Development Classifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'Affordable', range: 'Under ₱4.5M', desc: 'Government-assisted and developer-subsidized units ideal for first-time buyers and families.' },
              { type: 'Mid-Range', range: '₱4.5M – ₱10M', desc: 'Modern, well-designed homes with standard to upscale amenities. The most popular segment.' },
              { type: 'Premium', range: '₱10M – ₱30M', desc: 'High-quality finishes, managed concierge, and prime urban locations.' },
              { type: 'Luxury', range: '₱30M and above', desc: 'World-class architecture, bespoke interiors, private services, and exclusive addresses.' },
            ].map(cat => (
              <div key={cat.type} className="space-y-2">
                <p className="font-bold text-[#1428ae] text-sm">{cat.type}</p>
                <p className="text-xs font-semibold text-amber-500">{cat.range}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
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
