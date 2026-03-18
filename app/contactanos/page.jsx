'use client'
import { useState } from 'react'
import { submitContactForm } from '@/lib/api'

export default function ContactanosPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setStatus(null)

    try {
      await submitContactForm(form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
    }
    setSending(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <span className="section-eyebrow block mb-3">CONTACT</span>
        <h1 className="section-heading">Contact Us</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-200 bg-transparent font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-200 bg-transparent font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 bg-transparent font-body text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">
                Message *
              </label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 bg-transparent font-body text-sm focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            {status === 'success' && (
              <p className="text-green-700 text-sm font-sans">Message sent successfully! We will reply soon.</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-sm font-sans">Error sending message. Please try again.</p>
            )}

            <button type="submit" disabled={sending} className="btn-gold-filled w-full text-center disabled:opacity-50">
              {sending ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-sans text-[11px] font-semibold tracking-[2.5px] text-charcoal uppercase mb-4">Address</h3>
            <p className="font-body text-body-gray text-sm">Almería, Spain</p>
          </div>
          <div>
            <h3 className="font-sans text-[11px] font-semibold tracking-[2.5px] text-charcoal uppercase mb-4">Phone</h3>
            <a href="tel:+34950450518" className="font-body text-body-gray text-sm hover:text-gold transition-colors">+34 950 450 518</a>
          </div>
          <div>
            <h3 className="font-sans text-[11px] font-semibold tracking-[2.5px] text-charcoal uppercase mb-4">Email</h3>
            <a href="mailto:info@mynovia.es" className="font-body text-body-gray text-sm hover:text-gold transition-colors">info@mynovia.es</a>
          </div>
          <div>
            <h3 className="font-sans text-[11px] font-semibold tracking-[2.5px] text-charcoal uppercase mb-4">Hours</h3>
            <div className="font-body text-body-gray text-sm space-y-1">
              <p>Monday - Friday: 10:00 - 14:00, 17:00 - 20:30</p>
              <p>Saturday: 10:00 - 14:00</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          <div className="aspect-video bg-cream overflow-hidden mt-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.8!2d-2.46!3d36.84!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUwJzI0LjAiTiAywrAyNyczNi4wIlc!5e0!3m2!1sen!2ses!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
