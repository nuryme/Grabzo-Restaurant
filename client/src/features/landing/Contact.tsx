import { Container } from '../../components/ui/Container'
import { restaurant } from '../../config'

const rows = [
  { label: 'Address', value: restaurant.address, icon: 'M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11Z M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z' },
  { label: 'Hours', value: restaurant.hours, icon: 'M12 8v4l3 3 m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  { label: 'Phone', value: restaurant.phone, icon: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2Z' },
]

export function Contact() {
  return (
    <section id="contact" className="bg-cream py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-stretch">
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-brand">
              Come by
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Find us
            </h2>
            <div className="mt-8 space-y-5">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand ring-1 ring-line">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={r.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal-muted">{r.label}</p>
                    <p className="font-medium text-charcoal">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-2xl ring-1 ring-line">
            <iframe
              title={`Map to ${restaurant.name}`}
              src={restaurant.mapEmbedUrl}
              className="h-full min-h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
