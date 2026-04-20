'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function FeaturedDresses({ data, dresses = [] }) {
  const content = data || {}
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  })

  const yText = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })
  }
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })
  }

  const items = dresses.length > 0 ? dresses : Array(6).fill({ isDummy: true })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <motion.div style={{ opacity, y: yText }} className="text-center mb-12 pb-4 border-b border-gray-100">
          <span className="text-[10px] font-sans tracking-[3px] text-body-gray uppercase mb-3 block">
            {content.eyebrow || 'MY NOVIA BRIDAL'}
          </span>
          <h2 className="font-heading text-4xl font-light text-charcoal mb-3">
            {content.heading || 'Effortlessly Elegant'}
          </h2>
          <p className="font-body text-body-gray text-sm leading-relaxed max-w-lg mx-auto mb-4">
            {content.subtext || 'Discover the artistry of your perfect wedding dress from one of the most beloved bridal collections.'}
          </p>
          <Link href="/dresses" className="text-[11px] font-sans font-medium tracking-[2px] uppercase text-charcoal hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-1 inline-block">
            VIEW ALL
          </Link>
        </motion.div>

        <div className="relative group/nav">
          <button onClick={scrollLeft} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-charcoal shadow-md opacity-0 group-hover/nav:opacity-100 transition-opacity" aria-label="Previous">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <button onClick={scrollRight} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-charcoal shadow-md opacity-0 group-hover/nav:opacity-100 transition-opacity" aria-label="Next">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <motion.div 
            ref={scrollRef} 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          >
            {items.map((dress, i) => (
              <motion.div 
                variants={cardVariants}
                key={dress.id || i} 
                className="w-[85vw] md:w-[calc(33.333%-10px)] lg:w-[calc(25%-12px)] flex-shrink-0 snap-start relative group/card"
              >
                <Link href={dress.isDummy ? '#' : `/dresses/${dress.slug}`}>
                  <div className="aspect-[3/4] overflow-hidden bg-cream relative shadow-sm">
                    {!dress.isDummy ? (
                      <img src={dress.dress_images?.[0]?.image_url || ''} alt={dress.name} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/card:scale-110" />
                    ) : (
                      <div className="w-full h-full animate-pulse bg-gray-200" />
                    )}
                    {!dress.isDummy && (
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    )}
                    {!dress.isDummy && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[180px] opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-y-4 group-hover/card:translate-y-0">
                        <span className="whitespace-nowrap block w-full bg-white/95 px-4 py-3 text-[10px] font-sans font-medium tracking-[2px] uppercase text-center text-charcoal shadow-sm">
                          VIEW DETAILS
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                {!dress.isDummy && (
                  <div className="mt-4 text-center">
                    <p className="font-sans text-sm tracking-widest text-charcoal uppercase">{dress.name}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
