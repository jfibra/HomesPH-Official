import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'

const LOGO = 'https://rwhtwbbpnhkevhocdmma.supabase.co/storage/v1/object/public/homesph/logo.png'

export default function HomeFooter({
  contactEmail = 'info@homesph.com',
  contactPhone = '+63 912 345 6789',
  links = [
    { label: 'About Us', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms and Conditions', href: '/terms-and-conditions' },
  ],
  logoUrl = LOGO,
}: {
  contactEmail?: string
  contactPhone?: string
  links?: { label: string; href: string }[]
  logoUrl?: string
}) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#052539] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* 3-column grid styled like the provided design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 pb-12 border-b border-white/10">

          {/* Col 1: Brand */}
          <div className="space-y-5">
            <img src={logoUrl} alt="HomesPH" className="h-10 w-auto filter brightness-0 invert" />
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Your trusted partner in finding the perfect home.
              Connecting Filipinos with quality properties nationwide.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-md bg-white text-[#052539] hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-md bg-white text-[#052539] hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          {/* Col 2: Company / Quick Links */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold tracking-widest uppercase text-white">Quick Links</h4>
            <nav className="space-y-3">
              {links.map(({ label, href }) => (
                <Link key={href} href={href} className="block text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold tracking-widest uppercase text-white">Contact Us</h4>
            <div className="space-y-3 text-slate-300">
              <a href={`tel:${contactPhone}`} className="flex items-start gap-3">
                <Phone size={16} className="mt-1 text-amber-400" />
                <div>
                  <div className="font-medium text-white">{contactPhone}</div>
                  <div className="text-xs">Mon-Sat 9AM-6PM</div>
                </div>
              </a>
              <a href={`mailto:${contactEmail}`} className="flex items-start gap-3">
                <Mail size={16} className="mt-1 text-amber-400" />
                <div>
                  <div className="font-medium text-white">{contactEmail}</div>
                  <div className="text-xs">We reply within 24hrs</div>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <svg className="mt-1 text-amber-400" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" />
                </svg>
                <div>
                  <div className="font-medium text-white">Cebu City, Philippines</div>
                  <div className="text-xs">Serving nationwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <span>© {year} HomesPH. All rights reserved.</span>
          <span className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Sitemap</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
