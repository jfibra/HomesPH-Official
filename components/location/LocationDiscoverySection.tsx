import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  House,
  Landmark,
  LandPlot,
  LayoutGrid,
} from 'lucide-react'
import LocationPopularSearchesCarousel from './LocationPopularSearchesCarousel'
import {
  LOCATION_EDITORIAL_BREAKOUT_CLASS,
  LOCATION_EDITORIAL_CONTENT_SHELL_CLASS,
  LOCATION_EDITORIAL_TITLE_SHELL_CLASS,
  LOCATION_PAGE_SHELL_CLASS,
} from './location-page-layout'

const DISCOVERY_SECTION_CONTAINER_CLASS =
  `${LOCATION_PAGE_SHELL_CLASS} pt-[38px] sm:pt-[46px] lg:pt-[56px] pb-[24px] sm:pb-[32px] lg:pb-[38px]`
const DISCOVERY_SECTION_HEADING_ALIGNMENT_CLASS =
  'w-full'

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
  { icon: LandPlot, label: 'Land', query: 'land' },
  { icon: Landmark, label: 'Villa', query: 'villa' },
]

const POPULAR_SEARCH_EDITORIAL_ORDER: PopularLocationReference[] = [
  { slug: 'cebu', title: 'Cebu' },
  { slug: 'manila', title: 'Manila' },
  { slug: 'davao', title: 'Davao' },
  { slug: 'bacolod', title: 'Bacolod' },
  { slug: 'pampanga', title: 'Pampanga' },
  { slug: 'bgc', title: 'BGC' },
  { slug: 'palawan', title: 'Palawan' },
  { slug: 'dumaguete', title: 'Dumaguete' },
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
      className="group flex flex-col items-center gap-[14px] rounded-[24px] px-[10px] py-[8px] text-center outline-none"
    >
      <span
        className="flex h-[82px] w-[82px] items-center justify-center rounded-[22px] border border-[#d9e5fb] bg-[linear-gradient(180deg,#fcfdff_0%,#edf4ff_100%)] text-[#2140d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_14px_30px_rgba(20,40,174,0.08)] transition-[transform,border-color,background-color,color,box-shadow] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[4px] group-hover:border-[#c7d8fb] group-hover:bg-[#f5f9ff] group-hover:text-[#173260] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_18px_34px_rgba(20,40,174,0.12)] group-focus-visible:border-[#cbd9fb] group-focus-visible:ring-2 group-focus-visible:ring-[#2140d8]/20 sm:h-[92px] sm:w-[92px]"
      >
        <Icon size={30} strokeWidth={2} className="sm:size-[34px]" />
      </span>
      <span className="text-[15px] font-semibold leading-none tracking-[-0.02em] text-[#173260] sm:text-[17px]">
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

            <div className="mx-auto mt-[28px] grid max-w-[1180px] grid-cols-2 gap-x-[26px] gap-y-[26px] sm:mt-[32px] sm:grid-cols-3 sm:gap-x-[30px] sm:gap-y-[30px] lg:grid-cols-5 lg:gap-x-[42px] lg:gap-y-[34px]">
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
            <div className={LOCATION_EDITORIAL_BREAKOUT_CLASS}>
              <div className={LOCATION_EDITORIAL_TITLE_SHELL_CLASS}>
                <div className={DISCOVERY_SECTION_HEADING_ALIGNMENT_CLASS}>
                  <DiscoverySectionHeading
                    prefix="Philippine Real Estate"
                    accent="Popular Searches"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-[22px] min-w-0 sm:mt-[26px] ${LOCATION_EDITORIAL_BREAKOUT_CLASS}`}>
            <div className={`${LOCATION_EDITORIAL_CONTENT_SHELL_CLASS} min-w-0`}>
              <LocationPopularSearchesCarousel cards={popularLocationCards} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
