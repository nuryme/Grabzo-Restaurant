import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { connectDb } from './config/db.js'
import { env } from './config/env.js'
import { UserModel } from './models/User.js'
import { CategoryModel } from './models/Category.js'
import { MenuItemModel } from './models/MenuItem.js'
import { TableModel } from './models/Table.js'
import { SettingsModel } from './models/Settings.js'
import mongoose from 'mongoose'

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`

const CATEGORIES = ['Burgers', 'Pizza', 'Drinks', 'Desserts']

// [name, category, description, price(৳), prepTimeMin, popular, imgId]
const ITEMS: [string, string, string, number, number, boolean, string][] = [
  ['Grabzo Signature Burger', 'Burgers', 'Double smashed beef, cheddar, house sauce, brioche bun.', 480, 12, true, '1568901346375-23c9450c58cd'],
  ['Crispy Chicken Burger', 'Burgers', 'Buttermilk-fried chicken, slaw, pickles, spicy mayo.', 420, 12, false, '1606755962773-d324e0a13086'],
  ['Peri Peri Chicken Wings', 'Burgers', 'Six flame-grilled wings tossed in smoky peri peri.', 390, 14, true, '1608039755401-742074f0548d'],
  ['Wood-Fired Margherita', 'Pizza', 'San Marzano tomato, fresh mozzarella, basil, olive oil.', 650, 18, true, '1604382354936-07c5d9983bd3'],
  ['Pepperoni Pizza', 'Pizza', 'Loaded pepperoni, mozzarella, oregano, tomato base.', 750, 18, false, '1628840042765-356cda07504e'],
  ['BBQ Chicken Pizza', 'Pizza', 'Grilled chicken, red onion, BBQ sauce, coriander.', 780, 20, false, '1594007654729-407eedc4be65'],
  ['Belgian Chocolate Shake', 'Drinks', 'Thick chocolate shake with whipped cream and a wafer.', 260, 5, true, '1572490122747-3968b75cc699'],
  ['Fresh Lime Mint', 'Drinks', 'Cold-pressed lime, mint, soda, a hint of sugar.', 150, 4, false, '1622597467836-f3285f2131b8'],
  ['Iced Coffee', 'Drinks', 'Double-shot espresso over ice with cold milk.', 220, 5, false, '1461023058943-07fcbe16d735'],
  ['Molten Lava Cake', 'Desserts', 'Warm chocolate cake with a gooey molten centre.', 290, 8, true, '1624353365286-3f8d62daad51'],
  ['New York Cheesecake', 'Desserts', 'Classic baked cheesecake with a berry compote.', 310, 6, false, '1533134242443-d4fd215305ad'],
]

async function seed() {
  await connectDb()
  console.log('[seed] clearing existing data…')
  await Promise.all([
    UserModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    MenuItemModel.deleteMany({}),
    TableModel.deleteMany({}),
    SettingsModel.deleteMany({}),
  ])

  // Owner account
  const passwordHash = await bcrypt.hash(env.seed.ownerPassword, 10)
  await UserModel.create({
    name: 'Owner',
    email: env.seed.ownerEmail,
    passwordHash,
    role: 'owner',
  })
  console.log(`[seed] owner: ${env.seed.ownerEmail} / ${env.seed.ownerPassword}`)

  // Categories
  const cats = await CategoryModel.insertMany(
    CATEGORIES.map((name, i) => ({ name, sortOrder: i })),
  )
  const catId = new Map(cats.map((c) => [c.name, c._id]))

  // Menu items
  await MenuItemModel.insertMany(
    ITEMS.map(([name, cat, description, price, prepTimeMin, popular, imgId]) => ({
      name,
      description,
      price,
      category: catId.get(cat),
      imageUrl: img(imgId),
      prepTimeMin,
      popular,
      available: true,
    })),
  )
  console.log(`[seed] ${ITEMS.length} menu items across ${CATEGORIES.length} categories`)

  // Tables (with QR tokens)
  await TableModel.insertMany(
    Array.from({ length: 8 }, (_, i) => ({ tableName: `Table ${i + 1}`, qrToken: uuid() })),
  )
  console.log('[seed] 8 tables created')

  // Restaurant settings
  await SettingsModel.create({
    name: 'Grabzo',
    tagline: 'Flame-grilled burgers, wood-fired pizza, and cold drinks — ordered from your table.',
    phone: '+880 1700-000000',
    address: 'House 12, Road 7, Banani, Dhaka 1213',
    hours: 'Every day · 11:00 AM – 11:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps?q=Banani,Dhaka&output=embed',
  })

  console.log('[seed] done ✔')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('[seed] failed:', err)
  process.exit(1)
})
