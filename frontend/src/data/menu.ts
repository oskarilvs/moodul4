export type MenuCategory =
  | 'all'
  | 'offers'
  | 'starters'
  | 'ramen'
  | 'sides'
  | 'dessert'
  | 'drinks'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: MenuCategory
  image: string
  spicy?: boolean
  spicyLevel?: 1 | 2 | 3 | 4 | 5
  badge?: string
  detailCategory?: string
  ingredients?: string[]
  allergens?: string
}

export const categories: { id: MenuCategory; label: string }[] = [
  { id: 'all', label: 'Kõik' },
  { id: 'offers', label: 'Eripakkumised' },
  { id: 'starters', label: 'Eelroad & Suupisted' },
  { id: 'ramen', label: 'Ramen' },
  { id: 'sides', label: 'Kõrvale' },
  { id: 'dessert', label: 'Magustoit' },
  { id: 'drinks', label: 'Joogid' },
]

const STANDARD_ALLERGENS = 'Gluteen, Soja, Seesamiseemned, Võib sisaldada muna'

export const menuItems: MenuItem[] = [
  {
    id: 'lunch-combo',
    name: 'Lõunakombo',
    description: 'E–R kell 11–14. Suvaline Ramen + Edamame + Mugicha',
    price: 17,
    originalPrice: 22,
    category: 'offers',
    image: '/media/combos/lunch_combo.webp',
    ingredients: ['Vaata täpsemalt roogade kirjeldusest'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'couple-combo',
    name: 'Paarikombo',
    description: '2x Ramen (oma valik) + 2x Yuzu Lemonaad + 2x Mochi Jäätis',
    price: 42,
    originalPrice: 52,
    category: 'offers',
    image: '/media/combos/couple_combo.webp',
    ingredients: ['Vaata täpsemalt roogade kirjeldusest'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'beer-combo',
    name: 'Ramen & Õlu',
    description: 'Suvaline Ramen + Karaage + 0,5L õlu (Sapporo / Asahi)',
    price: 23,
    originalPrice: 29,
    category: 'offers',
    image: '/media/combos/beer_combo.webp',
    ingredients: ['Vaata täpsemalt roogade kirjeldusest'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'vegan-chilli-combo',
    name: 'Vegan Kombo',
    description: 'Vegan Shitake Dashi + Edamame Chilli Võiga + Mugicha',
    price: 25,
    originalPrice: 31,
    category: 'offers',
    image: '/media/combos/vegan_combo.webp',
    ingredients: ['Vaata täpsemalt roogade kirjeldusest'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'sharing-platter',
    name: 'Laua Jagamisplaat',
    description: 'min. 4 inimest. Kõik 3 eelrooga + 4x Ramen (oma valik) + 4x jook + 2x Hojicha Crème Brûlée',
    price: 99,
    originalPrice: 130,
    category: 'offers',
    image: '/media/combos/plate_combo.webp',
    badge: 'MIN. 4 INIMEST',
    ingredients: ['Vaata täpsemalt roogade kirjeldusest'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'spicy-challenge',
    name: 'Spicy Challenge',
    description:
      'Spicy Tantanmen (topelttšilli) + Calpico Soda (jahutab maha) + Takoyaki. Läbid väljakutse ilma piimata — saad tasuta Mochi Jäätise.',
    price: 24,
    originalPrice: 30,
    category: 'offers',
    image: '/media/combos/spicy_combo.webp',
    spicy: true,
    spicyLevel: 5,
    ingredients: ['Vaata täpsemalt roogade kirjeldusest'],
    allergens: STANDARD_ALLERGENS,
  },

  {
    id: 'gyoza',
    name: 'Gyoza',
    description: 'Sealiha ja ingveri pelmeenid ponzu kastmega',
    price: 7,
    category: 'starters',
    image: '/media/food/gyoza.webp',
    detailCategory: 'Eelroad & Suupisted',
    ingredients: ['Põhitooraine', 'Kaste', 'Maitseained'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'karaage',
    name: 'Karaage',
    description: 'Jaapani praetud kana sidrunimajonees ja shichimi',
    price: 8,
    category: 'starters',
    image: '/media/food/karaage.webp',
    detailCategory: 'Eelroad & Suupisted',
    spicy: true,
    spicyLevel: 1,
    ingredients: ['Põhitooraine', 'Kaste', 'Maitseained'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'edamame-chilli',
    name: 'Edamame Chilli Võiga',
    description: 'Meresoola, tšilli ja nori võiga röstitud edamame',
    price: 5,
    category: 'starters',
    image: '/media/food/edamame.webp',
    detailCategory: 'Eelroad & Suupisted',
    spicy: true,
    spicyLevel: 2,
    ingredients: ['Põhitooraine', 'Kaste', 'Maitseained'],
    allergens: STANDARD_ALLERGENS,
  },

  {
    id: 'tonkotsu',
    name: 'Tonkotsu',
    description: 'Rikkalik seakontide puljong, chashu sealiha, pehme muna, bambusevõrsed, nori',
    price: 16,
    category: 'ramen',
    image: '/media/food/tonkotsu.webp',
    detailCategory: 'Ramen',
    ingredients: ['Puljong', 'Nuudlid', 'Lisandid vastavalt roale', 'Roheline sibul', 'Nori'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'shio',
    name: 'Shio',
    description: 'Kerge selge kanapuljong, kammkarbid, wakame, tsitruseõli, roheline sibul',
    price: 15,
    category: 'ramen',
    image: '/media/food/shio.webp',
    detailCategory: 'Ramen',
    ingredients: ['Puljong', 'Nuudlid', 'Lisandid vastavalt roale', 'Roheline sibul', 'Nori'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'miso',
    name: 'Miso',
    description: 'Pruun misopasta, maisitera, või, sealiha hakkliha, bambusevõrsed, pehme muna',
    price: 15,
    category: 'ramen',
    image: '/media/food/miso.webp',
    detailCategory: 'Ramen',
    ingredients: ['Puljong', 'Nuudlid', 'Lisandid vastavalt roale', 'Roheline sibul', 'Nori'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'tantanmen',
    name: 'Spicy Tantanmen',
    description: 'Seesamipuljong, veisehakkliha, tšilliõli, pak choi, pehme muna',
    price: 16,
    category: 'ramen',
    image: '/media/food/tantanmen.webp',
    detailCategory: 'Ramen',
    spicy: true,
    spicyLevel: 3,
    ingredients: ['Puljong', 'Nuudlid', 'Lisandid vastavalt roale', 'Roheline sibul', 'Nori'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'shoyu-tori',
    name: 'Shoyu Tori',
    description: 'Sojakastmepuljong, konfit kanakintsud, menma, narutomaki, roheline sibul',
    price: 14,
    category: 'ramen',
    image: '/media/food/shoyu.webp',
    detailCategory: 'Ramen',
    ingredients: ['Puljong', 'Nuudlid', 'Lisandid vastavalt roale', 'Roheline sibul', 'Nori'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'vegan-shitake',
    name: 'Vegan Shitake Dashi',
    description: 'Kombu-shitake puljong, tofu, karamelliseeritud shiitake, misovõi, mungoad',
    price: 13,
    category: 'ramen',
    image: '/media/food/shiitake.webp',
    detailCategory: 'Ramen',
    ingredients: ['Puljong', 'Nuudlid', 'Lisandid vastavalt roale', 'Roheline sibul', 'Nori'],
    allergens: STANDARD_ALLERGENS,
  },

  {
    id: 'takoyaki',
    name: 'Takoyaki',
    description: '6 tk kaheksajalapalli, okonomiyaki kaste, katsuobushi',
    price: 9,
    category: 'sides',
    image: '/media/food/takoyaki.webp',
    detailCategory: 'Kõrvale',
    ingredients: ['Vastavalt retseptile'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'chashu-rice',
    name: 'Kasutera Chashu Riisinõu',
    description: 'Praetud riis, chashu tükid, munakreem, kimchi',
    price: 10,
    category: 'sides',
    image: '/media/food/kasutera.webp',
    detailCategory: 'Kõrvale',
    spicy: true,
    spicyLevel: 1,
    ingredients: ['Vastavalt retseptile'],
    allergens: STANDARD_ALLERGENS,
  },

  {
    id: 'mochi-ice-cream',
    name: 'Mochi Jäätis',
    description: '3 tk, valida: matcha, taro, must seesamikreem',
    price: 6,
    category: 'dessert',
    image: '/media/food/mochi.webp',
    detailCategory: 'Magustoit',
    ingredients: ['Vastavalt retseptile'],
    allergens: STANDARD_ALLERGENS,
  },
  {
    id: 'hojicha-brulee',
    name: 'Hojicha Crème Brûlée',
    description: 'Röstitud teega kreem, karamelliseeritud suhkrukoorik, yuzu koor',
    price: 7,
    category: 'dessert',
    image: '/media/food/hojicha.webp',
    detailCategory: 'Magustoit',
    ingredients: ['Vastavalt retseptile'],
    allergens: STANDARD_ALLERGENS,
  },

  {
    id: 'yuzu-lemonaad',
    name: 'Yuzu Lemonaad',
    description: 'Värske yuzu, ingver, soda',
    price: 5,
    category: 'drinks',
    image: '/media/drinks/yuzu.webp',
    detailCategory: 'Joogid',
    ingredients: ['Vastavalt retseptile'],
    allergens: 'Puuduvad',
  },
  {
    id: 'calpico-soda',
    name: 'Calpico Soda',
    description: 'Jaapani piimajook, passionfruit, jää',
    price: 4,
    category: 'drinks',
    image: '/media/drinks/calpico.webp',
    detailCategory: 'Joogid',
    ingredients: ['Vastavalt retseptile'],
    allergens: 'Puuduvad',
  },
  {
    id: 'mugicha',
    name: 'Mugicha',
    description: 'Jahutatud röstitud odratee, ilma suhkruta',
    price: 3,
    category: 'drinks',
    image: '/media/drinks/mugicha.webp',
    detailCategory: 'Joogid',
    ingredients: ['Vastavalt retseptile'],
    allergens: 'Puuduvad',
  },
  {
    id: 'ramune',
    name: 'Ramune',
    description: 'Klassikaline jaapani klaaspudeli limonaad, originaal või mango',
    price: 4,
    category: 'drinks',
    image: '/media/drinks/ramune.webp',
    detailCategory: 'Joogid',
    ingredients: ['Vastavalt retseptile'],
    allergens: 'Puuduvad',
  },
]

export const offerItems = menuItems.filter((item) => item.category === 'offers')
export const newItems = [
  menuItems.find((i) => i.id === 'shoyu-tori')!,
  menuItems.find((i) => i.id === 'tonkotsu')!,
  menuItems.find((i) => i.id === 'gyoza')!,
]
