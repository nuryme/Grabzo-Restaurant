import { Container } from '../../components/ui/Container'
import { taka } from '../../lib/format'
import { useFeatured } from '../menu/useMenu'

export function FeaturedDishes() {
  const { data: dishes } = useFeatured()

  return (
    <section id="menu" className="py-20 sm:py-28">
      <Container>
        <div className="mb-12 text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-brand">
            Fan favourites
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            The dishes people come back for
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((d) => (
            // Card is a flex column; every row is fixed-height so cards align.
            <article
              key={d._id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-shadow hover:shadow-lg"
            >
              <img
                src={d.imageUrl}
                alt={d.name}
                loading="lazy"
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-1 font-heading text-lg font-semibold text-charcoal">
                  {d.name}
                </h3>
                <p className="mt-1 line-clamp-2 h-10 text-sm text-charcoal-muted">
                  {d.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="font-heading text-lg font-bold text-charcoal">
                    {taka(d.price)}
                  </span>
                  <span className="text-xs font-medium text-charcoal-muted">
                    {d.prepTimeMin} min
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-charcoal-muted">
          Scan the QR code at your table to see the full menu and order.
        </p>
      </Container>
    </section>
  )
}
