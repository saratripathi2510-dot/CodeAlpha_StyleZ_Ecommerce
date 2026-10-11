const db = require('./db');
const bcrypt = require('bcryptjs');

console.log('--- Seeding StyleZ Database ---');

// Clear existing data cleanly in proper order
db.exec(`
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM products;
  DELETE FROM categories;
  DELETE FROM users;
`);

// 1. Categories
const insertCategory = db.prepare(`
  INSERT INTO categories (name, slug, description)
  VALUES (@name, @slug, @description)
`);

const categoriesData = [
  { name: 'Women', slug: 'women', description: 'Curated evening silhouettes, fluid silks, and bespoke tailoring.' },
  { name: 'Men', slug: 'men', description: 'Precision tailoring, modern minimalists, and elevated essentials.' },
  { name: 'Outerwear', slug: 'outerwear', description: 'Sculptural wool coats, cashmere wraps, and architectural blazers.' },
  { name: 'Accessories', slug: 'accessories', description: 'Handcrafted leather goods, 18k gold accents, and jacquard silks.' },
  { name: 'Footwear', slug: 'footwear', description: 'Artisanal Italian leather shoes, chelsea boots, and sculpted heels.' }
];

const categoryMap = {};
for (const cat of categoriesData) {
  const result = insertCategory.run(cat);
  categoryMap[cat.slug] = result.lastInsertRowid;
}

// 2. Demo User
const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync('password123', salt);

const insertUser = db.prepare(`
  INSERT INTO users (name, email, password_hash, role)
  VALUES (?, ?, ?, ?)
`);

const userResult = insertUser.run(
  'Alexander Vance',
  'client@stylez.com',
  passwordHash,
  'user'
);
const demoUserId = userResult.lastInsertRowid;

// Also create an admin user
const adminPasswordHash = bcrypt.hashSync('admin123', salt);
insertUser.run(
  'Elena Rostova',
  'admin@stylez.com',
  adminPasswordHash,
  'admin'
);

// 3. Products
const insertProduct = db.prepare(`
  INSERT INTO products (
    name, slug, category_id, price, compare_price, description, details, 
    images, sizes, colors, stock, rating, review_count, featured, badge
  ) VALUES (
    @name, @slug, @category_id, @price, @compare_price, @description, @details,
    @images, @sizes, @colors, @stock, @rating, @review_count, @featured, @badge
  )
`);

