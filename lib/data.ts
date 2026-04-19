import { Product, GoldRate } from './types';

export const initialGoldRates: GoldRate[] = [
  { type: '24K Gold', price: 9850, change: 1.2,  unit: 'per 10g' },
  { type: '22K Gold', price: 9020, change: -0.8, unit: 'per 10g' },
  { type: '18K Gold', price: 7380, change: 0.6,  unit: 'per 10g' },
  { type: 'Silver',   price: 112,  change: 0.5,  unit: 'per 10g' },
  { type: 'Platinum', price: 3480, change: 2.1,  unit: 'per 10g' },
];

const WP = 'https://shekharrajajewellers.com/wp-content/uploads/2026/03';

// ── CORRECTLY MAPPED BY CATEGORY ─────────────────────────────────────────

const RING_IMAGES = [
  `${WP}/Screenshot_2026-03-11-02-37-35-489_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-37-30-713_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-37-24-543_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-37-06-076_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-36-58-021_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-36-43-423_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-36-37-183_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-36-32-788_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-35-08-570_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-34-36-825_com.facebook.lite_.png`,
];

const NECKLACE_IMAGES = [
  `${WP}/Screenshot_2026-03-08-19-44-49-941_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-08-19-44-44-723_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-08-19-44-40-125_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-08-19-44-34-003_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-08-19-44-26-303_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-08-19-44-13-385_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-44-52-245_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-43-14-774_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-43-01-295_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-28-43-298_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-28-32-934_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-28-27-301_com.facebook.lite_.png`,
  `${WP}/file_00000000d1a071fab06fbf048655557e.png`,
  `${WP}/file_00000000663471fab64e8b3c9f7acebb.png`,
  `${WP}/file_000000009b0871faa3d2f53497543095.png`,
];

const EARRING_IMAGES = [
  `${WP}/file_000000002d20720b968f06d1e82af97d.png`,
  `${WP}/file_0000000016a4720bb922e408d0fb4532.png`,
  `${WP}/Screenshot_2026-03-08-19-46-28-732_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-08-19-46-28-732_com.facebook.lite-1.png`,
  `${WP}/Screenshot_2026-03-08-19-46-23-960_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-08-19-46-18-172_com.facebook.lite_.png`,
  `${WP}/IMG-20250924-WA0035.png`,
  `${WP}/Screenshot_2026-03-11-02-44-02-271_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-44-02-271_com.facebook.lite-1.png`,
  `${WP}/Screenshot_2026-03-11-02-38-00-970_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-37-56-903_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-35-12-083_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-31-14-005_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-29-01-417_com.facebook.lite_.png`,
];

const BANGLE_IMAGES = [
  `${WP}/Screenshot_2026-03-11-02-45-56-331_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-45-14-589_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-33-23-043_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-32-56-418_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-32-53-253_com.facebook.lite_.png`,
];

const PENDANT_IMAGES = [
  `${WP}/Screenshot_2026-03-11-02-39-28-425_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-39-18-037_com.facebook.lite_.png`,
  `${WP}/Screenshot_2026-03-11-02-39-11-106_com.facebook.lite_.png`,
  `${WP}/Photoroom-20260311_030954850.png`,
  `${WP}/Screenshot_2026-03-11-02-38-44-877_com.facebook.lite_.png`,
];

