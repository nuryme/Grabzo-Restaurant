import { Container } from '../../components/ui/Container'

const points = [
  {
    title: 'No app, no login',
    body: 'Scan the QR at your table and the menu opens instantly. Order in under a minute.',
    icon: 'M12 2 3 7v6c0 5 3.8 8.5 9 9 5.2-.5 9-4 9-9V7l-9-5Z',
  },
  {
    title: 'Live order tracking',
    body: 'Watch your order go from the kitchen to your table in real time — no flagging down staff.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  {
    title: 'Fresh & fast',
    body: 'Orders hit the kitchen the second you confirm, so your food is made to order and arrives hot.',
    icon: 'm13 2-3 7h5l-3 9 8-11h-5l3-5z',
  },
]

export function WhyUs() {
  return (
    <section id="about" className="bg-charcoal py-20 text-white sm:py-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-brand-400">
              Why Grabzo
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A better way to eat out
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              We built Grabzo around one idea: ordering should be the easiest part of your meal.
              Scan, choose, and relax — the kitchen takes it from there.
            </p>
          </div>

          <div className="grid gap-5">
            {points.map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-brand-400">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={p.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
