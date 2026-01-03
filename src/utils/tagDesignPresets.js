// Custom Tag Design Presets
// These are predefined styles customers can choose from

export const TAG_DESIGN_PRESETS = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Clean and timeless design',
    preview: 'Simple, readable text with classic fonts',
    fontFamily: '"Times New Roman", serif',
    fontSize: {
      petName: '16px',
      line1: '14px',
      line2: '14px',
      line3: '14px'
    },
    fontWeight: '800',
    textAlign: 'center',
    lineSpacing: '2px',
    colors: {
      text: '#1f2937',
      accent: '#4f46e5',
      background: 'transparent'
    },
    layout: 'centered',
    decorations: [],
    qrCodeStyle: {
      size: 100,
      position: 'center',
      backgroundColor: '#ffffff',
      foregroundColor: '#000000'
    }
  },
  
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary minimalist style',
    preview: 'Clean lines with modern typography',
    fontFamily: '"Helvetica Neue", "Arial", sans-serif',
    fontSize: {
      petName: '20px',
      line1: '14px',
      line2: '12px',
      line3: '10px'
    },
    fontWeight: '300',
    textAlign: 'left',
    lineSpacing: '6px',
    colors: {
      text: '#111827',
      accent: '#06d6a0',
      background: 'transparent'
    },
    layout: 'left-aligned',
    decorations: [
      { type: 'line', position: 'under-name', style: 'solid', color: '#06d6a0', width: '2px' }
    ],
    qrCodeStyle: {
      size: 55,
      position: 'bottom-right',
      backgroundColor: '#ffffff',
      foregroundColor: '#111827'
    }
  },
  
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated script fonts',
    preview: 'Graceful typography with decorative elements',
    fontFamily: '"Playfair Display", "Georgia", serif',
    fontSize: {
      petName: '22px',
      line1: '14px',
      line2: '12px',
      line3: '10px'
    },
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'center',
    lineSpacing: '8px',
    colors: {
      text: '#374151',
      accent: '#d97706',
      background: 'transparent'
    },
    layout: 'centered',
    decorations: [
      { type: 'flourish', position: 'above-name', style: 'swirl', color: '#d97706' },
      { type: 'flourish', position: 'below-name', style: 'swirl', color: '#d97706' }
    ],
    qrCodeStyle: {
      size: 65,
      position: 'center',
      backgroundColor: '#f9fafb',
      foregroundColor: '#374151'
    }
  },
  
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Strong, eye-catching design',
    preview: 'High contrast with bold typography',
    fontFamily: '"Arial Black", "Helvetica", sans-serif',
    fontSize: {
      petName: '24px',
      line1: '16px',
      line2: '14px',
      line3: '12px'
    },
    fontWeight: '900',
    textAlign: 'center',
    lineSpacing: '2px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    colors: {
      text: '#1f2937',
      accent: '#ef4444',
      background: 'transparent'
    },
    layout: 'centered',
    decorations: [
      { type: 'border', position: 'around-text', style: 'solid', color: '#ef4444', width: '2px' }
    ],
    qrCodeStyle: {
      size: 70,
      position: 'center',
      backgroundColor: '#ffffff',
      foregroundColor: '#1f2937'
    }
  },
  
  playful: {
    id: 'playful',
    name: 'Playful',
    description: 'Fun and friendly design',
    preview: 'Cheerful colors with rounded fonts',
    fontFamily: '"Quicksand", "Comic Sans MS", cursive',
    fontSize: {
      petName: '20px',
      line1: '14px',
      line2: '12px',
      line3: '10px'
    },
    fontWeight: '600',
    textAlign: 'center',
    lineSpacing: '6px',
    colors: {
      text: '#7c3aed',
      accent: '#f59e0b',
      background: 'transparent'
    },
    layout: 'centered',
    decorations: [
      { type: 'icon', position: 'left-of-name', style: 'paw', color: '#f59e0b', size: '16px' },
      { type: 'icon', position: 'right-of-name', style: 'paw', color: '#f59e0b', size: '16px' }
    ],
    qrCodeStyle: {
      size: 60,
      position: 'center',
      backgroundColor: '#fef3c7',
      foregroundColor: '#7c3aed'
    }
  },
  
  rustic: {
    id: 'rustic',
    name: 'Rustic',
    description: 'Natural, outdoorsy feel',
    preview: 'Earthy tones with handcrafted style',
    fontFamily: '"Courier New", "Monaco", monospace',
    fontSize: {
      petName: '18px',
      line1: '13px',
      line2: '11px',
      line3: '9px'
    },
    fontWeight: '500',
    textAlign: 'center',
    lineSpacing: '5px',
    colors: {
      text: '#92400e',
      accent: '#059669',
      background: 'transparent'
    },
    layout: 'centered',
    decorations: [
      { type: 'texture', position: 'background', style: 'wood-grain', opacity: '0.1' },
      { type: 'icon', position: 'above-name', style: 'tree', color: '#059669', size: '14px' }
    ],
    qrCodeStyle: {
      size: 58,
      position: 'center',
      backgroundColor: '#fef7ed',
      foregroundColor: '#92400e'
    }
  },
  
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean and simple',
    preview: 'Just the essentials, nothing more',
    fontFamily: '"SF Pro Text", "Helvetica Neue", sans-serif',
    fontSize: {
      petName: '16px',
      line1: '12px',
      line2: '10px',
      line3: '8px'
    },
    fontWeight: '400',
    textAlign: 'center',
    lineSpacing: '8px',
    colors: {
      text: '#6b7280',
      accent: '#6b7280',
      background: 'transparent'
    },
    layout: 'centered',
    decorations: [],
    qrCodeStyle: {
      size: 50,
      position: 'center',
      backgroundColor: '#ffffff',
      foregroundColor: '#374151'
    }
  },
  
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury design with gold accents',
    preview: 'High-end styling for discerning pet owners',
    fontFamily: '"Cormorant Garamond", "Times", serif',
    fontSize: {
      petName: '22px',
      line1: '15px',
      line2: '13px',
      line3: '11px'
    },
    fontWeight: '500',
    textAlign: 'center',
    lineSpacing: '6px',
    colors: {
      text: '#1f2937',
      accent: '#d97706', // Gold
      background: 'transparent'
    },
    layout: 'centered',
    decorations: [
      { type: 'border', position: 'around-tag', style: 'double', color: '#d97706', width: '1px' },
      { type: 'line', position: 'under-name', style: 'decorative', color: '#d97706', width: '1px' }
    ],
    qrCodeStyle: {
      size: 65,
      position: 'center',
      backgroundColor: '#fffbeb',
      foregroundColor: '#1f2937'
    }
  }
};

