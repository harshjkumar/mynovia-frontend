'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function ReviewsSection({ reviews = [] }) {
  const sectionRef = useRef(null)

  const displayReviews = reviews.length > 0 ? reviews : [
    { id: 1, author_name: 'Maria Garcia', rating: 5, review_text: 'A wonderful experience. I found the dress of my dreams on the first visit. The team is incredibly friendly and professional.' },
    { id: 2, author_name: 'Ana Lopez', rating: 5, review_text: 'My Novia has the best selection of dresses. I felt like a princess trying on every dress.' },
    { id: 3, author_name: 'Carmen Ruiz', rating: 5, review_text: 'Thank you My Novia for making my wedding magical. The dress was perfect and the service exceptional.' }
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
  }

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-blush overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
           className="text-center mb-16"
        >
          <span className="text-[10px] font-sans tracking-[3px] text-body-gray uppercase mb-3 block">TESTIMONIALS</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal">What our <em>brides</em> say</h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {displayReviews.slice(0, 3).map((review) => (
            <motion.div 
              variants={itemVariants}
              key={review.id} 
              className="bg-white p-10 text-center shadow-sm hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: review.rating || 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A96E">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="font-body text-sm text-body-gray leading-loose mb-8 italic">
                &ldquo;{review.review_text}&rdquo;
              </p>
              <p className="font-sans text-[11px] font-semibold tracking-widest text-charcoal uppercase">
                {review.author_name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
