const fs = require('fs');
const path = require('path');

const categories = [
  { slug: 'bride', name: 'Bride', image: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&q=80', description: 'Find the dress of your dreams. Classic, modern, and romantic designs for your special day.' },
  { slug: 'party', name: 'Party', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80', description: 'Elegance and sophistication for unforgettable nights. Be the center of attention.' },
  { slug: 'godmother', name: 'Godmother', image: 'https://images.unsplash.com/photo-1610419353995-17dc17b4ab36?w=800&q=80', description: 'Distinguished designs for an essential role. Classic cuts and elegant styling.' },
  { slug: 'cocktail', name: 'Cocktail', image: 'https://images.unsplash.com/photo-1572804013309-82a89b48af11?w=800&q=80', description: 'Chic, vibrant, and perfectly tailored for the modern celebration.' }
];

const basePath = path.join(__dirname, 'app', 'dresses'); // Mapped to dresses instead of vestidos

for (const cat of categories) {
  const dirPath = path.join(basePath, cat.slug);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const fileContent = `
import CategoryCollection from '@/components/catalog/CategoryCollection'

export const metadata = {
  title: '${cat.name} Dresses | My Novia',
  description: '${cat.description}',
}

export default function ${cat.name}Page() {
  return (
    <CategoryCollection 
      categorySlug="${cat.slug}"
      categoryName="${cat.name}"
      coverImage="${cat.image}"
      description="${cat.description}"
    />
  )
}
  `.trim();

  fs.writeFileSync(path.join(dirPath, 'page.jsx'), fileContent);
}

console.log('Category pages created successfully in dresses folder!');
