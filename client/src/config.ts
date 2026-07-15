import type { MenuItem, RestaurantSettings } from './types'

/** Placeholder brand identity for the demo. Swapped for a real owner's details later. */
export const restaurant: RestaurantSettings = {
  name: 'Delectus',
  tagline: 'Flame-grilled burgers, wood-fired pizza, and cold drinks — ordered from your table.',
  phone: '+880 1700-000000',
  address: 'House 12, Road 7, Banani, Dhaka 1213',
  hours: 'Every day · 11:00 AM – 11:00 PM',
  // Google Maps embed for Banani, Dhaka (no API key needed for the basic embed).
  mapEmbedUrl:
    'https://www.google.com/maps?q=Banani,Dhaka&output=embed',
}

/** Fallback featured dishes so the landing page renders before the backend is seeded. */
export const fallbackFeatured: MenuItem[] = [
  {
    _id: 'f1',
    name: 'Grabzo Signature Burger',
    description: 'Double smashed beef, cheddar, house sauce, brioche bun.',
    price: 480,
    category: 'burgers',
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=70',
    prepTimeMin: 12,
    available: true,
    popular: true,
  },
  {
    _id: 'f2',
    name: 'Wood-Fired Margherita',
    description: 'San Marzano tomato, fresh mozzarella, basil, olive oil.',
    price: 650,
    category: 'pizza',
    imageUrl:
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=70',
    prepTimeMin: 18,
    available: true,
    popular: true,
  },
  {
    _id: 'f3',
    name: 'Peri Peri Chicken Wings',
    description: 'Six flame-grilled wings tossed in smoky peri peri.',
    price: 390,
    category: 'burgers',
    imageUrl:
      'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=800&q=70',
    prepTimeMin: 14,
    available: true,
    popular: true,
  },
  {
    _id: 'f4',
    name: 'Belgian Chocolate Shake',
    description: 'Thick chocolate shake with whipped cream and a wafer.',
    price: 260,
    category: 'drinks',
    imageUrl:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=70',
    prepTimeMin: 5,
    available: true,
    popular: true,
  },
]
