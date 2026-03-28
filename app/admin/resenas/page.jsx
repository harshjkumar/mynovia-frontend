'use client'
import { useState, useEffect } from 'react'
import { adminGetReviews, adminUpdateReview, adminSyncReviews } from '@/lib/api'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [syncing, setSyncing] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => { load() }, [filter])

  async function load() {
    setLoading(true)
    try {
      const data = await adminGetReviews(filter === 'all' ? undefined : filter)
      setReviews(data)
    } catch {}
    setLoading(false)
  }

  async function toggleApproval(r) {
    if (r.is_approved) {
      await adminUpdateReview(r.id, false);
    } else {
      await adminUpdateReview(r.id, true);
    }
    load()
  }

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
              <th className="text-left px-6 py-3 text-xs font-sans text-body-gray uppercase">Date</th>
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
                <td className="px-6 py-3 text-body-gray text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-body-gray text-xs max-w-xs truncate hidden md:table-cell">{r.review_text}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedReview(r)} className="text-xs font-sans text-body-gray hover:text-gold uppercase tracking-wider">
                      View
                    </button>
                    <button onClick={() => toggleApproval(r)} className={`w-10 h-5 rounded-full relative transition-colors ${r.is_approved ? 'bg-gold' : 'bg-gray-300'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${r.is_approved ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-heading text-charcoal mb-4">Review Details</h2>
            <div className="mb-4">
              <p className="text-xs font-sans text-body-gray uppercase">Author</p>
              <p className="font-medium text-charcoal">{selectedReview.author_name}</p>
            </div>
            <div className="mb-4">
              <p className="text-xs font-sans text-body-gray uppercase">Rating</p>
              <p className="text-gold">{'★'.repeat(selectedReview.rating || 0)}</p>
            </div>
            <div className="mb-6">
              <p className="text-xs font-sans text-body-gray uppercase">Text</p>
              <p className="text-body-gray text-sm mt-1 whitespace-pre-wrap">{selectedReview.review_text}</p>
            </div>
            <button onClick={() => setSelectedReview(null)} className="btn-gold-filled w-full text-center py-3 text-xs">CLOSE</button>
          </div>
        </div>
      )}
    </div>
  )
}
