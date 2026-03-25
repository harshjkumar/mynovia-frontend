'use client'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ReviewsSection({ data, reviews = [] }) {
  const content = data || {}
  
  const displayReviews = reviews.length > 0 ? reviews : [
    { id: 1, author_name: 'Maria Garcia', rating: 5, review_text: 'A wonderful experience. I found the dress of my dreams on the first visit. The team is incredibly friendly and professional.' },
    { id: 2, author_name: 'Ana Lopez', rating: 5, review_text: 'My Novia has the best selection of dresses. I felt like a princess trying on every dress.' },
    { id: 3, author_name: 'Carmen Ruiz', rating: 5, review_text: 'Thank you My Novia for making my wedding magical. The dress was perfect and the service exceptional.' },
    { id: 4, author_name: 'Laura Sanchez', rating: 5, review_text: 'Beautiful boutique! The staff made me feel so special and they had exactly what I was looking for.' }
  ]

  const carouselRef = useRef(null)
  const autoScrollInterval = useRef(null)
  
  const startAutoScroll = () => {
    stopAutoScroll()
    autoScrollInterval.current = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        // Smoothly scroll to the start if we reach the end
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
           carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
           const scrollAmount = clientWidth >= 768 ? clientWidth / 3 : clientWidth
           carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
      }
    }, 4500) // 4.5 seconds for a nice slow auto-scroll
  }
  
  const stopAutoScroll = () => {
    if (autoScrollInterval.current) clearInterval(autoScrollInterval.current)
  }

  useEffect(() => {
    startAutoScroll()
    return () => stopAutoScroll()
  }, [])

  const scrollLeftBtn = () => {
    if (carouselRef.current) {
      const clientWidth = carouselRef.current.clientWidth
      const scrollAmount = clientWidth >= 768 ? clientWidth / 3 : clientWidth
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      startAutoScroll()
    }
  }

  const scrollRightBtn = () => {
    if (carouselRef.current) {
      const clientWidth = carouselRef.current.clientWidth
      const scrollAmount = clientWidth >= 768 ? clientWidth / 3 : clientWidth
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      startAutoScroll()
    }
  }

  return (
    <section className="py-24 px-6 bg-blush overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
           className="text-center mb-12 flex flex-col items-center"
        >
          <span className="text-[10px] font-sans tracking-[3px] text-body-gray uppercase mb-3 block">
            {content.eyebrow || 'TESTIMONIALS'}
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-8">
            {content.heading || <>What our <em>brides</em> say</>}
          </h2>
          
          <div className="flex gap-4">
            <button onClick={scrollLeftBtn} className="w-10 h-10 border border-bar-tan flex items-center justify-center text-charcoal hover:bg-gold hover:text-white hover:border-gold transition-colors rounded-full transition-all duration-300">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={scrollRightBtn} className="w-10 h-10 border border-bar-tan flex items-center justify-center text-charcoal hover:bg-gold hover:text-white hover:border-gold transition-colors rounded-full transition-all duration-300">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar"
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
            onTouchStart={stopAutoScroll}
            onTouchEnd={startAutoScroll}
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {displayReviews.map((review) => (
              <div 
                key={review.id} 
                className="snap-start shrink-0 w-full md:w-[calc(33.333%-16px)] bg-white p-10 text-center shadow-sm hover:-translate-y-2 transition-transform duration-500 flex flex-col items-center justify-between"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#C9A96E">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="font-body text-sm text-body-gray leading-loose mb-8 italic">
                    &ldquo;{review.review_text}&rdquo;
                  </p>
                </div>
                <p className="font-sans text-[11px] font-semibold tracking-widest text-charcoal uppercase mt-auto">
                  {review.author_name}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  )
}
