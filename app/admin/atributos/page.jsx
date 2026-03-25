'use client'
import { useState, useEffect } from 'react'
import { adminGetStyles, adminCreateStyle, adminDeleteStyle,
         adminGetSizes, adminCreateSize, adminDeleteSize,
         adminGetColors, adminCreateColor, adminDeleteColor } from '@/lib/api'

export default function AttributesPage() {
  const [styles, setStyles] = useState([])
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(true)

  const [newStyle, setNewStyle] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#000000')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [st, si, co] = await Promise.all([
        adminGetStyles(), adminGetSizes(), adminGetColors()
      ])
      setStyles(st || [])
      setSizes(si || [])
      setColors(co || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  // --- Styles ---
  async function handleAddStyle(e) {
    e.preventDefault()
    if (!newStyle.trim()) return
    try {
      await adminCreateStyle({ name: newStyle })
      setNewStyle('')
      loadAll()
    } catch (err) { alert('Error adding style') }
  }
  async function handleDeleteStyle(id) {
    if (!confirm('Delete this style?')) return
    try { await adminDeleteStyle(id); loadAll() }
    catch (err) { alert('Error deleting style') }
  }

  // --- Sizes ---
  async function handleAddSize(e) {
    e.preventDefault()
    if (!newSize.trim()) return
    try {
      await adminCreateSize({ name: newSize, display_order: sizes.length })
      setNewSize('')
      loadAll()
    } catch (err) { alert('Error adding size') }
  }
  async function handleDeleteSize(id) {
    if (!confirm('Delete this size?')) return
    try { await adminDeleteSize(id); loadAll() }
    catch (err) { alert('Error deleting size') }
  }

  // --- Colors ---
  async function handleAddColor(e) {
    e.preventDefault()
    if (!newColorName.trim()) return
    try {
      await adminCreateColor({ name: newColorName, hex_code: newColorHex })
      setNewColorName('')
      loadAll()
    } catch (err) { alert('Error adding color') }
  }
  async function handleDeleteColor(id) {
    if (!confirm('Delete this color?')) return
    try { await adminDeleteColor(id); loadAll() }
    catch (err) { alert('Error deleting color') }
  }

  if (loading) return <div className="p-8 text-center text-body-gray">Loading attributes...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading text-charcoal">Attributes</h1>
          <p className="text-body-gray text-sm font-sans mt-1">Manage styles, sizes, and colors for dress variants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* STYLES */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-heading text-charcoal mb-4">Dress Styles</h2>
          <form onSubmit={handleAddStyle} className="flex gap-2 mb-6">
            <input type="text" value={newStyle} onChange={e => setNewStyle(e.target.value)} placeholder="e.g. A-Line" className="flex-1 px-3 py-2 border border-gray-200 text-sm font-sans focus:outline-none focus:border-gold" />
            <button type="submit" className="px-4 py-2 bg-charcoal text-white text-xs font-sans hover:bg-gold transition-colors">Add</button>
          </form>
          <ul className="space-y-2">
            {styles.map(s => (
              <li key={s.id} className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-gray-100 rounded">
                <span className="text-sm font-sans text-charcoal">{s.name}</span>
                <button onClick={() => handleDeleteStyle(s.id)} className="text-red-500 hover:text-red-700 text-sm">×</button>
              </li>
            ))}
            {styles.length === 0 && <p className="text-xs text-body-gray italic">No styles added.</p>}
          </ul>
        </div>

        {/* SIZES */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-heading text-charcoal mb-4">Sizes</h2>
          <form onSubmit={handleAddSize} className="flex gap-2 mb-6">
            <input type="text" value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="e.g. Medium or 10" className="flex-1 px-3 py-2 border border-gray-200 text-sm font-sans focus:outline-none focus:border-gold" />
            <button type="submit" className="px-4 py-2 bg-charcoal text-white text-xs font-sans hover:bg-gold transition-colors">Add</button>
          </form>
          <ul className="space-y-2">
            {sizes.map(s => (
              <li key={s.id} className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-gray-100 rounded">
                <span className="text-sm font-sans text-charcoal">{s.name}</span>
                <button onClick={() => handleDeleteSize(s.id)} className="text-red-500 hover:text-red-700 text-sm">×</button>
              </li>
            ))}
            {sizes.length === 0 && <p className="text-xs text-body-gray italic">No sizes added.</p>}
          </ul>
        </div>

        {/* COLORS */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-heading text-charcoal mb-4">Colors</h2>
          <form onSubmit={handleAddColor} className="flex flex-col gap-2 mb-6">
            <div className="flex gap-2">
              <input type="text" value={newColorName} onChange={e => setNewColorName(e.target.value)} placeholder="e.g. Ivory" className="flex-1 px-3 py-2 border border-gray-200 text-sm font-sans focus:outline-none focus:border-gold" />
              <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-10 h-10 p-1 border border-gray-200 cursor-pointer" />
            </div>
            <button type="submit" className="px-4 py-2 bg-charcoal text-white text-xs font-sans hover:bg-gold transition-colors w-full">Add Color</button>
          </form>
          <ul className="space-y-2">
            {colors.map(c => (
              <li key={c.id} className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-gray-100 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: c.hex_code }}></div>
                  <span className="text-sm font-sans text-charcoal">{c.name}</span>
                </div>
                <button onClick={() => handleDeleteColor(c.id)} className="text-red-500 hover:text-red-700 text-sm">×</button>
              </li>
            ))}
            {colors.length === 0 && <p className="text-xs text-body-gray italic">No colors added.</p>}
          </ul>
        </div>

      </div>
    </div>
  )
}
