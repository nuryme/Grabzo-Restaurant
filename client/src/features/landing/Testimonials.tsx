import { Container } from '../../components/ui/Container'

const reviews = [
  {
    quote: 'Scanned the code, ordered, and the food came out faster than anywhere else. So simple.',
    name: 'Ayesha R.',
    role: 'Regular',
  },
  {
    quote: 'Watching the order status update on my phone is oddly satisfying. No more waving at waiters.',
    name: 'Tanvir H.',
    role: 'First-timer',
  },
  {
    quote: 'The burgers are unreal and I never had to wait for a menu. This is how it should be.',
    name: 'Nabila K.',
    role: 'Foodie',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mb-12 text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-brand">
            Loved by guests
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Don't take our word for it
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col rounded-2xl bg-cream p-6 ring-1 ring-line"
            >
              <div className="mb-3 flex gap-1 text-brand" aria-hidden>
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <blockquote className="flex-1 text-charcoal-soft">"{r.quote}"</blockquote>
              <figcaption className="mt-5 font-heading text-sm font-semibold text-charcoal">
                {r.name}
                <span className="ml-2 font-body font-normal text-charcoal-muted">{r.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}