const productsData = [
  {
    name: 'Aurelia Silk Satin Gown',
    slug: 'aurelia-silk-satin-gown',
    category_id: categoryMap['women'],
    price: 680.00,
    compare_price: 820.00,
    description: 'A breathtaking floor-length silhouette tailored from 100% heavy mulberry silk satin. Cut on the bias to drape effortlessly with champagne sheen, featuring an open cross-back and subtle train.',
    details: JSON.stringify([
      '100% Heavy Mulberry Silk Satin (22 Momme)',
      'Floor-sweeping bias cut with graceful cascade',
      'Architectural low back with delicate cross-straps',
      'Invisible side zipper with French seam finish',
      'Dry clean only. Crafted in Florence, Italy'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
    colors: JSON.stringify([
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Midnight Obsidian', hex: '#111111' },
      { name: 'Pearl Ivory', hex: '#FDFBF7' }
    ]),
    stock: 14,
    rating: 4.95,
    review_count: 48,
    featured: 1,
    badge: 'Haute Couture'
  },
  {
    name: 'Sovereign Double-Breasted Wool Blazer',
    slug: 'sovereign-double-breasted-wool-blazer',
    category_id: categoryMap['outerwear'],
    price: 520.00,
    compare_price: 640.00,
    description: 'Cut with razor-sharp precision from Super 150s Merino virgin wool, the Sovereign Blazer embodies timeless modern authority. Accented by brushed champagne-gold buttons and cupro silk lining.',
    details: JSON.stringify([
      'Super 150s Australian Virgin Merino Wool',
      'Hand-cast brushed champagne-gold buttons',
      'Full cupro silk interior lining with interior passport pocket',
      'Structured peak lapels with pick-stitching',
      'Double back vent for effortless posture'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['38R', '40R', '42R', '44R']),
    colors: JSON.stringify([
      { name: 'Onyx Black', hex: '#0A0A0A' },
      { name: 'Charcoal Shadow', hex: '#2B2B2B' }
    ]),
    stock: 18,
    rating: 4.92,
    review_count: 37,
    featured: 1,
    badge: 'Iconic Tailoring'
  },
  {
    name: 'L’Ombre Cashmere Belted Trench',
    slug: 'lombre-cashmere-belted-trench',
    category_id: categoryMap['outerwear'],
    price: 980.00,
    compare_price: 1200.00,
    description: 'An ethereal cocoon of pure Grade-A Mongolian cashmere. Features storm flaps, horn buckle closures, and an oversized fluid collar that wraps like a sculpture.',
    details: JSON.stringify([
      '100% Grade-A Mongolian Cashmere (480gsm)',
      'Water-repellent nano-membrane finish',
      'Removable sash belt with genuine buffalo horn buckle',
      'Hand-stitched welt pockets with deep fleece lining',
      'Made in Biella, Italy'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify([
      { name: 'Warm Camel', hex: '#C19A6B' },
      { name: 'Ivory Cream', hex: '#F5F2EB' },
      { name: 'Obsidian Noir', hex: '#141414' }
    ]),
    stock: 9,
    rating: 4.98,
    review_count: 52,
    featured: 1,
    badge: 'Limited Edition'
  },
  {
    name: 'Palais Pleated Palazzo Trousers',
    slug: 'palais-pleated-palazzo-trousers',
    category_id: categoryMap['women'],
    price: 340.00,
    compare_price: 410.00,
    description: 'High-waisted trousers rendered in crisp Italian wool-crepe with dramatic double inverted pleats. Tailored with a wide-leg cascade that moves fluidly with every stride.',
    details: JSON.stringify([
      'Italian Wool-Crepe & Viscose blend',
      'High-rise waist with extended tab closure',
      'Deep architectural double pleats',
      'Hidden side-seam pockets and rear welt pockets',
      'Hand-finished hem allowance for custom alteration'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
    colors: JSON.stringify([
      { name: 'Ivory Alabaster', hex: '#FAF8F5' },
      { name: 'Onyx Black', hex: '#111111' }
    ]),
    stock: 22,
    rating: 4.88,
    review_count: 29,
    featured: 0,
    badge: 'New Season'
  },
  {
    name: 'Elysian Structured Leather Tote',
    slug: 'elysian-structured-leather-tote',
    category_id: categoryMap['accessories'],
    price: 480.00,
    compare_price: 590.00,
    description: 'Hand-sculpted in Tuscany using full-grain vegetable-tanned calfskin. Features bespoke champagne gold hardware, magnetic bar clasp, and suede-lined compartments for tablets and essentials.',
    details: JSON.stringify([
      'Full-grain Tuscan Vegetable-Tanned Leather',
      '24k Champagne-Gold electroplated hardware',
      'Interior lined with micro-velvet suede',
      'Dedicated padded laptop compartment (up to 15")',
      'Reinforced base with protective metal feet'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify([
      { name: 'Obsidian Noir', hex: '#111111' },
      { name: 'Cognac Gold', hex: '#9E5B32' },
      { name: 'Alabaster Chalk', hex: '#EAE6DF' }
    ]),
    stock: 12,
    rating: 4.96,
    review_count: 64,
    featured: 1,
    badge: 'Bestseller'
  },
  {
    name: 'Milano Suede Chelsea Boots',
    slug: 'milano-suede-chelsea-boots',
    category_id: categoryMap['footwear'],
    price: 450.00,
    compare_price: 520.00,
    description: 'Impeccable Goodyear-welted Chelsea boots crafted from buttery Italian calf suede. Detailed with tonal elastic side gussets, stacked leather heels, and Vibram rubber-injected soles.',
    details: JSON.stringify([
      'Premium Italian Velour Calf Suede',
      'Traditional Goodyear-welt construction',
      'Vegetable-tanned leather insole with memory arch support',
      'Stacked leather heel with anti-slip rubber top lift',
      'Handcrafted in Civitanova Marche, Italy'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['40 EU', '41 EU', '42 EU', '43 EU', '44 EU', '45 EU']),
    colors: JSON.stringify([
      { name: 'Espresso Tobacco', hex: '#3E2723' },
      { name: 'Charcoal Black', hex: '#1F1F1F' }
    ]),
    stock: 16,
    rating: 4.91,
    review_count: 31,
    featured: 0,
    badge: 'Artisan'
  },
  {
    name: 'Verona Sculpted Gold Cuff',
    slug: 'verona-sculpted-gold-cuff',
    category_id: categoryMap['accessories'],
    price: 290.00,
    compare_price: 360.00,
    description: 'A striking statement cuff forged from heavy brass dipped in three layers of 18-karat champagne gold. Ergonomically tapered to contour the wrist with organic, molten liquid geometry.',
    details: JSON.stringify([
      'Recycled solid brass base metal',
      'Triple-dipped 18k Champagne Gold vermeil (3 microns)',
      'Hand-polished mirror and satin dual finish',
      'Hypoallergenic, nickel and lead-free',
      'Presented in a velvet-lined StyleZ keepsake box'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1611591475819-79b8b730ab09?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['Small', 'Medium', 'Large']),
    colors: JSON.stringify([
      { name: '18K Champagne Gold', hex: '#D4AF37' },
      { name: 'White Rhodium', hex: '#E2E2E2' }
    ]),
    stock: 25,
    rating: 4.94,
    review_count: 42,
    featured: 1,
    badge: 'Jewelry'
  },
  {
    name: 'Atelier Poplin Relaxed Shirt',
    slug: 'atelier-poplin-relaxed-shirt',
    category_id: categoryMap['men'],
    price: 210.00,
    compare_price: 260.00,
    description: 'Woven from 120/2 two-ply Egyptian Giza cotton for a crisp yet feather-light touch. Features an effortless relaxed drape, French placket, and genuine Australian mother-of-pearl buttons.',
    details: JSON.stringify([
      '100% Giza Extra Long Staple Cotton',
      'Single-needle stitching at 22 stitches per inch',
      'Genuine carved Mother-of-Pearl buttons',
      'Convertible cuffs and curved hemline',
      'Pre-washed for sublime softness'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify([
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sky Azure', hex: '#C6D9E8' },
      { name: 'Noir Black', hex: '#161616' }
    ]),
    stock: 30,
    rating: 4.87,
    review_count: 22,
    featured: 0,
    badge: 'Essential'
  },
  {
    name: 'Seraphina Sculpted Leather Mule',
    slug: 'seraphina-sculpted-leather-mule',
    category_id: categoryMap['footwear'],
    price: 410.00,
    compare_price: 490.00,
    description: 'Modern minimalism elevated into high art. Crafted from glove-soft lambskin leather with an 85mm architectural fluted champagne gold heel and padded leather footbed.',
    details: JSON.stringify([
      'Supple Italian Nappa lambskin upper',
      '85mm custom-cast metal flute heel',
      'Square open-toe modern profile',
      'Dual-density high-comfort cushioned insole',
      'Handcrafted in Milan'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['36 EU', '37 EU', '38 EU', '39 EU', '40 EU', '41 EU']),
    colors: JSON.stringify([
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Champagne Shimmer', hex: '#E5D3B3' },
      { name: 'Warm Cream', hex: '#F7F3EA' }
    ]),
    stock: 11,
    rating: 4.93,
    review_count: 36,
    featured: 1,
    badge: 'Editor’s Pick'
  },
  {
    name: 'Zephyr Pure Silk Twill Scarf',
    slug: 'zephyr-pure-silk-twill-scarf',
    category_id: categoryMap['accessories'],
    price: 185.00,
    compare_price: 230.00,
    description: 'An oversized 90x90cm carré hand-rolled in Lyon. Features an original architectural line art print in gold, charcoal, and warm ecru, embodying the StyleZ heritage.',
    details: JSON.stringify([
      '100% Silk Twill (18 Momme)',
      'Dimensions: 90 cm x 90 cm (35.4" x 35.4")',
      'Traditional artisanal hand-rolled hem',
      'Screen-printed with water-based eco-pigments',
      'Made in Lyon, France'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['90x90cm']),
    colors: JSON.stringify([
      { name: 'Gold & Ivory', hex: '#D4AF37' },
      { name: 'Noir & Silver', hex: '#2A2A2A' }
    ]),
    stock: 28,
    rating: 4.97,
    review_count: 51,
    featured: 0,
    badge: 'Artisanal'
  },
  {
    name: 'Venetian Velvet Evening Tuxedo',
    slug: 'venetian-velvet-evening-tuxedo',
    category_id: categoryMap['men'],
    price: 890.00,
    compare_price: 1100.00,
    description: 'Distinguished eveningwear tailored from opulent cotton velvet with black grosgrain shawl lapels. Designed for gala evenings and red carpet galas.',
    details: JSON.stringify([
      '100% Italian Cotton Velvet (420gsm)',
      'Pure silk grosgrain shawl lapels and pocket jettings',
      'Single button closure with satin fabric button',
      'Full black jacquard interior lining',
      'Unhemmed matching slim trousers included'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['38R', '40R', '42R', '44R', '46R']),
    colors: JSON.stringify([
      { name: 'Midnight Blue', hex: '#0E1B2A' },
      { name: 'Obsidian Noir', hex: '#0B0B0B' }
    ]),
    stock: 8,
    rating: 4.99,
    review_count: 19,
    featured: 1,
    badge: 'Gala Edition'
  },
  {
    name: 'Astral Heavyweight Cashmere Knit',
    slug: 'astral-heavyweight-cashmere-knit',
    category_id: categoryMap['women'],
    price: 420.00,
    compare_price: 510.00,
    description: 'A sumptuous 7-gauge fisherman rib sweater spun from un-dyed Mongolian cashmere. Dropped shoulders, ribbed funnel neckline, and prolonged cuffs that fold over.',
    details: JSON.stringify([
      '100% Pure Mongolian Cashmere (7-Gauge Rib Knit)',
      'Relaxed architectural silhouette with split hem',
      'Foldable funnel turtleneck collar',
      'Un-dyed organic yarns honoring natural fiber tones',
      'Dry clean or gentle hand wash cold'
    ]),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
    colors: JSON.stringify([
      { name: 'Ivory Sand', hex: '#ECE7DE' },
      { name: 'Charcoal Mist', hex: '#3C3C3C' }
    ]),
    stock: 19,
    rating: 4.90,
    review_count: 27,
    featured: 0,
    badge: 'Organic Cashmere'
  }
];

const productMap = {};
for (const prod of productsData) {
  const res = insertProduct.run(prod);
  productMap[prod.slug] = { id: res.lastInsertRowid, ...prod };
}

// 4. Demo Past Orders for the signed-in Demo user
const insertOrder = db.prepare(`
  INSERT INTO orders (
    order_number, user_id, customer_name, customer_email, customer_phone,
    shipping_address, city, postal_code, country, subtotal, shipping_fee, tax,
    total, status, payment_method, created_at
  ) VALUES (
    @order_number, @user_id, @customer_name, @customer_email, @customer_phone,
    @shipping_address, @city, @postal_code, @country, @subtotal, @shipping_fee, @tax,
    @total, @status, @payment_method, @created_at
  )
`);

const insertOrderItem = db.prepare(`
  INSERT INTO order_items (
    order_id, product_id, product_name, product_image, price, quantity, size, color, subtotal
  ) VALUES (
    @order_id, @product_id, @product_name, @product_image, @price, @quantity, @size, @color, @subtotal
  )
`);

// Past Order 1
const order1 = {
  order_number: 'STZ-2026-94812',
  user_id: demoUserId,
  customer_name: 'Alexander Vance',
  customer_email: 'client@stylez.com',
  customer_phone: '+1 (555) 749-2041',
  shipping_address: '742 Evergreen Terrace, Apt 14B',
  city: 'New York',
  postal_code: '10021',
  country: 'United States',
  subtotal: 1200.00,
  shipping_fee: 0.00,
  tax: 96.00,
  total: 1296.00,
  status: 'Delivered',
  payment_method: 'Demo Card (ending in 8842)',
  created_at: '2026-09-18 14:32:00'
};

const order1Res = insertOrder.run(order1);
const order1Id = order1Res.lastInsertRowid;

insertOrderItem.run({
  order_id: order1Id,
  product_id: productMap['sovereign-double-breasted-wool-blazer'].id,
  product_name: 'Sovereign Double-Breasted Wool Blazer',
  product_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
  price: 520.00,
  quantity: 1,
  size: '40R',
  color: 'Onyx Black',
  subtotal: 520.00
});

insertOrderItem.run({
  order_id: order1Id,
  product_id: productMap['aurelia-silk-satin-gown'].id,
  product_name: 'Aurelia Silk Satin Gown',
  product_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
  price: 680.00,
  quantity: 1,
  size: 'S',
  color: 'Champagne Gold',
  subtotal: 680.00
});

// Past Order 2
const order2 = {
  order_number: 'STZ-2026-48201',
  user_id: demoUserId,
  customer_name: 'Alexander Vance',
  customer_email: 'client@stylez.com',
  customer_phone: '+1 (555) 749-2041',
  shipping_address: '742 Evergreen Terrace, Apt 14B',
  city: 'New York',
  postal_code: '10021',
  country: 'United States',
  subtotal: 480.00,
  shipping_fee: 0.00,
  tax: 38.40,
  total: 518.40,
  status: 'Processing',
  payment_method: 'Demo Card (ending in 8842)',
  created_at: '2026-10-08 19:15:00'
};

const order2Res = insertOrder.run(order2);
const order2Id = order2Res.lastInsertRowid;

insertOrderItem.run({
  order_id: order2Id,
  product_id: productMap['elysian-structured-leather-tote'].id,
  product_name: 'Elysian Structured Leather Tote',
  product_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
  price: 480.00,
  quantity: 1,
  size: 'One Size',
  color: 'Obsidian Noir',
  subtotal: 480.00
});

console.log('✅ StyleZ Database seeded successfully!');
console.log(`- ${categoriesData.length} categories created`);
console.log(`- ${productsData.length} luxury products seeded`);
console.log(`- 2 users created (client@stylez.com / password123, admin@stylez.com / admin123)`);
console.log(`- 2 demo orders with order items created for client@stylez.com`);
