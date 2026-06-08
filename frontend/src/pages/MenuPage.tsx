import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories, fetchMenuItems, type ApiMenuItem } from '../api'

type SortOrder = 'default' | 'asc' | 'desc'

function SpicyDots({ level }: { level: number }) {
  if (!level) return null
  return (
    <div className="flex gap-1">
      {Array.from({ length: level }).map((_, i) => (
        <span
          key={i}
          className="flex size-[22px] items-center justify-center rounded-sm bg-[rgba(0,0,0,0.55)] text-[13px]"
        >
          🌶
        </span>
      ))}
    </div>
  )
}

function MenuCard({ item }: { item: ApiMenuItem }) {
  return (
    <article className="group flex flex-col bg-card">
      <Link to={`/menuu/${item.id}`} className="block">
        <div className="relative h-[198px] overflow-hidden">
          <img src={item.image} alt={item.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
          {item.spiciness > 0 && (
            <div className="absolute right-2 top-2">
              <SpicyDots level={item.spiciness} />
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-serif text-[24px] font-semibold leading-tight text-text">
              {item.name}
            </h2>
            <span className="shrink-0 text-[14px] font-semibold text-accent">{item.price}€</span>
          </div>
          <p className="mt-3 text-[14px] text-muted">{item.description}</p>
        </div>
        <Link
          to={`/menuu/${item.id}`}
          className="block border border-accent py-3 text-center text-[12px] font-medium uppercase tracking-[-0.12px] text-accent transition-colors hover:bg-accent hover:text-white"
        >
          vaata lähemalt
        </Link>
      </div>
    </article>
  )
}

export function MenuPage() {
  const [allItems, setAllItems] = useState<ApiMenuItem[]>([])
  const [categories, setCategories] = useState<string[]>(['Kõik'])
  const [activeCategory, setActiveCategory] = useState('Kõik')
  const [spicyOnly, setSpicyOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('default')

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchMenuItems().then(setAllItems)
  }, [])

  const filteredItems = useMemo(() => {
    let items = allItems.filter((item) => {
      const categoryMatch = activeCategory === 'Kõik' || item.category === activeCategory
      const spicyMatch = !spicyOnly || item.spiciness > 0
      return categoryMatch && spicyMatch
    })
    if (sortOrder === 'asc') items = [...items].sort((a, b) => a.price - b.price)
    if (sortOrder === 'desc') items = [...items].sort((a, b) => b.price - a.price)
    return items
  }, [allItems, activeCategory, spicyOnly, sortOrder])

  return (
    <div className="pb-24">
      <section className="mx-auto max-w-[610px] px-6 pt-24 text-center">
        <h1 className="font-serif text-[48px] text-accent">Menüü</h1>
        <p className="mt-6 text-[16px] text-muted">
          Avasta meie hoolikalt valitud roogasid, mis on valmistatud autentsete
          retseptide ja parima tooraine järgi.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-[1252px] px-6 lg:px-0">
        <div className="rounded-[3px] border border-muted/30 bg-card px-6 py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 text-[12px] font-medium uppercase tracking-[-0.12px] transition-colors ${
                      activeCategory === cat
                        ? 'bg-accent text-white'
                        : 'bg-bg text-white hover:text-accent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <label className="flex cursor-pointer items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={spicyOnly}
                  onClick={() => setSpicyOnly((v) => !v)}
                  className={`relative h-5 w-10 rounded-full transition-colors ${
                    spicyOnly ? 'bg-accent' : 'bg-bg'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-3.5 rounded-full bg-white transition-transform ${
                      spicyOnly ? 'left-[22px]' : 'left-1'
                    }`}
                  />
                </button>
                <span className="text-[12px] font-medium uppercase leading-tight text-white">
                  Ainult
                  <br />
                  Vürtsikas
                </span>
              </label>

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  aria-label="Sorteeri hinnaga"
                  className={`cursor-pointer appearance-none bg-bg py-3 pl-6 pr-10 text-[12px] font-medium uppercase tracking-[-0.12px] outline-none transition-colors ${sortOrder !== 'default' ? 'text-accent' : 'text-white'}`}
                >
                  <option value="default">Sorteeri</option>
                  <option value="asc">Hind ↑</option>
                  <option value="desc">Hind ↓</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-3 -translate-y-1/2 text-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1252px] px-6 lg:px-0">
        {filteredItems.length === 0 && allItems.length > 0 ? (
          <p className="text-center text-muted py-12">Selle filtriga roogasid ei leitud.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
