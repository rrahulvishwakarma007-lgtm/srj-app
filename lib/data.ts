import { Product, GoldRate } from './types';

export const initialGoldRates: GoldRate[] = [
  { type: '24K Gold', price: 9850, change: 1.2,  unit: 'per 10g' },
  { type: '22K Gold', price: 9020, change: -0.8, unit: 'per 10g' },
  { type: '18K Gold', price: 7380, change: 0.6,  unit: 'per 10g' },
  { type: 'Silver',   price: 112,  change: 0.5,  unit: 'per 10g' },
  { type: 'Platinum', price: 3480, change: 2.1,  unit: 'per 10g' },
];

// ── Google Drive direct URL helper ────────────────────────────────────────────
const gd = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;

// ── RING IMAGES (7 from Google Drive) ─────────────────────────────────────────
const RING_IMAGES = [
  gd('1IB_iNGjIlPQl2h4rqNfypU-Uqtrl2egk'),
  gd('1y9O-LEkRfva8KAYrRvQwtYSuqce71jRL'),
  gd('199ujiz-55egisPpSz57JO_7JIlNPsaqK'),
  gd('1quBTTS1bwijG-XAoT_7RLfQqBgk3kp_W'),
  gd('1LwA1xfMggIH_KywUUUuEEf9WJtpXdxmN'),
  gd('1nQRYBdiR2VFjhf85y9aTyGzfuTv-KHk6'),
  gd('1275Tcoywws7DtFDVQ4UmzEvVk9FnRy9d'),
];

// ── NECKLACE IMAGES (6 from Google Drive) ─────────────────────────────────────
const NECKLACE_IMAGES = [
  gd('178WZEQ5UhlSu0NJ2D7buXiBFyhRXd0TN'),
  gd('1etFrF2xVdxtcEYDZkAPD4NNZwNGkUmWN'),
  gd('1gjyEU0uPpfHKiuvoTfR847mkr2J5LHqW'),
  gd('1ZYL2io58ZBM3Zj5TUb29yZzIZCBpERVp'),
  gd('1MGHQ9y1ZwLSZFwyWzqPLMy4s2u0s4YCw'),
  gd('1u28Db88v2mghzWUUf8wweLxtWygCLxwr'),
];

// ── EARRING IMAGES (6 from Google Drive) ──────────────────────────────────────
const EARRING_IMAGES = [
  gd('1rz-e2uhRWYQsOyEJG_O0B3dekF0kpu43'),
  gd('1UFEF3zn8NKjGHxJjmlaAa4ZF0utIVwae'),
  gd('1UBsPeXQU5XHUyVjpeT3iSIyTt1PJPIRx'),
  gd('1VpZkJ5u7IVaj3ifTBMbHC2IJsvCCh-qh'),
  gd('1zdHsdwLPyBt6O5Zf4zk_i-XmDvcB7IRv'),
  gd('1WmTgcFqU_UT3rFMeXmeWIF-68DJgsO05'),
];

// ── BANGLE IMAGES (5 from Google Drive) ───────────────────────────────────────
const BANGLE_IMAGES = [
  gd('1bOjrDufMVW8WSHXRVaWvwSgaFVrNPafB'),
  gd('1JMwkg6uXC_tnnB9ytEUolrehfj6f4-nv'),
  gd('1qdjSq4qUROtXjSEEfSR5AEWrbGWwJhve'),
  gd('1t2DbNoLDld25xryH5owdAAbDoFs674RW'),
  gd('1Q7P4-Yi-_tJ48rD3OW6P5OjuwFCTXGWs'),
];

// ── CHAIN IMAGES (5 from Google Drive) ────────────────────────────────────────
const CHAIN_IMAGES = [
  gd('1uFouP3vJqRn3xg0_-XaYF5WstCjDmoOK'),
  gd('1Js6g0OUeKC8dNVhqHczaP0XhjcYn6cgP'),
  gd('1w9ywVe_xPI8JL7yzHo5bH8B-exvYgHYf'),
  gd('1zZrMUlrPdYgzEX3u679ogJTj9TY3Tord'),
  gd('18EZBNVN3MvqiKdXrVOf-xDn76YTXEE21'),
];

// ── PENDANT IMAGES — keeping necklace images as fallback ──────────────────────
const PENDANT_IMAGES = [
  gd('1gjyEU0uPpfHKiuvoTfR847mkr2J5LHqW'),
  gd('1ZYL2io58ZBM3Zj5TUb29yZzIZCBpERVp'),
  gd('1etFrF2xVdxtcEYDZkAPD4NNZwNGkUmWN'),
  gd('1MGHQ9y1ZwLSZFwyWzqPLMy4s2u0s4YCw'),
  gd('1u28Db88v2mghzWUUf8wweLxtWygCLxwr'),
];

