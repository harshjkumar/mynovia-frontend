'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthed(true)
      return
    }

    const token = localStorage.getItem('mynovia_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const u = JSON.parse(localStorage.getItem('mynovia_user') || '{}')
      setUser(u)
      setAuthed(true)
    } catch {
      router.push('/admin/login')
    }
  }, [pathname, router])

  if (!authed) return null

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  function handleLogout() {
    localStorage.removeItem('mynovia_token')
    localStorage.removeItem('mynovia_user')
    router.push('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="font-sans text-sm font-medium text-charcoal">
            Welcome, <span className="text-gold">{user?.name || 'Admin'}</span>
          </h2>
          <button onClick={handleLogout} className="text-xs font-sans text-body-gray hover:text-red-500 transition-colors">
            Logout
          </button>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
