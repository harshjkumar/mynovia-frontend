export const metadata = {
  title: 'Reserva tu Cita — My Novia',
  description: 'Reserva una cita privada en My Novia para encontrar el vestido de tus sueños en Almería.'
}

export default function AgendaCitaPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="section-eyebrow block mb-3">RESERVAR</span>
        <h1 className="section-heading mb-4">Reserva tu <em>Cita</em></h1>
        <p className="font-body text-body-gray max-w-xl mx-auto">
          Vive una experiencia exclusiva y personal. Nuestro equipo se dedicará
          a ayudarte a encontrar el vestido perfecto para tu gran día.
        </p>
      </div>

      <div className="w-full bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex flex-col items-center">
        <iframe
          src="https://app.bridallive.com/forms.html?formType=scheduler&retailerId=90ed22fa&lang=es"
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
          <h3 className="font-sans text-sm font-semibold tracking-wider text-charcoal uppercase mb-2">Prueba Exclusiva</h3>
          <p className="font-body text-xs text-body-gray">Probador privado con atención personalizada</p>
        </div>
        <div className="p-6">
          <div className="text-gold text-3xl mb-3">💎</div>
          <h3 className="font-sans text-sm font-semibold tracking-wider text-charcoal uppercase mb-2">Asesoramiento</h3>
          <p className="font-body text-xs text-body-gray">Expertas en moda nupcial a tu servicio</p>
        </div>
        <div className="p-6">
          <div className="text-gold text-3xl mb-3">🥂</div>
          <h3 className="font-sans text-sm font-semibold tracking-wider text-charcoal uppercase mb-2">Experiencia VIP</h3>
          <p className="font-body text-xs text-body-gray">Un momento especial para ti y tus acompañantes</p>
        </div>
      </div>
    </div>
  )
}
