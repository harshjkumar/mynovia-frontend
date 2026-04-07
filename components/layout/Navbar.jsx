'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { fetchCategories } from '@/lib/api'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dressDropdownOpen, setDressDropdownOpen] = useState(false)
  const [accDropdownOpen, setAccDropdownOpen] = useState(false)
  const pathname = usePathname()

  const [dressCategories, setDressCategories] = useState([
    { label: 'Bride', href: '/dresses/bride' },
    { label: 'Party', href: '/dresses/party' },
    { label: 'Godmother', href: '/dresses/godmother' },
    { label: 'Cocktail', href: '/dresses/cocktail' }
  ])
  const [accCategories, setAccCategories] = useState([
    { label: 'Combs', href: '/accessories/combs' },
    { label: 'Tiaras', href: '/accessories/tiaras' },
    { label: 'Belt', href: '/accessories/belt' },
    { label: 'Veils', href: '/accessories/veils' },
    { label: 'Shoes', href: '/accessories/shoes' },
    { label: 'Suspenders', href: '/accessories/suspenders' }
  ])

  const isHome = pathname === '/'
  const isDresses = pathname === '/dresses' || pathname.startsWith('/dresses/')
  const isAccessories = pathname === '/accessories' || pathname.startsWith('/accessories/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  useEffect(() => {
    const loadCats = async () => {
      try {
        const [dCats, aCats] = await Promise.all([
          fetchCategories('dress').catch(() => null),
          fetchCategories('accessory').catch(() => null)
        ])

        if (dCats && dCats.length > 0) {
          setDressCategories(
            dCats.map(c => ({ label: c.name, href: `/dresses/${c.slug}` }))
          )
        }

        if (aCats && aCats.length > 0) {
          setAccCategories(
            aCats.map(c => ({ label: c.name, href: `/accessories/${c.slug}` }))
          )
        }
      } catch (err) { }
    }
    loadCats()
  }, [])

  // Only apply transparent navbar on pages with dark hero sections
  const isDressesMain = pathname === '/dresses'
  const isAccessoriesMain = pathname === '/accessories'
  const hasHero = isHome || isDressesMain || isAccessoriesMain
  const isTransparent = hasHero && !scrolled && !mobileOpen
  const navBg = isTransparent ? 'bg-transparent' : 'bg-[#FAF9F6] shadow-sm'
  const textColor = isTransparent ? 'text-white' : 'text-charcoal'
  const hoverColor = isTransparent ? 'hover:text-white/70' : 'hover:text-gold'

  const navLinksRight = [
    { label: 'GALLERY', href: '/gallery' },
    { label: 'OUR STORY', href: '/about' },
    { label: 'CONTACT', href: '/contact' }
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <nav className="max-w-[1536px] mx-auto px-6">
          <div className="flex items-center justify-between h-[80px]">
            <div className="hidden lg:flex flex-1 items-center gap-8">
              {/* OUR STORY Link */}
              <Link href="/about" className={`text-[11px] font-sans font-medium tracking-[2.5px] uppercase transition-all duration-300 ${textColor} ${hoverColor}`}>
                OUR STORY
              </Link>

              {/* Dresses Dropdown */}
              <div
                className="relative group h-full flex items-center"
                onMouseEnter={() => setDressDropdownOpen(true)}
                onMouseLeave={() => setDressDropdownOpen(false)}
              >
                <Link href="/dresses" className={`text-[11px] font-sans font-medium tracking-[2.5px] uppercase transition-all duration-300 ${textColor} ${hoverColor} flex items-center gap-2 py-6`}>
                  DRESSES
                  <svg className={`w-3 h-3 transition-transform duration-300 ${dressDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Link>

                <div className={`absolute top-full left-0 mt-0 bg-white shadow-lg flex flex-col min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2 border-t-2 border-gold`}>
                  {dressCategories.map((cat, idx) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setDressDropdownOpen(false)}
                      className="px-6 py-3 text-[11px] font-sans font-medium tracking-[2px] uppercase text-charcoal hover:bg-[#f5f5f5] hover:text-gold transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Accessories Dropdown */}
              <div
                className="relative group h-full flex items-center"
                onMouseEnter={() => setAccDropdownOpen(true)}
                onMouseLeave={() => setAccDropdownOpen(false)}
              >
                <Link href="/accessories" className={`text-[11px] font-sans font-medium tracking-[2.5px] uppercase transition-all duration-300 ${textColor} ${hoverColor} flex items-center gap-2 py-6`}>
                  ACCESSORIES
                  <svg className={`w-3 h-3 transition-transform duration-300 ${accDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Link>

                <div className={`absolute top-full left-0 mt-0 bg-white shadow-lg flex flex-col min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2 border-t-2 border-gold`}>
                  {accCategories.map((cat, idx) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setAccDropdownOpen(false)}
                      className="px-6 py-3 text-[11px] font-sans font-medium tracking-[2px] uppercase text-charcoal hover:bg-[#f5f5f5] hover:text-gold transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/" className="flex-shrink-0 text-center mx-4 group">
              <img src="/image (1).png" alt="My Novia Logo" className="h-32 lg:h-48 object-contain filter drop-shadow-md brightness-75" />
            </Link>

            <div className="hidden lg:flex flex-1 items-center justify-end gap-8">
              {navLinksRight.filter(link => link.label !== 'OUR STORY').map(link => (
                <Link key={link.href} href={link.href} className={`text-[11px] font-sans font-medium tracking-[2.5px] uppercase transition-all duration-300 ${textColor} ${hoverColor}`}>
                  {link.label}
                </Link>
              ))}

              <div className="ml-4 flex-shrink-0">
                <Link href="/book-appointment" className={`whitespace-nowrap px-6 py-2.5 text-[10px] font-sans font-semibold tracking-[2px] uppercase transition-all duration-300 ${isTransparent ? 'bg-white text-charcoal hover:bg-transparent hover:text-white border border-white' : 'bg-charcoal text-white hover:bg-gold'}`}>
                  BOOK AN APPOINTMENT
                </Link>
              </div>
            </div>

            <div className="lg:hidden flex items-center gap-4">
              <Link href="/book-appointment" className={`px-4 py-2 text-[9px] font-sans font-semibold tracking-[1.5px] uppercase transition-all duration-300 ${isTransparent ? 'bg-white text-charcoal' : 'bg-charcoal text-white'}`}>
                BOOK
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={`z-50 ${textColor}`} aria-label="Menu">
                {mobileOpen ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {!hasHero && <div className="h-[80px] bg-[#FAF9F6]" />}

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAF9F6] flex flex-col pt-32 px-8 lg:hidden animate-fade-in text-charcoal overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setDressDropdownOpen(!dressDropdownOpen)}
                className="text-[13px] font-sans font-medium tracking-[3px] uppercase hover:text-gold transition-colors py-2 w-full text-left flex items-center justify-between"
              >
                DRESSES
                <svg className={`w-4 h-4 transition-transform duration-300 ${dressDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {dressDropdownOpen && (
                <div className="flex flex-col gap-3 mt-4 pl-4 border-l-2 border-gold">
                  {dressCategories.map(cat => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => {
                        setMobileOpen(false)
                        setDressDropdownOpen(false)
                      }}
                      className="text-[12px] font-sans font-medium tracking-[2px] uppercase hover:text-gold transition-colors py-1"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-gray-200 pb-6">
              <button
                onClick={() => setAccDropdownOpen(!accDropdownOpen)}
                className="text-[13px] font-sans font-medium tracking-[3px] uppercase hover:text-gold transition-colors py-2 w-full text-left flex items-center justify-between"
              >
                ACCESSORIES
                <svg className={`w-4 h-4 transition-transform duration-300 ${accDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {accDropdownOpen && (
                <div className="flex flex-col gap-3 mt-4 pl-4 border-l-2 border-gold">
                  {accCategories.map(cat => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => {
                        setMobileOpen(false)
                        setAccDropdownOpen(false)
                      }}
                      className="text-[12px] font-sans font-medium tracking-[2px] uppercase hover:text-gold transition-colors py-1"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinksRight.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-[13px] font-sans font-medium tracking-[3px] uppercase hover:text-gold transition-colors py-2 border-b border-gray-200">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-4 pb-12">
            <Link href="/book-appointment" onClick={() => setMobileOpen(false)} className="whitespace-nowrap block bg-charcoal text-white text-[11px] font-sans font-semibold tracking-[2px] uppercase py-4 text-center hover:bg-gold transition-colors">
              BOOK AN APPOINTMENT
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
