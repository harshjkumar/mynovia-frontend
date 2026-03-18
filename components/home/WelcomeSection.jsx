'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function WelcomeSection({ data, dresses = [], accessories = [] }) {
  const content = data || {}

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  })

  // Cool parallax effects for images coming in
  const yLeft = useTransform(scrollYProgress, [0, 1], [150, 0])
  const yRight = useTransform(scrollYProgress, [0, 1], [200, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])

  const dressImages = dresses.map(d => d.dress_images?.[0]?.image_url).filter(Boolean)
  const accessoryImages = accessories.map(a => a.accessory_images?.[0]?.image_url).filter(Boolean)

  const defaultLeft = [content.left_image || 'https://ik.imagekit.io/mynovia/elegant_wedding_dress_wnXwJZdx-.png']
  const defaultRight = [content.right_image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80']

  const slidesLeft = dressImages.length > 0 ? dressImages : defaultLeft
  const slidesRight = accessoryImages.length > 0 ? accessoryImages : defaultRight

  const [leftIndex, setLeftIndex] = useState(0)
  const [rightIndex, setRightIndex] = useState(0)

  useEffect(() => {
    const leftTimer = setInterval(() => setLeftIndex(p => (p + 1) % slidesLeft.length), 5000)
    const rightTimer = setInterval(() => setRightIndex(p => (p + 1) % slidesRight.length), 5000)
    return () => { clearInterval(leftTimer); clearInterval(rightTimer); }
  }, [slidesLeft.length, slidesRight.length])

  const nextLeft = () => setLeftIndex(p => (p + 1) % slidesLeft.length)
  const prevLeft = () => setLeftIndex(p => (p - 1 + slidesLeft.length) % slidesLeft.length)

  const nextRight = () => setRightIndex(p => (p + 1) % slidesRight.length)
  const prevRight = () => setRightIndex(p => (p - 1 + slidesRight.length) % slidesRight.length)

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-blush border-t border-white shadow-inner overflow-hidden">
      <motion.div style={{ opacity }} className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] sm:text-[11px] font-sans tracking-[3px] text-body-gray uppercase mb-4"
        >
          {content.eyebrow || 'THE MY NOVIA FAMILY OF BRANDS'}
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-4xl lg:text-[52px] leading-tight text-charcoal mb-12 md:mb-20 font-light max-w-3xl"
        >
          {content.heading_start || 'Timeless, romantic, and memorable'}
        </motion.h2>
        
        {/* Desktop & Mobile Layout Collection */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-10">
          
          {/* Left Slide (Dresses) */}
          <motion.div style={{ y: yLeft }} className="w-full md:w-[30%] lg:w-[35%] aspect-[3/4] overflow-hidden relative group rounded-sm shadow-md">
            {slidesLeft.map((img, i) => (
              <img 
                key={i}
                src={img} 
                alt="Bridal Dress Left" 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === leftIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-2">
              <button onClick={prevLeft} className="w-8 h-8 rounded-full bg-white/80 flex justify-center items-center text-charcoal hover:bg-white">→</button>
              <button onClick={nextLeft} className="w-8 h-8 rounded-full bg-white/80 flex justify-center items-center text-charcoal hover:bg-white">→</button>
            </div>
          </motion.div>

          {/* Center Book Appointment Box */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="w-full md:w-[40%] lg:w-[30%] bg-white p-10 md:p-8 lg:p-12 shadow-md rounded-sm border border-pink-100 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto md:h-full min-h-[400px] z-10"
          >
            <span className="text-3xl mb-6">💍</span>
            <h3 className="font-heading text-2xl lg:text-3xl text-charcoal mb-4">
              {content.cta_heading || 'Find Your Dream Dress'}
            </h3>
            <p className="font-sans text-sm text-body-gray mb-8 leading-relaxed">
              {content.cta_text || 'Book a private fitting session with our bridal experts. We ensure a personalized experience to find the dress that tells your unique story.'}
            </p>
            <Link 
              href={content.cta_btn_link || '/agenda-tu-cita'} 
              className="px-8 py-4 bg-charcoal text-white text-[10px] font-sans font-semibold tracking-[2px] uppercase hover:bg-gold transition-colors w-full sm:w-auto"
            >
              {content.cta_btn_text || 'Book an Appointment'}
            </Link>
          </motion.div>

          {/* Right Slide (Accessories) */}
          <motion.div style={{ y: yRight }} className="w-full md:w-[30%] lg:w-[35%] aspect-[3/4] overflow-hidden relative group rounded-sm shadow-md">
            {slidesRight.map((img, i) => (
              <img 
                key={i}
                src={img} 
                alt="Bridal Accessory Right" 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === rightIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-2">
              <button onClick={prevRight} className="w-8 h-8 rounded-full bg-white/80 flex justify-center items-center text-charcoal hover:bg-white">→</button>
              <button onClick={nextRight} className="w-8 h-8 rounded-full bg-white/80 flex justify-center items-center text-charcoal hover:bg-white">→</button>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}
