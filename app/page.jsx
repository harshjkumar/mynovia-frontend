import HeroBanner from '@/components/home/HeroBanner'
import WelcomeSection from '@/components/home/WelcomeSection'
import FeaturedDresses from '@/components/home/FeaturedDresses'
import InspirationCTA from '@/components/home/InspirationCTA'
import FeaturedAccessories from '@/components/home/FeaturedAccessories'
import ReviewsSection from '@/components/home/ReviewsSection'
import AppointmentCTA from '@/components/home/AppointmentCTA'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function getHomeData() {
  try {
    const [sectionsRes, dressesRes, accessoriesRes, reviewsRes] = await Promise.allSettled([
      fetch(`${API}/sections`, { next: { revalidate: 30 } }),
      fetch(`${API}/dresses?featured=true`, { next: { revalidate: 30 } }),
      fetch(`${API}/accessories`, { next: { revalidate: 30 } }),
      fetch(`${API}/reviews`, { next: { revalidate: 30 } })
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
    const accessories = accessoriesRes.status === 'fulfilled' && accessoriesRes.value.ok ? await safeJson(accessoriesRes.value) : []
    const reviews = reviewsRes.status === 'fulfilled' && reviewsRes.value.ok ? await safeJson(reviewsRes.value) : []

    const sectionMap = {}
    sections.forEach(s => { sectionMap[s.section_name] = s.content })

    return { sectionMap, dresses, accessories, reviews }
  } catch (err) {
    return { sectionMap: {}, dresses: [], accessories: [], reviews: [] }
  }
}

export default async function HomePage() {
  const { sectionMap, dresses, accessories, reviews } = await getHomeData()

  return (
    <>
      <HeroBanner data={sectionMap.hero} />
      <WelcomeSection data={sectionMap.welcome} dresses={dresses} accessories={accessories} />
      <FeaturedDresses dresses={dresses} />
      <InspirationCTA data={sectionMap.inspiration} />
      <FeaturedAccessories accessories={accessories} />
      <ReviewsSection reviews={reviews} />
      <AppointmentCTA data={sectionMap.appointment_cta} />
    </>
  )
}
