import React, { useState } from 'react';
import { TAG_DESIGN_PRESETS, getRecommendedDesigns, getOptimalDesigns } from '../utils/tagDesignPresets';
import { ChevronLeft, ChevronRight, Star, Zap, Check } from 'lucide-react';

const TagDesignSelector = ({ 
  material = 'silicone', 
  shape = 'circle', 
  selectedDesign, 
  onDesignSelect,
  className = ''
}) => {
  const [currentCategory, setCurrentCategory] = useState('recommended');
  
  const recommendedDesigns = getRecommendedDesigns(material.toLowerCase(), shape);
  const optimalDesigns = getOptimalDesigns(material.toLowerCase(), shape);
  const allDesigns = Object.values(TAG_DESIGN_PRESETS);
  
  const categories = {
    optimal: {
      name: 'Optimal for Your Tag',
      icon: <Star className="w-4 h-4" />,
      designs: optimalDesigns,
      description: 'Perfect for your material and shape combination'
    },
    recommended: {
      name: 'Recommended',
      icon: <Zap className="w-4 h-4" />,
      designs: recommendedDesigns,
      description: 'Great choices for your tag type'
    },
    all: {
      name: 'All Designs',
      icon: null,
      designs: allDesigns,
      description: 'Browse all available design presets'
    }
  };

  const currentDesigns = categories[currentCategory].designs;

  const renderDesignPreview = (design) => {
    const isSelected = selectedDesign?.id === design.id;
    
    return (
      <div
        key={design.id}
        className={`relative cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-indigo-500 ring-offset-2 bg-indigo-50' 
            : 'hover:bg-gray-50 hover:shadow-md'
        } rounded-lg border border-gray-200 p-4`}
        onClick={() => onDesignSelect(design)}
      >
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
        )}
        
        {/* Optimal badge */}
        {optimalDesigns.some(d => d.id === design.id) && (
          <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Optimal
          </div>
        )}
        
        {/* Design preview mockup */}
        <div className="mb-3 bg-gray-100 rounded-md h-24 flex items-center justify-center relative overflow-hidden">
          <div 
            className="text-center"
            style={{
              fontFamily: design.fontFamily,
              fontSize: '10px',
              fontWeight: design.fontWeight,
              color: design.colors.text,
              textAlign: design.textAlign,
              fontStyle: design.fontStyle
            }}
          >
            <div style={{ 
              fontSize: '12px', 
              marginBottom: '2px',
              color: design.colors.text
            }}>
              BUDDY
            </div>
            <div style={{ 
              fontSize: '8px', 
              opacity: 0.7,
              color: design.colors.text
            }}>
              555-0123
            </div>
            
            {/* Show decorative elements if any */}
            {design.decorations?.map((decoration, idx) => (
              <div key={idx} className="absolute inset-0 flex items-center justify-center">
                {decoration.type === 'line' && decoration.position === 'under-name' && (
                  <div 
                    className="absolute top-8 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '20px',
                      height: decoration.width,
                      backgroundColor: decoration.color
                    }}
                  />
                )}
                {decoration.type === 'icon' && decoration.style === 'paw' && (
                  <div className="absolute top-4 left-2 text-xs" style={{ color: decoration.color }}>🐾</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Design info */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{design.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{design.description}</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded" style={{ fontFamily: design.fontFamily }}>
              Aa
            </span>
            <span style={{ color: design.colors.accent, fontSize: '10px' }}>●</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Choose Your Tag Style</h2>
        <p className="text-sm text-gray-600">
          Select a design that matches your pet's personality and your style preferences.
        </p>
      </div>
      
      {/* Category tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setCurrentCategory(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                currentCategory === key
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.icon}
              {category.name}
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full ml-1">
                {category.designs.length}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Category description */}
      <div className="p-4 bg-gray-50">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          {categories[currentCategory].icon}
          {categories[currentCategory].description}
        </p>
      </div>
      
      {/* Design grid */}
      <div className="p-4">
        {currentDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDesigns.map(renderDesignPreview)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No designs available for this category.</p>
            <button
              onClick={() => setCurrentCategory('all')}
              className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Browse all designs →
            </button>
          </div>
        )}
      </div>
      
      {/* Selected design details */}
      {selectedDesign && (
        <div className="border-t border-gray-200 p-4 bg-indigo-50">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Check className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900">{selectedDesign.name} Selected</h3>
              <p className="text-sm text-indigo-700 mt-1">{selectedDesign.preview}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-indigo-600">
                <span>Font: <code style={{ fontFamily: selectedDesign.fontFamily }}>Sample Text</code></span>
                <span>Color: <span style={{ color: selectedDesign.colors.accent }}>●</span></span>
                <span>Layout: {selectedDesign.layout}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Help text */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          💡 <strong>Tip:</strong> {material.charAt(0).toUpperCase() + material.slice(1)} tags work best with {
            optimalDesigns.length > 0 
              ? `${optimalDesigns[0].name.toLowerCase()} or ${optimalDesigns[1]?.name.toLowerCase() || 'similar'} styles`
              : 'simple, clear designs'
          } for optimal laser engraving results.
        </p>
      </div>
    </div>
  );
};

export default TagDesignSelector;
