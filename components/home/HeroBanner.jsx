'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

export default function HeroBanner({ data }) {
  const slides = data?.slides || [
    {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
      heading: 'Unique wedding dresses for every story',
      subtext: 'Discover our exclusive collection, created for your most special moment',
      cta_text: 'VIEW COLLECTIONS',
      cta_link: '/dresses'
    }
  ]

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const goNext = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [paused, goNext])

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-charcoal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
           key={current}
           className="absolute inset-0 z-0"
           initial={{ opacity: 0, scale: 1.05 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.5, ease: "easeInOut" }}
           style={{ y }}
        >
          <img
            src={slides[current].image}
            alt={slides[current].heading}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex items-end justify-center pb-32 px-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
            className="text-center text-white max-w-3xl"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-heading text-5xl md:text-6xl lg:text-[72px] font-light leading-tight mb-6 tracking-wide drop-shadow-lg"
            >
              {slides[current]?.heading}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-body text-base md:text-lg text-white/90 mb-10 max-w-xl mx-auto font-light tracking-wide"
            >
              {slides[current]?.subtext}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href={slides[current]?.cta_link || '/dresses'} className="bg-white/95 text-charcoal px-8 py-4 text-[11px] font-sans font-semibold tracking-[3px] uppercase hover:bg-gold hover:text-white transition-all duration-300 shadow-xl inline-block">
                {slides[current]?.cta_text || 'VIEW COLLECTIONS'}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all duration-500 rounded-full ${i === current ? 'bg-white w-12' : 'bg-white/30 hover:bg-white/60 w-6'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </motion.section>
  )
}
