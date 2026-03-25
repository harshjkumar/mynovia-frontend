'use client'
import { useState, useEffect } from 'react'
import { adminGetReviews, adminUpdateReview, adminSyncReviews } from '@/lib/api'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [syncing, setSyncing] = useState(false)

  useEffect(() => { load() }, [filter])

  async function load() {
    setLoading(true)
    try {
      const data = await adminGetReviews(filter === 'all' ? undefined : filter)
      setReviews(data)
    } catch {}
    setLoading(false)
  }

  async function handleApprove(id) { await adminUpdateReview(id, true); load() }
  async function handleReject(id) { await adminUpdateReview(id, false); load() }

  async function handleSync() {
    setSyncing(true)
    try { await adminSyncReviews(); load() } catch {}
    setSyncing(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading text-charcoal">Reviews</h1>
        <button onClick={handleSync} disabled={syncing} className="btn-gold text-[10px]">
          {syncing ? 'SYNC...' : '🔄 SYNC GOOGLE'}
        </button>
      </div>
      <div className="flex gap-2 mb-6">
        {['all','pending','approved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-sans border ${filter===f ? 'bg-charcoal text-white border-charcoal' : 'border-gray-300 text-body-gray'}`}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-sans text-body-gray uppercase">Author</th>
              <th className="text-left px-6 py-3 text-xs font-sans text-body-gray uppercase">Rating</th>
              <th className="text-left px-6 py-3 text-xs font-sans text-body-gray uppercase hidden md:table-cell">Text</th>
              <th className="text-left px-6 py-3 text-xs font-sans text-body-gray uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={4} className="px-6 py-8 text-center text-body-gray">Loading...</td></tr>
            : reviews.length === 0 ? <tr><td colSpan={4} className="px-6 py-8 text-center text-body-gray">No reviews</td></tr>
            : reviews.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-charcoal">{r.author_name}</td>
                <td className="px-6 py-3 text-gold">{'★'.repeat(r.rating||0)}</td>
                <td className="px-6 py-3 text-body-gray text-xs max-w-xs truncate hidden md:table-cell">{r.review_text}</td>
                <td className="px-6 py-3">
                  {!r.is_approved && <button onClick={() => handleApprove(r.id)} className="text-xs text-green-600 hover:underline mr-2">Approve</button>}
                  {r.is_approved && <button onClick={() => handleReject(r.id)} className="text-xs text-red-500 hover:underline">Reject</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
