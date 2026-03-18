'use client'
import { useState, useEffect } from 'react'
import { fetchPageContent, fetchSections, adminUpdateContent, adminUpdateSection, adminUploadMedia } from '@/lib/api'

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [sections, setSections] = useState({})
  const [pages, setPages] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetchSections().then(data => {
      const map = {}
      data.forEach(s => { 
        map[s.section_name] = s.content || {} 
      })
      setSections(prev => ({ ...prev, ...map }))
      console.log('Fetched sections:', map)
    }).catch(err => {
      console.error('Error fetching sections:', err)
    })

    // Also fetch legacy pages if needed, but the objective is moving to sections
    ;['home', 'about', 'contact'].forEach(slug => {
      fetchPageContent(slug).then(data => {
        setPages(prev => ({ ...prev, [slug]: data.content || {} }))
      }).catch(() => {})
    })
  }, [])

  async function saveSection(name) {
    setSaving(true)
    try {
      await adminUpdateSection(name, sections[name] || {})
      setMsg('Saved!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setMsg('Error saving')
    }
    setSaving(false)
  }

  async function savePage(slug) {
    setSaving(true)
    try {
      await adminUpdateContent(slug, { content: pages[slug] || {} })
      setMsg('Saved!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setMsg('Error saving')
    }
    setSaving(false)
  }

  function updateSection(name, key, value) {
    setSections(prev => ({
      ...prev,
      [name]: { ...(prev[name] || {}), [key]: value }
    }))
  }

  function updatePage(slug, key, value) {
    setPages(prev => ({
      ...prev,
      [slug]: { ...(prev[slug] || {}), [key]: value }
    }))
  }

  // Hero slides management
  const heroSlides = sections.hero?.slides || []

  function updateHeroSlides(slides) {
    setSections(prev => ({
      ...prev,
      hero: { ...(prev.hero || {}), slides }
    }))
  }

  async function handleHeroImageUpload(file, index) {
    try {
      const result = await adminUploadMedia(file, 'hero')
      const newSlides = [...heroSlides]
      newSlides[index] = { ...newSlides[index], image: result.url }
      updateHeroSlides(newSlides)
      setMsg('Image uploaded!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setMsg('Error uploading image')
    }
  }

  function addHeroSlide() {
    const newSlide = {
      image: '',
      heading: '',
      subtext: '',
      cta_text: 'VIEW COLLECTIONS',
      cta_link: '/dresses'
    }
    updateHeroSlides([...heroSlides, newSlide])
  }

  function removeHeroSlide(index) {
    const newSlides = heroSlides.filter((_, i) => i !== index)
    updateHeroSlides(newSlides)
  }

  function updateHeroSlide(index, field, value) {
    const newSlides = [...heroSlides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    updateHeroSlides(newSlides)
  }

  const tabs = [
    { id: 'home', label: 'Homepage' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading text-charcoal">Content Editor</h1>
        {msg && <span className="text-sm font-sans text-green-600">{msg}</span>}
      </div>

      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-sans transition-colors border-b-2 -mb-px ${
              activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-body-gray hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'home' && (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-sm font-semibold text-charcoal">Hero Banner</h3>
              <button
                onClick={addHeroSlide}
                className="px-3 py-1.5 text-xs font-sans bg-charcoal text-white hover:bg-gold transition-colors"
              >
                + Add Slide
              </button>
            </div>

            {heroSlides.length === 0 && (
              <p className="text-sm text-body-gray mb-4">No slides configured. Add your first slide.</p>
            )}

            <div className="space-y-6">
              {heroSlides.map((slide, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-sans font-semibold text-charcoal">Slide {index + 1}</span>
                    <button
                      onClick={() => removeHeroSlide(index)}
                      className="text-xs text-red-500 hover:text-red-700 font-sans"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label className="block text-xs font-sans text-body-gray mb-2">Hero Image</label>
                    {slide.image ? (
                      <div className="relative">
                        <img
                          src={slide.image}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-48 object-cover rounded"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <label className="cursor-pointer bg-white/90 px-2 py-1 text-xs font-sans rounded hover:bg-white">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleHeroImageUpload(file, index)
                              }}
                            />
                          </label>
                          <button
                            onClick={() => updateHeroSlide(index, 'image', '')}
                            className="bg-red-500/90 px-2 py-1 text-xs font-sans text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="block border-2 border-dashed border-gray-300 hover:border-gold rounded-lg p-8 text-center cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleHeroImageUpload(file, index)
                          }}
                        />
                        <div className="text-2xl mb-2">📸</div>
                        <p className="text-sm font-sans text-body-gray">Upload hero image</p>
                      </label>
                    )}
                  </div>

                  {/* Text Fields */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Heading"
                      value={slide.heading || ''}
                      onChange={(e) => updateHeroSlide(index, 'heading', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
                    />
                    <textarea
                      placeholder="Subtext"
                      rows={2}
                      value={slide.subtext || ''}
                      onChange={(e) => updateHeroSlide(index, 'subtext', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y"
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Button text"
                        value={slide.cta_text || ''}
                        onChange={(e) => updateHeroSlide(index, 'cta_text', e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
                      />
                      <input
                        type="text"
                        placeholder="Button link (e.g., /dresses)"
                        value={slide.cta_link || ''}
                        onChange={(e) => updateHeroSlide(index, 'cta_link', e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => saveSection('hero')}
              disabled={saving}
              className="btn-gold text-[10px] mt-4"
            >
              {saving ? 'SAVING...' : 'SAVE HERO'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Announcement Bar</h3>
            <input type="text" placeholder="Announcement text"
              value={sections.announcement_bar?.text || ''}
              onChange={e => updateSection('announcement_bar', 'text', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
            <input type="text" placeholder="Link text"
              value={sections.announcement_bar?.link_text || ''}
              onChange={e => updateSection('announcement_bar', 'link_text', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
            <button onClick={() => saveSection('announcement_bar')} disabled={saving} className="btn-gold text-[10px] mt-4">SAVE</button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Welcome Section</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-sans text-body-gray mb-2">Fallback Left Image (Dresses)</label>
                  {sections.welcome?.left_image ? (
                    <div className="relative">
                      <img src={sections.welcome.left_image} className="w-full h-32 object-cover rounded" />
                      <label className="absolute top-1 right-1 cursor-pointer bg-white/90 px-2 py-1 text-[10px] font-sans rounded hover:bg-white text-charcoal">
                        Change
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const result = await adminUploadMedia(file, 'home')
                            updateSection('welcome', 'left_image', result.url)
                          }
                        }} />
                      </label>
                    </div>
                  ) : (
                    <label className="block border border-dashed border-gray-300 p-4 text-center cursor-pointer text-xs">
                      Upload Left Image
                      <input type="file" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const result = await adminUploadMedia(file, 'home')
                          updateSection('welcome', 'left_image', result.url)
                        }
                      }} />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-sans text-body-gray mb-2">Fallback Right Image (Accessories)</label>
                  {sections.welcome?.right_image ? (
                    <div className="relative">
                      <img src={sections.welcome.right_image} className="w-full h-32 object-cover rounded" />
                      <label className="absolute top-1 right-1 cursor-pointer bg-white/90 px-2 py-1 text-[10px] font-sans rounded hover:bg-white text-charcoal">
                        Change
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const result = await adminUploadMedia(file, 'home')
                            updateSection('welcome', 'right_image', result.url)
                          }
                        }} />
                      </label>
                    </div>
                  ) : (
                    <label className="block border border-dashed border-gray-300 p-4 text-center cursor-pointer text-xs">
                      Upload Right Image
                      <input type="file" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const result = await adminUploadMedia(file, 'home')
                          updateSection('welcome', 'right_image', result.url)
                        }
                      }} />
                    </label>
                  )}
                </div>
              </div>
              <input type="text" placeholder="Eyebrow text"
                value={sections.welcome?.eyebrow || ''}
                onChange={e => updateSection('welcome', 'eyebrow', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading"
                value={sections.welcome?.heading_start || ''}
                onChange={e => updateSection('welcome', 'heading_start', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Body text" rows={3}
                value={sections.welcome?.body || ''}
                onChange={e => updateSection('welcome', 'body', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-xs font-sans font-semibold text-charcoal mb-3">Center CTA Card</p>
                <input type="text" placeholder="Dream Dress Heading"
                  value={sections.welcome?.cta_heading || ''}
                  onChange={e => updateSection('welcome', 'cta_heading', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
                <textarea placeholder="Dream Dress Text" rows={2}
                  value={sections.welcome?.cta_text || ''}
                  onChange={e => updateSection('welcome', 'cta_text', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y mb-3" />
                <div className="flex gap-3">
                  <input type="text" placeholder="Button Text"
                    value={sections.welcome?.cta_btn_text || ''}
                    onChange={e => updateSection('welcome', 'cta_btn_text', e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
                  <input type="text" placeholder="Button Link"
                    value={sections.welcome?.cta_btn_link || ''}
                    onChange={e => updateSection('welcome', 'cta_btn_link', e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
            </div>
            <button onClick={() => saveSection('welcome')} disabled={saving} className="btn-gold text-[10px] mt-4">SAVE WELCOME</button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Appointment CTA</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Eyebrow text"
                value={sections.appointment_cta?.eyebrow || ''}
                onChange={e => updateSection('appointment_cta', 'eyebrow', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading"
                value={sections.appointment_cta?.heading || ''}
                onChange={e => updateSection('appointment_cta', 'heading', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Body Subtext" rows={2}
                value={sections.appointment_cta?.subtext || ''}
                onChange={e => updateSection('appointment_cta', 'subtext', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              
              <div className="flex gap-3">
                <input type="text" placeholder="Button Text"
                  value={sections.appointment_cta?.cta_text || 'BOOK AN APPOINTMENT'}
                  onChange={e => updateSection('appointment_cta', 'cta_text', e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
                <input type="text" placeholder="Button Link"
                  value={sections.appointment_cta?.cta_link || '/agenda-tu-cita'}
                  onChange={e => updateSection('appointment_cta', 'cta_link', e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              </div>

              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Background Image</label>
                {sections.appointment_cta?.bg_image ? (
                  <div className="relative">
                    <img src={sections.appointment_cta.bg_image} className="w-full h-32 object-cover rounded" />
                    <label className="absolute top-1 right-1 cursor-pointer bg-white/90 px-2 py-1 text-[10px] font-sans rounded hover:bg-white text-charcoal">
                      Change
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const result = await adminUploadMedia(file, 'home')
                          updateSection('appointment_cta', 'bg_image', result.url)
                        }
                      }} />
                    </label>
                  </div>
                ) : (
                  <label className="block border border-dashed border-gray-300 p-4 text-center cursor-pointer text-xs">
                    Upload Background Image
                    <input type="file" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const result = await adminUploadMedia(file, 'home')
                        updateSection('appointment_cta', 'bg_image', result.url)
                      }
                    }} />
                  </label>
                )}
              </div>
            </div>
            <button onClick={() => saveSection('appointment_cta')} disabled={saving} className="btn-gold text-[10px] mt-4">SAVE APPOINTMENT CTA</button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Inspiration Section (WILDERLY BRIDE)</h3>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-xs font-sans text-body-gray mb-2">Section Image</label>
                {sections.inspiration?.bg_image ? (
                  <div className="relative">
                    <img
                      src={sections.inspiration.bg_image}
                      alt="Inspiration"
                      className="w-full h-48 object-cover rounded"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <label className="cursor-pointer bg-white/90 px-3 py-1.5 text-xs font-sans rounded hover:bg-white text-charcoal transition-colors">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              try {
                                const result = await adminUploadMedia(file, 'inspiration')
                                updateSection('inspiration', 'bg_image', result.url)
                                setMsg('Image uploaded!')
                                setTimeout(() => setMsg(''), 2000)
                              } catch (err) {
                                setMsg('Error uploading image')
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-300 hover:border-gold rounded-lg p-8 text-center cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          try {
                            const result = await adminUploadMedia(file, 'inspiration')
                            updateSection('inspiration', 'bg_image', result.url)
                            setMsg('Image uploaded!')
                            setTimeout(() => setMsg(''), 2000)
                          } catch (err) {
                            setMsg('Error uploading image')
                          }
                        }
                      }}
                    />
                    <div className="text-2xl mb-2">📸</div>
                    <p className="text-sm font-sans text-body-gray">Upload inspiration image</p>
                  </label>
                )}
              </div>
              <input type="text" placeholder="Eyebrow text"
                value={sections.inspiration?.eyebrow || ''}
                onChange={e => updateSection('inspiration', 'eyebrow', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading"
                value={sections.inspiration?.heading || ''}
                onChange={e => updateSection('inspiration', 'heading', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Subtext" rows={3}
                value={sections.inspiration?.subtext || ''}
                onChange={e => updateSection('inspiration', 'subtext', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              <div className="flex gap-3">
                <input type="text" placeholder="Button Text"
                  value={sections.inspiration?.cta_text || 'VIEW COLLECTION'}
                  onChange={e => updateSection('inspiration', 'cta_text', e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
                <input type="text" placeholder="Button Link"
                  value={sections.inspiration?.cta_link || '/dresses'}
                  onChange={e => updateSection('inspiration', 'cta_link', e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
            <button onClick={() => saveSection('inspiration')} disabled={saving} className="btn-gold text-[10px] mt-4">SAVE INSPIRATION</button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Featured Dresses Section</h3>
            <input type="text" placeholder="Section Heading"
              value={sections.featured_dresses?.heading || ''}
              onChange={e => updateSection('featured_dresses', 'heading', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
            <button onClick={() => saveSection('featured_dresses')} disabled={saving} className="btn-gold text-[10px] mt-4">SAVE DRESSES SECTION</button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Featured Accessories Section</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Eyebrow text"
                value={sections.featured_accessories?.eyebrow || ''}
                onChange={e => updateSection('featured_accessories', 'eyebrow', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading"
                value={sections.featured_accessories?.heading || ''}
                onChange={e => updateSection('featured_accessories', 'heading', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Body text" rows={3}
                value={sections.featured_accessories?.body || ''}
                onChange={e => updateSection('featured_accessories', 'body', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Banner Image</label>
                {sections.featured_accessories?.banner_image ? (
                  <div className="relative">
                    <img src={sections.featured_accessories.banner_image} className="w-full h-32 object-cover rounded" />
                    <label className="absolute top-1 right-1 cursor-pointer bg-white/90 px-2 py-1 text-[10px] font-sans rounded hover:bg-white text-charcoal">
                      Change
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const result = await adminUploadMedia(file, 'home')
                          updateSection('featured_accessories', 'banner_image', result.url)
                        }
                      }} />
                    </label>
                  </div>
                ) : (
                  <label className="block border border-dashed border-gray-300 p-4 text-center cursor-pointer text-xs">
                    Upload Banner Image
                    <input type="file" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const result = await adminUploadMedia(file, 'home')
                        updateSection('featured_accessories', 'banner_image', result.url)
                      }
                    }} />
                  </label>
                )}
              </div>
            </div>
            <button onClick={() => saveSection('featured_accessories')} disabled={saving} className="btn-gold text-[10px] mt-4">SAVE ACCESSORIES SECTION</button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Reviews Section</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Eyebrow text"
                value={sections.reviews?.eyebrow || ''}
                onChange={e => updateSection('reviews', 'eyebrow', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading"
                value={sections.reviews?.heading || ''}
                onChange={e => updateSection('reviews', 'heading', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
            </div>
            <button onClick={() => saveSection('reviews')} disabled={saving} className="btn-gold text-[10px] mt-4">SAVE REVIEWS SECTION</button>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Hero Section</h3>

            {/* Hero Image */}
            <div className="mb-4">
              <label className="block text-xs font-sans text-body-gray mb-2">Hero Image</label>
              {sections.about?.hero_image ? (
                <div className="relative">
                  <img
                    src={sections.about.hero_image}
                    alt="Hero"
                    className="w-full h-48 object-cover rounded"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <label className="cursor-pointer bg-white/90 px-3 py-1.5 text-xs font-sans rounded hover:bg-white">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            try {
                              const result = await adminUploadMedia(file, 'about')
                              updateSection('about', 'hero_image', result.url)
                              setMsg('Image uploaded!')
                              setTimeout(() => setMsg(''), 2000)
                            } catch (err) {
                              setMsg('Error uploading image')
                            }
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={() => updateSection('about', 'hero_image', '')}
                      className="bg-red-500/90 px-3 py-1.5 text-xs font-sans text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-gray-300 hover:border-gold rounded-lg p-8 text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        try {
                          const result = await adminUploadMedia(file, 'about')
                          updateSection('about', 'hero_image', result.url)
                          setMsg('Image uploaded!')
                          setTimeout(() => setMsg(''), 2000)
                        } catch (err) {
                          setMsg('Error uploading image')
                        }
                      }
                    }}
                  />
                  <div className="text-2xl mb-2">📸</div>
                  <p className="text-sm font-sans text-body-gray">Upload hero image</p>
                </label>
              )}
            </div>

            <input type="text" placeholder="Hero Title (e.g., About Us)"
              value={sections.about?.hero_title || ''}
              onChange={e => updateSection('about', 'hero_title', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
          </div>

          {/* Main Content Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Main Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Eyebrow Text</label>
                <input type="text" placeholder="e.g., ABOUT MY NOVIA"
                  value={sections.about?.eyebrow || ''}
                  onChange={e => updateSection('about', 'eyebrow', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Heading</label>
                <input type="text" placeholder="e.g., Love brought us here. You too."
                  value={sections.about?.heading || ''}
                  onChange={e => updateSection('about', 'heading', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Brand Story</label>
                <textarea placeholder="Tell your brand's story..."
                  rows={5}
                  value={sections.about?.story || ''}
                  onChange={e => updateSection('about', 'story', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              </div>
            </div>
          </div>

          {/* Vision & Mission Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Vision & Mission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Vision Title</label>
                <input type="text" placeholder="VISION"
                  value={sections.about?.vision_title || ''}
                  onChange={e => updateSection('about', 'vision_title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
                <label className="block text-xs font-sans text-body-gray mb-2">Vision Text</label>
                <textarea placeholder="Your vision statement..."
                  rows={4}
                  value={sections.about?.vision || ''}
                  onChange={e => updateSection('about', 'vision', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              </div>
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Mission Title</label>
                <input type="text" placeholder="MISSION"
                  value={sections.about?.mission_title || ''}
                  onChange={e => updateSection('about', 'mission_title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
                <label className="block text-xs font-sans text-body-gray mb-2">Mission Text</label>
                <textarea placeholder="Your mission statement..."
                  rows={4}
                  value={sections.about?.mission || ''}
                  onChange={e => updateSection('about', 'mission', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-sm font-semibold text-charcoal">Gallery Images</h3>
              <button
                onClick={() => {
                  const gallery = sections.about?.gallery || []
                  updateSection('about', 'gallery', [...gallery, ''])
                }}
                className="px-3 py-1.5 text-xs font-sans bg-charcoal text-white hover:bg-gold transition-colors"
              >
                + Add Image
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {(sections.about?.gallery || []).map((img, index) => (
                <div key={index} className="relative group">
                  {img ? (
                    <div className="relative">
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-40 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-white/90 px-2 py-1 text-xs font-sans rounded hover:bg-white">
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                try {
                                  const result = await adminUploadMedia(file, 'about')
                                  const newGallery = [...(sections.about?.gallery || [])]
                                  newGallery[index] = result.url
                                  updateSection('about', 'gallery', newGallery)
                                  setMsg('Image uploaded!')
                                  setTimeout(() => setMsg(''), 2000)
                                } catch (err) {
                                  setMsg('Error uploading image')
                                }
                              }
                            }}
                          />
                        </label>
                        <button
                          onClick={() => {
                            const newGallery = (sections.about?.gallery || []).filter((_, i) => i !== index)
                            updateSection('about', 'gallery', newGallery)
                          }}
                          className="bg-red-500/90 px-2 py-1 text-xs font-sans text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-gray-300 hover:border-gold rounded-lg h-40 flex items-center justify-center cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            try {
                              const result = await adminUploadMedia(file, 'about')
                              const newGallery = [...(sections.about?.gallery || [])]
                              newGallery[index] = result.url
                              updateSection('about', 'gallery', newGallery)
                              setMsg('Image uploaded!')
                              setTimeout(() => setMsg(''), 2000)
                            } catch (err) {
                              setMsg('Error uploading image')
                            }
                          }
                        }}
                      />
                      <div className="text-center">
                        <div className="text-2xl mb-1">📸</div>
                        <p className="text-xs font-sans text-body-gray">Upload image</p>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>

            {(sections.about?.gallery || []).length === 0 && (
              <p className="text-sm text-body-gray">No gallery images. Click "Add Image" to upload.</p>
            )}
          </div>

          {/* SEO & Meta */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Page Title</label>
                <input type="text" placeholder="e.g., About Us — My Novia"
                  value={sections.about?.meta_title || ''}
                  onChange={e => updateSection('about', 'meta_title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Meta Description</label>
                <textarea placeholder="Page description for search engines..."
                  rows={2}
                  value={sections.about?.meta_description || ''}
                  onChange={e => updateSection('about', 'meta_description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              </div>
            </div>
          </div>

          <button
            onClick={() => saveSection('about')}
            disabled={saving}
            className="btn-gold text-[10px]"
          >
            {saving ? 'SAVING...' : 'SAVE ALL ABOUT CHANGES'}
          </button>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Contact Page</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans text-body-gray mb-2">Address</label>
              <input type="text" placeholder="Address"
                value={sections.contact?.address || ''}
                onChange={e => updateSection('contact', 'address', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-sans text-body-gray mb-2">Phone</label>
              <input type="text" placeholder="Phone"
                value={sections.contact?.phone || ''}
                onChange={e => updateSection('contact', 'phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-sans text-body-gray mb-2">Email</label>
              <input type="text" placeholder="Email"
                value={sections.contact?.email || ''}
                onChange={e => updateSection('contact', 'email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-sans text-body-gray mb-2">Business Hours</label>
              <textarea placeholder="Business hours"
                rows={3}
                value={sections.contact?.hours || ''}
                onChange={e => updateSection('contact', 'hours', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
            </div>
            <div>
              <label className="block text-xs font-sans text-body-gray mb-2">Google Maps Embed URL</label>
              <textarea placeholder="Paste the src URL from Google Maps embed code"
                rows={3}
                value={sections.contact?.map_embed_url || ''}
                onChange={e => updateSection('contact', 'map_embed_url', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              <p className="text-[10px] text-body-gray mt-1">Example: https://www.google.com/maps/embed?pb=...</p>
            </div>
          </div>
          <button 
            onClick={() => saveSection('contact')} 
            disabled={saving} 
            className="btn-gold text-[10px] mt-4"
          >
            {saving ? 'SAVING...' : 'SAVE CONTACT CHANGES'}
          </button>
        </div>
      )}
    </div>
  )
}
