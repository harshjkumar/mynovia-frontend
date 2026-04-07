'use client'
import { motion } from 'framer-motion'

export default function WhatsAppButton() {
  const phoneNumber = '+34638263358'
  const message = 'Hola estoy interesado en tus productos'
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d+]/g, '')}?text=${encodeURIComponent(message)}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, x: 100 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-3 bg-[#25D366] rounded-full shadow-2xl hover:shadow-[0_20px_40px_rgba(37,211,102,0.4)] transition-all duration-300"
      title="Chat with us on WhatsApp"
    >
      {/* House/Home Icon */}
      <svg 
        className="w-6 h-6 text-white flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
      
      {/* Text */}
      <span className="text-white font-semibold text-sm tracking-wide">WhatsApp</span>
    </motion.a>
  )
}
