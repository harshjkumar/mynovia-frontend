'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AccessoryCard({ accessory }) {
  const imgUrl = accessory.accessory_images?.sort((a, b) => a.display_order - b.display_order)?.[0]?.image_url
    || 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&q=80'

  return (
    <Link href={`/accessories/${accessory.slug}`}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="aspect-square overflow-hidden bg-cream mb-4 relative">
          <motion.img
            src={imgUrl}
            alt={accessory.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-charcoal/10 pointer-events-none"
          />
        </div>
        <h3 className="font-heading text-lg text-charcoal group-hover:text-gold transition-colors duration-300">
          {accessory.name}
        </h3>
        {accessory.categories && (
          <motion.p
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
            className="text-xs text-body-gray font-sans mt-1 tracking-wide uppercase"
          >
            {accessory.categories.name}
          </motion.p>
        )}
        {accessory.description && (
          <p className="text-sm text-body-gray font-body mt-2 line-clamp-2">
            {accessory.description}
          </p>
        )}
      </motion.div>
    </Link>
  )
}
