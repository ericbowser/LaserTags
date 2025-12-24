// C:\Projects\LaserTags\src\components\MaterialSelector.js
// Two-step material selection: Shape → Color

import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { SHAPES, getAvailableVariantsByShape, getShapeById } from '../config/inventory';

const MaterialSelector = ({ selectedVariant, onVariantChange }) => {
  const [step, setStep] = useState(1); // 1 = shape selection, 2 = color selection
  const [selectedShape, setSelectedShape] = useState(null);

  // Handle shape selection
  const handleShapeSelect = (shapeId) => {
    setSelectedShape(shapeId);
    setStep(2); // Move to color selection
  };

  // Handle color selection
  const handleColorSelect = (variant) => {
    onVariantChange(variant);
  };

  // Go back to shape selection
  const handleBack = () => {
    setStep(1);
    setSelectedShape(null);
  };

  // Get available colors for selected shape
  const availableColors = selectedShape ? getAvailableVariantsByShape(selectedShape) : [];

  return (
    <div className="material-selector bg-charcoal-800 rounded-2xl p-6 border border-charcoal-700">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`flex items-center gap-2 ${step === 1 ? 'text-coral-500' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 1 ? 'bg-coral-500 text-white' : 'bg-charcoal-700 text-gray-400'
          }`}>
            1
          </div>
          <span className="font-semibold">Shape</span>
        </div>
        
        <ChevronRight className="w-5 h-5 text-gray-600" />
        
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-coral-500' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 2 ? 'bg-coral-500 text-white' : 'bg-charcoal-700 text-gray-400'
          }`}>
            2
          </div>
          <span className="font-semibold">Color</span>
        </div>
      </div>

      {/* Step 1: Shape Selection */}
      {step === 1 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Choose Your Shape</h3>
          <p className="text-gray-400 mb-6">Select the tag style that fits your pet's collar</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SHAPES.map((shape) => (
              <button
                key={shape.id}
                onClick={() => handleShapeSelect(shape.id)}
                className="group bg-charcoal-900 rounded-xl p-6 border-2 border-charcoal-700 hover:border-coral-500 transition-all duration-200 transform hover:scale-105 hover:shadow-coral"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {shape.icon}
                </div>
                <h4 className="font-bold text-white mb-1">{shape.displayName}</h4>
                <p className="text-xs text-gray-400 mb-2">{shape.description}</p>
                
                {shape.badge && (
                  <span className="inline-block px-2 py-1 bg-coral-500/10 text-coral-500 text-xs font-bold rounded">
                    {shape.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Color Selection */}
      {step === 2 && selectedShape && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Shapes</span>
            </button>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            Choose Your Color
            <span className="text-gray-500 ml-2">({getShapeById(selectedShape)?.displayName})</span>
          </h3>
          <p className="text-gray-400 mb-6">
            {availableColors.length} colors available
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableColors.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleColorSelect(variant)}
                className={`group bg-charcoal-900 rounded-xl overflow-hidden border-2 transition-all duration-200 transform hover:scale-105 ${
                  selectedVariant?.id === variant.id
                    ? 'border-coral-500 shadow-coral'
                    : 'border-charcoal-700 hover:border-coral-500'
                }`}
              >
                {/* Image Preview */}
                <div className="aspect-square bg-neutral-100 relative flex items-center justify-center p-4">
                  <img
                    src={variant.image}
                    alt={`${variant.color} ${getShapeById(selectedShape)?.name}`}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-200"
                  />
                  
                  {/* Selected Checkmark */}
                  {selectedVariant?.id === variant.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Popular Badge */}
                  {variant.badge && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-charcoal-900 px-2 py-1 rounded text-xs font-bold">
                      {variant.badge}
                    </div>
                  )}
                </div>

                {/* Color Name */}
                <div className="p-3 bg-charcoal-900">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{variant.color}</span>
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Summary (shown at bottom when variant is selected) */}
      {selectedVariant && step === 2 && (
        <div className="mt-6 p-4 bg-coral-500/10 border border-coral-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-coral-500" />
              <div>
                <p className="text-sm text-gray-400">Selected Tag:</p>
                <p className="font-bold text-white">
                  {selectedVariant.color} {getShapeById(selectedShape)?.displayName}
                </p>
              </div>
            </div>
            <div className="w-16 h-16 bg-white rounded-lg p-2">
              <img
                src={selectedVariant.image}
                alt="Selected tag"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;
