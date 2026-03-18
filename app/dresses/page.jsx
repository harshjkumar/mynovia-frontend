'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { fetchDresses, fetchCategories } from '@/lib/api'

export default function DressesPage() {
  const [dresses, setDresses] = useState([])
  const [categories, setCategories] = useState([])
  
  // Default descriptions for categories
  const categoryDescriptions = {
    'bride': 'Find the dress of your dreams. Classic, modern, and romantic designs.',
    'party': 'Elegance and sophistication for unforgettable nights.',
    'godmother': 'Distinguished designs for an essential role. Classic cuts and styling.',
    'cocktail': 'Chic, vibrant, and perfectly tailored for the modern celebration.'
  }
  
  useEffect(() => {
    fetchDresses().then(data => setDresses(data || [])).catch(() => setDresses([]))
    
    fetchCategories().then(data => {
      if (data && Array.isArray(data)) {
        const enrichedCategories = data
          .filter(cat => ['bride', 'party', 'godmother', 'cocktail'].includes(cat.slug))
          .map(cat => ({
            ...cat,
            title: cat.name,
            description: categoryDescriptions[cat.slug] || cat.description || ''
          }))
        setCategories(enrichedCategories)
      }
    }).catch(() => setCategories([]))
  }, [])

  // Use fetched categories, fallback to empty array
  const categoriesData = categories.length > 0 ? categories : []

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="bg-[#FAF9F6] min-h-screen overflow-hidden">
      {/* Cinematic Hero Section */}
      <section ref={heroRef} className="relative w-full h-screen min-h-[700px] overflow-hidden bg-charcoal">
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="/images/dresses_hero.png"
            alt="Wedding Dresses Collection"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/65" />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-black/40" />
          {/* Additional radial overlay for center text area */}
          <div className="absolute inset-0 bg-radial-gradient" style={{
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.4), rgba(0,0,0,0.8))'
          }} />
        </motion.div>

        <motion.div 
          style={{ opacity: opacityText }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 w-full max-w-5xl mx-auto"
        >
          <span className="text-[12px] font-sans tracking-[6px] uppercase block mb-6 text-white font-semibold" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6)' }}>LUXURY COLLECTION</span>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light mb-8 tracking-wide" style={{ textShadow: '0 6px 20px rgba(0,0,0,0.9), 0 3px 10px rgba(0,0,0,0.8)' }}>
            Our <em>Dresses</em>
          </h1>
          <Link href="#collections" className="group mt-8 inline-flex flex-col items-center gap-4 text-[11px] font-sans tracking-[3px] uppercase hover:text-gold transition-colors font-semibold" style={{ textShadow: '0 3px 10px rgba(0,0,0,0.8)' }}>
            <span>Discover</span>
            <span className="w-[1px] h-12 bg-white group-hover:bg-gold transition-colors origin-top block animate-pulse"></span>
          </Link>
        </motion.div>
      </section>

      {/* Category Sections */}
      <div id="collections" className="py-24 bg-[#FAF9F6] relative z-20">
        {categoriesData.map((cat, index) => {
          const catDresses = dresses.filter(d => d.categories?.slug === cat.slug || false)
          const isEven = index % 2 === 0
          
          return (
            <section key={cat.slug} className={`py-20 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto border-b border-[#E5E5E5] last:border-0 ${!isEven ? 'bg-white' : ''}`}>
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch gap-12 lg:gap-24`}>
                
                {/* Category Cover */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-full lg:w-5/12 flex-shrink-0"
                >
                  <div className="sticky top-32">
                    <Link href={`/dresses/${cat.slug}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe8e3] group-hover:shadow-xl transition-shadow duration-700">
                        <img 
                          src={cat.image_url || cat.image || '/images/cat_bride.png'} 
                          alt={cat.title} 
                          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/30">
                          <span className="border border-white px-8 py-3 text-[11px] font-sans tracking-[3px] uppercase">
                            View Category
                          </span>
                        </div>
                      </div>
                    </Link>
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8, delay: 0.3 }}
                       className="mt-8 text-center lg:text-left"
                    >
                      <h2 className="font-heading text-4xl lg:text-5xl text-[#333] mb-4 font-light">{cat.title}</h2>
                      <p className="font-body text-[#7a7a7a] text-sm leading-relaxed max-w-md mx-auto lg:mx-0 pr-6">
                        {cat.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Horizontal Dress Slider */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="w-full lg:w-7/12 overflow-hidden flex flex-col justify-center"
                >
                  {catDresses.length > 0 ? (
                    <motion.div 
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.15 } }
                      }}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-10%" }}
                      className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {catDresses.slice(0, 6).map((dress, i) => {
                        const imgUrl = dress.dress_images?.sort((a,b)=>a.display_order-b.display_order)?.[0]?.image_url || 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&q=80';
                        return (
                          <motion.div 
                            variants={{ hidden: { opacity: 0, x: 50 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                            key={dress.id} 
                            className="w-[85%] md:w-[320px] lg:w-[350px] flex-shrink-0 snap-center group block"
                          >
                            <Link href={`/dresses/${dress.slug}`}>
                              <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe8e3] mb-5 group-hover:shadow-md transition-shadow">
                                <img src={imgUrl} alt={dress.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              </div>
                              <h3 className="font-heading text-2xl text-[#333] group-hover:text-[#f05f42] transition-colors font-light mb-1 truncate">{dress.name}</h3>
                              <p className="font-sans text-[12px] text-[#b3b3b3] uppercase tracking-wider">{cat.title} Dress</p>
                            </Link>
                          </motion.div>
                      )})}
                      {catDresses.length > 6 && (
                        <div className="w-[85%] md:w-[320px] lg:w-[350px] flex-shrink-0 snap-center flex items-center justify-center bg-transparent border border-[#E5E5E5] group">
                          <Link href={`/dresses/${cat.slug}`} className="flex flex-col items-center gap-3 text-[#333] group-hover:text-[#f05f42] transition-colors p-12">
                            <span className="font-heading text-xl font-light">See all {catDresses.length}</span>
                            <span className="text-[10px] font-sans tracking-[2px] uppercase border-b border-currentColor pb-1">View Category</span>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border border-[#E5E5E5] bg-white">
                      <div className="text-center p-8">
                        <p className="font-heading text-2xl text-[#333] mb-2">Coming Soon</p>
                        <p className="font-body text-[#7a7a7a] text-sm">We are currently updating our {cat.title} collection.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
                
              </div>
            </section>
          )
        })}

        {/* All Dresses Section */}
        <section className="py-24 px-6 md:px-12 max-w-[1800px] mx-auto bg-[#FAF9F6] relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-16"
          >
            <h2 className="font-heading text-5xl lg:text-6xl text-[#333] mb-4 font-light text-center">All Our Dresses</h2>
            <p className="font-body text-[#7a7a7a] text-sm leading-relaxed text-center max-w-2xl mx-auto">
              Explore our complete collection of wedding dresses, party wear, and special occasion gowns
            </p>
          </motion.div>

          {dresses.length > 0 ? (
            <motion.div 
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-10%" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {dresses.map((dress) => {
                const imgUrl = dress.dress_images?.sort((a,b)=>a.display_order-b.display_order)?.[0]?.image_url || 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&q=80';
                const categoryName = dress.categories?.name || 'Dress';
                return (
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
                    key={dress.id}
                    className="group"
                  >
                    <Link href={`/dresses/${dress.slug}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe8e3] mb-5 group-hover:shadow-lg transition-shadow duration-500">
                        <img 
                          src={imgUrl} 
                          alt={dress.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
                      </div>
                      <h3 className="font-heading text-lg text-[#333] group-hover:text-[#f05f42] transition-colors font-light mb-2 line-clamp-2">{dress.name}</h3>
                      <p className="font-sans text-[11px] text-[#b3b3b3] uppercase tracking-wider">{categoryName}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-[#E5E5E5] bg-white rounded-lg">
              <div className="text-center">
                <p className="font-heading text-2xl text-[#333] mb-2">No Dresses Found</p>
                <p className="font-body text-[#7a7a7a] text-sm">Check back soon for our newest collection</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
