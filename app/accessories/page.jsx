'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fetchAccessories } from '@/lib/api'
import AccessoryCard from '@/components/catalog/AccessoryCard'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)

  useEffect(() => {
    fetchAccessories()
      .then(data => setAccessories(data))
      .catch(() => setAccessories([]))
      .finally(() => setLoading(false))
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [60, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const filterBarVariants = {
    hidden: { opacity: 0, scaleX: 0.8 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    }
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-24">
      {/* Header and Breadcrumbs */}
      <motion.div
        ref={sectionRef}
        style={{ opacity }}
        className="max-w-[1600px] mx-auto px-6 md:px-12 text-center mb-12"
      >
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center text-[11px] font-sans tracking-[1px] text-[#7A7A7A] mb-4"
        >
          <Link href="/" className="hover:text-charcoal transition-colors underline decoration-transparent hover:decoration-currentColor underline-offset-4">Home</Link>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-2"
          >/</motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#a09e9e]"
          >Accessories</motion.span>
        </motion.div>
        <motion.h1
          style={{ y }}
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="font-heading text-4xl md:text-5xl lg:text-[56px] text-[#333333] font-light tracking-wide"
        >
          Exclusive Accessories
        </motion.h1>
        <motion.p
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="font-body text-[#7a7a7a] text-sm leading-relaxed mt-4 max-w-2xl mx-auto"
        >
          Complete your bridal look with our carefully curated collection of luxury accessories
        </motion.p>
      </motion.div>

      {/* Filter and Sort Bar */}
      <motion.div
        variants={filterBarVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-[1600px] mx-auto px-6 md:px-12 mb-12"
      >
        <div className="flex items-center justify-between border-t border-b border-[#E5E5E5] py-4 text-xs font-sans tracking-wide text-[#555555]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center hover:text-charcoal transition-colors uppercase"
          >
            <span>Filter</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block text-[#999999]"
          >
            {accessories.length} products
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center hover:text-charcoal transition-colors"
          >
            <span>Sort by: <span className="text-charcoal">Best selling</span></span>
            <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Collection Grid */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12">
        {loading ? (
          <div className="flex justify-center items-center h-64"><Spinner /></div>
        ) : accessories.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {accessories.map((accessory, index) => (
              <motion.div
                key={accessory.id}
                variants={cardVariants}
                className="group"
              >
                <AccessoryCard accessory={accessory} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24 bg-white shadow-sm border border-[#E5E5E5]"
          >
            <h3 className="font-heading text-2xl text-charcoal mb-4">No accessories found</h3>
            <p className="font-body text-[#7A7A7A]">We're currently updating our accessories collection. Please check back later.</p>
          </motion.div>
        )}
      </section>
    </div>
  )
}