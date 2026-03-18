'use client'

export default function FilterBar({ categories = [], tags = [], activeCategory, activeTag, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-6 border-b border-gray-200 mb-10">
      <span className="text-[11px] font-sans font-semibold tracking-[2px] text-charcoal uppercase mr-2">
        Filter:
      </span>

      <button
        onClick={() => onChange({ category: '', tag: activeTag })}
        className={`text-xs font-sans tracking-wider px-4 py-2 border transition-colors ${
          !activeCategory ? 'bg-charcoal text-white border-charcoal' : 'border-gray-300 text-body-gray hover:border-gold hover:text-gold'
        }`}
      >
        ALL
      </button>

      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange({ category: cat.slug, tag: activeTag })}
          className={`text-xs font-sans tracking-wider px-4 py-2 border transition-colors ${
            activeCategory === cat.slug ? 'bg-charcoal text-white border-charcoal' : 'border-gray-300 text-body-gray hover:border-gold hover:text-gold'
          }`}
        >
          {cat.name.toUpperCase()}
        </button>
      ))}

      {tags.length > 0 && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-2 hidden sm:block" />
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => onChange({ category: activeCategory, tag: activeTag === tag.slug ? '' : tag.slug })}
              className={`text-xs font-sans tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
                activeTag === tag.slug ? 'bg-gold text-white border-gold' : 'border-gray-300 text-body-gray hover:border-gold hover:text-gold'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </>
      )}
    </div>
  )
}
