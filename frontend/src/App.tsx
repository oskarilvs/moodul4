import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from './components/Layout'
import { BookingPage } from './pages/BookingPage'
import { ContactPage } from './pages/ContactPage'
import { DetailPage } from './pages/DetailPage'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="menuu" element={<MenuPage />} />
          <Route path="menuu/:id" element={<DetailPage />} />
          <Route path="broneering" element={<BookingPage />} />
          <Route path="kontakt" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
