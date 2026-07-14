import { Container } from '../../components/ui/Container'
import { restaurant } from '../../config'

export function Footer() {
  return (
    <footer className="bg-charcoal py-12 text-white">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-heading text-2xl font-bold">
              {restaurant.name}
              <span className="text-brand">.</span>
            </p>
            <p className="mt-1 text-sm text-white/50">{restaurant.address}</p>
          </div>
          <nav className="flex gap-6 text-sm text-white/70">
            <a href="#menu" className="hover:text-white">Menu</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
