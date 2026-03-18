'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { fetchMedia } from '@/lib/api'
import { ikGallery } from '@/lib/imagekit'
import Lightbox from '@/components/ui/Lightbox'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState(-1)
  const sectionRef = useRef(null)

  useEffect(() => {
    fetchMedia('gallery')
      .then(data => setImages(data))
      .catch(() => {
        setImages([
          { id: 1, image_url: 'https://ik.imagekit.io/mynovia/gallery/img1.jpg' },
          { id: 2, image_url: 'https://ik.imagekit.io/mynovia/gallery/img2.jpg' },
          { id: 3, image_url: 'https://ik.imagekit.io/mynovia/gallery/img3.jpg' },
          { id: 4, image_url: 'https://ik.imagekit.io/mynovia/gallery/img4.jpg' },
          { id: 5, image_url: 'https://ik.imagekit.io/mynovia/gallery/img5.jpg' },
          { id: 6, image_url: 'https://ik.imagekit.io/mynovia/gallery/img6.jpg' },
          { id: 7, image_url: 'https://ik.imagekit.io/mynovia/gallery/img7.jpg' },
          { id: 8, image_url: 'https://ik.imagekit.io/mynovia/gallery/img8.jpg' }
        ])
      })
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
        staggerChildren: 0.08
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

  const imgUrls = images.map(i => ikGallery(i.image_url))

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
          >Gallery</motion.span>
        </motion.div>
        <motion.h1
          style={{ y }}
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="font-heading text-4xl md:text-5xl lg:text-[56px] text-[#333333] font-light tracking-wide"
        >
          Our <em className="italic text-gold">Gallery</em>
        </motion.h1>
        <motion.p
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="font-body text-[#7a7a7a] text-sm leading-relaxed mt-4 max-w-2xl mx-auto"
        >
          Explore our collection of beautiful moments and elegant designs
        </motion.p>
      </motion.div>

      {/* Gallery Grid */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12">
        {loading ? (
          <div className="flex justify-center items-center h-64"><Spinner /></div>
        ) : images.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {images.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                variants={cardVariants}
                className="group cursor-pointer"
                onClick={() => setLightboxIdx(idx)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-cream relative shadow-sm">
                  <motion.img
                    src={ikGallery(img.image_url)}
                    alt={img.file_name || `Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    loading="lazy"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-charcoal/10 pointer-events-none"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2"
                  >
                    <span className="bg-white/95 px-4 py-2 text-[9px] font-sans font-medium tracking-[2px] uppercase text-charcoal shadow-sm">
                      VIEW
                    </span>
                  </motion.div>
                </div>
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
            <h3 className="font-heading text-2xl text-charcoal mb-4">No images found</h3>
            <p className="font-body text-[#7A7A7A]">We're currently updating our gallery. Please check back later.</p>
          </motion.div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx >= 0 && (
          <Lightbox
            images={imgUrls}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(-1)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}