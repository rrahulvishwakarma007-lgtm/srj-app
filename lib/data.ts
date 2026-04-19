import { Product, GoldRate } from './types';

export const initialGoldRates: GoldRate[] = [
  { type: '24K Gold', price: 9850, change: 1.2,  unit: 'per 10g' },
  { type: '22K Gold', price: 9020, change: -0.8, unit: 'per 10g' },
  { type: '18K Gold', price: 7380, change: 0.6,  unit: 'per 10g' },
  { type: 'Silver',   price: 112,  change: 0.5,  unit: 'per 10g' },
  { type: 'Platinum', price: 3480, change: 2.1,  unit: 'per 10g' },
];

// ── WordPress hosted images (full resolution) ─────────────────────────────
const WP = 'https://shekharrajajewellers.com/wp-content/uploads/2026/03';

// ── GitHub raw assets (300x300 thumbnails) ────────────────────────────────
const GH = 'https://raw.githubusercontent.com/rrahulvishwakarma007-lgtm/srj-app/main/assets';

const productImages = [
  // WordPress images
  `${WP}/Screenshot_2026-03-11-02-32-19-630_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-32-23-044_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-32-53-253_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-32-56-418_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-33-23-043_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-45-14-589_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-45-56-331_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-29-01-417_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-31-14-005_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-35-12-083_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-37-56-903_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-38-00-970_com.facebook.lite_.png`,

  // GitHub assets (remaining images)
  `${GH}/Screenshot_2026-03-11-02-28-27-301_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-28-32-934_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-28-43-298_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-31-46-858_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-31-51-582_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-34-36-825_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-35-08-570_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-36-32-788_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-36-37-183_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-36-43-423_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-36-58-021_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-37-06-076_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-37-24-543_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-37-30-713_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-37-35-489_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-38-44-877_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-39-11-106_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-39-18-037_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-39-28-425_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-40-44-218_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-43-01-295_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-43-14-774_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-44-02-271_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-44-52-245_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-44-13-385_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-44-26-303_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-44-34-003_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-44-40-125_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-44-44-723_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-44-49-941_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-46-18-172_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-46-23-960_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-08-19-46-28-732_com.facebook.lite_-300x300.png`,
  `${GH}/Screenshot_2026-03-11-02-45-14-589_com.facebook.lite_-300x300.png`,
  `${GH}/IMG-20250924-WA0035-300x300.png`,
  `${GH}/IMG_20260121_163734-300x295.jpg`,
  `${GH}/Photoroom-20260311_030954850-300x300.png`,
  `${GH}/ChatGPT-Image-Apr-5-2026-01_09-1.png`,
  `${GH}/file_0000000016a4720bb922e408d0fb4532-300x300.png`,
  `${GH}/file_000000002d20720b968f06d1e82af97d-300x300.png`,
  `${GH}/file_00000000663471fab64e8b3c9f7acebb-300x300.png`,
  `${GH}/file_000000009b0871faa3d2f53497543095-300x200.png`,
  `${GH}/file_00000000d1a071fab06fbf048655557e-200x300.png`,
];

