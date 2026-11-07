import { Product, Coupon, CategoryConfig } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kash-001',
    slug: 'zuleikha-emerald-tilla-velvet-pheran',
    name: 'Zuleikha Emerald Velvet Pheran',
    subtitle: 'Royal Silk Velvet with Handcrafted Antique Gold Tilla Needlework',
    category: 'pherans',
    description: 'A masterpiece of royal Kashmiri couture. Cut from heavyweight pure mulberry silk velvet in deep emerald forest green, this pheran features authentic hand-wrought Tilla embroidery along the jewel neckline, elongated cuffs, and hemline. Every paisley and chinar motif is crafted using silver threads dipped in 24k gold wash, continuing a 150-year-old Srinagar court tradition.',
    craftsmanship: 'Hand-embroidered by Master Craftsman Bashir Ahmad and his guild in Downtown Srinagar over 180 hours of meticulous needle placement. Uses traditional pure metallic zari (Tilla) that will never tarnish when preserved with care.',
    careGuide: 'Dry clean only using mild organic solvents. Store wrapped in unbleached pure cotton muslin away from moisture. Avoid direct perfumes on metallic zari embroidery.',
    basePrice: 42500,
    discountPercent: 10,
    rating: 4.95,
    reviewsCount: 28,
    isFeatured: true,
    isBestSeller: true,
    fabric: 'Pure Mulberry Silk Velvet',
    embroidery: 'Tilla Metallic Zari (Antique Gold)',
    occasions: ['Royal Ceremonies', 'Bridal Soirées', 'Winter Festive'],
    primaryImage: '/src/assets/images/product_velvet_pheran_1794059618066.jpg',
    galleryImages: [
      '/src/assets/images/product_velvet_pheran_1794059618066.jpg',
      '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
      '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg'
    ],
    variants: [
      { id: 'v-001-xs', sku: 'ZUL-EMR-XS', color: 'Royal Emerald', colorHex: '#162B21', size: 'XS', stockCount: 2, priceDelta: 0 },
      { id: 'v-001-s',  sku: 'ZUL-EMR-S',  color: 'Royal Emerald', colorHex: '#162B21', size: 'S',  stockCount: 3, priceDelta: 0 },
      { id: 'v-001-m',  sku: 'ZUL-EMR-M',  color: 'Royal Emerald', colorHex: '#162B21', size: 'M',  stockCount: 4, priceDelta: 0 },
      { id: 'v-001-l',  sku: 'ZUL-EMR-L',  color: 'Royal Emerald', colorHex: '#162B21', size: 'L',  stockCount: 1, priceDelta: 0 },
      { id: 'v-001-xl', sku: 'ZUL-EMR-XL', color: 'Royal Emerald', colorHex: '#162B21', size: 'XL', stockCount: 0, priceDelta: 0 }
    ],
    reviews: [
      {
        id: 'r-101',
        author: 'Begum Salma Qureshi',
        location: 'London, UK',
        rating: 5,
        date: 'October 14, 2026',
        title: 'Heirloom quality beyond compare',
        comment: 'The weight of the velvet and the sheen of the genuine Tilla needlework take your breath away. It arrived in an aromatic cedar gift chest. Simply royal.',
        verified: true
      },
      {
        id: 'r-102',
        author: 'Dr. Ananya Roy',
        location: 'Mumbai, India',
        rating: 5,
        date: 'September 28, 2026',
        title: 'Authentic Srinagar craftsmanship',
        comment: 'As a collector of traditional Indian textiles, this is the finest authentic pheran I have seen outside private heritage museums. True museum grade.',
        verified: true
      }
    ]
  },
  {
    id: 'kash-002',
    slug: 'noor-e-gulmarg-gi-pashmina-shawl',
    name: 'Noor-e-Gulmarg Pashmina Shawl',
    subtitle: 'GI-Certified Hand-Spun Cashmere with Fine Sozni Needlework Border',
    category: 'pashmina',
    description: 'Handcrafted from pure 12-micron Changthangi Capra Hircus cashmere, hand-spun on wooden charkhas and hand-woven on traditional looms in the valley. Framed by a delicate multi-chromatic Sozni (needlepoint) floral border depicting wild Himalayan lilies and paisley boteh motifs.',
    craftsmanship: 'GI (Geographical Indication) verified with registered hologram. Features over 240,000 hand stitches in ultra-fine silk floss needlework executed under natural skylight in Old Srinagar.',
    careGuide: 'Dry clean only with certified cashmere care specialists. When not in use, air out once a season and store flat with dry neem leaves or lavender sachets.',
    basePrice: 68000,
    discountPercent: 0,
    rating: 5.0,
    reviewsCount: 19,
    isFeatured: true,
    isBestSeller: true,
    fabric: '100% Pure Changthangi Pashmina (GI Tagged)',
    embroidery: 'Sozni Fine Needlework (Hand-Dyed Silk Floss)',
    occasions: ['Heirloom Trousseau', 'Diplomatic Soirées', 'Formal Evenings'],
    primaryImage: '/src/assets/images/product_pashmina_shawl_1794059618001.jpg',
    galleryImages: [
      '/src/assets/images/product_pashmina_shawl_1794059618001.jpg',
      '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg',
      '/src/assets/images/hero_kashida_couture_1794059616415.jpg'
    ],
    variants: [
      { id: 'v-002-ivory', sku: 'NOOR-PASH-IVR', color: 'Natural Ivory', colorHex: '#FAF8F5', size: '100 x 200 cm', stockCount: 2, priceDelta: 0 },
      { id: 'v-002-camel', sku: 'NOOR-PASH-CML', color: 'Soft Sand Beige', colorHex: '#E5DACB', size: '100 x 200 cm', stockCount: 1, priceDelta: 1500 }
    ],
    reviews: [
      {
        id: 'r-201',
        author: 'Lady Eleanor Vance',
        location: 'Geneva, Switzerland',
        rating: 5,
        date: 'November 2, 2026',
        title: 'Feather-light warmth and ethereal detail',
        comment: 'You can effortlessly pass this entire 2-meter shawl through a ring. The softness is unmatched by any commercial European cashmere brand.',
        verified: true
      }
    ]
  },
  {
    id: 'kash-003',
    slug: 'chinar-whisper-chanderi-silk-kurta',
    name: 'Chinar Whisper Chanderi Kurta Set',
    subtitle: 'Raw Silk Chanderi with Pastel Kashida Hand-Needlework',
    category: 'kurtas',
    description: 'An ethereal ensemble of raw mulberry silk chanderi in delicate ivory. Adorned with nuanced pastel Kashida needlework illustrating budding almond blossoms and cascading Chinar leaves. Paired with coordinating straight-leg silk trousers and a pure tissue silk dupatta with gilded zari border.',
    craftsmanship: 'Embroidered with single-strand floss silk utilizing aari and sozni stitches that lie completely flush against the sheer fabric without puckering or pulling.',
    careGuide: 'Dry clean only. Gentle steam press on silk setting from reverse side over a protective cotton cloth.',
    basePrice: 28500,
    discountPercent: 15,
    rating: 4.88,
    reviewsCount: 34,
    isFeatured: true,
    isNewArrival: true,
    fabric: 'Pure Mulberry Silk Chanderi',
    embroidery: 'Kashida Hand Floral Needlework',
    occasions: ['Spring Gatherings', 'Elegance Daywear', 'Intimate Weddings'],
    primaryImage: '/src/assets/images/product_silk_kurta_1794059619841.jpg',
    galleryImages: [
      '/src/assets/images/product_silk_kurta_1794059619841.jpg',
      '/src/assets/images/hero_kashida_couture_1794059616415.jpg'
    ],
    variants: [
      { id: 'v-003-xs', sku: 'CHN-KUR-XS', color: 'Ivory Cream', colorHex: '#FAF8F5', size: 'XS', stockCount: 4, priceDelta: 0 },
      { id: 'v-003-s',  sku: 'CHN-KUR-S',  color: 'Ivory Cream', colorHex: '#FAF8F5', size: 'S',  stockCount: 5, priceDelta: 0 },
      { id: 'v-003-m',  sku: 'CHN-KUR-M',  color: 'Ivory Cream', colorHex: '#FAF8F5', size: 'M',  stockCount: 6, priceDelta: 0 },
      { id: 'v-003-l',  sku: 'CHN-KUR-L',  color: 'Ivory Cream', colorHex: '#FAF8F5', size: 'L',  stockCount: 3, priceDelta: 0 },
      { id: 'v-003-xl', sku: 'CHN-KUR-XL', color: 'Ivory Cream', colorHex: '#FAF8F5', size: 'XL', stockCount: 2, priceDelta: 0 }
    ],
    reviews: [
      {
        id: 'r-301',
        author: 'Zainab Mir',
        location: 'Dubai, UAE',
        rating: 5,
        date: 'October 30, 2026',
        title: 'Subtle elegance at its peak',
        comment: 'The pastel threads against the warm ivory silk feel so restrained and poetic. Received countless compliments at our family Eid gathering.',
        verified: true
      }
    ]
  },
  {
    id: 'kash-004',
    slug: 'shah-i-hamadan-merino-wool-pheran',
    name: 'Shah-i-Hamadan Midnight Wool Pheran',
    subtitle: 'Pure Australian Merino Wool with Silver Aari Needlework',
    category: 'pherans',
    description: 'Designed for the crisp Himalayan chill, crafted from heavy 480 GSM pure Merino wool felt in deep midnight indigo. Detailed with dense silver-grey Aari chain-stitch needlework across the collar, breastplate, and side vents.',
    craftsmanship: 'Constructed by master artisans in Anantnag with reinforced inner silk facings for insulation and generational longevity.',
    careGuide: 'Professional wool dry cleaning. Brush with natural horsehair garment brush after each wear to maintain texture.',
    basePrice: 34000,
    discountPercent: 0,
    rating: 4.92,
    reviewsCount: 16,
    isFeatured: false,
    isNewArrival: true,
    fabric: '100% Merino Wool Felt (480 GSM)',
    embroidery: 'Aari Fine Chain-Stitch',
    occasions: ['Winter Banquets', 'High-Altitude Luxury', 'Evening Receptions'],
    primaryImage: '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
    galleryImages: [
      '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
      '/src/assets/images/product_velvet_pheran_1794059618066.jpg'
    ],
    variants: [
      { id: 'v-004-s', sku: 'SHH-MID-S', color: 'Midnight Indigo', colorHex: '#1B2430', size: 'S', stockCount: 3, priceDelta: 0 },
      { id: 'v-004-m', sku: 'SHH-MID-M', color: 'Midnight Indigo', colorHex: '#1B2430', size: 'M', stockCount: 4, priceDelta: 0 },
      { id: 'v-004-l', sku: 'SHH-MID-L', color: 'Midnight Indigo', colorHex: '#1B2430', size: 'L', stockCount: 2, priceDelta: 0 }
    ],
    reviews: []
  },
  {
    id: 'kash-005',
    slug: 'dal-mirage-handwoven-silk-stole',
    name: 'Dal Mirage Woven Silk Stole',
    subtitle: 'Pure Mulberry Silk with Shalimar Bagh Floral Jaal',
    category: 'stoles',
    description: 'Woven on pedal looms with fine spun mulberry silk. Features a continuous floral jaal embroidery inspired by the terraced watercourses and fountains of Shalimar Bagh.',
    craftsmanship: 'Hand-dyed with natural madder root and indigo pigments before being hand-finished with knotted silk tassels.',
    careGuide: 'Dry clean or delicate cold hand wash with organic silk shampoo. Dry flat away from direct sunlight.',
    basePrice: 16500,
    discountPercent: 10,
    rating: 4.85,
    reviewsCount: 14,
    isFeatured: false,
    isBestSeller: false,
    fabric: 'Pure Mulberry Satin Silk',
    embroidery: 'Kashida Floral Jaal',
    occasions: ['Formal Dinners', 'Cultural Soirées', 'Everyday Luxury'],
    primaryImage: '/src/assets/images/product_pashmina_shawl_1794059618001.jpg',
    galleryImages: [
      '/src/assets/images/product_pashmina_shawl_1794059618001.jpg'
    ],
    variants: [
      { id: 'v-005-gold', sku: 'DAL-STL-GLD', color: 'Parchment Gold', colorHex: '#C5A059', size: '70 x 200 cm', stockCount: 5, priceDelta: 0 },
      { id: 'v-005-sage', sku: 'DAL-STL-SAG', color: 'Kashmir Sage', colorHex: '#7C8A7E', size: '70 x 200 cm', stockCount: 3, priceDelta: 0 }
    ],
    reviews: []
  },
  {
    id: 'kash-006',
    slug: 'pampore-saffron-almond-nourishing-elixir',
    name: 'Pampore Saffron & Almond Radiance Elixir',
    subtitle: 'Cold-Pressed Sweet Almond Infused with Pure Pampore Mongra Saffron',
    category: 'cosmetics',
    description: 'An authentic facial nectar formulation honoring traditional Kashmiri botanicals. Combines certified GI Grade-A Mongra saffron stigmas harvested from the autumn plateaus of Pampore, slow-macerated in cold-pressed Kashmiri sweet badam (almond) oil, sea buckthorn, and wild Himalayan rosehip.',
    craftsmanship: 'Produced in small micro-batches of 100 amber glass bottles per harvest. 100% pure botanical cold infusion with zero synthetic additives, fragrances, parabens, or fillers.',
    careGuide: 'Store in a cool, dry place away from direct sunlight. Use within 12 months of opening. Massage 3-4 drops onto cleansed skin before resting.',
    ingredients: 'Prunus Amygdalus Dulcis (Kashmiri Sweet Almond) Oil, Crocus Sativus (Pampore Mongra Saffron) Stigma Extract, Rosa Moschata (Himalayan Rosehip) Seed Oil, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil, Tocopherol (Natural Vitamin E).',
    basePrice: 6200,
    discountPercent: 0,
    rating: 4.96,
    reviewsCount: 42,
    isFeatured: true,
    isBestSeller: true,
    fabric: 'Amber Glass Bottle (30ml)',
    embroidery: 'GI Verified Pampore Mongra Saffron',
    occasions: ['Evening Radiance Ritual', 'Restorative Skin Care'],
    primaryImage: '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg',
    galleryImages: [
      '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg'
    ],
    variants: [
      { id: 'v-006-30ml', sku: 'SAF-ELX-30ML', color: 'Golden Amber', colorHex: '#C5A059', size: '30 ml', stockCount: 12, priceDelta: 0 },
      { id: 'v-006-50ml', sku: 'SAF-ELX-50ML', color: 'Golden Amber', colorHex: '#C5A059', size: '50 ml', stockCount: 7, priceDelta: 3200 }
    ],
    reviews: [
      {
        id: 'r-601',
        author: 'Dr. Fatima Tariq',
        location: 'New Delhi, India',
        rating: 5,
        date: 'October 19, 2026',
        title: 'True Mongra saffron potency',
        comment: 'You can see the actual deep red saffron threads suspended inside. The scent is naturally honeyed and earthy. Transforms skin overnight.',
        verified: true
      }
    ]
  }
];

