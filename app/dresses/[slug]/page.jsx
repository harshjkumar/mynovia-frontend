import Link from 'next/link'
import CategoryCollection from '@/components/catalog/CategoryCollection'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${API}/dresses/${params.slug}`)
    if (res.ok) {
      const dress = await res.json()
      return {
        title: `${dress.name} — My Novia`,
        description: dress.description || `Discover ${dress.name} at My Novia. Exclusive wedding dress in Almería.`
      }
    }
  } catch {}
  
  try {
     const catRes = await fetch(`${API}/categories?type=dress`)
     if (catRes.ok) {
       const cats = await catRes.json()
       const cat = cats.find(c => c.slug === params.slug)
       if (cat) {
         return {
           title: `${cat.name} Dresses | My Novia`,
           description: `Explore our collection of ${cat.name} dresses.`
         }
       }
     }
  } catch {}

  return { title: 'Dress — My Novia' }
}

async function getDress(slug) {
  try {
    const res = await fetch(`${API}/dresses/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getCategory(slug) {
  try {
    const res = await fetch(`${API}/categories?type=dress`, { cache: 'no-store' })
    if (!res.ok) return null
    const cats = await res.json()
    return cats.find(c => c.slug === slug)
  } catch {
    return null
  }
}

export default async function DressDetailPage({ params }) {
  const dress = await getDress(params.slug)
  
  if (!dress) {
    const category = await getCategory(params.slug)
    if (category) {
      return (
        <CategoryCollection 
          categorySlug={category.slug}
          categoryName={category.name}
          coverImage={category.image_url || "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&q=80"}
          description={category.description || `Explore our latest collection of ${category.name} dresses.`}
        />
      )
    }

    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="section-heading mb-4">Dress or Category not found</h1>
        <Link href="/dresses" className="btn-gold">View Collection</Link>
      </div>
    )
  }

  const images = (dress.dress_images || []).sort((a, b) => a.display_order - b.display_order)
  const tags = (dress.dress_tags || []).map(dt => dt.tags).filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link href="/dresses" className="inline-flex items-center gap-2 text-sm text-body-gray hover:text-gold transition-colors font-sans mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to dresses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          {images.length > 0 ? (
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden bg-cream">
                <img
                  src={images[0].image_url}
                  alt={dress.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(1).map(img => (
                    <div key={img.id} className="aspect-[3/4] overflow-hidden bg-cream cursor-pointer hover:opacity-80 transition-opacity">
                      <img src={img.image_url} alt={dress.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[3/4] bg-cream flex items-center justify-center">
              <p className="text-body-gray font-sans text-sm">No image</p>
            </div>
          )}
        </div>

        <div className="lg:py-8">
          {dress.categories && (
            <span className="section-eyebrow block mb-3">{dress.categories.name}</span>
          )}
          <h1 className="font-display text-4xl lg:text-5xl text-charcoal mb-6">{dress.name}</h1>

          {dress.description && (
            <p className="font-body text-body-gray leading-relaxed mb-8">{dress.description}</p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map(tag => (
                <span key={tag.slug} className="text-xs font-sans tracking-wider px-3 py-1.5 border border-bar-tan text-body-gray">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-4 mb-10 p-6 bg-cream/50 border border-bar-tan/30">
            <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
              <span className="text-sm font-sans text-body-gray">Availability</span>
              <span className={`text-sm font-sans font-medium ${dress.is_available ? 'text-green-700' : 'text-gold'}`}>
                {dress.is_available && dress.inventory_count > 0 ? 'In stock' : 'On request'}
              </span>
            </div>
            {dress.delivery_time_days && (
              <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
                <span className="text-sm font-sans text-body-gray">Delivery time</span>
                <span className="text-sm font-sans text-charcoal">{dress.delivery_time_days} days</span>
              </div>
            )}
          </div>

          <Link href="/book-appointment" className="btn-gold-filled w-full text-center block">
             BOOK AN APPOINTMENT
          </Link>

          <p className="text-xs text-body-gray font-sans mt-4 text-center">
            Visit us to try on this dress with personalized attention
          </p>
        </div>
      </div>
    </div>
  )
}
