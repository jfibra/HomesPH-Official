import { LocationCard, type Location } from './LocationCard'

const BG = 'https://rwhtwbbpnhkevhocdmma.supabase.co/storage/v1/object/public/bg_elements'

export default function LocationGrid({ locations }: { locations: Location[] }) {
  return (
    <section
      id="locations"
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      {/* Colored Philippine map watermark */}
      <img
        src={`${BG}/ph-map-colors.png`}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-contain object-center opacity-[0.04] pointer-events-none select-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#1428ae] bg-[#1428ae]/8 px-4 py-1.5 rounded-full mb-5">
            Step 1 — Choose Your City
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Where Is Your Dream Home?
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
            Select a location below to explore available properties,
            condominiums, and investment opportunities.
          </p>
        </div>

        {/* Location grid: 2 → 3 → 4 → 5 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {locations.map((loc, i) => (
            <LocationCard key={loc.id} location={loc} index={i} />
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-12">
          More cities coming soon — check back regularly for updates.
        </p>
      </div>
    </section>
  )
}
