'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function FeaturedAccessories({ data, accessories = [] }) {
  const content = data || {}
  const scrollRef = useRef(null)
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  })

  // Cool parallax effects for text & block coming in
  const yText = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })

  const items = accessories.length > 0 ? accessories : Array(4).fill({ isDummy: true })

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
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-white border-t border-gray-100/50 overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Text and context left block */}
        <motion.div style={{ opacity, y: yText }} className="w-full lg:w-1/3 flex flex-col shrink-0">
          <span className="text-[10px] font-sans tracking-[3px] text-body-gray uppercase mb-4">
            {content.eyebrow || 'MY NOVIA ACCESSORIES'}
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl text-charcoal mb-6 font-light italic">
            {content.heading || 'Refined & Memorable'}
          </h2>
          <p className="font-body text-body-gray mb-12 text-sm leading-relaxed max-w-sm">
            {content.subtext || 'For the bride who wishes to shine with her own light. With sculpted details, intricate lace, and dazzling pieces designed to complement your look from the first to the last dance.'}
          </p>
          
          <div className="flex items-center gap-6 mb-12">
            <button onClick={scrollLeft} className="text-[10px] font-sans font-medium tracking-[2px] text-charcoal/50 hover:text-charcoal transition-colors uppercase flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M15 18l-6-6 6-6"/></svg>
              PREV
            </button>
            <button onClick={scrollRight} className="text-[10px] font-sans font-medium tracking-[2px] text-charcoal/50 hover:text-charcoal transition-colors uppercase flex items-center gap-2">
              NEXT
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          <div className="relative aspect-[3/4] overflow-hidden w-full max-w-[350px] group/cta shadow-sm">
            <img src={content.banner_image || "https://images.unsplash.com/photo-1549416878-b9ca95e28ce4?w=800&q=80"} alt="Accessories detail" className="w-full h-full object-cover transition-transform duration-1000 group-hover/cta:scale-105" />
            <div className="absolute bottom-6 left-6">
              <Link href="/accessories" className="bg-white/80 hover:bg-white text-[10px] font-sans tracking-[2px] font-medium uppercase px-5 py-3 transition-colors shadow-sm">
                SHOP ACCESSORIES
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Carousel block */}
        <motion.div 
          ref={scrollRef} 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:w-2/3 flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6 lg:mx-0 lg:px-0"
        >
          {items.map((acc, i) => (
            <motion.div 
              variants={cardVariants}
              key={acc.id || i} 
              className="w-[85vw] md:w-[calc(50%-8px)] lg:w-[calc(50%-8px)] flex-shrink-0 snap-start relative group"
            >
              <Link href={acc.isDummy ? '#' : `/accessories`}>
                <div className="aspect-[3/4] overflow-hidden bg-cream relative shadow-sm">
                  {!acc.isDummy ? (
                    <img src={acc.accessory_images?.[0]?.image_url || ''} alt={acc.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full animate-pulse bg-gray-200" />
                  )}
                  {!acc.isDummy && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-sans text-xs tracking-widest text-white uppercase">{acc.name}</p>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
