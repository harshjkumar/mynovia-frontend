import AboutContent from '@/components/about/AboutContent'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const metadata = {
  title: 'Our Story — My Novia',
  description: 'Discover the story of My Novia, your favorite bridal boutique in Almería.'
}

async function getAboutContent() {
  try {
    const res = await fetch(`${API}/sections/about`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function AboutPage() {
  const page = await getAboutContent()
  const content = page?.content || {}

  return <AboutContent content={content} />
}