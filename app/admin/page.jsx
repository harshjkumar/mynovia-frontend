'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getMe } from '@/lib/api'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getMe().then(setUser).catch(() => {})
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-charcoal mb-2">
          Welcome back, {user?.name || 'Admin'}
        </h1>
        <p className="text-body-gray font-sans">
          This is your My Novia control center. Manage your collections, content, and customer interactions from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <DashboardCard 
          title="Dresses" 
          desc="Manage your bridal gown collection"
          link="/admin/vestidos"
          icon="👗"
        />
        <DashboardCard 
          title="Accessories" 
          desc="Manage veils, tiaras, and other accessories"
          link="/admin/accesorios"
          icon="💍"
        />
        <DashboardCard 
          title="Content" 
          desc="Update website text and hero images"
          link="/admin/contenido"
          icon="📝"
        />
        <DashboardCard 
          title="Reviews" 
          desc="Manage Google Maps reviews"
          link="/admin/resenas"
          icon="⭐"
        />
        <DashboardCard 
          title="Messages" 
          desc="View contact form submissions"
          link="/admin/mensajes"
          icon="📬"
        />
        <DashboardCard 
          title="Gallery" 
          desc="Upload and manage site media"
          link="/admin/media"
          icon="🖼️"
        />
      </div>
    </div>
  )
}

function DashboardCard({ title, desc, link, icon }) {
  return (
    <Link href={link} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold/30 transition-all group flex flex-col gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <h3 className="text-lg font-sans font-semibold text-charcoal group-hover:text-gold transition-colors">{title}</h3>
        <p className="text-sm font-sans text-body-gray mt-1">{desc}</p>
      </div>
    </Link>
  )
}
