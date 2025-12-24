// C:\Projects\LaserTags\src\config\inventory.js
// Complete LaserTags Silicone Tag Inventory
// Two-step selection: Shape → Color

// Import all tag images
import darkblueBone from '../assets/Materials/Silicone/darkblue_bone.png';
import grayBone from '../assets/Materials/Silicone/gray_bone.png';
import lightpinkBone from '../assets/Materials/Silicone/lightpink_bone.png';
import offwhiteBone from '../assets/Materials/Silicone/offwhite_bone.png';
import orangeBone from '../assets/Materials/Silicone/orange_bone.png';
import whiteBone from '../assets/Materials/Silicone/white_bone.png';
import yellowBone from '../assets/Materials/Silicone/yellow_bone.png';

import blueCircle from '../assets/Materials/Silicone/blue_circ.jpg';
import lightblueCircle from '../assets/Materials/Silicone/lightblue_circ.png';
import orangeCircle from '../assets/Materials/Silicone/orange_circ.png';
import redCircle from '../assets/Materials/Silicone/red_circ.png';
import whiteCircle from '../assets/Materials/Silicone/white_circ.png';

import blueRect from '../assets/Materials/Silicone/blue_rect.png';
import darkblueRect from '../assets/Materials/Silicone/darkblue_rect.png';
import grayRect from '../assets/Materials/Silicone/gray_rect.png';
import greenRect from '../assets/Materials/Silicone/green_rect.png';
import lightblueRect from '../assets/Materials/Silicone/lightblue_rect.png';
import lightpinkRect from '../assets/Materials/Silicone/lightpink_rect.png';
import lightpurpleRect from '../assets/Materials/Silicone/lightpurple_rect.png';
import orangeRect from '../assets/Materials/Silicone/orange_rect.png';
import pinkRect from '../assets/Materials/Silicone/pink_rect.png';
import purpleRect from '../assets/Materials/Silicone/purple_rect.png';
import redRect from '../assets/Materials/Silicone/red_rect.png';
import turquoiseRect from '../assets/Materials/Silicone/turquoise_rect.png';
import yellowRect from '../assets/Materials/Silicone/yellow_rect.jpg';

import greenTri from '../assets/Materials/Silicone/green_tri.png';
import pinkTri from '../assets/Materials/Silicone/pink_tri.png';
import redTri from '../assets/Materials/Silicone/red_tri.png';

import purpleHex from '../assets/Materials/Silicone/purple_hex.png';
import turquoiseHex from '../assets/Materials/Silicone/turquoise_hex.png';

// Shape definitions
export const SHAPES = [
  {
    id: 'bone',
    name: 'Bone',
    displayName: 'Classic Bone',
    icon: '🦴',
    description: 'Traditional pet tag shape',
    popularityRank: 1
  },
  {
    id: 'rect',
    name: 'Rectangle',
    displayName: 'Rectangle',
    icon: '▭',
    description: 'Maximum engraving space',
    popularityRank: 2,
    badge: 'Most Space'
  },
  {
    id: 'circ',
    name: 'Circle',
    displayName: 'Circle',
    icon: '●',
    description: 'Sleek and modern',
    popularityRank: 3
  },
  {
    id: 'tri',
    name: 'Triangle',
    displayName: 'Triangle',
    icon: '▲',
    description: 'Unique and eye-catching',
    popularityRank: 4
  },
  {
    id: 'hex',
    name: 'Hexagon',
    displayName: 'Hexagon',
    icon: '⬡',
    description: 'Modern geometric style',
    popularityRank: 5
  }
];

