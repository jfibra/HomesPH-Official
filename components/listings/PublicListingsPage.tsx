import Link from 'next/link'
import React from 'react'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import Image from 'next/image'
import LocationSwitcher from '@/components/home/LocationSwitcher'
import {
  type ListingSearchMode,
  type PropertySearchParamsInput,
  searchPublicListings,
} from '@/lib/property-search'
import { getSiteSettings } from '@/lib/site-settings'
import {
  MapPin,
  ChevronDown,
  Heart,
  Share2,
  LayoutList,
  Bell,
  Bed,
  Bath,
  User,
  Map as MapIcon,
  List,
  Star,
  Check,
  ChevronRight,
  PhilippinePeso,
} from 'lucide-react'
import BuySearchBar from './BuySearchBar'
import PropertyTypeFilter from './PropertyTypeFilter'
import BedsBathsFilter from './BedsBathsFilter'
import MoreFilters from './MoreFilters'
import type { RentPHProperty } from './RentPHListingsGrid'

const RENTPH_LOGO = 'https://rent.ph/uploads/0000/1/2025/02/06/rentlogo-official1.png'

interface PublicListingsPageProps {
  mode: ListingSearchMode
  searchParams: PropertySearchParamsInput
  rentPHListings?: RentPHProperty[]
  rentPHTotal?: number
  rentPHPage?: number
  rentPHLastPage?: number
}

function formatPrice(value: number | null) {
  if (value === null || value === undefined) {
    return '0'
  }
  return Number(value).toLocaleString()
}

