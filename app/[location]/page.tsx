import type { Metadata } from 'next'
import Link from 'next/link'
import SiteFooter from '../../components/layout/SiteFooter'
import SiteHeader from '../../components/layout/SiteHeader'
import { getSiteSettings } from '../../lib/site-settings'

interface LocationPageParams {
  location?: string
}

interface LocationPageProps {
  params: LocationPageParams | Promise<LocationPageParams>
}

const DETAILS = [
  'New neighborhoods curated every week',
  'Trusted agents who know the local rhythm',
  'Insights on schools, commutes, and lifestyle',
]

const formatLocationName = (value: string) =>
  decodeURIComponent(value)
    .split('-')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ')

const normalizeSlug = (value?: string) => {
  if (!value) return 'location'
  const cleaned = value.trim().toLowerCase()
  if (cleaned === 'undefined' || cleaned === 'null') return 'location'
  return cleaned
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locationSlug = normalizeSlug(resolvedParams.location)
  const locationName = formatLocationName(locationSlug)
  return {
    title: locationName,
    description: `Explore properties, homes, and investment opportunities in ${locationName}, Philippines.`,
  }
}

export default async function LocationPage({ params }: LocationPageProps) {
  const resolvedParams = await params
  const locationSlug = normalizeSlug(resolvedParams.location)
  const locationName = formatLocationName(locationSlug)
  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader
        logoText={settings.siteTitle}
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />

      <main className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <section className="rounded-xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white p-10 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#1428ae]">
            Location selected
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900">
            You clicked on {locationName}
          </h1>
          <p className="mt-4 text-base text-gray-600">
            Welcome to the pared-down landing space for {locationName}. We are preparing curated
            property finds, market insight, and local stories to help you make a confident move.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#1428ae] px-6 py-2 text-sm font-semibold text-[#1428ae] transition hover:bg-[#1428ae]/5"
            >
              Back to home
            </Link>
            <a
              href="/#locations"
              className="inline-flex items-center justify-center rounded-full bg-[#f59e0b] px-6 py-2 text-sm font-semibold text-[#1428ae] shadow-lg shadow-amber-200/60 transition hover:bg-[#f7b500]"
            >
              Browse more cities
            </a>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {DETAILS.map((detail) => (
            <article
              key={detail}
              className="space-y-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="h-2 w-10 rounded-full bg-[#f59e0b]" aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                Built for you
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
            </article>
          ))}
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
