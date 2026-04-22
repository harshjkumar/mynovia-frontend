'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchCategories, fetchSections } from '@/lib/api'

const footerLinks = [
  { label: 'Dresses', href: '/dresses' },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Appointment', href: '/book-appointment' }
]

export default function Footer() {
  const [collections, setCollections] = useState([])

  useEffect(() => {
    Promise.all([
      fetchCategories().catch(() => []),
      fetchSections().catch(() => [])
    ]).then(([catsData, sectionsData]) => {
      const orderSection = sectionsData?.find(s => s.section_name === 'categories_order')
      const orderMap = orderSection?.content || { dress: [], accessory: [] }

      if (catsData && Array.isArray(catsData)) {
        const sortedCats = [...catsData].sort((a, b) => {
          const arrA = a.type === 'accessory' ? orderMap.accessory : orderMap.dress
          const arrB = b.type === 'accessory' ? orderMap.accessory : orderMap.dress
          const idxA = arrA?.indexOf(a.slug) ?? -1
          const idxB = arrB?.indexOf(b.slug) ?? -1
          
          if (a.type !== b.type) return a.type === 'dress' ? -1 : 1
          
          if (idxA === -1 && idxB === -1) return 0
          if (idxA === -1) return 1
          if (idxB === -1) return -1
          return idxA - idxB
        })
        // Only keep dress categories as requested by user
        setCollections(sortedCats.filter(cat => cat.type !== 'accessory'))
      }
    })
  }, [])

  return (
    <footer className="bg-[#FAF9F6] border-t border-gray-200 text-charcoal">
      <div className="max-w-[1536px] mx-auto px-6 py-20 pb-10">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-charcoal/80 mb-6">
              Our Collections
            </h4>
            <ul className="space-y-4">
              {collections.map(cat => (
                <li key={cat.id || cat.slug}>
                  <Link href={`/${cat.type === 'accessory' ? 'accessories' : 'dresses'}/${cat.slug}`} className="text-[13px] text-body-gray hover:text-charcoal transition-colors font-body">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-charcoal/80 mb-6">
              Information
            </h4>
            <ul className="space-y-4">
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-body-gray hover:text-charcoal transition-colors font-body">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-charcoal/80 mb-6">
              Contact
            </h4>
            <div className="space-y-4 text-[13px] text-body-gray font-body">
              <p>📍 Almería, Spain</p>
              <p>📞 <a href="tel:+34950450518" className="hover:text-charcoal transition-colors">+34 950 450 518</a></p>
              <p>✉️ <a href="mailto:info@mynovia.es" className="hover:text-charcoal transition-colors">info@mynovia.es</a></p>
            </div>
          </div>

          <div>
             <h4 className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-charcoal/80 mb-6">
              Social Connection
            </h4>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=100083262854501" target="_blank" rel="noopener noreferrer" className="text-body-gray hover:text-charcoal transition-colors" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/mynovia_es/" target="_blank" rel="noopener noreferrer" className="text-body-gray hover:text-charcoal transition-colors" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/channel/UCr4BMtjpw_V9tXmJqOate6A" target="_blank" rel="noopener noreferrer" className="text-body-gray hover:text-charcoal transition-colors" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@mynovia_es" target="_blank" rel="noopener noreferrer" className="text-body-gray hover:text-charcoal transition-colors" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-20 pt-8 border-t border-gray-200">
           <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <Link href="/privacy" className="text-[10px] text-body-gray hover:text-charcoal font-sans uppercase">Privacy Policy</Link>
               <span className="text-body-gray hidden md:inline">|</span>
               <Link href="/terms" className="text-[10px] text-body-gray hover:text-charcoal font-sans uppercase">Terms of Service</Link>
               <span className="text-body-gray hidden md:inline">|</span>
               <Link href="/cookies" className="text-[10px] text-body-gray hover:text-charcoal font-sans uppercase">Cookies Policy</Link>
           </div>
          <p className="text-[10px] text-body-gray font-sans mt-4 md:mt-0 uppercase">
            © {new Date().getFullYear()} My Novia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
