'use client'
import { useState, useEffect } from 'react'
import { fetchSections } from '@/lib/api'

export default function CookiesPage() {
  const [content, setContent] = useState('')

  useEffect(() => {
    fetchSections().then(data => {
      const section = data.find(s => s.section_name === 'cookies')
      if (section && section.content?.content) {
        setContent(section.content.content)
      }
    }).catch(() => {})
  }, [])

  return (
    <div className="bg-ivory min-h-screen pt-40 pb-32">
      <div className="max-w-[1536px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <h1 className="font-heading text-5xl md:text-7xl text-charcoal font-light tracking-tight mb-6">
            Cookies Policy
          </h1>
          <div className="w-24 h-[1px] bg-gold"></div>
        </div>
        
        {/* Split Layout */}
        <div className="max-w-4xl mx-auto">
          {content ? (
            <div 
              dangerouslySetInnerHTML={{ __html: content }} 
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-light prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-p:font-body prose-p:text-body-gray prose-p:leading-relaxed prose-a:text-gold hover:prose-a:text-gold-dark prose-li:font-body prose-li:text-body-gray prose-strong:text-charcoal prose-strong:font-semibold"
            />
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
