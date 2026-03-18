import CategoryCollection from '@/components/catalog/CategoryCollection'

export const metadata = {
  title: 'Cocktail Dresses | My Novia',
  description: 'Chic, vibrant, and perfectly tailored for the modern celebration.',
}

export default function CocktailPage() {
  return (
    <CategoryCollection 
      categorySlug="cocktail"
      categoryName="Cocktail"
      coverImage="https://images.unsplash.com/photo-1572804013309-82a89b48af11?w=800&q=80"
      description="Chic, vibrant, and perfectly tailored for the modern celebration."
    />
  )
}