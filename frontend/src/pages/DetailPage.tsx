import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchMenuItem, type ApiMenuItem } from '../api'
import { Icon } from '../components/Icon'

export function DetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState<ApiMenuItem | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchMenuItem(id)
      .then(setItem)
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="text-muted">Toodet ei leitud.</p>
        <Link to="/menuu" className="mt-4 inline-block text-accent">
          ← Tagasi menüüsse
        </Link>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="px-6 py-24 text-center text-muted">Laadimine...</div>
    )
  }

  return (
    <div className="pb-24">
      <div className="mx-auto flex max-w-[1252px] items-center px-6 pt-6 lg:px-0">
        <Link
          to="/menuu"
          className="text-[16px] font-medium uppercase text-text hover:text-accent"
        >
          ← Tagasi
        </Link>
      </div>

      <section className="mx-auto mt-12 flex max-w-[1252px] flex-col gap-12 px-6 lg:flex-row lg:gap-8 lg:px-0">
        <img
          src={item.image}
          alt={item.name}
          className="size-[610px] max-w-full shrink-0 rounded-[3px] object-cover"
        />

        <div className="flex max-w-[612px] flex-col gap-8">
          <div>
            <p className="text-[16px] font-medium uppercase tracking-[-0.16px] text-accent">
              {item.category}
            </p>
            <h1 className="mt-3 font-serif text-[48px] text-text">{item.name}</h1>
            <p className="mt-3 text-[24px] uppercase tracking-[-0.24px] text-accent">
              {item.price}€
            </p>
            <p className="mt-6 text-[16px] text-muted">{item.description}</p>
          </div>

          <div className="h-px bg-muted/30" />

          <div>
            <h2 className="font-serif text-[16px] font-semibold uppercase text-text">
              Vürtsikus
            </h2>
            {item.spiciness > 0 ? (
              <p className="mt-3 flex gap-1 text-[14px] text-muted">
                {Array.from({ length: item.spiciness }).map((_, i) => (
                  <span key={i}>🌶️</span>
                ))}
                <span className="ml-1">({item.spiciness}/3)</span>
              </p>
            ) : (
              <p className="mt-3 text-[14px] text-muted">Ei ole vürtsikas</p>
            )}
          </div>

          {item.ingredients.length > 0 && (
            <div>
              <h2 className="font-serif text-[16px] font-semibold uppercase text-text">
                Koostis
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] text-muted">
                {item.ingredients.map((ing) => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {item.allergens.length > 0 && (
            <div className="rounded-[3px] border border-muted/30 bg-card px-6 py-7">
              <div className="flex gap-3">
                <Icon name="info" className="mt-0.5 size-5 shrink-0" />
                <div>
                  <h2 className="font-serif text-[16px] font-semibold uppercase text-text">
                    Allergeenid
                  </h2>
                  <p className="mt-2 text-[14px] text-muted">{item.allergens.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          <Link
            to="/broneering"
            className="inline-flex w-[182px] items-center justify-center rounded-[3px] bg-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.12px] text-white"
          >
            Broneeri laud
          </Link>
        </div>
      </section>
    </div>
  )
}
