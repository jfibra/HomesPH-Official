import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { getSiteSettings } from '@/lib/site-settings'
import InquiryForm from '@/components/listings/InquiryForm'
import { MOCK_PROJECTS, MOCK_LISTINGS } from '@/lib/mock-data'

const fmt = (n?: number | null) => n ? `₱ ${Number(n).toLocaleString()}` : null
const fmtRange = (min?: number | null, max?: number | null) => {
  if (!min && !max) return 'Price on request'
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  return fmt(min ?? max) ?? 'Price on request'
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const settings = await getSiteSettings()

  const project = MOCK_PROJECTS.find(p => p.slug === slug)
  if (!project) notFound()

  const projectListings = MOCK_LISTINGS.filter(l => l.project_id === project.id)
  const saleListings = projectListings.filter(l => l.listing_type === 'sale')
  const rentListings = projectListings.filter(l => l.listing_type === 'rent')
  const sortedGallery = [...(project.project_galleries ?? [])].sort((a, b) => a.display_order - b.display_order)
  const amenities = (project.project_amenities ?? []).map((pa: any) => pa.amenities).filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* ── Hero ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {sortedGallery.length > 0 && (
            <div className="h-72 sm:h-96 bg-gray-100 overflow-hidden">
              <img src={sortedGallery[0].image_url} alt={project.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    project.status === 'Ready for Occupancy' ? 'bg-green-50 text-green-700' :
                    project.status === 'Pre-Selling' ? 'bg-amber-50 text-amber-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>{project.status}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{project.project_type}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{project.classification}</span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500 mt-1.5">
                  📍 {[project.barangay, project.city_municipality, project.province, project.region].filter(Boolean).join(', ')}
                </p>
                <p className="text-2xl font-bold text-[#1428ae] mt-3">{fmtRange(project.price_range_min, project.price_range_max)}</p>
                {project.vat_inclusive && <p className="text-xs text-gray-400 mt-0.5">VAT Inclusive</p>}

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {project.project_units?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">{project.project_units.length}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Unit Types</p>
                    </div>
                  )}
                  {project.amenity_ids?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">{project.project_amenities?.length ?? 0}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Amenities</p>
                    </div>
                  )}
                  {project.expected_completion_date && (
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-gray-900">{project.expected_completion_date}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Completion</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-gray-900">{project.island_group}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Island Group</p>
                  </div>
                </div>
              </div>

              {/* Developer Card */}
              {project.developers_profiles && (
                <Link href={`/developers/${project.developers_profiles.id}`}
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100 hover:bg-blue-50 hover:border-[#1428ae]/20 transition-colors shrink-0">
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-white border border-gray-100">
                    <img src={project.developers_profiles.logo_url ?? undefined} alt={project.developers_profiles.developer_name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Developer</div>
                    <div className="text-sm font-bold text-gray-900">{project.developers_profiles.developer_name}</div>
                    <div className="text-xs text-[#1428ae] mt-0.5">View profile →</div>
                  </div>
                </Link>
              )}
            </div>

            {/* Legal Details */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              {project.lts_number && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">LTS Number</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{project.lts_number}</p>
                </div>
              )}
              {project.dhsud_registration_number && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">DHSUD Registration</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{project.dhsud_registration_number}</p>
                </div>
              )}
              {project.address_details && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Address</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{project.address_details}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Gallery ── */}
        {sortedGallery.length > 1 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sortedGallery.slice(1).map(g => (
                <div key={g.id} className="h-48 rounded-xl overflow-hidden bg-gray-100">
                  <img src={g.image_url} alt={g.title ?? project.name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Amenities ── */}
        {amenities.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities & Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenities.map((a: any) => (
                <div key={a.id} className="flex items-center gap-2.5 bg-[#1428ae]/5 rounded-xl px-4 py-3">
                  <span className="w-2 h-2 rounded-full bg-[#1428ae] shrink-0" />
                  <span className="text-sm font-medium text-[#1428ae]">{a.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Unit Types ── */}
        {project.project_units?.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Unit Types</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.project_units.map((u: any) => (
                <div key={u.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#1428ae]/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{u.unit_name || u.unit_type}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{u.unit_type}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      u.status === 'Available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>{u.status}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs text-gray-600">
                    {u.floor_area_sqm && <div className="flex items-center gap-1.5"><span className="font-medium">Floor Area:</span> {u.floor_area_sqm} sqm</div>}
                    {u.lot_area_sqm && <div className="flex items-center gap-1.5"><span className="font-medium">Lot Area:</span> {u.lot_area_sqm} sqm</div>}
                    {u.bedrooms != null && <div className="flex items-center gap-1.5"><span className="font-medium">Bedrooms:</span> {u.bedrooms === 0 ? 'Studio' : u.bedrooms}</div>}
                    {u.bathrooms != null && <div className="flex items-center gap-1.5"><span className="font-medium">Bathrooms:</span> {u.bathrooms}</div>}
                    {u.is_furnished && <div className="flex items-center gap-1.5"><span className="font-medium">Furnished:</span> {u.is_furnished}</div>}
                    {u.has_parking !== undefined && <div className="flex items-center gap-1.5"><span className="font-medium">Parking:</span> {u.has_parking ? 'Yes' : 'No'}</div>}
                  </div>
                  {u.selling_price && (
                    <p className="mt-4 text-base font-bold text-[#1428ae]">{fmt(u.selling_price)}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Available Listings ── */}
        {(saleListings.length > 0 || rentListings.length > 0) && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Listings</h2>

            {saleListings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-3">For Sale</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {saleListings.map(l => (
                    <Link key={l.id} href={`/listings/${l.id}`}
                      className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-green-50 hover:border-green-200 border border-transparent transition-colors">
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {l.property_listing_galleries?.[0] && (
                          <img src={l.property_listing_galleries[0].image_url} alt={l.title} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{l.title}</p>
                        <p className="text-xs text-gray-500">
                          {l.project_units?.bedrooms === 0 ? 'Studio' : `${l.project_units?.bedrooms}BR`} · {l.project_units?.floor_area_sqm}sqm
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#1428ae] shrink-0">{fmt(l.price)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {rentListings.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-3">For Rent</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rentListings.map(l => (
                    <Link key={l.id} href={`/listings/${l.id}`}
                      className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-colors">
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        {l.property_listing_galleries?.[0] && (
                          <img src={l.property_listing_galleries[0].image_url} alt={l.title} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{l.title}</p>
                        <p className="text-xs text-gray-500">
                          {l.project_units?.bedrooms === 0 ? 'Studio' : `${l.project_units?.bedrooms}BR`} · {l.project_units?.floor_area_sqm}sqm
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#1428ae] shrink-0">{fmt(l.price)}/mo</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── FAQs ── */}
        {project.faqs && project.faqs.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {project.faqs.map(faq => (
                <details key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden group">
                  <summary className="font-semibold text-sm text-gray-900 cursor-pointer list-none flex justify-between items-center px-5 py-4 bg-gray-50 hover:bg-[#1428ae]/5 transition-colors">
                    {faq.question}
                    <span className="text-[#1428ae] group-open:rotate-180 transition-transform shrink-0 ml-2">▾</span>
                  </summary>
                  <p className="px-5 py-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── Inquiry Form ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Send an Inquiry</h2>
          <p className="text-sm text-gray-500 mb-6">
            Interested in {project.name}? Fill in the form and our team will contact you promptly.
          </p>
          <div className="max-w-lg">
            <InquiryForm projectId={project.id} listingTitle={project.name} />
          </div>
        </section>
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
