import HeroBanner from '@/components/home/HeroBanner'
import WelcomeSection from '@/components/home/WelcomeSection'
import FeaturedDresses from '@/components/home/FeaturedDresses'
import ReviewsSection from '@/components/home/ReviewsSection'
import AppointmentCTA from '@/components/home/AppointmentCTA'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function getHomeData() {
  try {
    const [sectionsRes, dressesRes, reviewsRes] = await Promise.allSettled([
      fetch(`${API}/sections`, { cache: 'no-store' }),
      fetch(`${API}/dresses?featured=true`, { cache: 'no-store' }),
      fetch(`${API}/reviews`, { cache: 'no-store' })
    ])

    const safeJson = async (res) => {
      try {
        const text = await res.text()
        return text ? JSON.parse(text) : []
      } catch (e) {
        return []
      }
    }

    const sections = sectionsRes.status === 'fulfilled' && sectionsRes.value.ok ? await safeJson(sectionsRes.value) : []
    const dresses = dressesRes.status === 'fulfilled' && dressesRes.value.ok ? await safeJson(dressesRes.value) : []
    const reviews = reviewsRes.status === 'fulfilled' && reviewsRes.value.ok ? await safeJson(reviewsRes.value) : []

    const sectionMap = {}
    sections.forEach(s => { sectionMap[s.section_name] = s.content })

    return { sectionMap, dresses, reviews }
  } catch (err) {
    return { sectionMap: {}, dresses: [], reviews: [] }
  }
}

export default async function HomePage() {
  const { sectionMap, dresses, reviews } = await getHomeData()

  return (
    <>
      <HeroBanner data={sectionMap.hero} />
      <WelcomeSection data={sectionMap.welcome} dresses={dresses} accessories={[]} />
      <FeaturedDresses data={sectionMap.featured_dresses} dresses={dresses} />
      <ReviewsSection data={sectionMap.reviews} reviews={reviews} />
      <AppointmentCTA data={sectionMap.appointment_cta} />
    </>
  )
}
