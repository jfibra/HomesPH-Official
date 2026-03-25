import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  BriefcaseBusiness,
  Building,
  Building2,
  Hotel,
  House,
  Landmark,
  LandPlot,
  LayoutGrid,
  Store,
  Warehouse,
} from 'lucide-react'
import LocationPopularSearchesCarousel from './LocationPopularSearchesCarousel'

const DISCOVERY_SECTION_CONTAINER_CLASS =
  'mx-auto w-full max-w-[1600px] px-6 pt-[46px] sm:px-8 sm:pt-[58px] lg:px-10 lg:pt-[70px]'
const DISCOVERY_SECTION_HEADING_ALIGNMENT_CLASS =
  'mx-auto w-full max-w-[1200px]'
const POPULAR_SEARCHES_BREAKOUT_CLASS =
  'mx-auto w-[calc(100vw-20px)] max-w-[1880px] pb-[46px] sm:w-[calc(100vw-28px)] sm:pb-[58px] lg:w-[calc(100vw-48px)] lg:pb-[70px] xl:w-[calc(100vw-64px)] 2xl:w-[calc(100vw-80px)]'

interface LocationDiscoverySectionProps {
  locationName: string
  locationSlug: string
}

interface PropertyTypeShortcut {
  icon: LucideIcon
  label: string
  query: string
}

interface PopularLocationReference {
  slug: string
  title: string
}

interface PopularLocationCardData extends PopularLocationReference {
  imageSrc: string
}

const PROPERTY_TYPE_SHORTCUTS: PropertyTypeShortcut[] = [
  { icon: House, label: 'House', query: 'house' },
  { icon: Building2, label: 'Condo', query: 'condo' },
  { icon: LayoutGrid, label: 'Townhouse', query: 'townhouse' },
  { icon: Landmark, label: 'Villa', query: 'villa' },
  { icon: LandPlot, label: 'Land', query: 'land' },
  { icon: BriefcaseBusiness, label: 'Office', query: 'office' },
  { icon: Store, label: 'Shop', query: 'shop' },
  { icon: Warehouse, label: 'Warehouse', query: 'warehouse' },
  { icon: Hotel, label: 'Hotel', query: 'hotel' },
  { icon: Building, label: 'Building', query: 'building' },
]

const POPULAR_SEARCH_EDITORIAL_ORDER: PopularLocationReference[] = [
  { slug: 'cebu', title: 'Cebu' },
  { slug: 'manila', title: 'Manila' },
  { slug: 'davao', title: 'Davao' },
  { slug: 'bgc', title: 'BGC' },
  { slug: 'palawan', title: 'Palawan' },
  { slug: 'dumaguete', title: 'Dumaguete' },
  { slug: 'bacolod', title: 'Bacolod' },
  { slug: 'pampanga', title: 'Pampanga' },
  { slug: 'cavite', title: 'Cavite' },
  { slug: 'bohol', title: 'Bohol' },
  { slug: 'iloilo', title: 'Iloilo' },
  { slug: 'baguio', title: 'Baguio' },
  { slug: 'tagaytay', title: 'Tagaytay' },
  { slug: 'siargao', title: 'Siargao' },
  { slug: 'makati', title: 'Makati' },
  { slug: 'quezon-city', title: 'Quezon City' },
  { slug: 'batangas', title: 'Batangas' },
  { slug: 'cagayan-de-oro', title: 'Cagayan de Oro' },
]

const LOCATION_IMAGE_BY_SLUG: Record<string, string> = {
  baguio:
    'https://images.pexels.com/photos/33650343/pexels-photo-33650343.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  bacolod:
    'https://images.pexels.com/photos/33072142/pexels-photo-33072142.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  batangas:
    'https://images.pexels.com/photos/35183767/pexels-photo-35183767.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  bgc:
    'https://images.pexels.com/photos/19599291/pexels-photo-19599291.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  bohol:
    'https://images.pexels.com/photos/32171654/pexels-photo-32171654.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  'cagayan-de-oro':
    'https://images.pexels.com/photos/35642895/pexels-photo-35642895.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  cavite:
    'https://images.pexels.com/photos/13546265/pexels-photo-13546265.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  cebu:
    'https://images.pexels.com/photos/19479147/pexels-photo-19479147.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  davao:
    'https://images.pexels.com/photos/35642895/pexels-photo-35642895.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  dumaguete:
    'https://images.pexels.com/photos/35183767/pexels-photo-35183767.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  iloilo:
    'https://images.pexels.com/photos/33072141/pexels-photo-33072141.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  makati:
    'https://images.pexels.com/photos/32427444/pexels-photo-32427444.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  manila:
    'https://images.pexels.com/photos/32427444/pexels-photo-32427444.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  palawan:
    'https://images.pexels.com/photos/35648108/pexels-photo-35648108.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  pampanga:
    'https://images.pexels.com/photos/33650343/pexels-photo-33650343.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  'quezon-city':
    'https://images.pexels.com/photos/19479147/pexels-photo-19479147.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  siargao:
    'https://images.pexels.com/photos/35648108/pexels-photo-35648108.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  tagaytay:
    'https://images.pexels.com/photos/33650343/pexels-photo-33650343.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
}