export const products: Product[] = [
  // ── RINGS ──────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Royal Solitaire Ring',
    category: 'Rings',
    weight: 6.2,
    purity: '22K',
    description: '1.2ct VVS1 Diamond',
    details: 'Crafted in 22K gold with a stunning 1.2 carat VVS1 round diamond. Intricate floral engraving on the band.',
    color: '#8C5C2D',
    image: 'https://shekharrajajewellers.com/wp-content/uploads/2026/03/Screenshot_2026-03-11-02-37-30-713_com.facebook.lite_.png',
  },
  {
    id: 2,
    name: 'Emerald Cocktail Ring',
    category: 'Rings',
    weight: 9.1,
    purity: '18K',
    description: '5.2ct Zambian Emerald',
    details: 'Statement ring featuring a 5.2 carat Zambian emerald surrounded by brilliant-cut diamonds in 18K gold.',
    color: '#8C5C2D',
    image: 'https://shekharrajajewellers.com/wp-content/uploads/2026/03/Screenshot_2026-03-11-02-40-44-218_com.facebook.lite_.png',
  },
  {
    id: 3,
    name: 'Vintage Signet Ring',
    category: 'Rings',
    weight: 8.7,
    purity: '22K',
    description: 'Engraved Family Crest',
    details: 'Classic signet ring in 22K gold with hand-engraved family crest motif.',
    color: '#8C5C2D',
    image: 'https://shekharrajajewellers.com/wp-content/uploads/2026/03/Screenshot_2026-03-11-02-36-43-423_com.facebook.lite_.png',
  },
  {
    id: 4,
    name: 'Diamond Eternity Band',
    category: 'Rings',
    weight: 5.4,
    purity: '18K',
    description: 'Full Eternity Diamond Ring',
    details: 'Full eternity band with brilliant-cut diamonds.',
    color: '#8C5C2D',
    image: 'https://shekharrajajewellers.com/wp-content/uploads/2026/03/Screenshot_2026-03-11-02-34-36-825_com.facebook.lite_.png',
  },
  {
    id: 5,
    name: 'Gents Gold Ring',
    category: 'Rings',
    weight: 10.2,
    purity: '22K',
    description: 'Bold Gents Design',
    details: 'Heavy bold gents ring with traditional engraving.',
    color: '#8C5C2D',
    image: 'https://shekharrajajewellers.com/wp-content/uploads/2026/03/Screenshot_2026-03-11-02-36-37-183_com.facebook.lite_.png',
  },
  {
    id: 6,
    name: 'Kundan Bridal Ring',
    category: 'Rings',
    weight: 7.8,
    purity: '22K',
    description: 'Kundan & Meenakari',
    details: 'Bridal ring with Kundan setting and Meenakari work.',
    color: '#8C5C2D',
    image: 'https://shekharrajajewellers.com/wp-content/uploads/2026/03/Screenshot_2026-03-11-02-36-32-788_com.facebook.lite_.png',
  },
];

  // ── NECKLACES ──────────────────────────────────────────────────────────
  { id: 7,  name: 'Heritage Necklace Set',      category: 'Necklaces', price: 245000, weight: 38.5, purity: '22K', description: 'Polki Diamonds & Emeralds',   details: 'Traditional heritage necklace with uncut polki diamonds and Colombian emeralds. Matching earrings included.',                  icon: 'flower-outline',   color: '#8C5C2D', image: productImages[1]  },
  { id: 8,  name: 'Diamond Mangalsutra',        category: 'Necklaces', price: 167000, weight: 28.0, purity: '22K', description: '22K Gold with Diamonds',      details: 'Elegant mangalsutra with 18 brilliant diamonds set in 22K gold. A timeless symbol of love.',                                    icon: 'flower-outline',   color: '#8C5C2D', image: productImages[6]  },
  { id: 9,  name: 'Layered Chain Necklace',     category: 'Necklaces', price: 134000, weight: 24.3, purity: '22K', description: 'Multi-Chain with Charms',     details: 'Contemporary layered necklace with three 22K chains and delicate diamond charms. Modern yet traditional.',                     icon: 'flower-outline',   color: '#8C5C2D', image: productImages[13] },
  { id: 10, name: 'Temple Coin Necklace',       category: 'Necklaces', price: 189000, weight: 45.0, purity: '22K', description: 'Lakshmi Coin Design',         details: 'Grand temple necklace with Lakshmi coin pendants. Pure 22K gold with antique finish. Ideal for weddings.',                    icon: 'flower-outline',   color: '#8C5C2D', image: productImages[14] },
  { id: 11, name: 'Pearl & Gold Necklace',      category: 'Necklaces', price: 98000,  weight: 22.5, purity: '22K', description: 'South Sea Pearls in 22K',     details: 'Elegant necklace featuring premium South Sea pearls interspersed with 22K gold beads. A bridal favorite.',                    icon: 'flower-outline',   color: '#8C5C2D', image: productImages[40] },
  { id: 12, name: 'Antique Rani Haar',          category: 'Necklaces', price: 312000, weight: 62.0, purity: '22K', description: 'Traditional Rani Haar',       details: 'Magnificent Rani Haar in 22K gold with ruby and emerald accents. A true showstopper for bridal occasions.',                   icon: 'flower-outline',   color: '#8C5C2D', image: productImages[41] },

  // ── EARRINGS ───────────────────────────────────────────────────────────
  { id: 13, name: 'Regal Hoop Earrings',        category: 'Earrings',  price: 68500,  weight: 12.8, purity: '22K', description: 'Kundan Work with Pearls',     details: 'Classic hoop earrings featuring exquisite Kundan work and natural freshwater pearls. Lightweight for all-day wear.',           icon: 'ellipse-outline',  color: '#8C5C2D', image: productImages[2]  },
  { id: 14, name: 'Chandelier Drop Earrings',   category: 'Earrings',  price: 112000, weight: 15.6, purity: '22K', description: 'Rose Cut Diamonds',           details: 'Stunning chandelier earrings featuring rose cut diamonds and delicate gold chains. Perfect for festive occasions.',            icon: 'ellipse-outline',  color: '#8C5C2D', image: productImages[7]  },
  { id: 15, name: 'Gold Jhumka Classic',        category: 'Earrings',  price: 42000,  weight: 9.4,  purity: '22K', description: 'Traditional Jhumka Design',   details: 'Classic gold jhumka with intricate filigree work. A wardrobe essential for every Indian woman.',                                icon: 'ellipse-outline',  color: '#8C5C2D', image: productImages[15] },
  { id: 16, name: 'Diamond Stud Earrings',      category: 'Earrings',  price: 78000,  weight: 4.2,  purity: '18K', description: '0.8ct Total Diamond Weight',  details: 'Classic solitaire diamond studs in 18K white gold. GIA certified VVS2 diamonds. Perfect for everyday luxury.',                  icon: 'ellipse-outline',  color: '#8C5C2D', image: productImages[16] },
  { id: 17, name: 'Polki Stud Earrings',        category: 'Earrings',  price: 56000,  weight: 8.0,  purity: '22K', description: 'Uncut Diamond Polki',         details: 'Beautiful polki earrings with uncut diamonds set in 22K gold with enamel backing. Rajasthani craftsmanship.',                   icon: 'ellipse-outline',  color: '#8C5C2D', image: productImages[42] },
  { id: 18, name: 'Baali Long Earrings',        category: 'Earrings',  price: 89000,  weight: 14.5, purity: '22K', description: 'Bridal Long Baali',           details: 'Elegant long baali earrings with ruby drops and diamond accents. Perfect for bridal and festive wear.',                          icon: 'ellipse-outline',  color: '#8C5C2D', image: productImages[43] },

  // ── BRACELETS ──────────────────────────────────────────────────────────
  { id: 19, name: 'Bangle Trio Set',            category: 'Bracelets', price: 156000, weight: 42.0, purity: '22K', description: 'Hand Engraved 22K Gold',      details: 'Set of three 22K gold bangles with hand-engraved motifs and subtle diamond accents. Sold as a set.',                          icon: 'ellipse',          color: '#8C5C2D', image: productImages[3]  },
  { id: 20, name: 'Antique Kada Bracelet',      category: 'Bracelets', price: 97000,  weight: 36.2, purity: '22K', description: 'Hand Hammered Finish',         details: 'Heavy 22K gold kada with traditional hammered finish and subtle engraving. A statement piece.',                                icon: 'ellipse',          color: '#8C5C2D', image: productImages[8]  },
  { id: 21, name: 'Diamond Tennis Bracelet',    category: 'Bracelets', price: 234000, weight: 18.4, purity: '18K', description: '3ct Diamond Line Bracelet',   details: 'Stunning tennis bracelet in 18K white gold with 3 carats of round brilliant diamonds. The ultimate luxury accessory.',          icon: 'ellipse',          color: '#8C5C2D', image: productImages[17] },
  { id: 22, name: 'Gold Chain Bracelet',        category: 'Bracelets', price: 48000,  weight: 12.0, purity: '22K', description: 'Fancy Link Gold Chain',        details: 'Versatile 22K gold chain bracelet with fancy links. Can be worn alone or stacked with bangles.',                                icon: 'ellipse',          color: '#8C5C2D', image: productImages[18] },
  { id: 23, name: 'Meenakari Bangle Set',       category: 'Bracelets', price: 72000,  weight: 28.5, purity: '22K', description: 'Colorful Meenakari Work',     details: 'Gorgeous set of two bangles with vibrant Meenakari enamel work in 22K gold. Traditional Rajasthani art form.',                 icon: 'ellipse',          color: '#8C5C2D', image: productImages[44] },
  { id: 24, name: 'Stone Gold Payal',           category: 'Bracelets', price: 38000,  weight: 16.5, purity: '22K', description: 'Gold Anklet with Stones',      details: 'Beautiful gold payal (anklet) with colorful stone setting. Delicate design with a comfortable fit.',                             icon: 'ellipse',          color: '#8C5C2D', image: productImages[45] },

  // ── PENDANTS ───────────────────────────────────────────────────────────
  { id: 25, name: 'Temple Pendant',             category: 'Pendants',  price: 89000,  weight: 18.4, purity: '22K', description: 'Goddess Lakshmi Design',      details: 'Exquisite temple pendant depicting Goddess Lakshmi, handcrafted with fine detailing in 22K gold.',                            icon: 'star-outline',     color: '#8C5C2D', image: productImages[4]  },
  { id: 26, name: 'Peacock Motif Pendant',      category: 'Pendants',  price: 73000,  weight: 14.9, purity: '22K', description: 'Ruby & Diamond Accents',      details: 'Beautiful peacock pendant with natural rubies and sparkling diamonds in 22K gold.',                                             icon: 'star-outline',     color: '#8C5C2D', image: productImages[9]  },
  { id: 27, name: 'Diamond Heart Pendant',      category: 'Pendants',  price: 145000, weight: 8.5,  purity: '18K', description: '1.5ct Heart Diamond',         details: 'Romantic heart-shaped diamond pendant in 18K white gold with a 1.5 carat pear-shaped diamond.',                                icon: 'star-outline',     color: '#8C5C2D', image: productImages[19] },
  { id: 28, name: 'Om Gold Pendant',            category: 'Pendants',  price: 34000,  weight: 7.2,  purity: '22K', description: 'Sacred Om Symbol 22K',        details: 'Beautifully crafted Om pendant in 22K gold. Available with or without diamond accents. A spiritual heirloom.',                  icon: 'star-outline',     color: '#8C5C2D', image: productImages[20] },
  { id: 29, name: 'Ganesh Pendant',             category: 'Pendants',  price: 52000,  weight: 11.0, purity: '22K', description: 'Lord Ganesha 22K Gold',       details: 'Intricate Lord Ganesha pendant in 22K gold with detailed craftsmanship. Blessed and auspicious.',                               icon: 'star-outline',     color: '#8C5C2D', image: productImages[21] },
  { id: 30, name: 'Gold & Ruby Pendant',        category: 'Pendants',  price: 67000,  weight: 9.8,  purity: '22K', description: 'Natural Ruby Centre Stone',    details: 'Elegant pendant featuring a natural Burmese ruby surrounded by diamonds in 22K gold.',                                          icon: 'star-outline',     color: '#8C5C2D', image: productImages[46] },
];
