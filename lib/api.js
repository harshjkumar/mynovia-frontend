import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mynovia_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAdminRoute = window.location.pathname.startsWith('/admin')
      const isLoginPage = window.location.pathname === '/admin/login'
      if (isAdminRoute && !isLoginPage) {
        localStorage.removeItem('mynovia_token')
        localStorage.removeItem('mynovia_user')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export async function fetchDresses(params = {}) {
  const { data } = await api.get('/dresses', { params })
  return data
}

export async function fetchDressBySlug(slug) {
  const { data } = await api.get(`/dresses/${slug}`)
  return data
}

export async function fetchAccessories(params = {}) {
  const { data } = await api.get('/accessories', { params })
  return data
}

export async function fetchSections() {
  const { data } = await api.get('/sections')
  return data
}

export async function fetchPageContent(slug) {
  const { data } = await api.get(`/content/${slug}`)
  return data
}

export async function fetchReviews() {
  const { data } = await api.get('/reviews')
  return data
}

export async function fetchCategories(type) {
  const { data } = await api.get('/categories', { params: type ? { type } : {} })
  return data
}

export async function fetchTags() {
  const { data } = await api.get('/tags')
  return data
}

export async function getMediaLibrary() {
  const { data } = await api.get('/media')
  return data
}

// ---------------------------------------------------------
// Variants API (Styles, Sizes, Colors, and Dress Variants)
// ---------------------------------------------------------

export async function adminGetStyles() {
  const { data } = await api.get('/variants/styles')
  return data
}
export async function adminCreateStyle(payload) {
  const { data } = await api.post('/variants/styles', payload)
  return data
}
export async function adminDeleteStyle(id) {
  const { data } = await api.delete(`/variants/styles/${id}`)
  return data
}

export async function adminGetSizes() {
  const { data } = await api.get('/variants/sizes')
  return data
}
export async function adminCreateSize(payload) {
  const { data } = await api.post('/variants/sizes', payload)
  return data
}
export async function adminDeleteSize(id) {
  const { data } = await api.delete(`/variants/sizes/${id}`)
  return data
}

export async function adminGetColors() {
  const { data } = await api.get('/variants/colors')
  return data
}
export async function adminCreateColor(payload) {
  const { data } = await api.post('/variants/colors', payload)
  return data
}
export async function adminDeleteColor(id) {
  const { data } = await api.delete(`/variants/colors/${id}`)
  return data
}

export async function getDressVariants(dressId) {
  const { data } = await api.get(`/variants/dress/${dressId}`)
  return data
}

export async function adminSaveDressVariants(dressId, variants) {
  const { data } = await api.post(`/variants/dress/${dressId}`, { variants })
  return data
}

export async function fetchMedia(folder) {
  const { data } = await api.get('/admin/media', { params: folder ? { folder } : {} })
  return data
}

export async function submitContactForm(formData) {
  const { data } = await api.post('/contact', formData)
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function adminGetDresses() {
  const { data } = await api.get('/admin/dresses')
  return data
}

export async function adminCreateDress(dressData) {
  const { data } = await api.post('/admin/dresses', dressData)
  return data
}

export async function adminUpdateDress(id, dressData) {
  const { data } = await api.put(`/admin/dresses/${id}`, dressData)
  return data
}

export async function adminDeleteDress(id) {
  const { data } = await api.delete(`/admin/dresses/${id}`)
  return data
}

export async function adminUploadDressImage(dressId, file, order = 0) {
  const fd = new FormData()
  fd.append('image', file)
  fd.append('display_order', order)
  const { data } = await api.post(`/admin/dresses/${dressId}/images`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function adminDeleteDressImage(imageId) {
  const { data } = await api.delete(`/admin/dresses/images/${imageId}`)
  return data
}

export async function adminGetAccessories() {
  const { data } = await api.get('/admin/accessories')
  return data
}

export async function adminCreateAccessory(accData) {
  const { data } = await api.post('/admin/accessories', accData)
  return data
}

export async function adminUpdateAccessory(id, accData) {
  const { data } = await api.put(`/admin/accessories/${id}`, accData)
  return data
}

export async function adminDeleteAccessory(id) {
  const { data } = await api.delete(`/admin/accessories/${id}`)
  return data
}

export async function adminUploadAccessoryImage(accId, file, order = 0) {
  const fd = new FormData()
  fd.append('image', file)
  fd.append('display_order', order)
  const { data } = await api.post(`/admin/accessories/${accId}/images`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function adminGetReviews(status) {
  const { data } = await api.get('/admin/reviews', { params: status ? { status } : {} })
  return data
}

export async function adminSyncReviews() {
  const { data } = await api.post('/admin/reviews/sync')
  return data
}

export async function adminUpdateReview(id, approved) {
  const { data } = await api.put(`/admin/reviews/${id}`, { approved })
  return data
}

export async function adminUpdateContent(slug, content) {
  const { data } = await api.put(`/admin/content/${slug}`, content)
  return data
}

export async function adminUpdateSection(name, content) {
  const { data } = await api.put(`/admin/sections/${name}`, { content })
  return data
}

export async function adminCreateCategory(categoryData) {
  const isFormData = categoryData instanceof FormData
  const { data } = await api.post('/admin/categories', categoryData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
  })
  return data
}

export async function adminUpdateCategory(id, categoryData) {
  const isFormData = categoryData instanceof FormData
  const { data } = await api.put(`/admin/categories/${id}`, categoryData, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
  })
  return data
}

export async function adminDeleteCategory(id) {
  const { data } = await api.delete(`/admin/categories/${id}`)
  return data
}

export async function adminUploadMedia(file, folder = 'general') {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', folder)
  const { data } = await api.post('/admin/media/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function adminDeleteMedia(id) {
  const { data } = await api.delete(`/admin/media/${id}`)
  return data
}

export async function adminGetContactMessages() {
  const { data } = await api.get('/admin/contact-messages')
  return data
}

// Page Heroes API
export async function getPageHero(pageType) {
  try {
    const { data } = await api.get(`/page-heroes/${pageType}`)
    return data
  } catch (err) {
    return { image_url: null, title: '', description: '' }
  }
}

export async function adminUpdatePageHero(pageType, heroData) {
  const { data } = await api.put(`/admin/page-heroes/${pageType}`, heroData)
  return data
}

export async function adminUploadPageHeroImage(pageType, file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('pageType', pageType)
  const { data } = await api.post(`/admin/media/upload`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data.url || data.image_url
}

export async function adminDeletePageHeroImage(pageType) {
  const { data } = await api.delete(`/admin/page-heroes/${pageType}`)
  return data
}

export default api
