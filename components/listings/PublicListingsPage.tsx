import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import AdBanner from '@/components/ui/AdBanner'
import {
  type ListingSearchMode,
  type PropertySearchParamsInput,
  searchPublicListings,
} from '@/lib/property-search'
import { getSiteSettings } from '@/lib/site-settings'

interface PublicListingsPageProps {
  mode: ListingSearchMode
  searchParams: PropertySearchParamsInput
}

function formatPrice(value: number | null, mode: ListingSearchMode) {
  if (value === null || value === undefined) {
    return 'Price on request'
  }

  const amount = `PHP ${Number(value).toLocaleString()}`
  return mode === 'sale' ? amount : `${amount}/mo`
}

function buildPersistentFields(filters: Awaited<ReturnType<typeof searchPublicListings>>['filters']) {
  return [
    ['location', filters.location],
    ['propertyType', filters.propertyType],
    ['city', filters.city],
    ['province', filters.province],
    ['barangay', filters.barangay],
    ['features', filters.features.length > 0 ? filters.features.join(', ') : null],
    ['ai', filters.ai ? '1' : null],
    ['aiQuery', filters.aiQuery],
  ] as const
}

export default async function PublicListingsPage({
  mode,
  searchParams,
}: PublicListingsPageProps) {
  const settings = await getSiteSettings()
  const { aiSummary, filters, listings, propertyTypeChips } = await searchPublicListings(
    mode,
    searchParams
  )
  const persistentFields = buildPersistentFields(filters)
  const isSale = mode === 'sale'
  const pageTitle = isSale ? 'Properties for Sale' : 'Properties for Rent'
  const eyebrow = isSale ? 'Real Estate Portfolio' : 'Rental Properties'
  const resultsLabel = isSale ? 'properties for sale' : 'rental properties'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />

      <div className="bg-[#0c1f4a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.6em] text-amber-400 mb-2">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">{pageTitle}</h1>
          <p className="text-blue-200 text-sm max-w-xl">
            {isSale
              ? `Browse ${listings.length} published sale listings from the Homes.ph database.`
              : `Browse ${listings.length} published rental listings from the Homes.ph database.`}
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {aiSummary ? (
          <div className="mb-6 rounded-2xl border border-[#dbe4ff] bg-[#f7f9ff] px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-[#173260]">
              Showing AI search results for: {aiSummary}
            </p>
          </div>
        ) : null}

        <form
          method="GET"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col lg:flex-row gap-4 items-end"
        >
          {persistentFields.map(([name, value]) =>
            value ? <input key={name} type="hidden" name={name} value={value} /> : null
          )}

          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Keywords</label>
            <input
              name="keywords"
              defaultValue={filters.keywordsText}
              placeholder={isSale ? 'Condo, city, or project name' : 'Condo, city, or rental keyword'}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Min Price</label>
            <input
              type="number"
              name="minPrice"
              defaultValue={filters.minPrice ?? ''}
              placeholder="Any"
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              defaultValue={filters.maxPrice ?? ''}
              placeholder="Any"
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bedrooms</label>
            <select
              name="bedrooms"
              defaultValue={filters.bedrooms !== null ? String(filters.bedrooms) : ''}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30"
            >
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Bathrooms</label>
            <select
              name="bathrooms"
              defaultValue={filters.bathrooms !== null ? String(filters.bathrooms) : ''}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sort By</label>
            <select
              name="sort"
              defaultValue={filters.sort}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1428ae]/30"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1428ae] text-white rounded-xl text-sm font-semibold hover:bg-amber-500 transition-colors"
          >
            Apply
          </button>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{listings.length}</span> {resultsLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {propertyTypeChips.map((propertyType) => (
                  <span
                    key={propertyType}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 font-medium"
                  >
                    {propertyType}
                  </span>
                ))}
                {!isSale ? (
                  <Link
                    href="/buy"
                    className="text-sm text-[#1428ae] font-medium hover:text-amber-500 transition-colors px-1 py-1.5"
                  >
                    Switch to Buy
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => {
                const image = listing.property_listing_galleries[0]?.image_url
                return (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={listing.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                          No image
                        </div>
                      )}
                      {listing.is_featured ? (
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">
                          Featured
                        </span>
                      ) : null}
                      {listing.negotiable ? (
                        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/90 text-gray-700">
                          Negotiable
                        </span>
                      ) : null}
                    </div>

                    <div className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isSale ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {isSale ? 'For Sale' : 'For Rent'}
                      </span>
                      <h3 className="font-semibold text-sm text-gray-900 mt-2 leading-snug line-clamp-2 group-hover:text-[#1428ae] transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {[listing.projects?.city_municipality, listing.projects?.province]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      <p className="font-bold text-[#1428ae] mt-2 text-base">
                        {formatPrice(listing.price, mode)}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 border-t border-gray-50 pt-2">
                        {listing.project_units?.bedrooms !== null &&
                        listing.project_units?.bedrooms !== undefined ? (
                          <span>
                            {listing.project_units.bedrooms === 0
                              ? 'Studio'
                              : `${listing.project_units.bedrooms} Bed`}
                          </span>
                        ) : null}
                        {listing.project_units?.bathrooms ? (
                          <span>{listing.project_units.bathrooms} Bath</span>
                        ) : null}
                        {listing.project_units?.floor_area_sqm ? (
                          <span>{listing.project_units.floor_area_sqm} sqm</span>
                        ) : null}
                      </div>
                      {listing.project_units?.is_furnished ? (
                        <p className="text-xs text-gray-400 mt-1">{listing.project_units.is_furnished}</p>
                      ) : null}
                    </div>
                  </Link>
                )
              })}

              {listings.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                  <div className="text-5xl mb-6 opacity-70">{isSale ? 'Portfolio' : 'Rentals'}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isSale ? 'No matching properties found' : 'No matching rentals found'}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {filters.ai
                      ? 'Try broadening the AI search or removing a few filters.'
                      : 'Try adjusting your filters to see more results.'}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="hidden xl:flex flex-col gap-6 w-[300px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <AdBanner sizes={['300x250']} />
              <AdBanner sizes={['160x600']} />
            </div>
          </div>
        </div>

        {isSale ? (
          <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Why Buy Property with HomesPH?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: 'Verified Sellers',
                  description:
                    'All listings are shown from published Homes.ph inventory managed by verified developers, brokers, or owners.',
                },
                {
                  title: 'Structured Search',
                  description:
                    'AI Mode only converts your request into filters, then Homes.ph searches the same database-backed listing set.',
                },
                {
                  title: 'Flexible Financing',
                  description:
                    'Use the search results as a starting point, then continue with mortgage planning and broker inquiries.',
                },
              ].map((feature) => (
                <div key={feature.title}>
                  <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Renting with HomesPH</h2>
            <p className="text-sm text-gray-500 mb-6">
              Use AI or manual filters to narrow the published rental listings that fit your budget and location.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Monthly Budget',
                  description: 'Set a ceiling and compare only listings that already fit your preferred monthly rent.',
                },
                {
                  title: 'Beds and Baths',
                  description: 'Use minimum bedroom and bathroom counts to skip units that do not meet your needs.',
                },
                {
                  title: 'Location First',
                  description: 'Queries can stay within the current city page or jump to a new city when your request is explicit.',
                },
                {
                  title: 'Database Grounded',
                  description: 'Results always come from Homes.ph listings, not text generated by the AI.',
                },
              ].map((tip) => (
                <div key={tip.title}>
                  <p className="font-semibold text-gray-900 text-sm">{tip.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
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
