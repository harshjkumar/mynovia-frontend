export const metadata = {
  title: 'Book your Appointment — My Novia',
  description: 'Book a private appointment at My Novia to find your dream dress in Almería.'
}

export default function BookAppointmentPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="section-eyebrow block mb-3">BOOK</span>
        <h1 className="section-heading mb-4">Book your <em>Appointment</em></h1>
        <p className="font-body text-body-gray max-w-xl mx-auto">
          Live an exclusive and personal experience. Our team will be dedicated
          to helping you find the perfect dress for your big day.
        </p>
      </div>

      <div className="w-full bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex flex-col items-center">
        <iframe
          src="https://app.bridallive.com/forms.html?formType=scheduler&retailerId=90ed22fa&lang=en"
          width="100%"
          height="800"
          frameBorder="0"
          className="w-full bg-transparent min-h-[800px]"
          title="BridalLive Appointment Scheduler"
          style={{ border: 'none' }}
        />
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-12 border-t border-gray-200">
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
