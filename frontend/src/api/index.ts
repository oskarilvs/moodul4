export interface ApiMenuItem {
  id: number
  name: string
  category: string
  description: string
  price: number
  spiciness: number
  ingredients: string[]
  allergens: string[]
  image: string
  isNew: boolean
}

const BASE = '/api'

export async function fetchMenuItems(params?: { category?: string; sort?: string }): Promise<ApiMenuItem[]> {
  const query = new URLSearchParams()
  if (params?.category && params.category !== 'Kõik') query.set('category', params.category)
  if (params?.sort) query.set('sort', params.sort)
  const res = await fetch(`${BASE}/menu?${query}`)
  if (!res.ok) throw new Error('Menüü laadimine ebaõnnestus')
  return res.json()
}

export async function fetchMenuItem(id: number | string): Promise<ApiMenuItem> {
  const res = await fetch(`${BASE}/menu/${id}`)
  if (!res.ok) throw new Error('Roog ei leitud')
  return res.json()
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE}/menu/categories`)
  if (!res.ok) return ['Kõik']
  return res.json()
}

export async function sendContactMessage(data: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Saatmine ebaõnnestus')
  return json
}
