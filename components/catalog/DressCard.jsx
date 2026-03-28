import Link from 'next/link'

export default function DressCard({ dress }) {
  const primaryImg = dress.dress_images?.sort((a, b) => a.display_order - b.display_order)?.[0]
  const secondImg = dress.dress_images?.sort((a, b) => a.display_order - b.display_order)?.[1]
  const imgUrl = primaryImg?.image_url || 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&q=80'
  const hoverUrl = secondImg?.image_url

  return (
    <div className="group block relative w-full mb-10">
      <Link href={`/dresses/${dress.slug}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ebe8e3] mb-4">
          <img
            src={imgUrl}
            alt={dress.name}
            className={`w-full h-full object-cover transition-opacity duration-700 ${hoverUrl ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform duration-700'}`}
          />
          {hoverUrl && (
            <img
              src={hoverUrl}
              alt={dress.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}

          {dress.is_available && dress.inventory_count > 0 ? (
            <span className="absolute bottom-4 right-4 bg-white/90 text-[9px] font-sans font-semibold tracking-wider text-green-700 px-3 py-1.5 uppercase shadow-sm">
              In stock
            </span>
          ) : (
            <span className="absolute bottom-4 right-4 bg-white/90 text-[9px] font-sans font-semibold tracking-wider text-gold px-3 py-1.5 uppercase shadow-sm">
              On request
            </span>
          )}
        </div>
      </Link>

      <div className="px-1">
        <div className="flex items-start mb-2">
          <Link href={`/dresses/${dress.slug}`}>
            <h3 className="font-heading text-[22px] text-[#333] hover:text-[#555] transition-colors font-light tracking-wide truncate pr-4">
              {dress.name}
            </h3>
          </Link>
        </div>
        
        <p className="font-sans text-[13px] leading-relaxed text-[#7a7a7a] font-light mb-3 line-clamp-2">
          {dress.description || "Elegant and timeless, this beautiful gown features meticulous craftsmanship and premium fabrics designed to make your special day unforgettable. With delicate lace appliques, hand-beaded details, and a flowing skirt, it moves gracefully with every step."}
        </p>
        
        {dress.categories && (
          <p className="text-[12px] text-[#b3b3b3] font-serif italic">
            {dress.categories.name} Wedding Dresses
          </p>
        )}
      </div>
    </div>
  )
}
