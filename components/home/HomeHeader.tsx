'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Facebook, Twitter, Menu, X, Mail, Phone } from 'lucide-react'

interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  [key: string]: string | undefined
}

interface HomeHeaderProps {
  contactEmail?: string
  contactPhone?: string
  socialLinks?: SocialLinks | string
  logoUrl?: string
}

// Home-specific nav: show company/link actions rather than global site nav
const NAV_ITEMS: { label: string; href: string }[] = [
  { label: 'Our Company', href: '/our-company' },
  { label: 'News', href: '/news' },
  { label: 'Mortgage', href: '/mortgage' },
  { label: 'Legal', href: '/legal' },
  { label: 'Tourism', href: '/tourism' },
  { label: 'Restaurant', href: '/restaurant' },
]

export default function HomeHeader({
  contactEmail,
  contactPhone,
  socialLinks,
  logoUrl,
}: HomeHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  let socials: SocialLinks = {}
  if (socialLinks) {
    if (typeof socialLinks === 'string') {
      try { socials = JSON.parse(socialLinks) } catch { socials = {} }
    } else {
      socials = socialLinks
    }
  }

  return (
    <div className="w-full">
      {/* ── Top contact bar — dark navy ── */}
      <div className="bg-[#0c1f4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
          <div className="flex items-center gap-5">
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition-colors"
              >
                <Phone size={12} className="shrink-0" />
                <span>{contactPhone}</span>
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="hidden sm:flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition-colors"
              >
                <Mail size={12} className="shrink-0" />
                <span>{contactEmail}</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-4">
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <Facebook size={14} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <Twitter size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
          scrolled ? 'shadow-md' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[72px] gap-6">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              {logoUrl ? (
                // show provided logo
                <img src={logoUrl} alt="HomesPH" className="h-10 w-auto" />
              ) : (
                // fallback to simple text brand when no logo provided
                <span className="text-lg font-semibold text-gray-900">HomesPH</span>
              )}
            </Link>

            {/* LocationSwitcher removed per request */}

            <nav className="hidden md:flex flex-1 items-center justify-end gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-sm font-medium transition-colors group ${
                      isActive ? 'text-[#1428ae]' : 'text-gray-700 hover:text-[#1428ae]'
                    }`}
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-[#f59e0b] rounded-full transition-all duration-200 group-hover:w-full" />
                  </Link>
                )
              })}
            </nav>

            {/* Mobile hamburger */}
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="md:hidden ml-auto p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown removed — sidebar below */}
      </header>

      {/* ── Mobile sidebar ── */}
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 h-[72px] border-b border-gray-100 shrink-0">
          <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="HomesPH" className="h-9 w-auto" />
            ) : (
              <span className="text-lg font-semibold text-gray-900">HomesPH</span>
            )}
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-[#1428ae]/5 hover:text-[#1428ae]'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Contact info */}
        {(contactPhone || contactEmail) && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Contact</p>
            {contactPhone && (
              <a href={`tel:${contactPhone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1428ae] transition-colors">
                <span className="w-7 h-7 rounded-lg bg-[#1428ae]/8 flex items-center justify-center shrink-0">
                  <Phone size={13} className="text-[#1428ae]" />
                </span>
                {contactPhone}
              </a>
            )}
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1428ae] transition-colors">
                <span className="w-7 h-7 rounded-lg bg-[#1428ae]/8 flex items-center justify-center shrink-0">
                  <Mail size={13} className="text-[#1428ae]" />
                </span>
                <span className="truncate">{contactEmail}</span>
              </a>
            )}
          </div>
        )}

        {/* Social links */}
        {(socials.facebook || socials.twitter) && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
                className="w-8 h-8 rounded-md bg-[#1428ae] text-white hover:bg-amber-500 transition-colors flex items-center justify-center">
                <Facebook size={14} />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter / X"
                className="w-8 h-8 rounded-md bg-[#1428ae] text-white hover:bg-amber-500 transition-colors flex items-center justify-center">
                <Twitter size={14} />
              </a>
            )}
          </div>
        )}

        {/* List Property CTA */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          <Link
            href="/list-property"
            onClick={() => setOpen(false)}
            className="block w-full py-2.5 text-center text-sm font-semibold text-white bg-[#1428ae] rounded-lg hover:bg-amber-500 transition-colors"
          >
            List Property
          </Link>
        </div>
      </aside>
    </div>
  )
}
