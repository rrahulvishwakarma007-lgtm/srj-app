// Shekhar Raja Jewellers — Premium Luxury Design System
// Royal Violet + Deep Violet + Soft Cream + Gold Gradient

export const Theme = {
  // Backgrounds
  bgPrimary: '#2A1B4D',      // Royal violet — main background
  bgSecondary: '#1E1338',    // Deep violet — secondary / insets
  bgCard: '#F8F3ED',         // Soft cream — cards, modals, surfaces
  bgCardAlt: '#F5EDE3',      // Slightly warmer cream variant

  // Gold Gradient Accent (approximate with two tones)
  gold: '#D4AF37',           // Classic gold
  goldLight: '#F5D76E',      // Light highlight gold
  goldDark: '#B8975E',       // Deep antique gold

  // Text on dark violet bg
  textOnDark: '#F8F3ED',     // Cream text on violet
  textOnDarkMuted: '#C9B8A8',// Soft muted cream

  // Text on cream card
  textOnCream: '#1E1338',    // Deep violet text on cream
  textOnCreamMuted: '#5C4734',// Warm muted brown

  // Accents
  violetAccent: '#7A4B6A',   // Deep rose-violet detail
  creamAccent: '#E8D9C8',    // Soft warm border

  // Buttons
  btnPrimaryBg: '#D4AF37',   // Gold fill
  btnPrimaryText: '#1E1338', // Deep violet on gold
  btnOutline: '#D4AF37',     // Gold outline
  btnOutlineText: '#F8F3ED', // Cream text on violet when outlined

  // Shadows (for cards)
  shadow: 'rgba(30,19,56,0.18)',

  // Functional
  whatsapp: '#25D366',
  danger: '#A14D4D',
  success: '#4A7043',
};

// Typography — elegant serif for headings, clean sans for body
export const Type = {
  serif: { fontFamily: 'serif', fontWeight: '700' as const },
  serifHeavy: { fontFamily: 'serif', fontWeight: '900' as const },
  sans: { fontFamily: undefined, fontWeight: '500' as const },
  sansBold: { fontFamily: undefined, fontWeight: '700' as const },
};

// Card style base
export const Card = {
  borderRadius: 18,
  backgroundColor: '#F8F3ED',
  shadowColor: '#1E1338',
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 3,
  borderWidth: 1,
  borderColor: '#E8D9C8',
};

// Button styles
export const Button = {
  primary: {
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};