// NO PRICE FIELD — customers enquire on WhatsApp
export const products: Product[] = [

  // ── RINGS ──────────────────────────────────────────────────────────────────
  { id: 1,  name: 'Royal Solitaire Ring',    category: 'Rings',     weight: 6.2,  purity: '22K', description: 'VVS1 Diamond Ring',          details: 'Crafted in 22K gold with a VVS1 round diamond. Intricate floral engraving on the band.',                      icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[0] },
  { id: 2,  name: 'Emerald Cocktail Ring',   category: 'Rings',     weight: 9.1,  purity: '18K', description: 'Zambian Emerald & Diamonds',  details: 'Statement ring with Zambian emerald surrounded by brilliant-cut diamonds in 18K gold.',                       icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[1] },
  { id: 3,  name: 'Vintage Signet Ring',     category: 'Rings',     weight: 8.7,  purity: '22K', description: 'Engraved Family Crest',       details: 'Classic signet ring in 22K gold with hand-engraved motif. A timeless heirloom piece.',                       icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[2] },
  { id: 4,  name: 'Diamond Eternity Band',   category: 'Rings',     weight: 5.4,  purity: '18K', description: 'Full Eternity Diamond Ring',  details: 'Full eternity band in 18K gold with 24 round brilliant diamonds. Perfect for anniversaries.',                 icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[3] },
  { id: 5,  name: 'Gents Bold Ring',         category: 'Rings',     weight: 10.2, purity: '22K', description: 'Bold Gents Design 22K',       details: 'Heavy bold gents ring in 22K gold with traditional engraving. A signature piece for men.',                   icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[4] },
  { id: 6,  name: 'Kundan Bridal Ring',      category: 'Rings',     weight: 7.8,  purity: '22K', description: 'Kundan & Meenakari Work',     details: 'Bridal ring with intricate Kundan setting and colorful Meenakari enamel work.',                              icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[5] },
  { id: 7,  name: 'Luxury Ring',             category: 'Rings',     weight: 5.9,  purity: '22K', description: 'SRJ Premium Collection',      details: 'Premium luxury ring in 22K gold. SRJ signature design.',                                                    icon: 'diamond-outline', color: '#8C5C2D', image: RING_IMAGES[6] },

  // ── NECKLACES ──────────────────────────────────────────────────────────────
  { id: 11, name: 'Heritage Necklace Set',   category: 'Necklaces', weight: 38.5, purity: '22K', description: 'Polki Diamonds & Emeralds',  details: 'Traditional heritage necklace with uncut polki diamonds and Colombian emeralds. Matching earrings included.',  icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[0] },
  { id: 12, name: 'Bridal Necklace',         category: 'Necklaces', weight: 28.0, purity: '22K', description: 'Bridal Gold Necklace',        details: 'Stunning bridal necklace in 22K gold. Perfect for weddings and special occasions.',                           icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[1] },
  { id: 13, name: 'Kundan Necklace',         category: 'Necklaces', weight: 45.0, purity: '22K', description: 'Kundan Polki Design',         details: 'Grand Kundan necklace with polki diamonds in 22K gold.',                                                    icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[2] },
  { id: 14, name: 'Antique Rani Haar',       category: 'Necklaces', weight: 62.0, purity: '22K', description: 'Traditional Rani Haar',       details: 'Magnificent Rani Haar in 22K gold with ruby and emerald accents. A bridal showstopper.',                    icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[3] },
  { id: 15, name: 'Temple Necklace',         category: 'Necklaces', weight: 22.5, purity: '22K', description: 'Temple Art Necklace',         details: 'Traditional temple necklace with deity motifs in 22K gold with antique finish.',                             icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[4] },
  { id: 16, name: 'Gold Choker Necklace',    category: 'Necklaces', weight: 24.3, purity: '22K', description: 'Classic Gold Choker',         details: 'Elegant close-fitting choker in 22K gold with intricate filigree work.',                                   icon: 'flower-outline',  color: '#8C5C2D', image: NECKLACE_IMAGES[5] },

  // ── EARRINGS ───────────────────────────────────────────────────────────────
  { id: 26, name: 'Gold Earrings',           category: 'Earrings',  weight: 12.8, purity: '22K', description: 'Classic Gold Earrings',       details: 'Elegant 22K gold earrings. Lightweight and perfect for all occasions.',                                      icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[0] },
  { id: 27, name: 'Jhumka Earrings',         category: 'Earrings',  weight: 15.6, purity: '22K', description: 'Traditional Jhumka',          details: 'Classic jhumka earrings in 22K gold. A timeless Indian jewellery staple.',                                  icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[1] },
  { id: 28, name: 'Chandbali Earrings',      category: 'Earrings',  weight: 9.4,  purity: '22K', description: 'Royal Chandbali Design',      details: 'Royal chandbali earrings with stone work in 22K gold.',                                                     icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[2] },
  { id: 29, name: 'Drop Earrings',           category: 'Earrings',  weight: 11.0, purity: '22K', description: 'Gold Drop Earrings',          details: 'Beautiful gold drop earrings in 22K. Elegant and versatile.',                                               icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[3] },
  { id: 30, name: 'Stud Earrings',           category: 'Earrings',  weight: 8.0,  purity: '22K', description: 'Gold Stud Earrings',          details: 'Classic gold stud earrings in 22K. Perfect for everyday wear.',                                            icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[4] },
  { id: 31, name: 'Pearl Drop Earrings',     category: 'Earrings',  weight: 7.8,  purity: '22K', description: 'Pearl & Gold Drop Earrings',  details: 'Elegant drop earrings with pearl accents in 22K gold setting.',                                            icon: 'ellipse-outline', color: '#8C5C2D', image: EARRING_IMAGES[5] },

  // ── BANGLES / BRACELETS ────────────────────────────────────────────────────
  { id: 40, name: 'Gold Bangles Set',        category: 'Bracelets', weight: 42.0, purity: '22K', description: 'Traditional Gold Bangles',    details: 'Set of gold bangles in 22K. Traditional design perfect for all occasions.',                                  icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[0] },
  { id: 41, name: 'Designer Bangles',        category: 'Bracelets', weight: 36.2, purity: '22K', description: 'Designer Gold Bangles',       details: 'Beautifully designed gold bangles in 22K with intricate detailing.',                                         icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[1] },
  { id: 42, name: 'Antique Bangles',         category: 'Bracelets', weight: 28.5, purity: '22K', description: 'Antique Finish Bangles',      details: 'Traditional antique finish bangles in 22K gold. A timeless classic.',                                       icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[2] },
  { id: 43, name: 'Bridal Bangles',          category: 'Bracelets', weight: 22.0, purity: '22K', description: 'Bridal Gold Bangles',         details: 'Elegant bridal bangles in 22K gold. Perfect for weddings.',                                                 icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[3] },
  { id: 44, name: 'Kada Bangles',            category: 'Bracelets', weight: 18.4, purity: '22K', description: 'Heavy Gold Kada',             details: 'Heavy gold kada in 22K. A statement piece for special occasions.',                                           icon: 'ellipse',         color: '#8C5C2D', image: BANGLE_IMAGES[4] },

  // ── CHAINS ─────────────────────────────────────────────────────────────────
  { id: 50, name: 'Gold Chain',              category: 'Chains',    weight: 15.0, purity: '22K', description: 'Everyday Gold Chain',         details: 'Classic everyday wear 22K gold chain. 916 certified and hallmarked.',                                        icon: 'flower-outline',  color: '#8C5C2D', image: CHAIN_IMAGES[0] },
  { id: 51, name: 'Figaro Chain',            category: 'Chains',    weight: 18.0, purity: '22K', description: 'Figaro Style Gold Chain',     details: 'Italian figaro style gold chain in 22K. Strong and elegant.',                                               icon: 'flower-outline',  color: '#8C5C2D', image: CHAIN_IMAGES[1] },
  { id: 52, name: 'Box Chain',               category: 'Chains',    weight: 12.0, purity: '22K', description: 'Box Link Gold Chain',         details: 'Classic box link gold chain in 22K. Durable and versatile.',                                                icon: 'flower-outline',  color: '#8C5C2D', image: CHAIN_IMAGES[2] },
  { id: 53, name: 'Rope Chain',              category: 'Chains',    weight: 14.0, purity: '22K', description: 'Rope Style Gold Chain',       details: 'Beautiful rope-style gold chain in 22K. Suitable for pendants or worn alone.',                              icon: 'flower-outline',  color: '#8C5C2D', image: CHAIN_IMAGES[3] },
  { id: 54, name: 'Curb Chain',              category: 'Chains',    weight: 20.0, purity: '22K', description: 'Heavy Curb Gold Chain',       details: 'Heavy curb chain in 22K gold. A bold statement piece.',                                                     icon: 'flower-outline',  color: '#8C5C2D', image: CHAIN_IMAGES[4] },

  // ── PENDANTS ───────────────────────────────────────────────────────────────
  { id: 45, name: 'Temple Pendant',          category: 'Pendants',  weight: 18.4, purity: '22K', description: 'Goddess Lakshmi Design',      details: 'Exquisite temple pendant depicting Goddess Lakshmi, handcrafted with fine detailing in 22K gold.',          icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[0] },
  { id: 46, name: 'Peacock Motif Pendant',   category: 'Pendants',  weight: 14.9, purity: '22K', description: 'Ruby & Diamond Accents',      details: 'Beautiful peacock pendant with natural rubies and sparkling diamonds in 22K gold.',                        icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[1] },
  { id: 47, name: 'Diamond Heart Pendant',   category: 'Pendants',  weight: 8.5,  purity: '18K', description: 'Heart Diamond 18K',           details: 'Romantic heart-shaped diamond pendant in 18K white gold with pear-shaped diamond.',                        icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[2] },
  { id: 48, name: 'Om Gold Pendant',         category: 'Pendants',  weight: 7.2,  purity: '22K', description: 'Sacred Om Symbol 22K',        details: 'Beautifully crafted Om pendant in 22K gold. A spiritual heirloom.',                                       icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[3] },
  { id: 49, name: 'Ganesh Gold Pendant',     category: 'Pendants',  weight: 11.0, purity: '22K', description: 'Lord Ganesha 22K Gold',       details: 'Intricate Lord Ganesha pendant in 22K gold with detailed craftsmanship. Blessed and auspicious.',          icon: 'star-outline',    color: '#8C5C2D', image: PENDANT_IMAGES[4] },
];
