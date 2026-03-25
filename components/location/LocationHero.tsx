import Link from 'next/link'
import { Outfit } from 'next/font/google'
import LocationHeroControls from './LocationHeroControls'
import LocationHeroScrollCue from './LocationHeroScrollCue'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const HERO_NAV_ITEMS = [
  { label: 'Our Company', href: '/our-company' },
  { label: 'News', href: '/news' },
  { label: 'Mortgage', href: '/mortgage' },
  { label: 'Legal', href: '/legal' },
  { label: 'Tourism', href: '/tourism' },
  { label: 'Restaurant', href: '/restaurant' },
]

const HERO_BACKGROUND_IMAGE =
  'https://rwhtwbbpnhkevhocdmma.supabase.co/storage/v1/object/public/homesph/heroBackground1.jpg'
const HERO_LOGO_URL =
  'https://rwhtwbbpnhkevhocdmma.supabase.co/storage/v1/object/public/homesph/whiteLogo.png'

interface HeroQuickLink {
  label: string
  href: string
}

interface LocationHeroProps {
  brandName?: string
  heroImage?: string | null
  locationName: string
  locationSlug: string
  logoUrl?: string
  quickLinks: HeroQuickLink[]
}

export default function LocationHero({
  brandName = 'HomesPH',
  heroImage,
  locationName,
  locationSlug,
  logoUrl,
  quickLinks,
}: LocationHeroProps) {
  const resolvedHeroImage = HERO_BACKGROUND_IMAGE
  const resolvedLogoUrl = logoUrl?.includes('whiteLogo.png') ? logoUrl : HERO_LOGO_URL

  return (
    <section className={`${outfit.className} relative isolate w-full overflow-hidden bg-[#1c4f89] text-white`}>
      <img
        src={resolvedHeroImage}
        alt={`${locationName} homes showcase`}
        className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,73,124,0.58)_0%,rgba(35,98,153,0.18)_34%,rgba(8,24,49,0.34)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,228,255,0.24)_0%,rgba(20,73,124,0)_42%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,29,55,0.12)_0%,rgba(9,29,55,0.03)_28%,rgba(9,29,55,0.05)_58%,rgba(9,29,55,0.12)_100%)]" />

      <div className="relative mx-auto flex min-h-[690px] max-w-[1280px] flex-col px-6 pb-[56px] pt-[22px] sm:px-8 lg:px-10">
        <div className="relative flex min-h-[48px] items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            {resolvedLogoUrl ? (
              <img
                src={resolvedLogoUrl}
                alt={brandName}
                className="h-[36px] w-auto object-contain sm:h-[38px]"
                decoding="async"
                fetchPriority="high"
              />
            ) : (
              <span className="text-[28px] font-semibold tracking-[-0.04em] text-white">
                Homes<span className="font-normal text-white/84">.ph</span>
              </span>
            )}
          </Link>

          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-[40px] text-[15px] font-medium tracking-[-0.025em] text-white/96 lg:flex">
            {HERO_NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center justify-end gap-[28px]">
            <Link
              href="/login"
              className="hidden items-center text-[14px] font-medium leading-none tracking-[-0.02em] text-white/92 transition hover:text-white sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/registration/broker"
              className="inline-flex h-[40px] items-center justify-center rounded-[10px] bg-[#2140d8] px-[20px] text-[14px] font-semibold leading-none tracking-[-0.02em] text-white transition hover:bg-[#1b35b8]"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-start pb-[46px] pt-[88px] sm:pb-[54px] sm:pt-[102px] lg:pb-[64px] lg:pt-[108px]">
          <div className="mx-auto flex w-full max-w-[940px] flex-col items-center text-center">
            <h1 className="max-w-[900px] text-[56px] font-normal leading-[0.96] tracking-[-0.058em] text-white sm:text-[68px] lg:text-[80px]">
              Your Home Starts Here
            </h1>

            <p className="mt-[20px] max-w-[740px] text-[17px] leading-[1.45] font-medium tracking-[-0.02em] text-white/94 sm:text-[19px]">
              The best way to find your home in the Philippines.
            </p>

          </div>

          <LocationHeroControls
            locationName={locationName}
            locationSlug={locationSlug}
            quickLinks={quickLinks}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-[34px] flex justify-center sm:bottom-[38px] lg:bottom-[42px]">
          <LocationHeroScrollCue targetId="location-discovery" />
        </div>
      </div>
    </section>
  )
}
