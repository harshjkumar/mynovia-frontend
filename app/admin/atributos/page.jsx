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
  const [colorInputMethod, setColorInputMethod] = useState('hex') // 'hex' or 'rgb'
  const [newColorR, setNewColorR] = useState(0)
  const [newColorG, setNewColorG] = useState(0)
  const [newColorB, setNewColorB] = useState(0)
  
  // Selection states
  const [selectedStyles, setSelectedStyles] = useState(new Set())
  const [selectedSizes, setSelectedSizes] = useState(new Set())
  const [selectedColors, setSelectedColors] = useState(new Set())

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

  // --- Color Conversion Helpers ---
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('').toUpperCase()
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const handleColorMethodToggle = (method) => {
    setColorInputMethod(method)
    if (method === 'rgb') {
      const rgb = hexToRgb(newColorHex)
      setNewColorR(rgb.r)
      setNewColorG(rgb.g)
      setNewColorB(rgb.b)
    }
  }

  const handleRgbChange = (r, g, b) => {
    setNewColorR(r)
    setNewColorG(g)
    setNewColorB(b)
    setNewColorHex(rgbToHex(r, g, b))
  }

  const handleHexChange = (hex) => {
    setNewColorHex(hex)
    const rgb = hexToRgb(hex)
    setNewColorR(rgb.r)
    setNewColorG(rgb.g)
    setNewColorB(rgb.b)
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

  // --- Selection & Bulk Delete Handlers ---
  const toggleStyleSelection = (id) => {
    const newSet = new Set(selectedStyles)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedStyles(newSet)
  }

  const toggleAllStyles = () => {
    if (selectedStyles.size === styles.length) setSelectedStyles(new Set())
    else setSelectedStyles(new Set(styles.map(s => s.id)))
  }

  const deleteSelectedStyles = async () => {
    if (selectedStyles.size === 0) return
    if (!confirm(`Delete ${selectedStyles.size} selected style(s)?`)) return
    try {
      for (const id of selectedStyles) {
        await adminDeleteStyle(id)
      }
      setSelectedStyles(new Set())
      loadAll()
    } catch (err) { alert('Error deleting styles') }
  }

  const toggleSizeSelection = (id) => {
    const newSet = new Set(selectedSizes)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedSizes(newSet)
  }

  const toggleAllSizes = () => {
    if (selectedSizes.size === sizes.length) setSelectedSizes(new Set())
    else setSelectedSizes(new Set(sizes.map(s => s.id)))
  }

  const deleteSelectedSizes = async () => {
    if (selectedSizes.size === 0) return
    if (!confirm(`Delete ${selectedSizes.size} selected size(s)?`)) return
    try {
      for (const id of selectedSizes) {
        await adminDeleteSize(id)
      }
      setSelectedSizes(new Set())
      loadAll()
    } catch (err) { alert('Error deleting sizes') }
  }

  const toggleColorSelection = (id) => {
    const newSet = new Set(selectedColors)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedColors(newSet)
  }

  const toggleAllColors = () => {
    if (selectedColors.size === colors.length) setSelectedColors(new Set())
    else setSelectedColors(new Set(colors.map(c => c.id)))
  }

  const deleteSelectedColors = async () => {
    if (selectedColors.size === 0) return
    if (!confirm(`Delete ${selectedColors.size} selected color(s)?`)) return
    try {
      for (const id of selectedColors) {
        await adminDeleteColor(id)
      }
      setSelectedColors(new Set())
      loadAll()
    } catch (err) { alert('Error deleting colors') }
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
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={toggleAllStyles}
              className="px-3 py-2 text-xs font-sans rounded border bg-gold text-white border-gold hover:bg-charcoal transition-colors"
            >
              Select All
            </button>
            {selectedStyles.size > 0 && (
              <button 
                onClick={deleteSelectedStyles}
                className="px-3 py-2 text-xs font-sans rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete ({selectedStyles.size})
              </button>
            )}
          </div>
          
          <ul className="space-y-2">
            {styles.map(s => (
              <li key={s.id} className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-gray-100 rounded hover:border-gold transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedStyles.has(s.id)}
                  onChange={() => toggleStyleSelection(s.id)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-sans text-charcoal flex-1">{s.name}</span>
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
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={toggleAllSizes}
              className="px-3 py-2 text-xs font-sans rounded border bg-gold text-white border-gold hover:bg-charcoal transition-colors"
            >
              Select All
            </button>
            {selectedSizes.size > 0 && (
              <button 
                onClick={deleteSelectedSizes}
                className="px-3 py-2 text-xs font-sans rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete ({selectedSizes.size})
              </button>
            )}
          </div>
          
          <ul className="space-y-2">
            {sizes.map(s => (
              <li key={s.id} className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-gray-100 rounded hover:border-gold transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedSizes.has(s.id)}
                  onChange={() => toggleSizeSelection(s.id)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-sans text-charcoal flex-1">{s.name}</span>
                <button onClick={() => handleDeleteSize(s.id)} className="text-red-500 hover:text-red-700 text-sm">×</button>
              </li>
            ))}
            {sizes.length === 0 && <p className="text-xs text-body-gray italic">No sizes added.</p>}
          </ul>
        </div>

        {/* COLORS */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-heading text-charcoal mb-4">Colors</h2>
          
          {/* Input Method Toggle */}
          <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4">
            <button
              onClick={() => handleColorMethodToggle('hex')}
              className={`text-xs font-sans px-3 py-1 rounded ${
                colorInputMethod === 'hex'
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-charcoal hover:bg-gray-200'
              }`}
            >
              Hex Code
            </button>
            <button
              onClick={() => handleColorMethodToggle('rgb')}
              className={`text-xs font-sans px-3 py-1 rounded ${
                colorInputMethod === 'rgb'
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-charcoal hover:bg-gray-200'
              }`}
            >
              RGB Code
            </button>
          </div>
          
          <form onSubmit={handleAddColor} className="flex flex-col gap-2 mb-6">
            <input
              type="text"
              value={newColorName}
              onChange={e => setNewColorName(e.target.value)}
              placeholder="e.g. Ivory"
              className="flex-1 px-3 py-2 border border-gray-200 text-sm font-sans focus:outline-none focus:border-gold"
            />
            
            {colorInputMethod === 'hex' ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newColorHex}
                  onChange={e => handleHexChange(e.target.value)}
                  placeholder="e.g. #FF6B9D"
                  className="flex-1 px-3 py-2 border border-gray-200 text-sm font-sans focus:outline-none focus:border-gold"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={e => handleHexChange(e.target.value)}
                  className="w-10 h-10 p-1 border border-gray-200 cursor-pointer"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-body-gray font-sans block mb-1">Red (0-255)</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={newColorR}
                    onChange={e => handleRgbChange(parseInt(e.target.value) || 0, newColorG, newColorB)}
                    className="w-full px-2 py-2 border border-gray-200 text-sm font-sans focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-body-gray font-sans block mb-1">Green (0-255)</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={newColorG}
                    onChange={e => handleRgbChange(newColorR, parseInt(e.target.value) || 0, newColorB)}
                    className="w-full px-2 py-2 border border-gray-200 text-sm font-sans focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-body-gray font-sans block mb-1">Blue (0-255)</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={newColorB}
                    onChange={e => handleRgbChange(newColorR, newColorG, parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-2 border border-gray-200 text-sm font-sans focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}
            
            <div className="flex gap-2 items-center p-3 bg-gray-50 border border-gray-200 rounded">
              <div className="flex-1">
                <div className="text-xs font-sans text-body-gray">
                  <span className="font-semibold text-charcoal">Hex:</span> <span className="font-mono">{newColorHex}</span>
                </div>
                <div className="text-xs font-sans text-body-gray mt-1">
                  <span className="font-semibold text-charcoal">RGB:</span> <span className="font-mono">({newColorR}, {newColorG}, {newColorB})</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded border-2 border-gray-300 shadow-sm" style={{ backgroundColor: newColorHex }}></div>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-charcoal text-white text-xs font-sans hover:bg-gold transition-colors w-full"
            >
              Add Color
            </button>
          </form>
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={toggleAllColors}
              className="px-3 py-2 text-xs font-sans rounded border bg-gold text-white border-gold hover:bg-charcoal transition-colors"
            >
              Select All
            </button>
            {selectedColors.size > 0 && (
              <button 
                onClick={deleteSelectedColors}
                className="px-3 py-2 text-xs font-sans rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete ({selectedColors.size})
              </button>
            )}
          </div>
          
          <ul className="space-y-2">
            {colors.map(c => (
              <li key={c.id} className="flex items-center gap-3 p-3 bg-[#FAF9F6] border border-gray-100 rounded hover:border-gold transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedColors.has(c.id)}
                  onChange={() => toggleColorSelection(c.id)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div className="flex items-center gap-3 flex-1">
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
