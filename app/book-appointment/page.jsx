export const metadata = {
  title: 'Book your Appointment — My Novia',
  description: 'Book a private appointment at My Novia to find your dream dress in Almería.'
}

export default function BookAppointmentPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <span className="section-eyebrow block mb-3">BOOK</span>
        <h1 className="section-heading mb-4">Book your <em>Appointment</em></h1>
        <p className="font-body text-body-gray max-w-xl mx-auto">
          Live an exclusive and personal experience. Our team will be dedicated
          to helping you find the perfect dress for your big day.
        </p>
      </div>

      <div className="bg-cream p-8 lg:p-12 border border-bar-tan/30 text-center">
        <div className="space-y-6 max-w-lg mx-auto">
          <p className="font-body text-body-gray text-sm">
            To book your appointment, you can contact us directly:
          </p>
          <div className="space-y-3">
            <a
              href="tel:+34950450518"
              className="block font-heading text-2xl text-charcoal hover:text-gold transition-colors"
            >
              +34 950 450 518
            </a>
            <a
              href="mailto:info@mynovia.es"
              className="block font-body text-body-gray hover:text-gold transition-colors"
            >
              info@mynovia.es
            </a>
          </div>

          <div className="w-16 h-px bg-gold mx-auto my-8" />

          <p className="font-body text-body-gray text-sm">
            You can also visit us at our boutique in Almería.
            We recommend booking in advance to guarantee
            completely personalized attention.
          </p>

          <div className="pt-4">
            <a href="/contact" className="btn-gold">
              CONTACT US
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6">
          <div className="text-gold text-3xl mb-3">👗</div>
          <h3 className="font-sans text-sm font-semibold tracking-wider text-charcoal uppercase mb-2">Exclusive Fitting</h3>
          <p className="font-body text-xs text-body-gray">Private fitting room with personalized attention</p>
        </div>
        <div className="p-6">
          <div className="text-gold text-3xl mb-3">💎</div>
          <h3 className="font-sans text-sm font-semibold tracking-wider text-charcoal uppercase mb-2">Advice</h3>
          <p className="font-body text-xs text-body-gray">Bridal fashion experts at your service</p>
        </div>
        <div className="p-6">
          <div className="text-gold text-3xl mb-3">🥂</div>
          <h3 className="font-sans text-sm font-semibold tracking-wider text-charcoal uppercase mb-2">VIP Experience</h3>
          <p className="font-body text-xs text-body-gray">A special moment for you and your companions</p>
        </div>
      </div>
    </div>
  )
}
