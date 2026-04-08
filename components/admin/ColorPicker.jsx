'use client'
import { useState, useRef, useEffect } from 'react'

export default function ColorPicker({ color, onChange }) {
  const [hex, setHex] = useState(color || '#FF6B9D')
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef(null)
  const canvasRef = useRef(null)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [brightness, setBrightness] = useState(100)
  const [alpha, setAlpha] = useState(100)

  // Color presets matching Coloris style
  const colorPresets = [
    '#FF6B9D', '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FF8800',
    '#FF4500', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00', '#FFB347',
    '#CCAA44', '#DAA520', '#B8860B', '#CD853F', '#8B7355', '#A0522D',
    '#FFFFFF', '#F0F0F0', '#D3D3D3', '#A9A9A9', '#808080', '#696969',
    '#505050', '#333333', '#1a1a1a', '#000000', '#2F4F4F', '#00008B',
    '#191970', '#4B0082', '#0000CD', '#0000FF', '#4169E1', '#6495ED',
    '#87CEEB', '#00CED1', '#20B2AA', '#008B8B', '#006666', '#336666',
    '#00FF00', '#90EE90', '#98FB98', '#00FA9A', '#00FF7F', '#3CB371',
  ]

  // Convert HEX to HSV
  const hexToHSV = (hexColor) => {
    let hex = hexColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const v = max

    if (max !== min) {
      const d = max - min
      s = max === 0 ? 0 : d / max

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    }
  }

  // Convert HSV to HEX
  const hsvToHex = (h, s, v) => {
    const c = (v / 100) * (s / 100)
    const hPrime = (h / 60) % 6
    const x = c * (1 - Math.abs((hPrime % 2) - 1))
    const m = v / 100 - c

    let r, g, b

    if (hPrime < 1) {
      r = c
      g = x
      b = 0
    } else if (hPrime < 2) {
      r = x
      g = c
      b = 0
    } else if (hPrime < 3) {
      r = 0
      g = c
      b = x
    } else if (hPrime < 4) {
      r = 0
      g = x
      b = c
    } else if (hPrime < 5) {
      r = x
      g = 0
      b = c
    } else {
      r = c
      g = 0
      b = x
    }

    const toHex = (val) => {
      const hex = Math.round((val + m) * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
  }

  useEffect(() => {
    setHex(color || '#FF6B9D')
    const hsv = hexToHSV(color || '#FF6B9D')
    setHue(hsv.h)
    setSaturation(hsv.s)
    setBrightness(hsv.v)
  }, [color])

  // Draw color gradient on canvas
  useEffect(() => {
    if (!showPicker || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Draw saturation/brightness gradient with current hue
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const sat = (x / width) * 100
        const bri = ((height - y) / height) * 100

        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${bri}%)`
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }, [showPicker, hue])

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSat = (x / rect.width) * 100
    const newBri = ((rect.height - y) / rect.height) * 100

    setSaturation(newSat)
    setBrightness(newBri)

    const newHex = hsvToHex(hue, newSat, newBri)
    setHex(newHex)
    onChange(newHex)
  }

  const handleHueChange = (e) => {
    const newHue = parseInt(e.target.value)
    setHue(newHue)

    const newHex = hsvToHex(newHue, saturation, brightness)
    setHex(newHex)
    onChange(newHex)
  }

  const handleHexChange = (e) => {
    const value = e.target.value.toUpperCase()
    setHex(value)
    if (value.length === 7 && value.startsWith('#')) {
      onChange(value)
      const hsv = hexToHSV(value)
      setHue(hsv.h)
      setSaturation(hsv.s)
      setBrightness(hsv.v)
    }
  }

  const handlePresetClick = (preset) => {
    setHex(preset)
    onChange(preset)
    const hsv = hexToHSV(preset)
    setHue(hsv.h)
    setSaturation(hsv.s)
    setBrightness(hsv.v)
  }

  const handleColorInputChange = (e) => {
    const value = e.target.value
    setHex(value)
    onChange(value)
    const hsv = hexToHSV(value)
    setHue(hsv.h)
    setSaturation(hsv.s)
    setBrightness(hsv.v)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  const markerLeft = (saturation / 100) * 100
  const markerTop = ((100 - brightness) / 100) * 100

  return (
    <div className="relative">
      {/* Color Input and Preview */}
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="relative w-14 h-14 rounded-lg border-2 border-gray-300 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden group flex-shrink-0"
          style={{ backgroundColor: hex }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={hex}
            onChange={handleHexChange}
            placeholder="#FF6B9D"
            className="flex-1 px-3 py-2 border-2 border-gray-200 text-sm font-mono rounded focus:outline-none focus:border-gold"
            maxLength="7"
          />
          <input
            type="color"
            value={hex}
            onChange={handleColorInputChange}
            className="w-14 h-14 p-1 border-2 border-gray-200 rounded cursor-pointer flex-shrink-0"
          />
        </div>
      </div>

      {/* Color Picker Dropdown */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-50 bg-white rounded-lg shadow-2xl p-4 border border-gray-200 w-96 mt-2 space-y-4"
        >
          {/* Color Gradient Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-charcoal uppercase tracking-wide block">Color Area</label>
            <div className="relative h-48 border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={300}
                height={180}
                onClick={handleCanvasClick}
                className="w-full h-full cursor-crosshair block"
              />
              {/* Color Marker */}
              <div
                className="absolute w-6 h-6 border-2 border-white rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${markerLeft}%`,
                  top: `${markerTop}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.2), 0 0 5px rgba(0,0,0,0.3)',
                }}
              />
            </div>
          </div>

          {/* Hue Slider */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-charcoal uppercase tracking-wide block">Hue</label>
            <div className="relative h-8 rounded-lg overflow-hidden border-2 border-gray-200">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), 
                    hsl(60, 100%, 50%), 
                    hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), 
                    hsl(240, 100%, 50%), 
                    hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%))`,
                }}
              />
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={handleHueChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {/* Hue Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white"
                style={{
                  left: `${(hue / 360) * 100}%`,
                  pointerEvents: 'none',
                  boxShadow: '0 0 3px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          </div>

          {/* Alpha Slider */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-charcoal uppercase tracking-wide block">Opacity</label>
            <div className="relative h-8 rounded-lg overflow-hidden border-2 border-gray-200">
              <div
                className="absolute inset-0 checkered-bg"
                style={{
                  backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                      linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                      linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                      linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  backgroundColor: '#fff',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, ${hex}00, ${hex}FF)`,
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={alpha}
                onChange={(e) => setAlpha(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {/* Alpha Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white"
                style={{
                  left: `${alpha}%`,
                  pointerEvents: 'none',
                  boxShadow: '0 0 3px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-charcoal uppercase tracking-wide block">Quick Colors</label>
            <div className="grid grid-cols-6 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="w-full aspect-square rounded-lg border-2 border-gray-300 hover:border-gold transition-all hover:scale-110 relative"
                  style={{ backgroundColor: preset }}
                >
                  {hex === preset && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border-2 border-white shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
