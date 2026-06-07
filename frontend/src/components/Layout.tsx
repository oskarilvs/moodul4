import { useLocation, Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <div className="sticky top-0 z-50 border-b border-muted/10 bg-bg/90 backdrop-blur-sm">
        <Navbar />
      </div>
      <main key={pathname} className="animate-page-enter flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
