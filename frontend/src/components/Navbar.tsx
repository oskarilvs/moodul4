import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Avaleht' },
  { to: '/menuu', label: 'Menüü' },
  { to: '/broneering', label: 'Broneering' },
  { to: '/kontakt', label: 'Kontakt' },
] as const

export function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <header className="mx-auto w-full max-w-[1252px] px-6 lg:px-0">
      <div className="flex items-center justify-between py-6">
        <Link
          to="/"
          className="font-serif text-[27px] font-bold leading-[1.2] text-accent"
          onClick={() => setOpen(false)}
        >
          SHOYU &amp; CO.
        </Link>

        <nav className="hidden items-center gap-8 text-[16px] font-medium uppercase tracking-[0.32px] lg:flex">
          {links.map(({ to, label }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                className={active ? 'text-accent' : 'text-text transition-colors hover:text-accent'}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          className="flex items-center justify-center text-text lg:hidden"
          aria-label="Ava menüü"
          onClick={() => setOpen((v: boolean) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-muted/20 pb-6 lg:hidden">
          {links.map(({ to, label }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`py-4 text-[16px] font-medium uppercase tracking-[0.32px] ${active ? 'text-accent' : 'text-text'}`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
