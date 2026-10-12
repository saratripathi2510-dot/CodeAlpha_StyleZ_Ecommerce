/**
 * StyleZ - Static Catalog Data
 * Source of truth: database/seed.js
 * Enables full catalog functionality on static hosting (e.g. GitHub Pages)
 * when a Node.js/Express backend is unavailable.
 */

(function () {
  const categories = [
    {
      id: 1,
      name: 'Women',
      slug: 'women',
      description: 'Curated evening silhouettes, fluid silks, and bespoke tailoring.',
      product_count: 3
    },
    {
      id: 2,
      name: 'Men',
      slug: 'men',
      description: 'Precision tailoring, modern minimalists, and elevated essentials.',
      product_count: 2
    },
    {
      id: 3,
      name: 'Outerwear',
      slug: 'outerwear',
      description: 'Sculptural wool coats, cashmere wraps, and architectural blazers.',
      product_count: 2
    },
    {
      id: 4,
      name: 'Accessories',
      slug: 'accessories',
      description: 'Handcrafted leather goods, 18k gold accents, and jacquard silks.',
      product_count: 3
    },
    {
      id: 5,
      name: 'Footwear',
      slug: 'footwear',
      description: 'Artisanal Italian leather shoes, chelsea boots, and sculpted heels.',
      product_count: 2
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Aurelia Silk Satin Gown',
      slug: 'aurelia-silk-satin-gown',
      category_id: 1,
      category_name: 'Women',
      category_slug: 'women',
      price: 680.00,
      compare_price: 820.00,
      description: 'A breathtaking floor-length silhouette tailored from 100% heavy mulberry silk satin. Cut on the bias to drape effortlessly with champagne sheen, featuring an open cross-back and subtle train.',
      details: [
        '100% Heavy Mulberry Silk Satin (22 Momme)',
        'Floor-sweeping bias cut with graceful cascade',
        'Architectural low back with delicate cross-straps',
        'Invisible side zipper with French seam finish',
        'Dry clean only. Crafted in Florence, Italy'
      ],
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Midnight Obsidian', hex: '#111111' },
        { name: 'Pearl Ivory', hex: '#FDFBF7' }
      ],
      stock: 14,
      rating: 4.95,
      review_count: 48,
      featured: 1,
      badge: 'Haute Couture',
      created_at: '2026-09-01 10:00:00'
    },
    {
      id: 2,
      name: 'Sovereign Double-Breasted Wool Blazer',
      slug: 'sovereign-double-breasted-wool-blazer',
      category_id: 3,
      category_name: 'Outerwear',
      category_slug: 'outerwear',
      price: 520.00,
      compare_price: 640.00,
      description: 'Cut with razor-sharp precision from Super 150s Merino virgin wool, the Sovereign Blazer embodies timeless modern authority. Accented by brushed champagne-gold buttons and cupro silk lining.',
      details: [
        'Super 150s Australian Virgin Merino Wool',
        'Hand-cast brushed champagne-gold buttons',
        'Full cupro silk interior lining with interior passport pocket',
        'Structured peak lapels with pick-stitching',
        'Double back vent for effortless posture'
      ],
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['38R', '40R', '42R', '44R'],
      colors: [
        { name: 'Onyx Black', hex: '#0A0A0A' },
        { name: 'Charcoal Shadow', hex: '#2B2B2B' }
      ],
      stock: 18,
      rating: 4.92,
      review_count: 37,
      featured: 1,
      badge: 'Iconic Tailoring',
      created_at: '2026-09-03 11:00:00'
    },
    {
      id: 3,
      name: 'L’Ombre Cashmere Belted Trench',
      slug: 'lombre-cashmere-belted-trench',
      category_id: 3,
      category_name: 'Outerwear',
      category_slug: 'outerwear',
      price: 980.00,
      compare_price: 1200.00,
      description: 'An ethereal cocoon of pure Grade-A Mongolian cashmere. Features storm flaps, horn buckle closures, and an oversized fluid collar that wraps like a sculpture.',
      details: [
        '100% Grade-A Mongolian Cashmere (480gsm)',
        'Water-repellent nano-membrane finish',
        'Removable sash belt with genuine buffalo horn buckle',
        'Hand-stitched welt pockets with deep fleece lining',
        'Made in Biella, Italy'
      ],
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Warm Camel', hex: '#C19A6B' },
        { name: 'Ivory Cream', hex: '#F5F2EB' },
        { name: 'Obsidian Noir', hex: '#141414' }
      ],
      stock: 9,
      rating: 4.98,
      review_count: 52,
      featured: 1,
      badge: 'Limited Edition',
      created_at: '2026-09-05 12:00:00'
    },
    {
      id: 4,
      name: 'Palais Pleated Palazzo Trousers',
      slug: 'palais-pleated-palazzo-trousers',
      category_id: 1,
      category_name: 'Women',
      category_slug: 'women',
      price: 340.00,
      compare_price: 410.00,
      description: 'High-waisted trousers rendered in crisp Italian wool-crepe with dramatic double inverted pleats. Tailored with a wide-leg cascade that moves fluidly with every stride.',
      details: [
        'Italian Wool-Crepe & Viscose blend',
        'High-rise waist with extended tab closure',
        'Deep architectural double pleats',
        'Hidden side-seam pockets and rear welt pockets',
        'Hand-finished hem allowance for custom alteration'
      ],
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [
        { name: 'Ivory Alabaster', hex: '#FAF8F5' },
        { name: 'Onyx Black', hex: '#111111' }
      ],
      stock: 22,
      rating: 4.88,
      review_count: 29,
      featured: 0,
      badge: 'New Season',
      created_at: '2026-09-08 14:00:00'
    },
    {
      id: 5,
      name: 'Elysian Structured Leather Tote',
      slug: 'elysian-structured-leather-tote',
      category_id: 4,
      category_name: 'Accessories',
      category_slug: 'accessories',
      price: 480.00,
      compare_price: 590.00,
      description: 'Hand-sculpted in Tuscany using full-grain vegetable-tanned calfskin. Features bespoke champagne gold hardware, magnetic bar clasp, and suede-lined compartments for tablets and essentials.',
      details: [
        'Full-grain Tuscan Vegetable-Tanned Leather',
        '24k Champagne-Gold electroplated hardware',
        'Interior lined with micro-velvet suede',
        'Dedicated padded laptop compartment (up to 15")',
        'Reinforced base with protective metal feet'
      ],
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['One Size'],
      colors: [
        { name: 'Obsidian Noir', hex: '#111111' },
        { name: 'Cognac Gold', hex: '#9E5B32' },
        { name: 'Alabaster Chalk', hex: '#EAE6DF' }
      ],
      stock: 12,
      rating: 4.96,
      review_count: 64,
      featured: 1,
      badge: 'Bestseller',
      created_at: '2026-09-10 15:00:00'
    },
    {
      id: 6,
      name: 'Milano Suede Chelsea Boots',
      slug: 'milano-suede-chelsea-boots',
      category_id: 5,
      category_name: 'Footwear',
      category_slug: 'footwear',
      price: 450.00,
      compare_price: 520.00,
      description: 'Impeccable Goodyear-welted Chelsea boots crafted from buttery Italian calf suede. Detailed with tonal elastic side gussets, stacked leather heels, and Vibram rubber-injected soles.',
      details: [
        'Premium Italian Velour Calf Suede',
        'Traditional Goodyear-welt construction',
        'Vegetable-tanned leather insole with memory arch support',
        'Stacked leather heel with anti-slip rubber top lift',
        'Handcrafted in Civitanova Marche, Italy'
      ],
      images: [
        'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['40 EU', '41 EU', '42 EU', '43 EU', '44 EU', '45 EU'],
      colors: [
        { name: 'Espresso Tobacco', hex: '#3E2723' },
        { name: 'Charcoal Black', hex: '#1F1F1F' }
      ],
      stock: 16,
      rating: 4.91,
      review_count: 31,
      featured: 0,
      badge: 'Artisan',
      created_at: '2026-09-12 16:00:00'
    },
    {
      id: 7,
      name: 'Verona Sculpted Gold Cuff',
      slug: 'verona-sculpted-gold-cuff',
      category_id: 4,
      category_name: 'Accessories',
      category_slug: 'accessories',
      price: 290.00,
      compare_price: 360.00,
      description: 'A striking statement cuff forged from heavy brass dipped in three layers of 18-karat champagne gold. Ergonomically tapered to contour the wrist with organic, molten liquid geometry.',
      details: [
        'Recycled solid brass base metal',
        'Triple-dipped 18k Champagne Gold vermeil (3 microns)',
        'Hand-polished mirror and satin dual finish',
        'Hypoallergenic, nickel and lead-free',
        'Presented in a velvet-lined StyleZ keepsake box'
      ],
      images: [
        'https://images.unsplash.com/photo-1611591475819-79b8b730ab09?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['Small', 'Medium', 'Large'],
      colors: [
        { name: '18K Champagne Gold', hex: '#D4AF37' },
        { name: 'White Rhodium', hex: '#E2E2E2' }
      ],
      stock: 25,
      rating: 4.94,
      review_count: 42,
      featured: 1,
      badge: 'Jewelry',
      created_at: '2026-09-15 17:00:00'
    },
    {
      id: 8,
      name: 'Atelier Poplin Relaxed Shirt',
      slug: 'atelier-poplin-relaxed-shirt',
      category_id: 2,
      category_name: 'Men',
      category_slug: 'men',
      price: 210.00,
      compare_price: 260.00,
      description: 'Woven from 120/2 two-ply Egyptian Giza cotton for a crisp yet feather-light touch. Features an effortless relaxed drape, French placket, and genuine Australian mother-of-pearl buttons.',
      details: [
        '100% Giza Extra Long Staple Cotton',
        'Single-needle stitching at 22 stitches per inch',
        'Genuine carved Mother-of-Pearl buttons',
        'Convertible cuffs and curved hemline',
        'Pre-washed for sublime softness'
      ],
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Crisp White', hex: '#FFFFFF' },
        { name: 'Sky Azure', hex: '#C6D9E8' },
        { name: 'Noir Black', hex: '#161616' }
      ],
      stock: 30,
      rating: 4.87,
      review_count: 22,
      featured: 0,
      badge: 'Essential',
      created_at: '2026-09-18 18:00:00'
    },
    {
      id: 9,
      name: 'Seraphina Sculpted Leather Mule',
      slug: 'seraphina-sculpted-leather-mule',
      category_id: 5,
      category_name: 'Footwear',
      category_slug: 'footwear',
      price: 410.00,
      compare_price: 490.00,
      description: 'Modern minimalism elevated into high art. Crafted from glove-soft lambskin leather with an 85mm architectural fluted champagne gold heel and padded leather footbed.',
      details: [
        'Supple Italian Nappa lambskin upper',
        '85mm custom-cast metal flute heel',
        'Square open-toe modern profile',
        'Dual-density high-comfort cushioned insole',
        'Handcrafted in Milan'
      ],
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['36 EU', '37 EU', '38 EU', '39 EU', '40 EU', '41 EU'],
      colors: [
        { name: 'Obsidian Black', hex: '#111111' },
        { name: 'Champagne Shimmer', hex: '#E5D3B3' },
        { name: 'Warm Cream', hex: '#F7F3EA' }
      ],
      stock: 11,
      rating: 4.93,
      review_count: 36,
      featured: 1,
      badge: 'Editor’s Pick',
      created_at: '2026-09-20 19:00:00'
    },
    {
      id: 10,
      name: 'Zephyr Pure Silk Twill Scarf',
      slug: 'zephyr-pure-silk-twill-scarf',
      category_id: 4,
      category_name: 'Accessories',
      category_slug: 'accessories',
      price: 185.00,
      compare_price: 230.00,
      description: 'An oversized 90x90cm carré hand-rolled in Lyon. Features an original architectural line art print in gold, charcoal, and warm ecru, embodying the StyleZ heritage.',
      details: [
        '100% Silk Twill (18 Momme)',
        'Dimensions: 90 cm x 90 cm (35.4" x 35.4")',
        'Traditional artisanal hand-rolled hem',
        'Screen-printed with water-based eco-pigments',
        'Made in Lyon, France'
      ],
      images: [
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['90x90cm'],
      colors: [
        { name: 'Gold & Ivory', hex: '#D4AF37' },
        { name: 'Noir & Silver', hex: '#2A2A2A' }
      ],
      stock: 28,
      rating: 4.97,
      review_count: 51,
      featured: 0,
      badge: 'Artisanal',
      created_at: '2026-09-22 20:00:00'
    },
    {
      id: 11,
      name: 'Venetian Velvet Evening Tuxedo',
      slug: 'venetian-velvet-evening-tuxedo',
      category_id: 2,
      category_name: 'Men',
      category_slug: 'men',
      price: 890.00,
      compare_price: 1100.00,
      description: 'Distinguished eveningwear tailored from opulent cotton velvet with black grosgrain shawl lapels. Designed for gala evenings and red carpet galas.',
      details: [
        '100% Italian Cotton Velvet (420gsm)',
        'Pure silk grosgrain shawl lapels and pocket jettings',
        'Single button closure with satin fabric button',
        'Full black jacquard interior lining',
        'Unhemmed matching slim trousers included'
      ],
      images: [
        'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['38R', '40R', '42R', '44R', '46R'],
      colors: [
        { name: 'Midnight Blue', hex: '#0E1B2A' },
        { name: 'Obsidian Noir', hex: '#0B0B0B' }
      ],
      stock: 8,
      rating: 4.99,
      review_count: 19,
      featured: 1,
      badge: 'Gala Edition',
      created_at: '2026-09-25 21:00:00'
    },
    {
      id: 12,
      name: 'Astral Heavyweight Cashmere Knit',
      slug: 'astral-heavyweight-cashmere-knit',
      category_id: 1,
      category_name: 'Women',
      category_slug: 'women',
      price: 420.00,
      compare_price: 510.00,
      description: 'A sumptuous 7-gauge fisherman rib sweater spun from un-dyed Mongolian cashmere. Dropped shoulders, ribbed funnel neckline, and prolonged cuffs that fold over.',
      details: [
        '100% Pure Mongolian Cashmere (7-Gauge Rib Knit)',
        'Relaxed architectural silhouette with split hem',
        'Foldable funnel turtleneck collar',
        'Un-dyed organic yarns honoring natural fiber tones',
        'Dry clean or gentle hand wash cold'
      ],
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [
        { name: 'Ivory Sand', hex: '#ECE7DE' },
        { name: 'Charcoal Mist', hex: '#3C3C3C' }
      ],
      stock: 19,
      rating: 4.90,
      review_count: 27,
      featured: 0,
      badge: 'Organic Cashmere',
      created_at: '2026-09-28 22:00:00'
    }
  ];

  window.StyleZStaticData = {
    categories,
    products
  };
})();
