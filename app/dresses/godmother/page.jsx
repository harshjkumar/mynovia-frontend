import CategoryCollection from '@/components/catalog/CategoryCollection'

export const metadata = {
  title: 'Godmother Dresses | My Novia',
  description: 'Distinguished designs for an essential role. Classic cuts and elegant styling.',
}

export default function GodmotherPage() {
  return (
    <CategoryCollection 
      categorySlug="godmother"
      categoryName="Godmother"
      coverImage="https://images.unsplash.com/photo-1610419353995-17dc17b4ab36?w=800&q=80"
      description="Distinguished designs for an essential role. Classic cuts and elegant styling."
    />
  )
}