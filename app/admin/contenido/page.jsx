'use client'
import { useState, useEffect } from 'react'
import { fetchPageContent, fetchSections, adminUpdateContent, adminUpdateSection, adminUploadMedia } from '@/lib/api'
import LoadingOverlay from '@/components/admin/LoadingOverlay'

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [sections, setSections] = useState({})
  const [pages, setPages] = useState({})
  const [savingSection, setSavingSection] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetchSections().then(data => {
      const map = {}
      data.forEach(s => { 
        map[s.section_name] = s.content || {} 
      })
      
      // Merge with default data so the inputs aren't completely blank if the DB is empty
      setSections({
        hero: {
          slides: [
            { image: '', heading: '', subtext: '', cta_text: 'VIEW COLLECTIONS' }
          ],
          ...map.hero
        },
        welcome: {
          eyebrow: 'THE MY NOVIA FAMILY OF',
          heading_start: 'Timeless, romantic, and memorable',
          cta_icon: '💍',
          cta_heading: 'Find Your Dream Dress',
          cta_text: 'Book a private fitting session with our bridal experts. We ensure a personalized experience to find the dress that tells your unique story.',
          cta_btn_text: 'BOOK AN APPOINTMENT',
          ...map.welcome
        },
        featured_dresses: {
          eyebrow: 'MY NOVIA BRIDAL',
          heading: 'Effortlessly Elegant',
          subtext: 'Discover the artistry of your perfect wedding dress from one of the most beloved bridal collections.',
          ...map.featured_dresses
        },
        featured_accessories: {
          eyebrow: 'MY NOVIA ACCESSORIES',
          heading: 'Refined & Memorable',
          subtext: 'For the bride who wishes to shine with her own light. With sculpted details, intricate lace, and dazzling pieces designed to complement your look from the first to the last dance.',
          ...map.featured_accessories
        },
        appointment_cta: {
          eyebrow: 'VISIT US',
          heading: 'Experience My Novia',
          subtext: 'Your journey to the perfect dress begins here.',
          cta_text: 'BOOK AN APPOINTMENT',
          ...map.appointment_cta
        },
        inspiration: {
          eyebrow: 'BE INSPIRED',
          heading: 'Wilderly Bride',
          subtext: 'For the free-spirited bride.',
          cta_text: 'VIEW COLLECTION',
          ...map.inspiration
        },
        about: {
          hero_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
          hero_title: 'Our Story',
          eyebrow: 'ABOUT MY NOVIA',
          heading: 'Love brought us here. You too.',
          story: "My Novia was born from the passion to make every bride's dream come true, bringing to Almería the most exclusive and elegant trends in bridal fashion.\n\nWe believe that choosing your wedding dress is an experience that should be memorable, deeply personal, and completely free of stress.\n\nOur team of experts dedicates themselves completely to understanding your style, your personality, and the vision of your perfect day, accompanying you at every step of this beautiful journey.",
          vision_title: 'VISION',
          vision: 'To be the benchmark boutique in Almería and southern Spain, recognized for our curated selection of exclusive designers, excellence in customer service, and dedication to the smallest details.',
          mission_title: 'MISSION',
          mission: 'To accompany each bride in one of the most important moments of her life, providing a safe, luxurious and welcoming environment where she can explore, feel and find the dress that will make her shine on her wedding day.',
          gallery: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80',
            'https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=500&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80'
          ],
          ...map.about
        },
        contact: {
          address: 'Almería, Spain',
          phone: '+34 950 450 518',
          email: 'info@mynovia.es',
          hours: 'Monday - Friday: 10:00 - 14:00, 17:00 - 20:30\nSaturday: 10:00 - 14:00\nSunday: Closed',
          map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.8!2d-2.46!3d36.84!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUwJzI0LjAiTiAywrAyNyczNi4wIlc!5e0!3m2!1sen!2ses!4v1',
          ...map.contact
        }
      })
    }).catch(err => console.error('Error fetching sections:', err))

    ;['home', 'about', 'contact'].forEach(slug => {
      fetchPageContent(slug).then(data => {
        setPages(prev => ({ ...prev, [slug]: data.content || {} }))
      }).catch(() => {})
    })
  }, [])

  async function saveSection(name) {
    setSavingSection(name)
    try {
      await adminUpdateSection(name, sections[name] || {})
      setMsg('Saved!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setMsg('Error saving')
    }
    setSavingSection(null)
  }

  async function savePage(slug) {
    setSavingSection(slug)
    try {
      await adminUpdateContent(slug, { content: pages[slug] || {} })
      setMsg('Saved!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setMsg('Error saving')
    }
    setSavingSection(null)
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

  const heroSlides = sections.hero?.slides || []

  function updateHeroSlides(slides) {
    setSections(prev => ({ ...prev, hero: { ...(prev.hero || {}), slides } }))
  }

  async function handleHeroImageUpload(file, index) {
    setUploadingImage(true)
    try {
      setUploadingImage(true); const result = await adminUploadMedia(file, 'hero')
      const newSlides = [...heroSlides]
      newSlides[index] = { ...newSlides[index], image: result.url }
      updateHeroSlides(newSlides)
      setMsg('Image uploaded!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setMsg('Error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  function addHeroSlide() {
    updateHeroSlides([...heroSlides, { image: '', heading: '', subtext: '', cta_text: 'VIEW COLLECTIONS' }])
  }

  function removeHeroSlide(index) {
    updateHeroSlides(heroSlides.filter((_, i) => i !== index))
  }

  function updateHeroSlide(index, field, value) {
    const newSlides = [...heroSlides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    updateHeroSlides(newSlides)
  }

  const tabs = [
    { id: 'home', label: 'Homepage' },
    { id: 'about', label: 'Our Story' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <div>
      <LoadingOverlay isLoading={uploadingImage} message="Uploading Image..." />
      <LoadingOverlay isLoading={savingSection !== null} message="Saving changes..." />
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
              <button onClick={addHeroSlide} className="px-3 py-1.5 text-xs font-sans bg-charcoal text-white hover:bg-gold transition-colors">
                + Add Slide
              </button>
            </div>

            {heroSlides.length === 0 && <p className="text-sm text-body-gray mb-4">No slides configured. Add your first slide.</p>}

            <div className="space-y-6">
              {heroSlides.map((slide, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-sans font-semibold text-charcoal">Slide {index + 1}</span>
                    <button onClick={() => removeHeroSlide(index)} className="text-xs text-red-500 hover:text-red-700 font-sans">Remove</button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-sans text-body-gray mb-2">Hero Image</label>
                    {slide.image ? (
                      <div className="relative">
                        <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-48 object-cover rounded" />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <label className="cursor-pointer bg-white/90 px-2 py-1 text-xs font-sans rounded hover:bg-white">
                            Replace
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0], index)} />
                          </label>
                          <button onClick={() => updateHeroSlide(index, 'image', '')} className="bg-red-500/90 px-2 py-1 text-xs font-sans text-white rounded hover:bg-red-600">Delete</button>
                        </div>
                      </div>
                    ) : (
                      <label className="block border-2 border-dashed border-gray-300 hover:border-gold rounded-lg p-8 text-center cursor-pointer transition-colors">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0], index)} />
                        <div className="text-2xl mb-2">📸</div>
                        <p className="text-sm font-sans text-body-gray">Upload hero image</p>
                      </label>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input type="text" placeholder="Heading" value={slide.heading || ''} onChange={(e) => updateHeroSlide(index, 'heading', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
                    <textarea placeholder="Subtext" rows={2} value={slide.subtext || ''} onChange={(e) => updateHeroSlide(index, 'subtext', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
                    <input type="text" placeholder="Button text" value={slide.cta_text || ''} onChange={(e) => updateHeroSlide(index, 'cta_text', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => saveSection('hero')} disabled={savingSection !== null || uploadingImage} className="btn-gold text-[10px] mt-4">{savingSection === 'hero' ? 'SAVING...' : 'SAVE HERO'}</button>
          </div>

          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Welcome Section</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Eyebrow text (e.g., THE MY NOVIA FAMILY OF)" value={sections.welcome?.eyebrow || ''} onChange={e => updateSection('welcome', 'eyebrow', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Main Heading (e.g., Timeless, romantic, and memorable)" value={sections.welcome?.heading_start || ''} onChange={e => updateSection('welcome', 'heading_start', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              
              <div className="border-t border-gray-100 pt-4 mt-6">
                <p className="text-xs font-sans font-semibold text-charcoal mb-3">Center Appointment Card (The White Box)</p>
                <input type="text" placeholder="Emoji Icon (e.g., 💍)" value={sections.welcome?.cta_icon || ''} onChange={e => updateSection('welcome', 'cta_icon', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
                <input type="text" placeholder="Card Heading (e.g., Find Your Dream Dress)" value={sections.welcome?.cta_heading || ''} onChange={e => updateSection('welcome', 'cta_heading', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
                <textarea placeholder="Card Subtext (e.g., Book a private fitting...)" rows={3} value={sections.welcome?.cta_text || ''} onChange={e => updateSection('welcome', 'cta_text', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y mb-3" />
                <input type="text" placeholder="Button Text (e.g., BOOK AN APPOINTMENT)" value={sections.welcome?.cta_btn_text || ''} onChange={e => updateSection('welcome', 'cta_btn_text', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
            <button onClick={() => saveSection('welcome')} disabled={savingSection !== null || uploadingImage} className="btn-gold text-[10px] mt-4">{savingSection === 'welcome' ? 'SAVING...' : 'SAVE WELCOME'}</button>
          </div>

          {/* Featured Dresses Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Featured Dresses Section</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Eyebrow text (e.g., MY NOVIA BRIDAL)" value={sections.featured_dresses?.eyebrow || ''} onChange={e => updateSection('featured_dresses', 'eyebrow', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading (e.g., Effortlessly Elegant)" value={sections.featured_dresses?.heading || ''} onChange={e => updateSection('featured_dresses', 'heading', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Body Subtext" rows={2} value={sections.featured_dresses?.subtext || ''} onChange={e => updateSection('featured_dresses', 'subtext', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
            </div>
            <button onClick={() => saveSection('featured_dresses')} disabled={savingSection !== null || uploadingImage} className="btn-gold text-[10px] mt-4">{savingSection === 'featured_dresses' ? 'SAVING...' : 'SAVE FEATURED DRESSES'}</button>
          </div>

          {/* Featured Accessories Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Featured Accessories Section</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Eyebrow text (e.g., MY NOVIA ACCESSORIES)" value={sections.featured_accessories?.eyebrow || ''} onChange={e => updateSection('featured_accessories', 'eyebrow', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading (e.g., Refined & Memorable)" value={sections.featured_accessories?.heading || ''} onChange={e => updateSection('featured_accessories', 'heading', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Body Subtext" rows={2} value={sections.featured_accessories?.subtext || ''} onChange={e => updateSection('featured_accessories', 'subtext', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
            </div>
            <button onClick={() => saveSection('featured_accessories')} disabled={savingSection !== null || uploadingImage} className="btn-gold text-[10px] mt-4">{savingSection === 'featured_accessories' ? 'SAVING...' : 'SAVE FEATURED ACCESSORIES'}</button>
          </div>

          {/* Appointment CTA */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Appointment CTA</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Eyebrow text" value={sections.appointment_cta?.eyebrow || ''} onChange={e => updateSection('appointment_cta', 'eyebrow', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading" value={sections.appointment_cta?.heading || ''} onChange={e => updateSection('appointment_cta', 'heading', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Body Subtext" rows={2} value={sections.appointment_cta?.subtext || ''} onChange={e => updateSection('appointment_cta', 'subtext', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              <input type="text" placeholder="Button Text" value={sections.appointment_cta?.cta_text || ''} onChange={e => updateSection('appointment_cta', 'cta_text', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              
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
                          setUploadingImage(true); try { const result = await adminUploadMedia(file, 'home'); updateSection('appointment_cta', 'bg_image', result.url); } finally { setUploadingImage(false); }
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
                        setUploadingImage(true); try { const result = await adminUploadMedia(file, 'home'); updateSection('appointment_cta', 'bg_image', result.url); } finally { setUploadingImage(false); }
                      }
                    }} />
                  </label>
                )}
              </div>
            </div>
            <button onClick={() => saveSection('appointment_cta')} disabled={savingSection !== null || uploadingImage} className="btn-gold text-[10px] mt-4">{savingSection === 'appointment_cta' ? 'SAVING...' : 'SAVE APPOINTMENT CTA'}</button>
          </div>

          {/* Inspiration Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Inspiration Section (WILDERLY BRIDE)</h3>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-xs font-sans text-body-gray mb-2">Section Image</label>
                {sections.inspiration?.bg_image ? (
                  <div className="relative">
                    <img src={sections.inspiration.bg_image} alt="Inspiration" className="w-full h-48 object-cover rounded" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <label className="cursor-pointer bg-white/90 px-3 py-1.5 text-xs font-sans rounded hover:bg-white text-charcoal transition-colors">
                        Replace
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setUploadingImage(true); try { const result = await adminUploadMedia(file, 'inspiration'); updateSection('inspiration', 'bg_image', result.url); setMsg('Image uploaded!'); setTimeout(() => setMsg(''), 2000); } catch (err) { } finally { setUploadingImage(false); }
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-300 hover:border-gold rounded-lg p-8 text-center cursor-pointer transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setUploadingImage(true); try { const result = await adminUploadMedia(file, 'inspiration'); updateSection('inspiration', 'bg_image', result.url); setMsg('Image uploaded!'); setTimeout(() => setMsg(''), 2000); } catch (err) { } finally { setUploadingImage(false); }
                      }
                    }} />
                    <div className="text-2xl mb-2">📸</div>
                    <p className="text-sm font-sans text-body-gray">Upload inspiration image</p>
                  </label>
                )}
              </div>
              <input type="text" placeholder="Eyebrow text" value={sections.inspiration?.eyebrow || ''} onChange={e => updateSection('inspiration', 'eyebrow', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <input type="text" placeholder="Heading" value={sections.inspiration?.heading || ''} onChange={e => updateSection('inspiration', 'heading', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
              <textarea placeholder="Subtext" rows={3} value={sections.inspiration?.subtext || ''} onChange={e => updateSection('inspiration', 'subtext', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              <input type="text" placeholder="Button Text" value={sections.inspiration?.cta_text || ''} onChange={e => updateSection('inspiration', 'cta_text', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
            </div>
            <button onClick={() => saveSection('inspiration')} disabled={savingSection !== null || uploadingImage} className="btn-gold text-[10px] mt-4">{savingSection === 'inspiration' ? 'SAVING...' : 'SAVE INSPIRATION'}</button>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Hero Section</h3>
            <div className="mb-4">
              <label className="block text-xs font-sans text-body-gray mb-2">Hero Image</label>
              {sections.about?.hero_image ? (
                <div className="relative">
                  <img src={sections.about.hero_image} alt="Hero" className="w-full h-48 object-cover rounded" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <label className="cursor-pointer bg-white/90 px-3 py-1.5 text-xs font-sans rounded hover:bg-white">
                      Replace
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0]; if (file) { setUploadingImage(true); try { const result = await adminUploadMedia(file, 'about'); updateSection('about', 'hero_image', result.url); } finally { setUploadingImage(false); } }
                      }} />
                    </label>
                    <button onClick={() => updateSection('about', 'hero_image', '')} className="bg-red-500/90 px-3 py-1.5 text-xs font-sans text-white rounded hover:bg-red-600">Delete</button>
                  </div>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-gray-300 hover:border-gold rounded-lg p-8 text-center cursor-pointer transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { setUploadingImage(true); try { const result = await adminUploadMedia(file, 'about'); updateSection('about', 'hero_image', result.url); } finally { setUploadingImage(false); } } }} />
                  <div className="text-2xl mb-2">📸</div>
                  <p className="text-sm font-sans text-body-gray">Upload hero image</p>
                </label>
              )}
            </div>
            <input type="text" placeholder="Hero Title (e.g., About Us)" value={sections.about?.hero_title || ''} onChange={e => updateSection('about', 'hero_title', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Main Content</h3>
            <div className="space-y-4">
              <div><label className="block text-xs font-sans text-body-gray mb-2">Eyebrow Text</label><input type="text" value={sections.about?.eyebrow || ''} onChange={e => updateSection('about', 'eyebrow', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" /></div>
              <div><label className="block text-xs font-sans text-body-gray mb-2">Heading</label><input type="text" value={sections.about?.heading || ''} onChange={e => updateSection('about', 'heading', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" /></div>
              <div><label className="block text-xs font-sans text-body-gray mb-2">Brand Story</label><textarea rows={5} value={sections.about?.story || ''} onChange={e => updateSection('about', 'story', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" /></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Vision & Mission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Vision Title</label><input type="text" value={sections.about?.vision_title || ''} onChange={e => updateSection('about', 'vision_title', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
                <label className="block text-xs font-sans text-body-gray mb-2">Vision Text</label><textarea rows={4} value={sections.about?.vision || ''} onChange={e => updateSection('about', 'vision', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              </div>
              <div>
                <label className="block text-xs font-sans text-body-gray mb-2">Mission Title</label><input type="text" value={sections.about?.mission_title || ''} onChange={e => updateSection('about', 'mission_title', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold mb-3" />
                <label className="block text-xs font-sans text-body-gray mb-2">Mission Text</label><textarea rows={4} value={sections.about?.mission || ''} onChange={e => updateSection('about', 'mission', e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-sm font-semibold text-charcoal">Gallery Images</h3>
              <button onClick={() => updateSection('about', 'gallery', [...(sections.about?.gallery || []), ''])} className="px-3 py-1.5 text-xs font-sans bg-charcoal text-white hover:bg-gold transition-colors">+ Add Image</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {(sections.about?.gallery || []).map((img, index) => (
                <div key={index} className="relative group">
                  {img ? (
                    <div className="relative"><img src={img} alt={`Gallery ${index + 1}`} className="w-full h-40 object-cover rounded" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-white/90 px-2 py-1 text-xs font-sans rounded hover:bg-white">Replace<input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { setUploadingImage(true); try { const result = await adminUploadMedia(file, 'about'); const newGallery = [...sections.about.gallery]; newGallery[index] = result.url; updateSection('about', 'gallery', newGallery); } finally { setUploadingImage(false); } } }} /></label>
                        <button onClick={() => updateSection('about', 'gallery', sections.about.gallery.filter((_, i) => i !== index))} className="bg-red-500/90 px-2 py-1 text-xs font-sans text-white rounded hover:bg-red-600">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-gray-300 hover:border-gold rounded-lg h-40 flex items-center justify-center cursor-pointer transition-colors"><input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { setUploadingImage(true); try { const result = await adminUploadMedia(file, 'about'); const newGallery = [...sections.about.gallery]; newGallery[index] = result.url; updateSection('about', 'gallery', newGallery); } finally { setUploadingImage(false); } } }} /><div className="text-center"><div className="text-2xl mb-1">📸</div><p className="text-xs font-sans text-body-gray">Upload image</p></div></label>
                  )}
                </div>
              ))}
            </div>
            {(sections.about?.gallery || []).length === 0 && <p className="text-sm text-body-gray">No gallery images. Click "Add Image" to upload.</p>}
          </div>

          <button onClick={() => saveSection('about')} disabled={savingSection !== null || uploadingImage} className="btn-gold text-[10px]">{savingSection === 'about' ? 'SAVING...' : 'SAVE ALL ABOUT CHANGES'}</button>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-sans text-sm font-semibold text-charcoal mb-4">Contact Page</h3>
          <div className="space-y-4">
            <div><label className="block text-xs font-sans text-body-gray mb-2">Address</label><input type="text" value={sections.contact?.address || ''} onChange={e => updateSection('contact', 'address', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" /></div>
            <div><label className="block text-xs font-sans text-body-gray mb-2">Phone</label><input type="text" value={sections.contact?.phone || ''} onChange={e => updateSection('contact', 'phone', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" /></div>
            <div><label className="block text-xs font-sans text-body-gray mb-2">Email</label><input type="text" value={sections.contact?.email || ''} onChange={e => updateSection('contact', 'email', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" /></div>
            <div><label className="block text-xs font-sans text-body-gray mb-2">Business Hours</label><textarea rows={3} value={sections.contact?.hours || ''} onChange={e => updateSection('contact', 'hours', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" /></div>
            <div><label className="block text-xs font-sans text-body-gray mb-2">Google Maps Embed URL</label><textarea rows={3} value={sections.contact?.map_embed_url || ''} onChange={e => updateSection('contact', 'map_embed_url', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" /><p className="text-[10px] text-body-gray mt-1">Example: https://www.google.com/maps/embed?pb=...</p></div>
          </div>
          <button onClick={() => saveSection('contact')} disabled={savingSection !== null || uploadingImage} className="btn-gold text-[10px] mt-4">{savingSection === 'contact' ? 'SAVING...' : 'SAVE CONTACT CHANGES'}</button>
        </div>
      )}
    </div>
  )
}
