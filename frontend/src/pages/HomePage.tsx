import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useReveal } from '../hooks/useReveal'
import { fetchMenuItems, type ApiMenuItem } from '../api'

const VISIBLE = 3
const VISIBLE_MOBILE = 1
const GAP = 32

const events = [
  {
    date: 'Täna',
    type: 'UUDIS',
    title: 'Kevadmenüü on kohal!',
    description:
      'Lisasime menüüsse uued kergemad road ja värskendavad yuzu-joogid. Tule proovima!',
  },
  {
    date: '12.06',
    type: 'SÜNDMUS',
    title: 'Öine ramen-festival',
    description: 'Eriline menüü ja elav muusika kogu öö läbi. Broneeri laud aegsasti!',
  },
  {
    date: '20.06',
    type: 'UUDIS',
    title: 'Uus vegan-ramen',
    description: 'Proovi meie uut shiitake-miso ramenit — täiesti taimne ja maitserikas.',
  },
]

function OfferCard({
  id,
  name,
  description,
  price,
  image,
}: {
  id: number
  name: string
  description: string
  price: number
  image: string
}) {
  return (
    <Link to={`/menuu/${id}`} className="group block w-full bg-card">
      <div className="relative h-[200px] overflow-hidden">
        <img src={image} alt={name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="flex h-[200px] flex-col justify-between p-6">
        <div>
          <h3 className="font-serif text-[24px] font-semibold text-text">{name}</h3>
          <p className="mt-3 text-[14px] text-muted">{description}</p>
        </div>
        <span className="text-[16px] font-semibold text-accent">{price}€</span>
      </div>
    </Link>
  )
}

function DishCard({
  name,
  description,
  price,
  image,
  id,
}: {
  name: string
  description: string
  price: number
  image: string
  id: number
}) {
  return (
    <Link to={`/menuu/${id}`} className="group w-full max-w-[396px]">
      <div className="aspect-square overflow-hidden rounded-[3px]">
        <img
          src={image}
          alt={name}
          className="size-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[24px] font-semibold text-text">{name}</h3>
          <span className="text-[14px] font-semibold text-accent">{price}€</span>
        </div>
        <p className="mt-2 text-[14px] text-muted">{description}</p>
        <p className="mt-6 text-[12px] uppercase text-accent">Vaata lähemalt →</p>
      </div>
    </Link>
  )
}

export function HomePage() {
  const [offerItems, setOfferItems] = useState<ApiMenuItem[]>([])
  const [newItems, setNewItems] = useState<ApiMenuItem[]>([])

  useEffect(() => {
    fetchMenuItems().then((items) => {
      setOfferItems(items.filter((i) => i.category === 'Eripakkumised'))
      setNewItems(items.filter((i) => i.isNew).slice(0, 3))
    })
  }, [])

  const [index, setIndex] = useState(0)
  const outerRef = useRef<HTMLDivElement>(null)
  const [outerWidth, setOuterWidth] = useState(1252)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setIndex(0)
  }, [isMobile])

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setOuterWidth(el.offsetWidth))
    ro.observe(el)
    setOuterWidth(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  const visible = isMobile ? VISIBLE_MOBILE : VISIBLE
  const maxIdx = Math.max(0, offerItems.length - visible)
  const cardWidth = (outerWidth - GAP * (visible - 1)) / visible
  const offset = index * (cardWidth + GAP)

  const prev = () => setIndex((i) => (i <= 0 ? maxIdx : i - 1))
  const next = () => setIndex((i) => (i >= maxIdx ? 0 : i + 1))

  const refOffers = useReveal<HTMLElement>()
  const refStory = useReveal<HTMLElement>()
  const refNew = useReveal<HTMLElement>()
  const refEvents = useReveal<HTMLElement>()

  return (
    <div>
      <section className="relative flex min-h-[1080px] items-center justify-center overflow-hidden">
        <img
          src="/media/herobanner.webp"
          alt="Ramen kauss"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 mx-auto flex max-w-[581px] flex-col items-center gap-8 px-6 text-center">
          <div className="flex flex-col gap-6">
            <h1 className="whitespace-nowrap font-serif text-[72px] font-bold leading-none text-white">
              Öine <span className="italic text-accent">Ramen</span> Baar
            </h1>
            <p className="text-[16px] text-muted">
              Autentne tänavatoit, mis ärkab ellu siis, kui linn magab.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/menuu"
              className="bg-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.12px] text-white transition-colors duration-200 hover:bg-[#d4a0a0]"
            >
              vaata menüüd
            </Link>
            <Link
              to="/broneering"
              className="border border-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.12px] text-accent transition-colors duration-200 hover:bg-accent hover:text-white"
            >
              broneeri laud
            </Link>
          </div>
        </div>
      </section>

      <section ref={refOffers} className="reveal mx-auto max-w-[1252px] px-6 py-24 lg:px-0">
        <h2 className="text-center font-serif text-[48px] text-accent">Eripakkumised</h2>

        <div ref={outerRef} className="mt-8 overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ gap: GAP, transform: `translateX(-${offset}px)` }}
          >
            {offerItems.map((item) => (
              <div key={item.id} style={{ width: cardWidth, flexShrink: 0 }}>
                <OfferCard {...item} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={prev}
            className="flex size-[50px] items-center justify-center rounded-full border border-muted/30 text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Eelmine"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            onClick={next}
            className="flex size-[50px] items-center justify-center rounded-full border border-muted/30 text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Järgmine"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </section>

      <section ref={refStory} className="reveal bg-card py-24">
        <div className="mx-auto flex max-w-[1252px] flex-col items-center gap-12 px-6 lg:flex-row lg:justify-between lg:px-0">
          <img
            src="/media/mascot1.webp"
            alt="Shoyu & Co. maskott"
            className="size-[500px] shrink-0 rounded-[3px] object-cover shadow-[0px_8px_10px_5px_rgba(0,0,0,0.25)]"
          />
          <div className="max-w-[616px]">
            <h2 className="font-serif text-[48px] text-accent">Meie Lugu</h2>
            <div className="mt-3 space-y-4 text-[16px] leading-normal text-muted">
              <p>
                Shoyu &amp; Co. sündis kirest ehtsa Jaapani tänavatoidu ja öise
                linnakultuuri vastu. Kõik algas ühest väikesest Tokyo kõrvaltänavast,
                kus meie asutajad kogesid esimest korda tõelist, hingega tehtud ramenit.
              </p>
              <p>
                Meie missioon on tuua teieni see sama autentne maitseelamus – kausitäis
                lohutust pärast pikka päeva või enne pikka ööd. Me ei tee kompromisse:
                keedame oma puljongeid tunde, valmistame nuudlid kohapeal käsitööna ja
                kasutame vaid parimat, hoolikalt valitud toorainet.
              </p>
              <p>
                Shoyu &amp; Co. ei ole lihtsalt söögikoht. See on kohtumispaik, kus
                sulavad ühte traditsioonid, moodne tänavakultuur ja suurepärane toit.
                Astuge sisse ja saage osa meie elamusest.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={refNew} className="reveal mx-auto max-w-[1252px] px-6 py-24 lg:px-0">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[48px] text-accent">Uued Road</h2>
          <Link
            to="/menuu"
            className="text-[16px] font-medium uppercase tracking-[0.32px] text-text hover:text-accent"
          >
            Kogu menüü →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {newItems.map((item) => (
            <DishCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section ref={refEvents} className="reveal bg-card py-24">
        <div className="mx-auto max-w-[824px] px-6 lg:px-0">
          <h2 className="text-center font-serif text-[48px] text-accent">
            Tulevased Sündmused ja Uudised
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            {events.map((event) => (
              <article
                key={event.title}
                className="flex flex-col gap-6 rounded-[3px] border-l-[3px] border-accent bg-bg px-6 py-8 sm:flex-row sm:items-center sm:gap-[109px]"
              >
                <div className="flex items-center gap-2">
                  <Icon name="calendar" className="h-[25px] w-[22px] shrink-0" />
                  <div className="text-center">
                    <p className="text-[16px] text-accent">{event.date}</p>
                    <p className="text-[14px] text-muted">{event.type}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-[24px] font-semibold text-text">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-[14px] text-muted">{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
