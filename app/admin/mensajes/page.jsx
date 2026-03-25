'use client'
import { useState, useEffect } from 'react'
import { adminGetContactMessages } from '@/lib/api'

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedMsg, setSelectedMsg] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    setLoading(true)
    try {
      const data = await adminGetContactMessages()
      setMessages(data || [])
    } catch (err) {
      console.error('Error loading contact messages:', err)
    }
    setLoading(false)
  }

  const filtered = messages.filter(m =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.phone || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.message || '').toLowerCase().includes(search.toLowerCase())
  )

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading text-charcoal">Contact Messages</h1>
        <button
          onClick={loadMessages}
          className="px-4 py-2 text-xs font-sans bg-charcoal text-white hover:bg-gold transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, phone or message..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
          <p className="text-body-gray font-sans text-sm">
            {messages.length === 0 ? 'No contact messages yet.' : 'No messages match your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray">Name</th>
                  <th className="px-6 py-3 text-left text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray">Email</th>
                  <th className="px-6 py-3 text-left text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray">Phone</th>
                  <th className="px-6 py-3 text-left text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray">Message</th>
                  <th className="px-6 py-3 text-left text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray">Date</th>
                  <th className="px-6 py-3 text-left text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(msg => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-sans text-charcoal font-medium whitespace-nowrap">{msg.name}</td>
                    <td className="px-6 py-4 text-sm font-sans text-body-gray">
                      <a href={`mailto:${msg.email}`} className="hover:text-gold transition-colors">{msg.email}</a>
                    </td>
                    <td className="px-6 py-4 text-sm font-sans text-body-gray whitespace-nowrap">{msg.phone || '—'}</td>
                    <td className="px-6 py-4 text-sm font-sans text-body-gray max-w-xs truncate">{msg.message}</td>
                    <td className="px-6 py-4 text-xs font-sans text-body-gray whitespace-nowrap">{formatDate(msg.created_at)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedMsg(msg)}
                        className="text-xs font-sans text-gold hover:text-charcoal transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs font-sans text-body-gray">
              Showing {filtered.length} of {messages.length} messages
            </p>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedMsg(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-sans text-sm font-semibold text-charcoal">Message Details</h3>
              <button onClick={() => setSelectedMsg(null)} className="text-body-gray hover:text-charcoal text-lg">×</button>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray mb-1">Name</label>
                <p className="text-sm font-sans text-charcoal">{selectedMsg.name}</p>
              </div>
              <div>
                <label className="block text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray mb-1">Email</label>
                <p className="text-sm font-sans text-charcoal">
                  <a href={`mailto:${selectedMsg.email}`} className="text-gold hover:underline">{selectedMsg.email}</a>
                </p>
              </div>
              {selectedMsg.phone && (
                <div>
                  <label className="block text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray mb-1">Phone</label>
                  <p className="text-sm font-sans text-charcoal">{selectedMsg.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray mb-1">Message</label>
                <p className="text-sm font-sans text-charcoal whitespace-pre-wrap leading-relaxed">{selectedMsg.message}</p>
              </div>
              <div>
                <label className="block text-[10px] font-sans font-semibold tracking-wider uppercase text-body-gray mb-1">Received</label>
                <p className="text-sm font-sans text-body-gray">{formatDate(selectedMsg.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
