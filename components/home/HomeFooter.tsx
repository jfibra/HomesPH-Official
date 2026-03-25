import Link from 'next/link'
import {
  SolidFacebookIcon,
  SolidInstagramIcon,
  SolidMailIcon,
  SolidMapPinIcon,
  SolidPhoneIcon,
} from '../layout/FooterIcons'

const LOGO = 'https://rwhtwbbpnhkevhocdmma.supabase.co/storage/v1/object/public/homesph/logo.png'
const FOOTER_LOGO_URL =
  'https://rwhtwbbpnhkevhocdmma.supabase.co/storage/v1/object/public/homesph/whiteLogo.png'

export default function HomeFooter({
  contactEmail = 'info@homesph.com',
  contactPhone = '+63 912 345 6789',
  links = [
    { label: 'Our Company', href: '/our-company' },
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
  const resolvedLogoUrl = logoUrl?.includes('whiteLogo.png') ? logoUrl : FOOTER_LOGO_URL

  return (
    <footer className="bg-[#052539] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* 3-column grid styled like the provided design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 pb-12 border-b border-white/10">

          {/* Col 1: Brand */}
          <div className="space-y-5">
            <img src={resolvedLogoUrl} alt="HomesPH" className="h-10 w-auto object-contain" />
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
                <SolidFacebookIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-md bg-white text-[#052539] hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
              >
                <SolidInstagramIcon className="h-[18px] w-[18px]" />
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
                <SolidPhoneIcon className="mt-1 h-4 w-4 text-amber-400" />
                <div>
                  <div className="font-medium text-white">{contactPhone}</div>
                  <div className="text-xs">Mon-Sat 9AM-6PM</div>
                </div>
              </a>
              <a href={`mailto:${contactEmail}`} className="flex items-start gap-3">
                <SolidMailIcon className="mt-1 h-4 w-4 text-amber-400" />
                <div>
                  <div className="font-medium text-white">{contactEmail}</div>
                  <div className="text-xs">We reply within 24hrs</div>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <SolidMapPinIcon className="mt-1 h-4 w-4 text-amber-400" />
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
