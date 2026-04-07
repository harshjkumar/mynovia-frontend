export const metadata = {
  title: 'Book your Appointment — My Novia',
  description: 'Book a private appointment at My Novia to find your dream dress in Almería.'
}

export default function BookAppointmentPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <span className="section-eyebrow block mb-4">BOOK</span>
        <h1 className="section-heading mb-4">Book your <em>Appointment</em></h1>
        <p className="font-body text-body-gray max-w-xl mx-auto text-sm">
          Live an exclusive and personal experience. Our team will be dedicated
          to helping you find the perfect dress for your big day.
        </p>
      </div>

      <div className="w-full border-4 border-gold rounded-lg overflow-hidden bg-white shadow-md mt-6">
        <iframe
          src="https://app.bridallive.com/forms.html?formType=scheduler&retailerId=90ed22fa&lang=en"
          width="100%"
          height="1000"
          frameBorder="0"
          className="w-full min-h-[1000px]"
          title="BridalLive Appointment Scheduler"
          style={{ border: 'none', display: 'block' }}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8 border-t border-gray-200">
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
