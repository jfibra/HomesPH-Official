import type { LucideIcon } from 'lucide-react'
import { Building, Globe } from 'lucide-react'

const HIGHLIGHTS: { title: string; description: string; icon: LucideIcon; accent: string }[] = [
  {
    title: 'Network Nationwide',
    description:
      'Our vetted ambassador of agents stretches from the northernmost peaks to the southern keys, so every neighborhood enjoys the same expert care and first-look alerts.',
    icon: Globe,
    accent: '#f59e0b',
  },
  {
    title: 'Listings Nationwide',
    description:
      'Every listing is curated in real time, covering city condos, provincial estates, and investment-ready developments so you can compare homes side-by-side.',
    icon: Building,
    accent: '#0ea5e9',
  },
]

export default function NationwideShowcase() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white"
      aria-label="Nationwide reach and listings"
    >
      <div className="absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute right-10 top-10 h-44 w-44 rounded-full bg-[#f59e0b]/30 blur-[120px]" />
        <div className="absolute left-16 -bottom-12 h-52 w-52 rounded-full bg-[#0ea5e9]/30 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.6em] text-amber-200/80">
            Reach & inventory
          </p>
          <h2 className="text-3xl leading-tight font-semibold md:text-4xl">
            Network Nationwide <span className="text-amber-300">and</span> Listings Nationwide
          </h2>
          <p className="mx-auto max-w-3xl text-sm text-white/80 md:text-base">
            We pair every city with a dedicated local team while syncing live inventory across the Philippines. The moment a property moves, your feed updates across every connected neighborhood.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {HIGHLIGHTS.map((highlight) => {
            const Icon = highlight.icon
            return (
              <article
                key={highlight.title}
                className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-8 shadow-2xl shadow-slate-900/60 transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-14 w-14 flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-[1.6rem]"
                    style={{ color: highlight.accent }}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <span
                    className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70"
                    style={{ letterSpacing: '0.3em' }}
                  >
                    LIVE
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-semibold leading-snug">{highlight.title}</h3>
                <p className="mt-4 text-sm text-white/80">{highlight.description}</p>
                <div
                  className="pointer-events-none absolute -top-4 right-0 h-24 w-24 rounded-full border border-white/20 bg-white/10 blur-[0px]"
                  aria-hidden
                />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
