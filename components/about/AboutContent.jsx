'use client'
import { motion } from 'framer-motion'

export default function AboutContent({ content }) {
  return (
    <div className="bg-[#FAF9F6]">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[50vh] min-h-[400px] overflow-hidden"
      >
        <img
          src={content.hero_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'}
          alt="About Us"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white font-heading text-5xl md:text-6xl tracking-wide"
          >
            {content.hero_title || 'About Us'}
          </motion.h1>
        </div>
      </motion.section>

      {/* Main Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <span className="section-eyebrow block mb-4 uppercase tracking-[2px] text-[10px] text-body-gray">
              {content.eyebrow || 'ABOUT MY NOVIA'}
            </span>
            <h2 className="font-heading text-4xl text-charcoal leading-tight">
              {content.heading || 'Love brought us here. You too.'}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <p className="font-body text-body-gray leading-relaxed text-[15px] whitespace-pre-wrap">
              {content.story || "My Novia was born from the passion to make every bride's dream come true..."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="bg-white/50 py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow block mb-4 uppercase tracking-[2px] text-[10px] text-body-gray">
              {content.vision_title || 'VISION'}
            </span>
            <p className="font-body text-body-gray leading-relaxed">
              {content.vision || 'To be the benchmark boutique in Almería and southern Spain...'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="section-eyebrow block mb-4 uppercase tracking-[2px] text-[10px] text-body-gray">
              {content.mission_title || 'MISSION'}
            </span>
            <p className="font-body text-body-gray leading-relaxed">
              {content.mission || 'To accompany each bride in one of the most important moments of her life...'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {(content.gallery || [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80',
            'https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=500&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80'
          ]).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="aspect-[4/5] overflow-hidden group"
            >
              <img
                src={typeof img === 'string' ? img : img.url}
                alt={`About ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
