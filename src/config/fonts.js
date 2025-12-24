// C:\Projects\LaserTags\src\config\fonts.js
// Font configuration for LaserTags engraving

export const AVAILABLE_FONTS = [
  {
    id: 'times-new-roman',
    name: 'Times New Roman',
    family: '"Times New Roman", serif',
    style: 'Classic',
    recommendedFor: 'neutral',
    description: 'Traditional serif font',
    displayOrder: 1,
    testOnOrange: true
  },
  {
    id: 'acme',
    name: 'Acme',
    family: 'Acme, sans-serif',
    style: 'Modern',
    recommendedFor: 'neutral',
    description: 'Clean modern sans-serif',
    displayOrder: 2,
    testOnOrange: true
  },
  {
    id: 'pacifico',
    name: 'Pacifico',
    family: 'Pacifico, cursive',
    style: 'Elegant',
    recommendedFor: 'feminine',
    description: 'Elegant script - Perfect for girl pets! ✨',
    displayOrder: 3,
    testOnOrange: true,
    badge: 'Popular',
    highlighted: true
  },
  {
    id: 'cookie',
    name: 'Cookie',
    family: 'Cookie, cursive',
    style: 'Casual',
    recommendedFor: 'feminine',
    description: 'Playful handwritten style',
    displayOrder: 4,
    testOnOrange: true,
    highlighted: true
  },
  {
    id: 'burtons',
    name: 'Burtons',
    family: 'Burtons, display',
    style: 'Playful',
    recommendedFor: 'neutral',
    description: 'Fun decorative font',
    displayOrder: 5,
    testOnOrange: true
  },
  {
    id: 'atomic-age',
    name: 'Atomic Age',
    family: '"Atomic Age", display',
    style: 'Retro',
    recommendedFor: 'neutral',
    description: 'Vintage 1950s style',
    displayOrder: 6,
    testOnOrange: true
  },
  {
    id: 'aldrich',
    name: 'Aldrich',
    family: 'Aldrich, sans-serif',
    style: 'Bold',
    recommendedFor: 'neutral',
    description: 'Strong modern sans-serif',
    displayOrder: 7,
    testOnOrange: true
  },
  {
    id: 'abril-fatface',
    name: 'Abril Fatface',
    family: '"Abril Fatface", display',
    style: 'Statement',
    recommendedFor: 'neutral',
    description: 'Bold display font',
    displayOrder: 8,
    testOnOrange: true
  }
];

// Helper function to get font by ID
export const getFontById = (fontId) => {
  return AVAILABLE_FONTS.find(font => font.id === fontId);
};

// Helper function to get fonts by category
export const getFontsByCategory = (category) => {
  if (category === 'all') return AVAILABLE_FONTS;
  return AVAILABLE_FONTS.filter(font => font.recommendedFor === category);
};

// Helper function to get feminine fonts
export const getFeminineFonts = () => {
  return AVAILABLE_FONTS.filter(font => font.recommendedFor === 'feminine');
};

// Default font
export const DEFAULT_FONT = AVAILABLE_FONTS[0];
