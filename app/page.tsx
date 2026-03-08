import HomeHero from '../components/home/HomeHero'
import LocationGrid from '../components/home/LocationGrid'
import HomeFooter from '../components/home/HomeFooter'
import HomeHeader from '../components/home/HomeHeader'
import type { Location } from '../components/home/LocationCard'
import { getSiteSettings } from '../lib/site-settings'

const FALLBACK_LOCATIONS: Location[] = [
  { id: 1,  title: 'Cebu',            slug: 'cebu',            logo_url: null, description: null },
  { id: 2,  title: 'BGC',             slug: 'bgc',             logo_url: null, description: null },
  { id: 3,  title: 'Cavite',          slug: 'cavite',          logo_url: null, description: null },
  { id: 4,  title: 'Bacolod',         slug: 'bacolod',         logo_url: null, description: null },
  { id: 5,  title: 'Bohol',           slug: 'bohol',           logo_url: null, description: null },
  { id: 6,  title: 'Iloilo',          slug: 'iloilo',          logo_url: null, description: null },
  { id: 7,  title: 'Cagayan De Oro',  slug: 'cagayan-de-oro',  logo_url: null, description: null },
  { id: 8,  title: 'Davao',           slug: 'davao',           logo_url: null, description: null },
  { id: 9,  title: 'Gensan',          slug: 'gensan',          logo_url: null, description: null },
  { id: 10, title: 'Pampanga',        slug: 'pampanga',        logo_url: null, description: null },
]

async function getLocations(): Promise<Location[]> {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SERVICE_ROLE = process.env.NEXT_SUPABASE_SERVICE_ROLE
    if (!SUPABASE_URL || !SERVICE_ROLE) return FALLBACK_LOCATIONS

    const url =
      `${SUPABASE_URL}/rest/v1/site_locations` +
      `?select=id,title,slug,logo_url,description` +
      `&is_active=eq.true&order=title.asc`

    const res = await fetch(url, {
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) return FALLBACK_LOCATIONS
    const data: Location[] = await res.json()
    return data.length > 0 ? data : FALLBACK_LOCATIONS
  } catch {
    return FALLBACK_LOCATIONS
  }
}

export default async function Home() {
  const [settings, locations] = await Promise.all([getSiteSettings(), getLocations()])

  return (
    <main className="min-h-screen bg-white">
      <HomeHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />
      <HomeHero />
      <LocationGrid locations={locations} />
      <HomeFooter
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        links={settings.footerLinks}
      />
    </main>
  )
}
