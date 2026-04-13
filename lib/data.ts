import { Product, GoldRate } from './types';

export const initialGoldRates: GoldRate[] = [
  { type: '24K Gold', price: 7850, change: 1.2, unit: 'per 10g' },
  { type: '22K Gold', price: 7200, change: -0.8, unit: 'per 10g' },
  { type: 'Silver', price: 92, change: 0.5, unit: 'per 10g' },
  { type: 'Platinum', price: 3280, change: 2.1, unit: 'per 10g' },
];

export const products: Product[] = [
  { id: 1, name: 'Royal Solitaire Ring', category: 'Rings', price: 124000, weight: 6.2, purity: '22K', description: '1.2ct VVS1 Diamond', details: 'Crafted in 22K gold with a stunning 1.2 carat VVS1 round diamond. Intricate floral engraving on the band.', icon: 'diamond-outline', color: '#C5A26F' },
  { id: 2, name: 'Heritage Necklace Set', category: 'Necklaces', price: 245000, weight: 38.5, purity: '22K', description: 'Polki Diamonds & Emeralds', details: 'Traditional heritage necklace with uncut polki diamonds and Colombian emeralds. Matching earrings included.', icon: 'flower-outline', color: '#B8975E' },
  { id: 3, name: 'Regal Hoop Earrings', category: 'Earrings', price: 68500, weight: 12.8, purity: '22K', description: 'Kundan Work with Pearls', details: 'Classic hoop earrings featuring exquisite Kundan work and natural freshwater pearls.', icon: 'ellipse-outline', color: '#D4AF37' },
  { id: 4, name: 'Bangle Trio Set', category: 'Bracelets', price: 156000, weight: 42.0, purity: '22K', description: 'Hand Engraved 22K Gold', details: 'Set of three 22K gold bangles with hand-engraved motifs and subtle diamond accents.', icon: 'ellipse', color: '#C5A26F' },
  { id: 5, name: 'Temple Pendant', category: 'Pendants', price: 89000, weight: 18.4, purity: '22K', description: 'Goddess Lakshmi Design', details: 'Exquisite temple pendant depicting Goddess Lakshmi, handcrafted with fine detailing.', icon: 'star-outline', color: '#B8975E' },
  { id: 6, name: 'Emerald Cocktail Ring', category: 'Rings', price: 198000, weight: 9.1, purity: '18K', description: '5.2ct Zambian Emerald', details: 'Statement ring featuring a 5.2 carat Zambian emerald surrounded by brilliant-cut diamonds.', icon: 'diamond-outline', color: '#C5A26F' },
  { id: 7, name: 'Diamond Mangalsutra', category: 'Necklaces', price: 167000, weight: 28.0, purity: '22K', description: '22K Gold with Diamonds', details: 'Elegant mangalsutra with 18 brilliant diamonds set in 22K gold. A timeless symbol of love.', icon: 'flower-outline', color: '#D4AF37' },
  { id: 8, name: 'Chandelier Drop Earrings', category: 'Earrings', price: 112000, weight: 15.6, purity: '22K', description: 'Rose Cut Diamonds', details: 'Stunning chandelier earrings featuring rose cut diamonds and delicate gold chains.', icon: 'ellipse-outline', color: '#B8975E' },
  { id: 9, name: 'Antique Kada Bracelet', category: 'Bracelets', price: 97000, weight: 36.2, purity: '22K', description: 'Hand Hammered Finish', details: 'Heavy 22K gold kada with traditional hammered finish and subtle engraving.', icon: 'ellipse', color: '#C5A26F' },
  { id: 10, name: 'Peacock Motif Pendant', category: 'Pendants', price: 73000, weight: 14.9, purity: '22K', description: 'Ruby & Diamond Accents', details: 'Beautiful peacock pendant with natural rubies and sparkling diamonds.', icon: 'star-outline', color: '#D4AF37' },
  { id: 11, name: 'Vintage Signet Ring', category: 'Rings', price: 54000, weight: 8.7, purity: '22K', description: 'Engraved Family Crest', details: 'Classic signet ring in 22K gold with hand-engraved family crest motif.', icon: 'diamond-outline', color: '#B8975E' },
  { id: 12, name: 'Layered Chain Necklace', category: 'Necklaces', price: 134000, weight: 24.3, purity: '22K', description: 'Multi-Chain with Charms', details: 'Contemporary layered necklace with three 22K chains and delicate diamond charms.', icon: 'flower-outline', color: '#C5A26F' },
];