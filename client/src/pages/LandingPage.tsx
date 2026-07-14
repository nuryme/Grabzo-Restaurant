import { Navbar } from '../features/landing/Navbar'
import { Hero } from '../features/landing/Hero'
import { FeaturedDishes } from '../features/landing/FeaturedDishes'
import { WhyUs } from '../features/landing/WhyUs'
import { Testimonials } from '../features/landing/Testimonials'
import { Contact } from '../features/landing/Contact'
import { Footer } from '../features/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedDishes />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
