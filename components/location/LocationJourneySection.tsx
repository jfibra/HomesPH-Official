import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface LocationJourneySectionProps {
  locationName: string
  locationSlug: string
}

interface JourneyStep {
  ctaHref: string
  ctaLabel: string
  description: string
  imageAlt: string
  imageSrc: string
  title: string
}

const JOURNEY_SECTION_CONTAINER_CLASS =
  'mx-auto w-full max-w-[1600px] px-6 py-[28px] sm:px-8 sm:py-[36px] lg:px-10 lg:py-[44px]'
const JOURNEY_SECTION_HEADING_ALIGNMENT_CLASS =
  'mx-auto w-full max-w-[1200px]'

function buildJourneySteps(locationName: string, locationSlug: string): JourneyStep[] {
  return [
    {
      title: 'Browse Properties',
      description: `Search verified listings in ${locationName} by price, size, and neighborhood so you can quickly narrow down the homes that fit your needs.`,
      ctaLabel: 'Explore Listings',
      ctaHref: `/buy?location=${encodeURIComponent(locationSlug)}`,
      imageAlt: `Browse properties in ${locationName}`,
      imageSrc:
        'https://images.pexels.com/photos/7578860/pexels-photo-7578860.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1',
    },
    {
      title: 'Connect with Brokers',
      description:
        'Get matched with verified professionals who understand your goals, answer your questions clearly, and guide you through each step of the process.',
      ctaLabel: 'Find Brokers',
      ctaHref: '/developers',
      imageAlt: 'Connect with brokers',
      imageSrc:
        'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1',
    },
    {
      title: 'Move In',
      description:
        'Complete secure transactions with full legal support and documentation, from reservation to turnover, so you can move in with confidence.',
      ctaLabel: 'Learn More',
      ctaHref: '/legal',
      imageAlt: 'Move into your new home',
      imageSrc:
        'https://images.pexels.com/photos/7937417/pexels-photo-7937417.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1',
    },
  ]
}

function JourneyStepCard({
  ctaHref,
  ctaLabel,
  description,
  imageAlt,
  imageSrc,
  title,
}: JourneyStep) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-[#e4ecf8] bg-white shadow-[0_14px_30px_rgba(15,39,78,0.06)]">
      <div className="grid min-h-[188px] grid-cols-[104px_minmax(0,1fr)] sm:min-h-[198px] sm:grid-cols-[118px_minmax(0,1fr)]">
        <div className="relative h-full min-h-[188px] sm:min-h-[198px]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,40,75,0.04)_0%,rgba(17,40,75,0.16)_100%)]"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-between px-[16px] py-[16px] sm:px-[18px] sm:py-[18px]">
          <div>
            <h3 className="text-[20px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#0f274e]">
              {title}
            </h3>
            <p className="mt-[10px] text-[14px] leading-[1.5] tracking-[-0.015em] text-[#41597f]">
              {description}
            </p>
          </div>

          <Link
            href={ctaHref}
            className="mt-[18px] inline-flex items-center gap-[7px] text-[14px] font-semibold tracking-[-0.02em] text-[#f5a623] transition-colors hover:text-[#d68b12]"
          >
            <span>{ctaLabel}</span>
            <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function LocationJourneySection({
  locationName,
  locationSlug,
}: LocationJourneySectionProps) {
  const steps = buildJourneySteps(locationName, locationSlug)

  return (
    <section aria-labelledby="location-journey-heading" className="bg-white">
      <div className={JOURNEY_SECTION_CONTAINER_CLASS}>
        <div className={JOURNEY_SECTION_HEADING_ALIGNMENT_CLASS}>
          <h2
            id="location-journey-heading"
            className="text-[28px] font-semibold tracking-[-0.045em] text-[#0f274e] sm:text-[32px]"
          >
            <span>Your Journey to </span>
            <span className="text-[#2140d8]">Homeownership</span>
          </h2>
          <p className="mt-[10px] max-w-[720px] text-[15px] leading-[1.5] tracking-[-0.02em] text-[#41597f] sm:text-[16px]">
            We make finding and buying your dream home simple, transparent, and
            stress-free.
          </p>
        </div>

        <div className="mt-[24px] grid grid-cols-1 gap-[16px] xl:grid-cols-3 xl:gap-[18px]">
          {steps.map((step) => (
            <JourneyStepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
