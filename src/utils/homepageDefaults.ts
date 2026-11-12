import { HomepageCMSConfig } from '../types';

export const DEFAULT_HOMEPAGE_CMS: HomepageCMSConfig = {
  hero: {
    imageUrl: '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
    badge: 'Bespoke Kashmiri Haute Couture · Made To Order',
    headline: 'Tradition Woven Into Every Detail',
    subheadline:
      'Pure silk velvet pherans adorned with antique gold Tilla metallic threadwork and feather-light GI-certified Changthangi Pashmina. Each creation represents over 180 hours of handcraft by fourth-generation Srinagar artisans.',
    ctaText: 'Explore The Collection',
    overlayOpacity: 75,
  },
  lookbook: [
    {
      id: 'look-1',
      title: 'Imperial Velvet Pherans',
      subtitle: 'Pure Makhmal with 24K Gold-washed Tilla metallic embroidery',
      categoryTag: 'Royal Bridal & Formal',
      imageUrl: '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
      linkCategory: 'pherans',
    },
    {
      id: 'look-2',
      title: 'GI-Certified Changthangi Pashmina',
      subtitle: 'Spun from 12-micron Ladakhi cashmere with single-needle Sozni needlework',
      categoryTag: 'Heirloom Shawls',
      imageUrl: '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg',
      linkCategory: 'pashmina',
    },
    {
      id: 'look-3',
      title: 'Heritage Pure Silk Kurtas',
      subtitle: 'Breathable mulberry silk embellished with delicate neck motifs',
      categoryTag: 'Bespoke Occasion',
      imageUrl: '/src/assets/images/lookbook_silk_kurta_1794468433537.jpg',
      linkCategory: 'kurtas',
    },
    {
      id: 'look-4',
      title: 'Chinar Autumn Silk Stoles',
      subtitle: 'Feather-light organza and mulberry silk stoles with aari floral borders',
      categoryTag: 'Evening Drapes',
      imageUrl: '/src/assets/images/lookbook_silk_stole_1794468433780.jpg',
      linkCategory: 'stoles',
    },
  ],
  heritage: {
    artisanImageUrl: '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg',
    artisanImageAlt: 'Elderly Kashmiri master artisan hand-embroidering sozni pashmina in Srinagar atelier',
    dossierTitle: 'Master Ustad Ghulam Nabi in his 1880 Srinagar wood atelier',
    dossierDescription: 'Single-needle Sozni technique with 32 stitches per linear centimetre.',
    headline: 'Where Time Is Counted In Stitches, Not Hours',
    subheadline: 'The Soul of the Valley',
    narrativeParagraph1:
      'In an era of disposable fashion and synthetic mass production, Kāshida Couture stands as a sanctuary for Kashmir’s finest living arts. Our garments are not stored in warehouses; they are individually hand-embroidered by multigenerational master craftspeople (Ustads) along the banks of the Jhelum and Dal Lake.',
    narrativeParagraph2:
      'Every motif draws from Kashmir’s natural poetry: the flaming autumnal Chinar leaves, the almond blossoms of Badamwari, and the regal Paisley (Boteh) favored by Mughal empresses.',
  },
  promoBanner: {
    enabled: true,
    imageUrl: '/src/assets/images/product_indigo_pheran_1794468434866.jpg',
    badge: 'Chinar Autumn Harvest Exclusive',
    title: 'The Kashmir Royal Atelier Commission',
    subtitle: 'Complimentary white-glove custom fitting and bespoke monogram initials on all commissions over ₹35,000.',
    couponCode: 'ROYALAUTUMN',
  },
};

// Curated Royalty-Free Kashmiri & Luxury High-Definition Fashion Photography Asset Library
export const CURATED_HERITAGE_PRESETS = [
  {
    name: 'Emerald Velvet Pheran & Gold Tilla',
    category: 'Hero / Pherans',
    url: '/src/assets/images/hero_kashida_couture_1794059616415.jpg',
  },
  {
    name: 'Master Ustad Needlework Atelier',
    category: 'Heritage / Artisans',
    url: '/src/assets/images/craft_artisan_embroidery_1794059619731.jpg',
  },
  {
    name: 'Ivory Chanderi Silk Kurta',
    category: 'Bridal / Kurtas',
    url: '/src/assets/images/lookbook_silk_kurta_1794468433537.jpg',
  },
  {
    name: 'Pure Changthangi Pashmina Shawl',
    category: 'Pashmina / Shawls',
    url: '/src/assets/images/product_pashmina_shawl_1794059618001.jpg',
  },
  {
    name: 'Gilded Mulberry Silk Stole',
    category: 'Stoles / Drapes',
    url: '/src/assets/images/lookbook_silk_stole_1794468433780.jpg',
  },
  {
    name: 'Royal Midnight Indigo Wool Pheran',
    category: 'Outerwear / Pherans',
    url: '/src/assets/images/product_indigo_pheran_1794468434866.jpg',
  },
  {
    name: 'Pampore Mongra Saffron Radiance Nectar',
    category: 'Botanicals / Beauty',
    url: '/src/assets/images/product_saffron_elixir_1794468434796.jpg',
  },
];
