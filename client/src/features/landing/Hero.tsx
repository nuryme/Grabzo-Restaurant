import { motion } from 'framer-motion'
import { restaurant } from '../../config'

export function Hero() {
  return (
    // Vertically centered hero (flex + items-center), never anchored top/bottom.
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-cream"
    >
      {/* soft warm background accents — -z-10 keeps them behind the text (absolute elements
          otherwise paint above normal-flow content regardless of DOM order) */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-brand-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-accent-50 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand shadow-sm ring-1 ring-line">
            Scan · Order · Track — no app, no waiting
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
            Order straight
            <br />
            from your <span className="text-brand">table.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-charcoal-soft">{restaurant.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="inline-flex h-14 items-center justify-center rounded-full bg-brand px-8 text-base font-medium text-white transition-colors hover:bg-brand-600"
            >
              View Menu
            </a>
            <a
              href="#contact"
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-medium text-charcoal ring-1 ring-line transition-colors hover:bg-cream"
            >
              Find Us
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=75"
            alt="Grabzo signature burger with fries"
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-2xl md:aspect-square"
            loading="eager"
          />
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-line sm:block">
            <p className="font-heading text-2xl font-bold text-charcoal">~12 min</p>
            <p className="text-sm text-charcoal-muted">avg. to your table</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