// Complete inventory organized by shape
export const INVENTORY = {
  bone: [
    { id: 'bone-darkblue', color: 'Dark Blue', colorHex: '#1e3a8a', image: darkblueBone, stock: true },
    { id: 'bone-gray', color: 'Gray', colorHex: '#6b7280', image: grayBone, stock: true },
    { id: 'bone-lightpink', color: 'Light Pink', colorHex: '#fbbf24', image: lightpinkBone, stock: true, badge: 'Popular' },
    { id: 'bone-offwhite', color: 'Off White', colorHex: '#f5f5f4', image: offwhiteBone, stock: true },
    { id: 'bone-orange', color: 'Orange', colorHex: '#ea580c', image: orangeBone, stock: false, note: 'Prototype only' },
    { id: 'bone-white', color: 'White', colorHex: '#ffffff', image: whiteBone, stock: true },
    { id: 'bone-yellow', color: 'Yellow', colorHex: '#fbbf24', image: yellowBone, stock: true }
  ],
  circ: [
    { id: 'circ-blue', color: 'Blue', colorHex: '#3b82f6', image: blueCircle, stock: true },
    { id: 'circ-lightblue', color: 'Light Blue', colorHex: '#7dd3fc', image: lightblueCircle, stock: true },
    { id: 'circ-orange', color: 'Orange', colorHex: '#ea580c', image: orangeCircle, stock: false, note: 'Prototype only' },
    { id: 'circ-red', color: 'Red', colorHex: '#dc2626', image: redCircle, stock: true },
    { id: 'circ-white', color: 'White', colorHex: '#ffffff', image: whiteCircle, stock: true }
  ],
  rect: [
    { id: 'rect-blue', color: 'Blue', colorHex: '#3b82f6', image: blueRect, stock: true },
    { id: 'rect-darkblue', color: 'Dark Blue', colorHex: '#1e3a8a', image: darkblueRect, stock: true },
    { id: 'rect-gray', color: 'Gray', colorHex: '#6b7280', image: grayRect, stock: true },
    { id: 'rect-green', color: 'Green', colorHex: '#16a34a', image: greenRect, stock: true },
    { id: 'rect-lightblue', color: 'Light Blue', colorHex: '#7dd3fc', image: lightblueRect, stock: true },
    { id: 'rect-lightpink', color: 'Light Pink', colorHex: '#fbbf24', image: lightpinkRect, stock: true },
    { id: 'rect-lightpurple', color: 'Light Purple', colorHex: '#c084fc', image: lightpurpleRect, stock: true },
    { id: 'rect-orange', color: 'Orange', colorHex: '#ea580c', image: orangeRect, stock: false, note: 'Prototype only' },
    { id: 'rect-pink', color: 'Pink', colorHex: '#ec4899', image: pinkRect, stock: true, badge: 'Popular' },
    { id: 'rect-purple', color: 'Purple', colorHex: '#9333ea', image: purpleRect, stock: true },
    { id: 'rect-red', color: 'Red', colorHex: '#dc2626', image: redRect, stock: true },
    { id: 'rect-turquoise', color: 'Turquoise', colorHex: '#14b8a6', image: turquoiseRect, stock: true },
    { id: 'rect-yellow', color: 'Yellow', colorHex: '#fbbf24', image: yellowRect, stock: true }
  ],
  tri: [
    { id: 'tri-green', color: 'Green', colorHex: '#16a34a', image: greenTri, stock: true },
    { id: 'tri-pink', color: 'Pink', colorHex: '#ec4899', image: pinkTri, stock: true },
    { id: 'tri-red', color: 'Red', colorHex: '#dc2626', image: redTri, stock: true }
  ],
  hex: [
    { id: 'hex-purple', color: 'Purple', colorHex: '#9333ea', image: purpleHex, stock: true },
    { id: 'hex-turquoise', color: 'Turquoise', colorHex: '#14b8a6', image: turquoiseHex, stock: true }
  ]
};

// Helper function to get all variants for a shape
export const getVariantsByShape = (shapeId) => {
  return INVENTORY[shapeId] || [];
};

// Helper function to get available (in-stock) variants for a shape
export const getAvailableVariantsByShape = (shapeId) => {
  const variants = INVENTORY[shapeId] || [];
  return variants.filter(variant => variant.stock);
};

// Helper function to get a specific variant
export const getVariantById = (variantId) => {
  for (const shapeId in INVENTORY) {
    const variant = INVENTORY[shapeId].find(v => v.id === variantId);
    if (variant) {
      return {
        ...variant,
        shape: SHAPES.find(s => s.id === shapeId)
      };
    }
  }
  return null;
};

// Helper function to get shape by ID
export const getShapeById = (shapeId) => {
  return SHAPES.find(s => s.id === shapeId);
};

// Get total inventory count
export const getTotalInventoryCount = () => {
  let total = 0;
  for (const shapeId in INVENTORY) {
    total += INVENTORY[shapeId].length;
  }
  return total;
};

// Get in-stock inventory count
export const getInStockCount = () => {
  let total = 0;
  for (const shapeId in INVENTORY) {
    total += INVENTORY[shapeId].filter(v => v.stock).length;
  }
  return total;
};

// Summary stats
export const INVENTORY_STATS = {
  totalVariants: getTotalInventoryCount(),
  inStock: getInStockCount(),
  outOfStock: getTotalInventoryCount() - getInStockCount(),
  shapes: SHAPES.length
};
