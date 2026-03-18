import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { getSiteSettings } from '@/lib/site-settings'
import { MOCK_NEWS } from '@/lib/mock-data'
import AdBanner from '@/components/ui/AdBanner'

const CATEGORIES = ['All', ...Array.from(new Set(MOCK_NEWS.map(n => n.category)))]

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const settings = await getSiteSettings()

  const filtered = category && category !== 'All'
    ? MOCK_NEWS.filter(n => n.category === category)
    : MOCK_NEWS

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
      />

      {/* ── Hero ── */}
      <section className="bg-[#0c1f4a] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Insights & Updates</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Real Estate News</h1>
          <p className="text-white/60 text-sm max-w-lg">
            Stay informed on market trends, new developments, investment insights, and property guides from across the Philippines.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={cat === 'All' ? '/news' : `/news?category=${encodeURIComponent(cat)}`}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                (category === cat || (!category && cat === 'All'))
                  ? 'bg-[#1428ae] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1428ae]/40 hover:text-[#1428ae]'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Featured Article */}
        {featured && (
          <Link href={`/news/${featured.slug}`}
            className="group block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-5">
              <div className="sm:col-span-3 h-64 sm:h-80 overflow-hidden bg-gray-100">
                <img src={featured.image_url} alt={featured.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="sm:col-span-2 p-6 sm:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">{featured.category}</span>
                  <span className="text-[10px] text-gray-400">⭐ Featured</span>
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-[#1428ae] transition-colors leading-snug">{featured.title}</h2>
                <p className="text-sm text-gray-500 mt-3 line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{new Date(featured.published_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>·</span>
                  <span>{featured.read_time} min read</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {featured.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Articles Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(article => (
              <Link key={article.id} href={`/news/${article.slug}`}
                className="group block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#1428ae]/20 transition-all">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img src={article.image_url} alt={article.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#1428ae]/8 text-[#1428ae]">{article.category}</span>
                    <span className="text-[9px] text-gray-400">{article.read_time} min read</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#1428ae] transition-colors leading-snug line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>{article.author}</span>
                    <span>{new Date(article.published_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {article.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">📰</div>
                <p className="font-semibold text-gray-600">No articles in this category yet</p>
                <Link href="/news" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#1428ae] text-white text-sm font-semibold">View All News</Link>
              </div>
            )}
          </div>

          {/* ── Sidebar Ads ── */}
          <div className="hidden lg:flex flex-col gap-6 w-[300px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <AdBanner sizes={['300x250']} />
              <AdBanner sizes={['160x600']} />
            </div>
          </div>
        </div>

        {/* ── Newsletter CTA ── */}
        <div className="mt-14 bg-[#0c1f4a] rounded-2xl px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Stay Ahead of the Market</h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
            Get weekly real estate insights, market reports, and investment opportunities delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button className="bg-amber-400 text-[#1428ae] font-bold text-sm px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors shrink-0">
              Subscribe
            </button>
          </div>
        </div>

        {/* ── Topic Categories ── */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Explore by Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: '📈', label: 'Market Trends', desc: 'Price movements & forecasts' },
              { icon: '🏗️', label: 'New Developments', desc: 'Project launches & updates' },
              { icon: '💰', label: 'Investment', desc: 'ROI strategies & hot spots' },
              { icon: '📋', label: 'Guides', desc: 'Buying, renting & legal tips' },
              { icon: '🌿', label: 'Sustainability', desc: 'Green buildings & eco-living' },
              { icon: '🌍', label: 'Regional Update', desc: 'Province & city news' },
              { icon: '✈️', label: 'OFW Corner', desc: 'Overseas Filipino buyers' },
              { icon: '🏦', label: 'Finance', desc: 'Mortgages, Pag-IBIG & banks' },
            ].map(t => (
              <Link key={t.label} href={`/news?category=${encodeURIComponent(t.label)}`}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-[#1428ae]/30 hover:shadow-sm transition-all text-left">
                <div className="text-xl mb-2">{t.icon}</div>
                <p className="text-sm font-bold text-gray-900">{t.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <AdBanner />

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