// NO PRICE FIELD — customers enquire on WhatsApp
export const products: Product[] = [

  // ── RINGS ──────────────────────────────────────────────────────────────
  { id: 1,  name: 'Royal Solitaire Ring',    category: 'Rings',     weight: 6.2,  purity: '22K', description: 'VVS1 Diamond Ring',          details: 'Crafted in 22K gold with a VVS1 round diamond. Intricate floral engraving on the band.',                      icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[0] },
  { id: 2,  name: 'Emerald Cocktail Ring',   category: 'Rings',     weight: 9.1,  purity: '18K', description: 'Zambian Emerald & Diamonds',  details: 'Statement ring with Zambian emerald surrounded by brilliant-cut diamonds in 18K gold.',                       icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[1] },
  { id: 3,  name: 'Vintage Signet Ring',     category: 'Rings',     weight: 8.7,  purity: '22K', description: 'Engraved Family Crest',       details: 'Classic signet ring in 22K gold with hand-engraved motif. A timeless heirloom piece.',                       icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[2] },
  { id: 4,  name: 'Diamond Eternity Band',   category: 'Rings',     weight: 5.4,  purity: '18K', description: 'Full Eternity Diamond Ring',  details: 'Full eternity band in 18K gold with 24 round brilliant diamonds. Perfect for anniversaries.',                 icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[3] },
  { id: 5,  name: 'Gents Bold Ring',         category: 'Rings',     weight: 10.2, purity: '22K', description: 'Bold Gents Design 22K',       details: 'Heavy bold gents ring in 22K gold with traditional engraving. A signature piece for men.',                   icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[4] },
  { id: 6,  name: 'Kundan Bridal Ring',      category: 'Rings',     weight: 7.8,  purity: '22K', description: 'Kundan & Meenakari Work',     details: 'Bridal ring with intricate Kundan setting and colorful Meenakari enamel work.',                              icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[5] },
  { id: 7,  name: 'Floral Gold Ring',        category: 'Rings',     weight: 5.9,  purity: '22K', description: 'Floral Motif 22K',            details: 'Delicate floral ring in 22K gold with petal-shaped design. Lightweight for everyday wear.',                  icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[6] },
  { id: 8,  name: 'Temple Gold Ring',        category: 'Rings',     weight: 7.1,  purity: '22K', description: 'Temple Art Design',           details: 'Traditional temple-style ring with deity motifs in 22K gold. Divine and auspicious.',                        icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[7] },
  { id: 9,  name: 'Ladies Fancy Ring',       category: 'Rings',     weight: 4.8,  purity: '22K', description: 'Fancy Ladies Design',         details: 'Elegant ladies ring with fancy stone setting in 22K gold. Versatile for all occasions.',                     icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[8] },
  { id: 10, name: 'Classic Band Ring',       category: 'Rings',     weight: 6.0,  purity: '22K', description: 'Classic Gold Band',           details: 'Simple and elegant gold band in 22K. Perfect as a wedding band or everyday ring.',                           icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[9] },

  // ── NECKLACES ──────────────────────────────────────────────────────────
  { id: 11, name: 'Heritage Necklace Set',   category: 'Necklaces', weight: 38.5, purity: '22K', description: 'Polki Diamonds & Emeralds',  details: 'Traditional heritage necklace with uncut polki diamonds and Colombian emeralds. Matching earrings included.',  icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[0]  },
  { id: 12, name: 'Diamond Mangalsutra',     category: 'Necklaces', weight: 28.0, purity: '22K', description: '22K Gold with Diamonds',      details: 'Elegant mangalsutra with 18 brilliant diamonds in 22K gold. A timeless symbol of love.',                      icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[1]  },
  { id: 13, name: 'Temple Coin Necklace',    category: 'Necklaces', weight: 45.0, purity: '22K', description: 'Lakshmi Coin Design',         details: 'Grand temple necklace with Lakshmi coin pendants in 22K gold with antique finish.',                          icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[2]  },
  { id: 14, name: 'Antique Rani Haar',       category: 'Necklaces', weight: 62.0, purity: '22K', description: 'Traditional Rani Haar',       details: 'Magnificent Rani Haar in 22K gold with ruby and emerald accents. A bridal showstopper.',                    icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[3]  },
  { id: 15, name: 'Pearl & Gold Necklace',   category: 'Necklaces', weight: 22.5, purity: '22K', description: 'South Sea Pearls in 22K',     details: 'Elegant necklace with premium South Sea pearls interspersed with 22K gold beads.',                          icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[4]  },
  { id: 16, name: 'Layered Chain Necklace',  category: 'Necklaces', weight: 24.3, purity: '22K', description: 'Multi-Chain with Charms',     details: 'Contemporary layered necklace with three 22K chains and delicate diamond charms.',                           icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[5]  },
  { id: 17, name: 'Kundan Bridal Necklace',  category: 'Necklaces', weight: 55.0, purity: '22K', description: 'Kundan Polki Bridal Set',     details: 'Stunning bridal Kundan necklace with uncut diamonds and precious stones in 22K gold.',                      icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[6]  },
  { id: 18, name: 'Gold Choker Necklace',    category: 'Necklaces', weight: 32.0, purity: '22K', description: 'Classic Gold Choker',         details: 'Elegant close-fitting choker in 22K gold with intricate filigree work.',                                   icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[7]  },
  { id: 19, name: 'Meenakari Necklace',      category: 'Necklaces', weight: 28.5, purity: '22K', description: 'Colorful Meenakari Art',      details: 'Vibrant Meenakari necklace in 22K gold with traditional Rajasthani enamel work.',                           icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[8]  },
  { id: 20, name: 'Diamond Pendant Chain',   category: 'Necklaces', weight: 18.0, purity: '18K', description: 'Diamond Solitaire Chain',     details: 'Elegant 18K gold chain with a diamond solitaire pendant.',                                                  icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[9]  },
  { id: 21, name: 'Long Gold Chain',         category: 'Necklaces', weight: 20.0, purity: '22K', description: 'Long 22K Gold Chain',         details: 'Classic long gold chain in 22K. Versatile and timeless.',                                                   icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[10] },
  { id: 22, name: 'Fancy Link Chain',        category: 'Necklaces', weight: 15.0, purity: '22K', description: 'Fancy Link Gold Chain',       details: 'Stylish fancy link chain in 22K gold. A modern classic.',                                                   icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[11] },
  { id: 23, name: 'Rope Gold Chain',         category: 'Necklaces', weight: 14.0, purity: '22K', description: 'Rope Style 22K Chain',        details: 'Beautiful rope-style gold chain in 22K. Suitable for pendants or worn alone.',                              icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[12] },
  { id: 24, name: 'Box Gold Chain',          category: 'Necklaces', weight: 12.0, purity: '22K', description: 'Box Link Gold Chain',         details: 'Classic box link chain in 22K gold. Durable and elegant.',                                                  icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[13] },
  { id: 25, name: 'Singapore Gold Chain',    category: 'Necklaces', weight: 10.0, purity: '22K', description: 'Singapore Style 22K Chain',   details: 'Delicate Singapore-style chain in 22K gold. Light and versatile.',                                          icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[14] },

  // ── EARRINGS ───────────────────────────────────────────────────────────
  { id: 26, name: 'Kundan Jhumka Set',       category: 'Earrings',  weight: 12.8, purity: '22K', description: 'Kundan Work with Pearls',     details: 'Classic Kundan jhumka earrings with natural freshwater pearls. Lightweight for all-day wear.',               icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[0]  },
  { id: 27, name: 'Chandelier Earrings',     category: 'Earrings',  weight: 15.6, purity: '22K', description: 'Rose Cut Diamonds',           details: 'Stunning chandelier earrings featuring rose cut diamonds and delicate gold chains.',                          icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[1]  },
  { id: 28, name: 'Gold Hoop Earrings',      category: 'Earrings',  weight: 9.4,  purity: '22K', description: 'Classic Gold Hoops',          details: 'Timeless gold hoop earrings in 22K. A wardrobe essential for every woman.',                                  icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[2]  },
  { id: 29, name: 'Polki Drop Earrings',     category: 'Earrings',  weight: 11.0, purity: '22K', description: 'Uncut Diamond Polki',         details: 'Beautiful polki earrings with uncut diamonds in 22K gold with enamel backing.',                              icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[3]  },
  { id: 30, name: 'Regal Stud Earrings',     category: 'Earrings',  weight: 8.0,  purity: '22K', description: 'Royal Stud Design',           details: 'Elegant stud earrings in 22K gold with detailed craftsmanship.',                                            icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[4]  },
  { id: 31, name: 'Diamond Stud Earrings',   category: 'Earrings',  weight: 4.2,  purity: '18K', description: '0.8ct Total Diamond Weight',  details: 'Classic diamond studs in 18K white gold. GIA certified VVS2 diamonds. Everyday luxury.',                    icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[5]  },
  { id: 32, name: 'Antique Gold Earrings',   category: 'Earrings',  weight: 11.2, purity: '22K', description: 'Antique Finish Earrings',     details: 'Traditional antique finish earrings with intricate detailing in 22K gold.',                                  icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[6]  },
  { id: 33, name: 'Baali Long Earrings',     category: 'Earrings',  weight: 14.5, purity: '22K', description: 'Bridal Long Baali',           details: 'Elegant long baali earrings with ruby drops and diamond accents. Perfect for bridal wear.',                  icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[7]  },
  { id: 34, name: 'Meenakari Jhumka',        category: 'Earrings',  weight: 10.5, purity: '22K', description: 'Colorful Meenakari Jhumka',   details: 'Vibrant Meenakari jhumka in 22K gold. Traditional Rajasthani artform.',                                     icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[8]  },
  { id: 35, name: 'Pearl Drop Earrings',     category: 'Earrings',  weight: 7.8,  purity: '22K', description: 'Pearl & Gold Drop',           details: 'Elegant drop earrings with South Sea pearls in 22K gold setting.',                                          icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[9]  },
  { id: 36, name: 'Ruby Gold Earrings',      category: 'Earrings',  weight: 9.0,  purity: '22K', description: 'Natural Ruby Earrings',       details: 'Beautiful earrings with natural Burmese rubies and diamond accents in 22K gold.',                           icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[10] },
  { id: 37, name: 'Emerald Drop Earrings',   category: 'Earrings',  weight: 8.5,  purity: '22K', description: 'Emerald & Diamond Drops',     details: 'Stunning drop earrings with Colombian emeralds surrounded by diamonds in 22K gold.',                         icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[11] },
  { id: 38, name: 'Filigree Earrings',       category: 'Earrings',  weight: 6.2,  purity: '22K', description: 'Handcrafted Filigree',        details: 'Delicate filigree earrings handcrafted in 22K gold. A masterpiece of artisanship.',                         icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[12] },
  { id: 39, name: 'Temple Earrings',         category: 'Earrings',  weight: 13.0, purity: '22K', description: 'Temple Art Earrings',         details: 'Traditional temple earrings with deity motifs in 22K gold. Divine and auspicious.',                         icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[13] },

  // ── BRACELETS / BANGLES ────────────────────────────────────────────────
  { id: 40, name: 'Bangle Trio Set',         category: 'Bracelets', weight: 42.0, purity: '22K', description: 'Hand Engraved 22K Bangles',   details: 'Set of three 22K gold bangles with hand-engraved motifs and subtle diamond accents.',                      icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[0] },
  { id: 41, name: 'Antique Kada Bracelet',   category: 'Bracelets', weight: 36.2, purity: '22K', description: 'Hand Hammered Finish',        details: 'Heavy 22K gold kada with traditional hammered finish and subtle engraving. A statement piece.',              icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[1] },
  { id: 42, name: 'Meenakari Bangle Set',    category: 'Bracelets', weight: 28.5, purity: '22K', description: 'Colorful Meenakari Bangles',  details: 'Gorgeous set of two bangles with vibrant Meenakari enamel work in 22K gold.',                              icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[2] },
  { id: 43, name: 'Classic Gold Bangle',     category: 'Bracelets', weight: 22.0, purity: '22K', description: 'Plain Classic Bangle 22K',    details: 'Elegant plain gold bangle in 22K. A timeless classic for everyday or special occasions.',                  icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[3] },
  { id: 44, name: 'Diamond Bangle',          category: 'Bracelets', weight: 18.4, purity: '18K', description: 'Diamond Line Bangle',         details: 'Stunning bangle in 18K white gold with a line of round brilliant diamonds.',                               icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[4] },

  // ── PENDANTS ───────────────────────────────────────────────────────────
  { id: 45, name: 'Temple Pendant',          category: 'Pendants',  weight: 18.4, purity: '22K', description: 'Goddess Lakshmi Design',      details: 'Exquisite temple pendant depicting Goddess Lakshmi, handcrafted with fine detailing in 22K gold.',          icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[0] },
  { id: 46, name: 'Peacock Motif Pendant',   category: 'Pendants',  weight: 14.9, purity: '22K', description: 'Ruby & Diamond Accents',      details: 'Beautiful peacock pendant with natural rubies and sparkling diamonds in 22K gold.',                        icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[1] },
  { id: 47, name: 'Diamond Heart Pendant',   category: 'Pendants',  weight: 8.5,  purity: '18K', description: 'Heart Diamond 18K',           details: 'Romantic heart-shaped diamond pendant in 18K white gold with pear-shaped diamond.',                        icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[2] },
  { id: 48, name: 'Om Gold Pendant',         category: 'Pendants',  weight: 7.2,  purity: '22K', description: 'Sacred Om Symbol 22K',        details: 'Beautifully crafted Om pendant in 22K gold. A spiritual heirloom.',                                       icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[3] },
  { id: 49, name: 'Ganesh Gold Pendant',     category: 'Pendants',  weight: 11.0, purity: '22K', description: 'Lord Ganesha 22K Gold',       details: 'Intricate Lord Ganesha pendant in 22K gold with detailed craftsmanship. Blessed and auspicious.',          icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[4] },
];
