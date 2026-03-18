'use client'

export default function RichTextEditor({ value, onChange, placeholder = 'Write here...' }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={8}
      className="w-full px-4 py-3 border border-gray-200 bg-white font-body text-sm focus:outline-none focus:border-gold transition-colors resize-y"
    />
  )
}
