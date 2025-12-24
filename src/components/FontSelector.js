// C:\Projects\LaserTags\src\components\FontSelector.js
import React, { useState } from 'react';
import { AVAILABLE_FONTS, getFontById } from '../config/fonts';
import '../styles/fonts.css';

const FontSelector = ({ selectedFont, onFontChange, previewText = "Bella" }) => {
  const [hoveredFont, setHoveredFont] = useState(null);

  const handleFontSelect = (fontId) => {
    onFontChange(fontId);
  };

  return (
    <div className="font-selector-container">
      <h3 className="section-title">Choose Your Font</h3>
      <p className="section-description">
        Select a font style for your pet's tag
      </p>

      {/* Font Grid */}
      <div className="font-selector-grid">
        {AVAILABLE_FONTS.map((font) => (
          <div
            key={font.id}
            className={`font-option ${
              selectedFont === font.id ? 'selected' : ''
            } ${font.recommendedFor === 'feminine' ? 'feminine' : ''}`}
            onClick={() => handleFontSelect(font.id)}
            onMouseEnter={() => setHoveredFont(font.id)}
            onMouseLeave={() => setHoveredFont(null)}
          >
            {/* Font Preview */}
            <div
              className="font-preview"
              style={{ fontFamily: font.family }}
            >
              {previewText}
            </div>

            {/* Font Info */}
            <p className="font-name">{font.name}</p>
            <p className="font-style">{font.style}</p>

            {/* Badges */}
            {font.recommendedFor === 'feminine' && (
              <span className="font-badge feminine">
                Perfect for Girl Pets
              </span>
            )}
            {font.badge && (
              <span className="font-badge popular">
                {font.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Large Preview */}
      {selectedFont && (
        <div className="selected-font-preview">
          <h4>Preview: {getFontById(selectedFont)?.name}</h4>
          <div
            className="large-preview"
            style={{ fontFamily: getFontById(selectedFont)?.family }}
          >
            {previewText}
            <br />
            (555) 123-4567
            <br />
            IF FOUND CALL
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
