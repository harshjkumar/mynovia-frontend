const IK_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/mynovia'

export function ikUrl(path, transforms = '') {
  if (!path) return '/placeholder.jpg'
  if (path.startsWith('http')) {
    if (transforms && path.includes('ik.imagekit.io')) {
      return path.includes('?') ? `${path}&${transforms}` : `${path}?${transforms}`
    }
    return path
  }
  const base = `${IK_URL}/${path.replace(/^\//, '')}`
  return transforms ? `${base}?${transforms}` : base
}

export function ikThumb(url) {
  return ikUrl(url, 'tr=w-400,h-500,fo-auto')
}

export function ikDetail(url) {
  return ikUrl(url, 'tr=w-900,fo-auto')
}

export function ikGallery(url) {
  return ikUrl(url, 'tr=w-600,h-750,fo-auto,c-maintain_ratio')
}

export function ikHero(url) {
  return ikUrl(url, 'tr=w-1920,h-900,fo-auto')
}