function buildPopularLocationCards(
  locationName: string,
  locationSlug: string
): PopularLocationCardData[] {
  const buildCard = (item: PopularLocationReference): PopularLocationCardData => ({
    ...item,
    imageSrc:
      LOCATION_IMAGE_BY_SLUG[item.slug] ??
      'https://images.pexels.com/photos/3638870/pexels-photo-3638870.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1',
  })

  const orderedLocations = [
    {
      slug: locationSlug,
      title: locationName,
    },
    ...POPULAR_SEARCH_EDITORIAL_ORDER.filter((item) => item.slug !== locationSlug),
  ]

  return orderedLocations.slice(0, 18).map((item) => buildCard(item))
}

function DiscoverySectionHeading({
  prefix,
  accent,
}: {
  accent: string
  prefix: string
}) {
  return (
    <h2 className="text-[28px] font-semibold tracking-[-0.045em] text-[#0f274e] sm:text-[32px]">
      <span>{prefix} </span>
      <span className="text-[#2140d8]">{accent}</span>
    </h2>
  )
}

function PropertyTypeShortcutItem({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: LucideIcon
  label: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-[10px] rounded-[18px] px-[4px] py-[2px] text-center outline-none"
    >
      <span
        className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] border border-[#e7eef9] bg-[linear-gradient(180deg,#fbfdff_0%,#f1f6ff_100%)] text-[#2140d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition-[transform,border-color,background-color,color] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:border-[#d5e0f8] group-hover:bg-[#f7faff] group-hover:text-[#173260] group-focus-visible:border-[#cbd9fb] group-focus-visible:ring-2 group-focus-visible:ring-[#2140d8]/20"
      >
        <Icon size={18} strokeWidth={2} />
      </span>
      <span className="text-[12px] font-medium leading-none tracking-[-0.02em] text-[#173260] sm:text-[13px]">
        {label}
      </span>
    </Link>
  )
}

export default function LocationDiscoverySection({
  locationName,
  locationSlug,
}: LocationDiscoverySectionProps) {
  const popularLocationCards = buildPopularLocationCards(locationName, locationSlug)

  return (
    <section
      id="location-discovery"
      aria-label="Discovery shortcuts"
      className="border-t border-[#edf2fa] bg-white"
    >
      <div className={DISCOVERY_SECTION_CONTAINER_CLASS}>
        <div className="w-full min-w-0">
          <div>
            <div className={DISCOVERY_SECTION_HEADING_ALIGNMENT_CLASS}>
              <DiscoverySectionHeading prefix="Explore by" accent="Property Type" />
            </div>

            <div className="mt-[24px] grid grid-cols-5 gap-x-[14px] gap-y-[18px] sm:mt-[28px] sm:gap-x-[18px] lg:grid-cols-10 lg:gap-x-[20px]">
              {PROPERTY_TYPE_SHORTCUTS.map((item) => (
                <PropertyTypeShortcutItem
                  key={item.label}
                  href={`/search?location=${encodeURIComponent(locationSlug)}&q=${encodeURIComponent(item.query)}`}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>
          </div>

          <div className="mt-[42px] sm:mt-[52px]">
            <div className={DISCOVERY_SECTION_HEADING_ALIGNMENT_CLASS}>
              <DiscoverySectionHeading
                prefix="Philippine Real Estate"
                accent="Popular Searches"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-[22px] min-w-0 sm:mt-[26px] ${POPULAR_SEARCHES_BREAKOUT_CLASS}`}
      >
        <LocationPopularSearchesCarousel cards={popularLocationCards} />
      </div>
    </section>
  )
}
