'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Facebook, Twitter, Mail, Phone, Menu, X, MapPin } from 'lucide-react'
import RegisterModal from '../auth/RegisterModal'

interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  [key: string]: string | undefined
}

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'Contact Us', href: '/contact' },
]

export default function SiteHeader({
  logoText = 'HomesPH',
  logoUrl,
  contactEmail,
  contactPhone,
  socialLinks,
}: {
  logoText?: string
  logoUrl?: string
  contactEmail?: string
  contactPhone?: string
  socialLinks?: SocialLinks | string
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
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
      {(contactPhone || contactEmail || socials.facebook || socials.twitter) && (
        <div className="bg-[#0c1f4a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
            <div className="flex items-center gap-5">
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition-colors">
                  <Phone size={12} className="shrink-0" />
                  <span>{contactPhone}</span>
                </a>
              )}
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="hidden sm:flex items-center gap-1.5 text-xs text-blue-100 hover:text-white transition-colors">
                  <Mail size={12} className="shrink-0" />
                  <span>{contactEmail}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-blue-200 hover:text-white transition-colors">
                  <Facebook size={14} />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter / X" className="text-blue-200 hover:text-white transition-colors">
                  <Twitter size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main header ── */}
      <header className={`sticky top-0 z-40 bg-white transition-all duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[72px] gap-6">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={logoText} className="h-10 w-auto" />
              ) : (
                <span className="text-lg font-semibold text-gray-900">{logoText}</span>
              )}
            </Link>

            {/* Desktop nav — centered */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 group ${
                      isActive ? 'text-[#1428ae] bg-[#1428ae]/5' : 'text-gray-600 hover:text-[#1428ae] hover:bg-[#1428ae]/5'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[#f59e0b] transition-all duration-200 ${isActive ? 'w-4/5' : 'w-0 group-hover:w-4/5'}`} />
                  </Link>
                )
              })}
            </nav>

            {/* Auth buttons — desktop */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Link href="/login" className="px-4 py-2 text-sm font-semibold text-[#1428ae] rounded-lg border border-[#1428ae]/30 hover:border-[#1428ae] hover:bg-[#1428ae]/5 transition-all duration-150">
                Login
              </Link>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1428ae] rounded-lg shadow-sm hover:bg-[#f59e0b] hover:text-[#1428ae] transition-all duration-150"
              >
                Register
              </button>
            </div>

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
              <img src={logoUrl} alt={logoText} className="h-9 w-auto" />
            ) : (
              <span className="text-lg font-semibold text-gray-900">{logoText}</span>
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
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-7 h-7 rounded-lg bg-[#1428ae]/8 flex items-center justify-center shrink-0">
                <MapPin size={13} className="text-[#1428ae]" />
              </span>
              Cebu City, Philippines
            </div>
          </div>
        )}

        {/* Social links */}
        {(socials.facebook || socials.instagram || socials.twitter) && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
                className="w-8 h-8 rounded-md bg-[#1428ae] text-white hover:bg-amber-500 transition-colors flex items-center justify-center">
                <Facebook size={14} />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="w-8 h-8 rounded-md bg-[#1428ae] text-white hover:bg-amber-500 transition-colors flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
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

        {/* Auth buttons */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-2 shrink-0">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex-1 py-2.5 text-center text-sm font-semibold text-[#1428ae] border border-[#1428ae]/30 rounded-lg hover:bg-[#1428ae]/5 transition-colors"
          >
            Login
          </Link>
          <button
            onClick={() => { setOpen(false); setShowRegisterModal(true) }}
            className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-[#1428ae] rounded-lg hover:bg-amber-500 transition-colors"
          >
            Register
          </button>
        </div>
      </aside>
      <RegisterModal open={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </div>
  )
}
