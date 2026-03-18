import CategoryCollection from '@/components/catalog/CategoryCollection'

export const metadata = {
  title: 'Bride Dresses | My Novia',
  description: 'Find the dress of your dreams. Classic, modern, and romantic designs for your special day.',
}

export default function BridePage() {
  return (
    <CategoryCollection 
      categorySlug="bride"
      categoryName="Bride"
      coverImage="https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&q=80"
      description="Find the dress of your dreams. Classic, modern, and romantic designs for your special day."
    />
  )
}