// Material-specific design recommendations
export const MATERIAL_DESIGN_COMPATIBILITY = {
  silicone: {
    recommended: ['classic', 'modern', 'bold', 'playful'],
    optimal: ['modern', 'bold'], // Best engraving results
    avoid: [] // Silicone works well with all designs
  },
  metal: {
    recommended: ['elegant', 'premium', 'minimal', 'rustic'],
    optimal: ['elegant', 'premium'],
    avoid: ['playful'] // Playful doesn't suit metal aesthetic
  },
  wood: {
    recommended: ['rustic', 'elegant', 'classic', 'minimal'],
    optimal: ['rustic'],
    avoid: ['modern', 'bold'] // Can be too harsh for wood
  }
};

// Shape-specific layout adjustments
export const SHAPE_LAYOUT_ADJUSTMENTS = {
  circle: {
    textAlign: 'center',
    maxLines: 3,
    fontSize: { multiplier: 0.9 }, // Slightly smaller for circular constraints
    qrCodePosition: 'center'
  },
  bone: {
    textAlign: 'center',
    maxLines: 3,
    fontSize: { multiplier: 1.0 },
    qrCodePosition: 'center'
  },
  rectangle: {
    textAlign: 'left',
    maxLines: 4,
    fontSize: { multiplier: 1.1 }, // Can be larger
    qrCodePosition: 'right'
  },
  hexagon: {
    textAlign: 'center',
    maxLines: 3,
    fontSize: { multiplier: 0.95 },
    qrCodePosition: 'center'
  },
  triangle: {
    textAlign: 'center',
    maxLines: 2, // Limited space
    fontSize: { multiplier: 0.8 },
    qrCodePosition: 'center'
  }
};

// Design preset utility functions
export const getRecommendedDesigns = (material, shape) => {
  const materialRecommendations = MATERIAL_DESIGN_COMPATIBILITY[material]?.recommended || [];
  return materialRecommendations.map(designId => TAG_DESIGN_PRESETS[designId]).filter(Boolean);
};

export const getOptimalDesigns = (material, shape) => {
  const materialOptimal = MATERIAL_DESIGN_COMPATIBILITY[material]?.optimal || [];
  return materialOptimal.map(designId => TAG_DESIGN_PRESETS[designId]).filter(Boolean);
};

export const applyShapeAdjustments = (design, shape) => {
  const shapeAdjustments = SHAPE_LAYOUT_ADJUSTMENTS[shape] || {};
  
  return {
    ...design,
    textAlign: shapeAdjustments.textAlign || design.textAlign,
    fontSize: {
      ...design.fontSize,
      ...(shapeAdjustments.fontSize?.multiplier ? Object.keys(design.fontSize).reduce((acc, key) => {
        acc[key] = `${parseInt(design.fontSize[key]) * shapeAdjustments.fontSize.multiplier}px`;
        return acc;
      }, {}) : {})
    },
    qrCodeStyle: {
      ...design.qrCodeStyle,
      position: shapeAdjustments.qrCodePosition || design.qrCodeStyle.position
    }
  };
};
