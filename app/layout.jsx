import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'My Novia — Your Bridal Boutique in Almería',
  description: 'Discover unique wedding dresses at My Novia. Your favorite boutique in Almería with exclusive collections for your special day.',
  keywords: 'wedding dresses, bridal, Almería, boutique, wedding, bride',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F6]">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