export const PROMO_COUPONS: Coupon[] = [
  {
    code: 'KASHIDA10',
    discountPercent: 10,
    minSpend: 20000,
    description: '10% Inaugural Privilege on Handcrafted Curations above ₹20,000'
  },
  {
    code: 'ROYALHERITAGE',
    discountPercent: 15,
    minSpend: 50000,
    description: '15% Royal Trousseau Privilege on Orders above ₹50,000'
  }
];

export const INITIAL_CATEGORIES: CategoryConfig[] = [
  {
    id: 'pherans',
    name: 'Bespoke Velvet & Woolen Pherans',
    subtitle: 'Royal Silk Velvet & Fine Wool with Handcrafted Tilla & Sozni',
    description: 'Traditional Kashmiri court silhouette reimagined in heavy mulberry silk velvet and Australian merino wool, embellished with antique gold metallic zari.',
    image: '/src/assets/images/product_velvet_pheran_1794059618066.jpg',
    imageAlt: 'Handcrafted Kashmiri Velvet Pheran with Tilla Needlework',
    slug: 'pherans',
    metaTitle: 'Royal Kashmiri Velvet & Woolen Pherans — Handcrafted Tilla Couture',
    metaDescription: 'Discover bespoke royal Kashmiri pherans cut from pure mulberry silk velvet and fine wool, hand-embroidered in Srinagar.',
    needleworkFocus: 'Tilla Zari & Sozni Needlepoint',
    isFeatured: true,
  },
  {
    id: 'kurtas',
    name: 'Hand-Embroidered Raw Silk Kurtas',
    subtitle: 'Chanderi & Mulberry Silk Kurta Sets with Fine Aari & Zari',
    description: 'Understated regal elegance for celebratory gatherings and royal ceremonies, crafted in breathable natural silks.',
    image: '/src/assets/images/product_silk_kurta_1794059619841.jpg',
    imageAlt: 'Hand-embroidered pure raw silk Kashmiri kurta with ivory aari work',
    slug: 'kurtas',
    metaTitle: 'Pure Silk Kashmiri Kurtas — Hand-Embroidered Chanderi & Tilla',
    metaDescription: 'Shop handcrafted raw silk Kashmiri kurtas featuring authentic Aari chain stitch and delicate floral Kashida motifs.',
    needleworkFocus: 'Aari Chain Stitch & Fine Kashida',
    isFeatured: true,
  },
  {
    id: 'pashmina',
    name: 'GI-Certified Changthangi Pashmina',
    subtitle: 'Under-Fleece of Ladakh Changthangi Goats Spun on Traditional Charkha',
    description: 'The pinnacle of global textile luxury. Certified with a Geographical Indication (GI) micro-chip seal guaranteeing authenticity and hand-spun provenance.',
    image: '/src/assets/images/product_pashmina_shawl_1794059618001.jpg',
    imageAlt: 'Authentic GI-Certified Kashmiri Pashmina Shawl with fine needlepoint borders',
    slug: 'pashmina',
    metaTitle: 'Authentic GI-Certified Pashmina Shawls — Changthangi Cashmere',
    metaDescription: 'Explore genuine GI-certified Kashmiri Pashmina shawls hand-spun in the high Himalayas and hand-embroidered by master craftsmen.',
    needleworkFocus: 'Reversible Jamawar & Sozni Borders',
    isFeatured: true,
  },
  {
    id: 'stoles',
    name: 'Pure Woven Mulberry Silk Stoles',
    subtitle: 'Fluid Silk Wraps Handcrafted with Paisley & Chinar Medallions',
    description: 'Versatile evening wraps in lustrous natural silk, adorned with miniature paisley and chinar leaf medallions.',
    image: '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
    imageAlt: 'Mulberry silk Kashmiri stole with gold metallic embroidery',
    slug: 'stoles',
    metaTitle: 'Kashmiri Mulberry Silk Stoles & Wraps — Bespoke Artisanal Textiles',
    metaDescription: 'Elevate evening ensembles with pure mulberry silk Kashmiri stoles featuring delicate antique gold needlework.',
    needleworkFocus: 'Chinar Medallions & Fine Filigree',
    isFeatured: true,
  },
  {
    id: 'cosmetics',
    name: 'Pampore Saffron & Botanical Radiance',
    subtitle: 'Artisanal Cold-Pressed Nectars Infused with Wild Walnut & Rose',
    description: 'Rare botanical elixirs formulated with GI-certified Pampore Mongra saffron, cold-pressed wild apricot kernel oil, and valley wild roses.',
    image: '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg',
    imageAlt: 'Kashmir Botanical Radiance Elixir with Pampore Saffron and Wild Apricot Oil',
    slug: 'cosmetics',
    metaTitle: 'Pampore Saffron Botanical Radiance Elixirs — Pure Kashmir Alchemy',
    metaDescription: 'Immerse in pure Kashmiri botanical alchemy with authentic Pampore Mongra saffron and cold-pressed Himalayan nut oils.',
    needleworkFocus: 'Pure Valley Botanical Distillation',
    isFeatured: false,
  },
];