export default async function PublicListingsPage({
  mode,
  searchParams,
  rentPHListings,
  rentPHTotal = 0,
  rentPHPage = 1,
  rentPHLastPage = 1,
}: PublicListingsPageProps) {
  const settings = await getSiteSettings()
  const { listings, selectedProject } = await searchPublicListings(mode, searchParams)

  const isSale = mode === 'sale'
  const isRent = mode === 'rent'

  type SlotItem =
    | { kind: 'homesph'; listing: (typeof listings)[0] }
    | { kind: 'rentph'; listing: RentPHProperty }
  const slots: SlotItem[] = []
  for (const l of (listings ?? []).slice(0, 6)) slots.push({ kind: 'homesph', listing: l })
  if (isRent && rentPHListings) {
    for (const p of rentPHListings) {
      if (slots.length >= 6) break
      slots.push({ kind: 'rentph', listing: p })
    }
  }

  /* ─── Shared sub-components ─────────────────────────────── */
  const SortViewBar = () => (
    <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
      <div style={{ border: '1px solid #D3D3D3', borderRadius: '10px', height: '45px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#FFF' }}>
        <LayoutList size={20} color="#002143" />
        <span style={{ fontSize: '16px', fontWeight: 300, color: '#002143' }}>Popular</span>
        <ChevronDown size={18} color="#002143" />
      </div>
      <div style={{ border: '1px solid #D3D3D3', borderRadius: '10px', height: '45px', minWidth: '185px', display: 'flex', alignItems: 'center', padding: '0 4px', position: 'relative', background: '#FFF' }}>
        <div style={{ position: 'absolute', left: '4px', width: '88px', height: '37px', background: '#DFE3FF', borderRadius: '7px' }} />
        <div style={{ zIndex: 1, display: 'flex', width: '100%' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <List size={18} color="#1428AE" />
            <span style={{ fontSize: '15px', fontWeight: 500, color: '#1428AE' }}>List</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer' }}>
            <MapIcon size={16} color="#8187B0" />
            <span style={{ fontSize: '15px', fontWeight: 300, color: '#8187B0' }}>Map</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .listing-card-interactive {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          cursor: pointer; text-decoration: none; color: inherit; display: flex;
        }
        .listing-card-interactive:hover {
          transform: translateY(-6px);
          box-shadow: 0px 20px 40px rgba(0, 33, 67, 0.12);
        }
        .ph-container {
          max-width: 1920px;
          margin: 0 auto;
          padding-left: clamp(24px, 5vw, 296px);
          padding-right: clamp(24px, 5vw, 296px);
        }
      `}} />
      {/* Top Contact Bar for Buy/Rent pages */}
      {(() => {
        let socials: any = {}
        const raw = settings.socialLinks as any
        if (raw) {
          if (typeof raw === 'string') {
            try { socials = JSON.parse(raw) } catch { socials = {} }
          } else {
            socials = raw
          }
        }
        const hasTopBar = Boolean(settings.contactPhone || settings.contactEmail || socials.facebook || socials.twitter || socials.instagram)
        if (!hasTopBar) return null
        return (
          <div className="bg-[#002143]" style={{ position: 'relative', zIndex: 1000 }}>
            <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 xl:px-20 2xl:pl-[227px] 2xl:pr-[227px] flex items-center justify-between h-10">
              <div className="flex items-center gap-5">
                {settings.contactPhone && (
                  <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition-colors">
                    {/* phone icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12" className="shrink-0">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                    </svg>
                    <span>{settings.contactPhone}</span>
                  </a>
                )}
                {settings.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`} className="hidden sm:flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition-colors">
                    {/* mail icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12" className="shrink-0">
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                    <span>{settings.contactEmail}</span>
                  </a>
                )}
              </div>
              <div className="flex items-center gap-4">
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-blue-200 hover:text-white transition-colors">
                    <Image src="/socialIcons/fb.png" alt="Facebook" width={14} height={14} />
                  </a>
                )}
                <a href={socials.twitter || '#'} aria-label="X / Twitter" className="text-blue-200 hover:text-white transition-colors">
                  <Image src="/socialIcons/X.png" alt="X / Twitter" width={14} height={14} />
                </a>
                <LocationSwitcher variant="dark" />
              </div>
            </div>
          </div>
        )
      })()}

      {/* Footer Wrapper - Center across 100% (Full Width) */}
      <div style={{
        position: 'absolute',
        width: '100%',
        left: '0px',
        bottom: '0px',
        zIndex: 5
      }}>
        <SiteFooter
          logoUrl={settings.logoUrl}
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          socialLinks={settings.socialLinks}
          brandName={settings.siteTitle}
        />
      </div>

      {/* Main Site Header */}
      {/* Main Site Header (top contact bar rendered above to match design) */}
      <SiteHeader
        logoUrl={settings.logoUrl}
      />

      {/* 1920px Centered Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1920px',
        margin: '-150px auto 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Enable interactions for children */}
        <div style={{ pointerEvents: 'auto', width: '100%', height: '100%', position: 'relative' }}>

          {/* Absolute positioning container for previous elements */}

          {/* Search Bar Section */}
          {/* Search Bar and Filter Section */}
          <div style={{ position: 'relative', zIndex: 100, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '1920px' }}>
              <BuySearchBar initialValue={(Array.isArray(searchParams.location) ? searchParams.location[0] : searchParams.location) || ''} />

              {/* Filter Dropdowns */}
              <PropertyTypeFilter />
              <BedsBathsFilter />
              <MoreFilters />

              <div style={{ position: 'absolute', left: '1418px', top: '259.12px', fontSize: '16px', fontWeight: 500, color: '#001392' }}>Clear Filters</div>
              <div style={{ position: 'absolute', left: '1535px', top: '259.12px', fontSize: '16px', fontWeight: 500, color: '#001392' }}>Save Search</div>
            </div>
          </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {['Payment Plan', 'Unit Types', 'About Project'].map(label => (
                      <div key={label} style={{ border: '1px solid #D3D3D3', borderRadius: '10px', height: '54px', flex: '1 1 180px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', cursor: 'pointer', background: '#FFF' }}>
                        <span style={{ fontSize: '17px', fontWeight: 400, color: '#002143' }}>{label}</span>
                        <ChevronRight size={13} color="#D2D2D2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: gallery */}
                <div style={{ flexShrink: 0, width: 'min(380px, 35vw)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', height: '260px', background: '#D9D9D9', flexShrink: 0 }}>
                    <img src={selectedProject.gallery[0]?.image_url || selectedProject.main_image_url || ''} alt={selectedProject.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ borderRadius: '10px', overflow: 'hidden', height: '140px', background: '#D9D9D9' }}>
                      <img src={selectedProject.gallery[1]?.image_url || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ borderRadius: '10px', overflow: 'hidden', height: '140px', background: '#D9D9D9' }}>
                      <img src={selectedProject.gallery[2]?.image_url || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results header for project view */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '26px', fontWeight: 400, color: '#002143' }}>
                  Properties {isSale ? 'for sale' : 'for rent'} in {selectedProject.name}
                </h3>
                <SortViewBar />
              </div>

              {/* Sub-project phases bar */}
              <div style={{ border: '1px solid #D3D3D3', borderRadius: '10px', height: '58px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '24px', background: '#FFF' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '18px', fontWeight: 300, color: '#1428AE' }}>{selectedProject.name} 101</span>
                  <span style={{ fontSize: '18px', fontWeight: 300, color: '#002143' }}>(8)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '18px', fontWeight: 300, color: '#1428AE' }}>{selectedProject.name} 102</span>
                  <span style={{ fontSize: '18px', fontWeight: 300, color: '#002143' }}>(5)</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Standard page header (default listing view) ── */}
          {!selectedProject && (
            <div style={{ paddingTop: '28px', paddingBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 300, color: '#002143' }}>
                    {isSale ? 'For Sale:' : 'For Rent:'} Philippine Properties
                  </p>
                  <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 400, color: '#002143', lineHeight: 1.15 }}>
                    Properties {isSale ? 'for sale' : 'for rent'} in Philippines
                  </h1>
                </div>
                <SortViewBar />
              </div>

              {/* City stats bar */}
              {(() => {
                const cityCounts = (listings || []).reduce((acc: Record<string, number>, listing: any) => {
                  const city = listing.projects?.city_municipality || 'Other'
                  acc[city] = (acc[city] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
                const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)
                if (topCities.length === 0) return null
                return (
                  <div style={{ border: '1px solid #D3D3D3', borderRadius: '10px', height: '60px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF', maxWidth: '960px' }}>
                    <div style={{ display: 'flex', gap: '28px', flex: 1, flexWrap: 'wrap' }}>
                      {topCities.map(([city, count], idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                          <Link href={`${isSale ? '/buy' : '/rent'}?location=${encodeURIComponent(city)}`} style={{ fontSize: '15px', fontWeight: 300, color: '#1428AE', textDecoration: 'none', whiteSpace: 'nowrap' }}>{city}</Link>
                          <span style={{ fontSize: '15px', fontWeight: 300, color: '#002143' }}>({count.toLocaleString()})</span>
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 500, color: '#1428AE', cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: '16px' }}>VIEW ALL LOCATIONS</span>
                  </div>
                )
              })()}
            </div>
          )}

          {/* ── Main layout: Listings + Sidebar ── */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', paddingBottom: '64px' }}>

            {/* Listings column */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {slots.map((slot, index) => {
                const hasBrokerBadge = index === 2 || index === 4 || index === 5

                /* ── RentPH card ── */
                if (slot.kind === 'rentph') {
                  const p = slot.listing
                  const rawPrice = Number(String(p.price).replace(/[^0-9.]/g, ''))
                  const priceStr = isNaN(rawPrice) || rawPrice === 0 ? '0' : rawPrice.toLocaleString()
                  const img = p.image?.startsWith('http') ? p.image : (p.gallery?.[0]?.large ?? '')
                  const baths = Number(p.bath) || 0
                  const sqm = Number(p.square) || 0
                  return (
                    <Link
                      key={`rentph-${p.id}`}
                      href={`/rent/${p.slug}`}
                      className="listing-card-interactive"
                      style={{ border: '1px solid #D3D3D3', borderRadius: '12px', overflow: 'hidden', background: '#FFF', minHeight: '280px' }}
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', width: '46%', flexShrink: 0, background: '#E8E8E8', overflow: 'hidden' }}>
                        {img
                          ? <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🏠</div>
                        }
                        {/* RentPH badge */}
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', borderRadius: '6px', padding: '3px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                          <img src={RENTPH_LOGO} alt="Rent.PH" style={{ height: '15px', objectFit: 'contain', display: 'block' }} />
                        </div>
                        {p.is_featured && (
                          <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#f59e0b', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>⭐ Featured</div>
                        )}
                        <div style={{ position: 'absolute', right: '14px', bottom: '14px', display: 'flex', gap: '12px' }}>
                          <Heart size={22} color="white" fill="none" style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.4))' }} />
                          <Share2 size={22} color="white" fill="none" style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.4))' }} />
                        </div>
                        {hasBrokerBadge && p.user_name && (
                          <div style={{ position: 'absolute', left: 0, bottom: '26px', display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #0A124D', background: '#3249E7', overflow: 'hidden', flexShrink: 0, zIndex: 2 }}>
                              {p.user_avatar
                                ? <img src={p.user_avatar} alt={p.user_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} color="white" /></div>}
                            </div>
                            <div style={{ background: 'linear-gradient(207deg, #2D43D8 33%, #081148 90%)', borderRadius: '0 8px 8px 0', padding: '4px 12px 4px 6px', marginLeft: '-6px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 300, color: '#FFF', whiteSpace: 'nowrap' }}>{p.agent_title || 'Agent'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, padding: '18px 20px 18px 22px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                          <img src={RENTPH_LOGO} alt="Rent.PH" style={{ height: '20px', objectFit: 'contain' }} />
                        </div>
                        <div style={{ marginTop: '28px', marginBottom: '6px', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                          <span style={{ fontSize: '20px', fontWeight: 500, color: '#002143' }}>Php</span>
                          <span style={{ fontSize: '28px', fontWeight: 600, color: '#002143' }}>{priceStr}</span>
                          <span style={{ fontSize: '13px', fontWeight: 300, color: '#888' }}>/mo</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>{p.property_type || 'Property'}</span>
                          {p.bed > 0 && <><div style={{ width: '1px', height: '14px', background: '#D3D3D3' }} /><Bed size={15} color="#002143" /><span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>{p.bed}</span></>}
                          {baths > 0 && <><div style={{ width: '1px', height: '14px', background: '#D3D3D3' }} /><Bath size={15} color="#002143" /><span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>{baths}</span></>}
                          {sqm > 0 && <><div style={{ width: '1px', height: '14px', background: '#D3D3D3' }} /><span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>Area: {sqm} sqm</span></>}
                        </div>
                        <p style={{ margin: '0 0 5px', fontSize: '13px', fontWeight: 300, color: '#1428AE', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: 'auto' }}>
                          <MapPin size={13} color="#002143" />
                          <span style={{ fontSize: '13px', fontWeight: 300, color: '#002143', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                          <div style={{ height: '40px', padding: '0 14px', background: '#DFE3FF', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1428AE"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                            <span style={{ fontSize: '14px', fontWeight: 400, color: '#1428AE' }}>Email</span>
                          </div>
                          <div style={{ height: '40px', padding: '0 14px', background: '#DFE3FF', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1428AE"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                            <span style={{ fontSize: '14px', fontWeight: 400, color: '#1428AE' }}>Call</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                }

                /* ── HomePH card ── */
                const listing = slot.listing
                const image = listing.property_listing_galleries[0]?.image_url || listing.projects?.main_image_url
                return (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="listing-card-interactive"
                    style={{ border: '1px solid #D3D3D3', borderRadius: '12px', overflow: 'hidden', background: '#FFF', minHeight: '280px' }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', width: '46%', flexShrink: 0, background: '#E8E8E8', overflow: 'hidden' }}>
                      <img
                        src={image || 'https://via.placeholder.com/460x280'}
                        alt={listing.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Pagination dots */}
                      <div style={{ position: 'absolute', left: '50%', bottom: '12px', transform: 'translateX(-50%)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <div style={{ width: '7px', height: '7px', background: '#FFF', borderRadius: '50%' }} />
                        <div style={{ width: '5px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
                        <div style={{ width: '5px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
                        <div style={{ width: '5px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
                      </div>
                      {/* Icons */}
                      <div style={{ position: 'absolute', right: '14px', bottom: '14px', display: 'flex', gap: '12px' }}>
                        <Heart size={22} color="white" fill="none" style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.4))' }} />
                        <Share2 size={22} color="white" fill="none" style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.4))' }} />
                      </div>
                      {/* Broker badge */}
                      {hasBrokerBadge && (
                        <div style={{ position: 'absolute', left: 0, bottom: '26px', display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #0A124D', background: '#3249E7', overflow: 'hidden', flexShrink: 0, zIndex: 2 }}>
                            {listing.user_profiles?.profile_image_url
                              ? <img src={listing.user_profiles.profile_image_url} alt="Broker" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} color="white" /></div>}
                          </div>
                          <div style={{ background: 'linear-gradient(207deg, #2D43D8 33%, #081148 90%)', borderRadius: '0 8px 8px 0', padding: '4px 12px 4px 6px', marginLeft: '-6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 300, color: '#FFF' }}>TopBroker</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, padding: '18px 18px 18px 22px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                      {/* Developer logo */}
                      <div style={{ position: 'absolute', top: '14px', right: '14px', width: '72px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {listing.developers_profiles?.logo_url
                          ? <img src={listing.developers_profiles.logo_url} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          : <div style={{ width: '100%', height: '100%', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '9px', color: '#666', textAlign: 'center', lineHeight: 1.2 }}>Project<br />Logo</span></div>}
                      </div>
                      {/* Price */}
                      <div style={{ marginTop: '28px', marginBottom: '6px', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 500, color: '#002143' }}>Php</span>
                        <span style={{ fontSize: '28px', fontWeight: 600, color: '#002143' }}>{formatPrice(listing.price)}</span>
                      </div>
                      {/* Specs */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>{listing.projects?.project_type || 'Apartment'}</span>
                        <div style={{ width: '1px', height: '14px', background: '#D3D3D3' }} />
                        <Bed size={15} color="#002143" /><span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>{listing.project_units?.bedrooms || 0}</span>
                        <div style={{ width: '1px', height: '14px', background: '#D3D3D3' }} />
                        <Bath size={15} color="#002143" /><span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>{listing.project_units?.bathrooms || 0}</span>
                        <div style={{ width: '1px', height: '14px', background: '#D3D3D3' }} />
                        <span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>Area: {listing.project_units?.floor_area_sqm || 0} sqm</span>
                      </div>
                      {/* Title */}
                      <p style={{ margin: '0 0 5px', fontSize: '13px', fontWeight: 300, color: '#1428AE', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</p>
                      {/* Location */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: 'auto' }}>
                        <MapPin size={13} color="#002143" />
                        <span style={{ fontSize: '13px', fontWeight: 300, color: '#002143' }}>
                          {[listing.projects?.city_municipality, listing.projects?.province, 'Philippines'].filter(Boolean).join(', ')}
                        </span>
                      </div>
                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                        <div style={{ height: '40px', padding: '0 14px', background: '#DFE3FF', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1428AE"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                          <span style={{ fontSize: '14px', fontWeight: 400, color: '#1428AE' }}>Email</span>
                        </div>
                        <div style={{ height: '40px', padding: '0 14px', background: '#DFE3FF', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1428AE"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                          <span style={{ fontSize: '14px', fontWeight: 400, color: '#1428AE' }}>Call</span>
                        </div>
                        <div style={{ height: '40px', padding: '0 14px', background: '#E1FFDF', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" fill="#00A629" />
                          </svg>
                          <span style={{ fontSize: '14px', fontWeight: 400, color: '#00A629' }}>WhatsApp</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}

              {slots.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px solid #E5E5E5', borderRadius: '12px' }}>
                  <p style={{ fontSize: '18px', fontWeight: 300, color: '#888', margin: '0 0 12px' }}>No listings found for your search.</p>
                  <Link href={isSale ? '/buy' : '/rent'} style={{ color: '#1428AE', textDecoration: 'underline', fontSize: '15px' }}>Clear filters</Link>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Contact Us box (project mode) */}
              {selectedProject && (
                <div style={{ border: '1px solid #D3D3D3', borderRadius: '10px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: '#FFF' }}>
                  <h4 style={{ fontWeight: 500, fontSize: '18px', color: '#002143', margin: '0 0 10px' }}>Contact Us</h4>
                  <p style={{ fontWeight: 300, fontSize: '15px', color: '#002143', margin: 0 }}>Submit your interest or inquiry for {selectedProject.name}.</p>
                </div>
              )}

              {/* Ad 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', height: '290px', background: '#F0F0F0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <iframe
                    src="https://homesphnews-api-394504332858.asia-southeast1.run.app/ads/14?size=300x250"
                    width="300" height="250" frameBorder="0" scrolling="no"
                    style={{ border: 'none', overflow: 'hidden' }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 300, color: '#9CA3AF' }}>Advertisement</span>
              </div>

              {/* Alert Me */}
              <div style={{ border: '1px solid #1428AE', borderRadius: '10px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                <Bell size={20} color="#1428AE" fill="#1428AE" />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1428AE', letterSpacing: '0.3px' }}>ALERT ME OF NEW PROPERTIES</span>
              </div>

              {/* Recommended searches */}
              <div>
                <div style={{ background: '#F4F4F9', borderRadius: '6px', height: '36px', display: 'flex', alignItems: 'center', paddingLeft: '14px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 400, color: '#002143' }}>Recommended searches</span>
                </div>
                <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    '1 Bedroom Properties for sale in the Philippines',
                    '2 Bedroom Properties for sale in the Philippines',
                    'Apartments for sale in the Philippines',
                  ].map(s => <span key={s} style={{ fontSize: '13px', fontWeight: 300, color: '#002143', cursor: 'pointer', lineHeight: 1.4 }}>{s}</span>)}
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#1428AE', cursor: 'pointer' }}>View More</span>
                </div>
              </div>

              {/* Useful links */}
              <div>
                <div style={{ background: '#F4F4F9', borderRadius: '6px', height: '36px', display: 'flex', alignItems: 'center', paddingLeft: '14px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 400, color: '#002143' }}>Useful Links</span>
                </div>
                <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {[
                    'Apartments for rent in the Philippines',
                    'Apartment for sale in the Philippines',
                    'Hotel Apartment for rent in the Philippines',
                    'Villa Compound for sale in the Philippines',
                  ].map(l => <span key={l} style={{ fontSize: '13px', fontWeight: 300, color: '#002143', cursor: 'pointer' }}>{l}</span>)}
                </div>
              </div>

              {/* Ad 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', height: '480px', background: '#F0F0F0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '48px', fontWeight: 900, color: '#D0D0D0' }}>ADS</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 300, color: '#9CA3AF' }}>Advertisement</span>
              </div>

            </div>
          </div>
        </div>

        {/* ── RentPH Pagination Strip ── */}
        {isRent && rentPHLastPage > 1 && (
          <div style={{ width: '100%', background: '#F8F9FF', borderTop: '1px solid #E2E5F0', padding: '32px 0 40px' }}>
            <div className="ph-container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <img src={RENTPH_LOGO} alt="Rent.PH" style={{ height: '26px', objectFit: 'contain' }} />
                <div style={{ width: '1px', height: '26px', background: '#D3D3D3' }} />
                <span style={{ fontSize: '18px', fontWeight: 400, color: '#002143' }}>{rentPHTotal.toLocaleString()} rentals from Rent.PH</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#EDF0FF', color: '#1428AE', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  Live
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {rentPHPage > 1 && (
                  <a href={`?rentPage=${rentPHPage - 1}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'white', border: '1px solid #D1D5DB', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Previous
                  </a>
                )}
                {(() => {
                  const pills: number[] = []
                  const cur = rentPHPage, last = rentPHLastPage
                  for (let i = 1; i <= last; i++) {
                    if (i === 1 || i === last || (i >= cur - 2 && i <= cur + 2)) pills.push(i)
                  }
                  return pills.flatMap((p, idx, arr) => {
                    const nodes: React.JSX.Element[] = []
                    if (idx > 0 && p > arr[idx - 1] + 1) nodes.push(<span key={`e${p}`} style={{ padding: '0 6px', color: '#9CA3AF' }}>…</span>)
                    nodes.push(
                      <a key={p} href={`?rentPage=${p}`} style={{ width: '40px', height: '40px', borderRadius: '10px', border: `1px solid ${p === cur ? '#1428AE' : '#D1D5DB'}`, background: p === cur ? '#1428AE' : 'white', color: p === cur ? 'white' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '14px', fontWeight: p === cur ? 700 : 400, boxShadow: p === cur ? '0 2px 8px rgba(20,40,174,0.25)' : 'none' }}>{p}</a>
                    )
                    return nodes
                  })
                })()}
                {rentPHPage < rentPHLastPage && (
                  <a href={`?rentPage=${rentPHPage + 1}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'white', border: '1px solid #D1D5DB', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Next <ChevronRight size={14} />
                  </a>
                )}
              </div>

              {/* Sidebar Contact Us Box */}
              <div style={{ position: 'absolute', width: '343px', height: '235px', left: '1280px', top: '918.12px', background: '#FFFFFF', border: '1px solid #D3D3D3', borderRadius: '10px', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h4 style={{ fontFamily: "'Outfit'", fontWeight: 500, fontSize: '22px', color: '#002143', margin: '30px 0 15px 0' }}>Contact Us</h4>
                <p style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '18px', color: '#002143', margin: 0 }}>
                  Submit your interest or inquiry for {selectedProject.name}.
                </p>
              </div>
            </>
          )}

          {/* Listing Slots */}
          {(listings || []).slice(0, 6).map((listing, index) => {
            const defaultTops = [548.27, 886.05, 1223.83, 1561.62, 1899.4, 2237.18]
            const projectTops = [1120.12, 1456.12, 1792.12, 2128.12, 2464.12, 2800.12]
            // Shift down if project header is active
            const top = selectedProject ? projectTops[index] : defaultTops[index]
            const image = listing.property_listing_galleries[0]?.image_url || listing.projects?.main_image_url

            // Check if this slot should have a broker badge (based on Figma CSS indices 3 and 5)
            const hasBrokerBadge = index === 2 || index === 4 || index === 5

            return (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="listing-card-interactive"
                style={{
                  boxSizing: 'border-box',
                  position: 'absolute',
                  width: '945.99px',
                  height: '317.68px',
                  left: '296px',
                  top: `${top}px`,
                  border: '1px solid #D3D3D3',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  display: 'block'
                }}
              >
                {/* Frame 2147223313 - Image Container */}
                <div style={{
                  position: 'absolute',
                  width: '453.39px', // Frame size
                  height: '295.56px',
                  left: '12px',
                  top: '11px',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  background: '#D9D9D9' // Rectangle 11196 mask
                }}>
                  {/* Actual Image (image 2035) with masking/offset */}
                  <div style={{
                    position: 'absolute',
                    width: '451px',
                    height: '294px',
                    left: '0px',
                    top: '0px',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={image || 'https://via.placeholder.com/460x314'}
                      alt={listing.title}
                      style={{
                        position: 'absolute',
                        width: '460px',
                        height: '314px',
                        left: 'calc(50% - 460px/2 - 0.7px)',
                        top: 'calc(50% - 314px/2 + 0.22px)',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Pagination Dots - Group 481931 - OVER the image */}
                  <div style={{ position: 'absolute', left: '201px', top: '261px', display: 'flex', gap: '8px', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ width: '8.04px', height: '8.04px', background: '#FFFFFF', borderRadius: '50%' }} />
                    <div style={{ width: '6.03px', height: '6.03px', background: 'rgba(211, 211, 211, 0.5)', borderRadius: '50%' }} />
                    <div style={{ width: '6.03px', height: '6.03px', background: 'rgba(211, 211, 211, 0.5)', borderRadius: '50%' }} />
                    <div style={{ width: '6.03px', height: '6.03px', background: 'rgba(211, 211, 211, 0.5)', borderRadius: '50%' }} />
                  </div>

                  {/* Icons on Image - Heart and Share */}
                  <div style={{ position: 'absolute', right: '15px', bottom: '15px', display: 'flex', gap: '15px', zIndex: 10 }}>
                    <Heart size={28.15} color="white" fill="none" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.3))' }} />
                    <Share2 size={28.15} color="white" fill="none" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.3))' }} />
                  </div>

                  {/* Broker Badge Section - OVER the image bottom-left */}
                  {hasBrokerBadge && (
                    <div style={{ position: 'absolute', left: '14px', top: '247px', zIndex: 20 }}>
                      <div style={{
                        width: '101.54px',
                        height: '32.17px',
                        left: '20px', // Offset for the profile circle
                        position: 'relative',
                        background: 'linear-gradient(207.12deg, #2D43D8 33.52%, #081148 89.63%)',
                        borderRadius: '0px 10px 10px 0px',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '21px'
                      }}>
                        <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#FFFFFF' }}>TopBroker</span>
                      </div>
                      {/* profile group */}
                      <div style={{
                        position: 'absolute',
                        width: '45.24px',
                        height: '45.24px',
                        left: '-10px',
                        top: '-7px',
                        borderRadius: '50%',
                        background: '#3249E7',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          boxSizing: 'border-box',
                          width: '43.23px',
                          height: '43.23px',
                          background: '#D9D9D9',
                          border: '1px solid #0A124D',
                          borderRadius: '50%',
                          overflow: 'hidden'
                        }}>
                          {listing.user_profiles?.profile_image_url ? (
                            <img
                              src={listing.user_profiles.profile_image_url}
                              alt="Broker"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e5e7eb' }}>
                              <User size={20} color="#9ca3af" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Area (Right side of image) */}
                <div style={{ position: 'absolute', left: '488px', width: '430px', top: '0px', height: '100%' }}>
                  {/* Project Logo - Top Right */}
                  <div style={{
                    position: 'absolute',
                    width: '95px',
                    height: '61.86px',
                    right: '10px',
                    top: '15px',
                    background: 'transparent',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {listing.developers_profiles?.logo_url ? (
                      <img
                        src={listing.developers_profiles.logo_url}
                        alt="Project Logo"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>Project<br />Logo</span>
                      </div>
                    )}
                  </div>

                  {/* Group 481922 - Price Group */}
                  <div style={{ position: 'absolute', left: '0px', top: '54px', display: 'flex', alignItems: 'baseline' }}>
                    <span style={{
                      fontFamily: "'Outfit'",
                      fontWeight: 500,
                      fontSize: '30px',
                      lineHeight: '30px',
                      color: '#002143'
                    }}>Php</span>
                    <span style={{
                      marginLeft: '10px',
                      fontFamily: "'Outfit'",
                      fontWeight: 500,
                      fontSize: '40px',
                      lineHeight: '40px',
                      color: '#002143'
                    }}>{formatPrice(listing.price)}</span>
                  </div>

                  {/* Group 481923 - Info/Details Group */}
                  <div style={{ position: 'absolute', left: '0px', top: '115px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143' }}>
                      {listing.projects?.project_type || 'Apartment'}
                    </span>
                    <div style={{ width: '1.01px', height: '20.11px', background: '#D3D3D3' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bed size={20.11} color="#002143" />
                      <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143' }}>
                        {listing.project_units?.bedrooms || 0}
                      </span>
                    </div>
                    <div style={{ width: '1.01px', height: '20.11px', background: '#D3D3D3' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bath size={20.11} color="#002143" />
                      <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143' }}>
                        {listing.project_units?.bathrooms || 0}
                      </span>
                    </div>
                    <div style={{ width: '1.01px', height: '20.11px', background: '#D3D3D3' }} />
                    <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143' }}>
                      Area: {listing.project_units?.floor_area_sqm || 0} sqm
                    </span>
                  </div>

                  {/* Group 481924 - Title/Link Group */}
                  <div style={{ position: 'absolute', left: '0px', top: '152px', display: 'flex', alignItems: 'center', gap: '10px', width: '430px', overflow: 'hidden' }}>
                    <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#1428AE', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{listing.title}</span>
                    {listing.project_amenities?.[0] && (
                      <>
                        <div style={{ width: '1.01px', height: '15.08px', background: '#D3D3D3' }} />
                        <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#1428AE', whiteSpace: 'nowrap' }}>{listing.project_amenities[0]}</span>
                      </>
                    )}
                    {listing.projects?.project_type && (
                      <>
                        <div style={{ width: '1.01px', height: '15.08px', background: '#D3D3D3' }} />
                        <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#1428AE', whiteSpace: 'nowrap' }}>{listing.projects.project_type}</span>
                      </>
                    )}
                  </div>

                  {/* Location Group */}
                  <div style={{ position: 'absolute', left: '0px', top: '188px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={17.09} color="#002143" />
                    <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143' }}>
                      {listing.projects?.city_municipality}, {listing.projects?.province}, Philippines
                    </span>
                  </div>

                  {/* Action Buttons - Group 481925 */}
                  <div style={{ position: 'absolute', left: '0px', top: '235px', display: 'flex', gap: '15px' }}>
                    {/* Email Button */}
                    <div style={{
                      width: '109.58px',
                      height: '50.27px',
                      background: '#DFE3FF',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8.13px',
                      cursor: 'pointer'
                    }}>
                      <svg width="25.13" height="25.13" viewBox="0 0 24 24" fill="#1428AE">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      <span style={{ fontFamily: "'Outfit'", fontWeight: 400, fontSize: '18px', lineHeight: '18px', color: '#1428AE' }}>Email</span>
                    </div>

                    {/* Call Button */}
                    <div style={{
                      width: '97.51px',
                      height: '50.27px',
                      background: '#DFE3FF',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8.13px',
                      cursor: 'pointer'
                    }}>
                      <svg width="25.13" height="25.13" viewBox="0 0 24 24" fill="#1428AE">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      <span style={{ fontFamily: "'Outfit'", fontWeight: 400, fontSize: '18px', lineHeight: '18px', color: '#1428AE' }}>Call</span>
                    </div>

                    {/* WhatsApp Button */}
                    <div style={{
                      width: '152.81px',
                      height: '50.27px',
                      background: '#E1FFDF',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: 'pointer'
                    }}>
                      <svg width="23.12" height="23.12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" fill="#00A629" />
                        <path d="M12.05 0C5.414 0 .004 5.408 0 12.046c0 2.123.543 4.192 1.571 6.059L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.637 0 12.048-5.408 12.052-12.046a11.824 11.824 0 00-3.417-8.514L12.05 0z" fill="#00A629" fillOpacity="0.1" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 14.1522 1.62123 16.155 2.68652 17.8441L1 23L6.28955 21.2831C7.94043 22.3721 9.9043 23 12 23Z" fill="#00A629" />
                        <path d="M17.5015 14.3315C17.2275 14.1945 15.881 13.5315 15.6315 13.4415C15.381 13.3505 15.1985 13.305 15.016 13.5785C14.8335 13.8515 14.309 14.4665 14.15 14.6495C13.991 14.832 13.832 14.8545 13.558 14.718C13.2845 14.581 12.4045 14.293 11.36 13.3615C10.547 12.636 9.9985 11.7435 9.839 11.4705C9.6795 11.1975 9.822 11.05 9.959 10.914C10.082 10.7915 10.232 10.595 10.369 10.435C10.5055 10.2755 10.551 10.1615 10.642 9.979C10.7335 9.797 10.688 9.6375 10.6195 9.501C10.551 9.364 10.0045 8.0195 9.7765 7.468C9.5545 6.9315 9.3295 7.001 9.163 6.9925C9.006 6.9845 8.824 6.983 8.642 6.983C8.4595 6.983 8.1635 7.0515 7.913 7.3245C7.6625 7.5975 6.9565 8.258 6.9565 9.6015C6.9565 10.945 7.936 12.2425 8.0725 12.425C8.2095 12.6075 10.0015 15.3675 12.741 16.549C13.3925 16.83 13.9015 17.0005 14.3005 17.127C14.9545 17.334 15.5495 17.305 16.021 17.2345C16.5465 17.156 17.6405 16.5715 17.868 15.934C18.096 15.297 18.096 14.75 18.0275 14.6365C17.959 14.5225 17.7765 14.4685 17.5015 14.3315Z" fill="white" />
                      </svg>
                      <span style={{ fontFamily: "'Outfit'", fontWeight: 400, fontSize: '18px', lineHeight: '18px', color: '#00A629' }}>WhatsApp</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {/* Sidebar Area - Absolute Track for Sticky Sidebar */}
          <div style={{
            position: 'absolute',
            top: '351.23px', // Start at the same vertical position as before
            left: '1272.15px',
            width: '350.85px',
            bottom: '40px', // End before the footer
            pointerEvents: 'none' // Allow clicking through the track itself
          }}>
            <div style={{
              position: 'sticky',
              top: '100px', // Stick 100px from the top (below the header)
              width: '100%',
              height: 'fit-content',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
              pointerEvents: 'auto' // Re-enable pointer events for the sidebar content
            }}>
              {/* AD 1 (Small) */}
              <div style={{ width: '350.85px', height: '335.77px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '350.85px', height: '335.77px', background: '#D9D9D9', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <iframe
                    src="https://homesphnews-api-394504332858.asia-southeast1.run.app/ads/14?size=300x250"
                    width="300"
                    height="250"
                    frameBorder="0"
                    scrolling="no"
                    style={{ border: 'none', overflow: 'hidden' }}
                  />
                </div>
                <span style={{ marginTop: '10px', fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', color: '#7F7F7F' }}>Advertisement</span>
              </div>

              {/* Alert Me Button */}
              <div style={{
                boxSizing: 'border-box',
                width: '350.85px',
                height: '56.3px',
                border: '1px solid #1428AE',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '13px',
                cursor: 'pointer',
                background: '#FFFFFF'
              }}>
                <Bell size={25.13} color="#1428AE" fill="#1428AE" />
                <span style={{ fontFamily: "'Outfit'", fontWeight: 400, fontSize: '18px', lineHeight: '18px', color: '#1428AE' }}>ALERT ME OF NEW PROPERTIES</span>
              </div>

              {/* Recommended Searches */}
              <div style={{ width: '350.85px' }}>
                <div style={{ width: '350.85px', height: '35.19px', background: '#F4F4F9', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingLeft: '16px', marginBottom: '15px' }}>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 400, fontSize: '18px', lineHeight: '18px', color: '#002143' }}>Recommended searches</span>
                </div>
                <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143', cursor: 'pointer' }}>1 Bedroom Properties for sale in the Philippines</span>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143', cursor: 'pointer' }}>2 Bedroom Properties for sale in the Philippines</span>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143', cursor: 'pointer' }}>Apartments for sale in the Philippines</span>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 500, fontSize: '15px', lineHeight: '15px', color: '#1428AE', cursor: 'pointer' }}>View More</span>
                </div>
              </div>

              {/* Useful Links */}
              <div style={{ width: '350.85px' }}>
                <div style={{ width: '350.85px', height: '35.19px', background: '#F4F4F9', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingLeft: '16px', marginBottom: '15px' }}>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 400, fontSize: '18px', lineHeight: '18px', color: '#002143' }}>Useful Links</span>
                </div>
                <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143', cursor: 'pointer' }}>Apartments for rent in the Philippines</span>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143', cursor: 'pointer' }}>Apartment for sale in the Philippines</span>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143', cursor: 'pointer' }}>Hotel Apartment for rent in the Philippines</span>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', lineHeight: '15px', color: '#002143', cursor: 'pointer' }}>Villa Compound for sale in the Philippines</span>
                </div>
              </div>

              {/* AD 2 (Large) */}
              <div style={{ width: '350.85px', height: '588.1px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '350.85px', height: '588.1px', background: '#D9D9D9', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Outfit'", fontWeight: 900, fontSize: '80px', lineHeight: '80px', color: '#002143', textAlign: 'center' }}>ADS</span>
                </div>
                <span style={{ marginTop: '10px', fontFamily: "'Outfit'", fontWeight: 300, fontSize: '15px', color: '#7F7F7F' }}>Advertisement</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

