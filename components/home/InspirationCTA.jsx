'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function InspirationCTA({ data }) {
  const content = data || {}
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Parallax background image
  const yBg = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  
  // Staggered text reveal setup
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-blush overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row shadow-sm bg-white">
        <div className="w-full md:w-1/2 relative aspect-[4/5] md:aspect-auto md:min-h-[600px] overflow-hidden">
          <motion.img
            style={{ y: yBg }}
            src={content.bg_image || 'https://images.unsplash.com/photo-1533005834887-3c97db37d800?w=1200&q=80'}
            alt="Bridal Inspiration"
            className="absolute inset-0 w-full h-[130%] object-cover"
          />
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.2 }}
          className="w-full md:w-1/2 bg-white p-12 md:p-20 flex flex-col justify-center items-center text-center z-10"
        >
          <motion.span variants={textVariants} className="text-[10px] font-sans tracking-[3px] text-body-gray uppercase block mb-6">
            {content.eyebrow || 'WILDERLY BRIDE'}
          </motion.span>
          <motion.h2 variants={textVariants} className="font-heading text-4xl lg:text-5xl font-light mb-8 text-charcoal">
            {content.heading || 'Sirens of the Sea'}
          </motion.h2>
          <motion.p variants={textVariants} className="font-body text-body-gray mb-10 text-sm leading-loose max-w-sm mx-auto">
            {content.subtext || 'Introducing our latest Spring Collection: an ethereal tribute to untamed beauty. Capturing the quiet power of a woman in her element—adrift in magic and motion.'}
          </motion.p>
          <motion.div variants={textVariants}>
            <Link href="/dresses" className="inline-block border-b border-charcoal pb-1 text-[11px] font-sans font-medium tracking-[2px] uppercase text-charcoal hover:text-gold hover:border-gold transition-colors">
              VIEW COLLECTION
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
