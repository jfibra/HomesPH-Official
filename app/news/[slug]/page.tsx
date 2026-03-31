import Link from 'next/link'
import { Share2, Printer, Copy, X } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import { getSiteSettings } from '@/lib/site-settings'
import { GENERAL_NAV_ITEMS } from '@/lib/general-nav'
import { MOCK_NEWS, MOCK_REAL_ESTATE_NEWS } from '@/lib/mock-data'
import AdBanner from '@/components/ui/AdBanner'

interface Article {
  id: number | string
  title: string
  slug: string
  summary?: string
  excerpt?: string
  description?: string
  category?: string
  image_url?: string
  image?: string
  author?: string
  published_at: string
  read_time?: number
  tags?: string[]
  topics?: string[]
  location?: string
  city?: string | null
  is_live?: boolean
  views_count?: number
  body?: string
  content?: string
}

function fmtDate(value: string) {
  return new Date(value).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return fmtDate(value)
}

function getImage(article: Article) {
  return article.image_url ?? article.image ?? ''
}

function getAllArticles(): Article[] {
  const allArticles = [...(MOCK_NEWS as Article[]), ...(MOCK_REAL_ESTATE_NEWS as Article[])]
  const seen = new Map<string, Article>()
  for (const article of allArticles) {
    const key = String(article.id)
    if (!seen.has(key)) seen.set(key, article)
  }
  return [...seen.values()].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const settings = await getSiteSettings()
  
  const allArticles = getAllArticles()
  const article = allArticles.find(a => a.slug === slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader
          logoUrl={settings.logoUrl}
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          socialLinks={settings.socialLinks}
          navItems={GENERAL_NAV_ITEMS}
        />
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-4xl font-extrabold text-gray-950">Article not found</h1>
          <p className="mt-4 text-gray-600">The article you're looking for doesn't exist.</p>
          <Link href="/news" className="mt-6 inline-block text-[#1428ae] font-bold hover:underline">
            ← Back to News
          </Link>
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

  // Get related articles for sidebar
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 8)

  const latestStories = relatedArticles.slice(0, 4)
  const trendingStories = relatedArticles.slice(4, 8)

  const image = getImage(article)

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader
        logoUrl={settings.logoUrl}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        socialLinks={settings.socialLinks}
        navItems={GENERAL_NAV_ITEMS}
      />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 border-l-4 border-[#1428ae] pl-6">
          <h1 className="text-4xl font-extrabold leading-tight text-gray-950 mb-3">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="font-semibold text-gray-700">UPDATED {timeAgo(article.published_at).toUpperCase()}</span>
            <div className="flex items-center gap-2">
              <span>By</span>
              <span className="font-semibold text-gray-700">{article.author ?? 'HomesPH News Desk'}</span>
            </div>
          </div>
          
          {/* Social Buttons */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Featured Image */}
            {image && (
              <div className="overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Housing prices in the Philippines expanded by less than two percent in the third quarter of 2025, marking the slowest annual inflation on record.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                According to the Residential Property Price Index (RPPI) reported by 'The Bangko Sentral ng Pilipinas (BSP) on Friday, Dec. 26, price growth for all types of housing units in the Philippines slowed to 1.9 percent in the July, by September period, significantly slower than the 7.6 percent posted in the year-over-for year.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Notably, the sharp easing in prices was largely driven by house prices, which slowed to 1.9 percent from 9.4 percent in the third quarter of 2024. Growth in condominium units also decelerated to 1.9 percent in a year-over-a-year earlier.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                While the trend mirrored price movements in Metro Manila and areas outside National Capital Region (ANCR), the slowdown in NCR - where price growth eased to 2.3 percent from 7.2 percent last year - did not hit the weakness on record.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                To recall, prices of all types of housing units in the cap tal region contracted by 1.9 percent in the fourth quarter of 2023, directly a deeper 4.8-percent drop in condominium prices. The 4.5-percent increase in NCR house prices during the period was enough to offset the contraction.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                House price increases outside Metro Manila slowed to one percent in the third quarter from nine percent a year earlier. Likewise, condominium unit prices eased to 3.2 percent from four percent.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                During the quarter, the median price of residential properties nationwide stood at ₱3,462,235 - slightly below the ₱3,469,855-median price for condominium units but higher than the ₱3,292,100 median price of houses.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Across the country, over1 mths of residential real estate loans (RRELs) increased both year-on-year and quarter-on-quarter, signaling sustained housing demand.
              </p>
            </div>

            {/* Article Footer */}
            <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
              <div>
                <p className="text-gray-700 font-semibold">{article.author ?? 'HomesPH News Desk'}</p>
                <p className="text-gray-500 text-sm">{fmtDate(article.published_at)}</p>
              </div>
              {article.read_time && (
                <div className="text-gray-600 text-sm">
                  <span className="font-semibold">{article.read_time}</span> min read
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ad Banner */}
            <div className="rounded-lg bg-gray-200 h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-gray-600">ADS</p>
                <p className="text-sm text-gray-500 mt-2">Advertisement</p>
              </div>
            </div>

            {/* Latest Stories */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-4">Latest Stories</h3>
              <div className="space-y-4">
                {latestStories.map(story => (
                  <Link key={story.id} href={`/news/${story.slug}`} className="group block">
                    <div className="flex gap-3">
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                        {getImage(story) && (
                          <img
                            src={getImage(story)}
                            alt={story.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-bold text-gray-950 group-hover:text-[#1428ae] transition-colors">
                          {story.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{fmtDate(story.published_at)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-4">Trending</h3>
              <div className="space-y-4">
                {trendingStories.map(story => (
                  <Link key={story.id} href={`/news/${story.slug}`} className="group block">
                    <div className="flex gap-3">
                      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                        {getImage(story) && (
                          <img
                            src={getImage(story)}
                            alt={story.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-bold text-gray-950 group-hover:text-[#1428ae] transition-colors">
                          {story.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{fmtDate(story.published_at)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad Banner Bottom */}
            <div className="rounded-lg bg-gray-200 h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-gray-600">ADS</p>
                <p className="text-sm text-gray-500 mt-2">Advertisement</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-16">
        <AdBanner />
      </div>

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
