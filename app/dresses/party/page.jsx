import CategoryCollection from '@/components/catalog/CategoryCollection'

export const metadata = {
  title: 'Party Dresses | My Novia',
  description: 'Elegance and sophistication for unforgettable nights. Be the center of attention.',
}

export default function PartyPage() {
  return (
    <CategoryCollection 
      categorySlug="party"
      categoryName="Party"
      coverImage="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80"
      description="Elegance and sophistication for unforgettable nights. Be the center of attention."
    />
  )
}