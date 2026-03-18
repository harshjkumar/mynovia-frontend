const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const metadata = {
  title: 'About Us — My Novia',
  description: 'Discover the story of My Novia, your favorite bridal boutique in Almería.'
}

async function getAboutContent() {
  try {
    const res = await fetch(`${API}/content/about`, { next: { revalidate: 120 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function ConocenosPage() {
  const page = await getAboutContent()
  const content = page?.content || {}

  return (
    <div>
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={content.hero_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'}
          alt="Conócenos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
          <h1 className="text-white font-display text-5xl md:text-6xl">About Us</h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <span className="section-eyebrow block mb-4">ABOUT MY NOVIA</span>
            <h2 className="font-display text-4xl text-charcoal leading-tight">
              {content.heading || 'Love brought us here. You too.'}
            </h2>
          </div>
          <div className="lg:col-span-3">
            <p className="font-body text-body-gray leading-relaxed text-[15px]">
              {content.story || 'My Novia was born from the passion to make every bride\'s dream come true. From our boutique in the heart of Almería, we offer a personal and unique experience. Every dress in our collection has been carefully selected to reflect the elegance, romance, and personality of each bride. We believe finding the perfect dress should be as special as your wedding day. That\'s why our team is dedicated to giving you personalized attention, guiding you with care and professionalism in finding your ideal dress.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <span className="section-eyebrow block mb-4">VISION</span>
            <p className="font-body text-body-gray leading-relaxed">
              {content.vision || 'To be the benchmark boutique in Almería and southern Spain, recognized for offering wedding dresses that combine trends, quality, and extraordinary service.'}
            </p>
          </div>
          <div>
            <span className="section-eyebrow block mb-4">MISSION</span>
            <p className="font-body text-body-gray leading-relaxed">
              {content.mission || 'To accompany each bride in one of the most important moments of her life, offering exclusive collections and a personalized, unforgettable shopping experience.'}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(content.gallery || [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80',
            'https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=500&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80'
          ]).map((img, i) => (
            <div key={i} className="aspect-[4/5] overflow-hidden">
              <img src={typeof img === 'string' ? img : img.url} alt={`About ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
