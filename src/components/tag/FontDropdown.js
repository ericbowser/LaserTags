// C:\Projects\LaserTags\src\components\FontDropdown.js
import React from 'react';
import { AVAILABLE_FONTS, getFontById } from '../../config/fonts';
import { ChevronDown } from 'lucide-react';

const FontDropdown = ({ selectedFont, onFontChange, previewText = "Pet Name" }) => {
  const selectedFontData = getFontById(selectedFont);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (fontId) => {
    onFontChange(fontId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
        Font Style
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all flex items-center justify-between hover:border-light-primary dark:hover:border-dark-primary"
      >
        <div className="flex items-center gap-3">
          <span
            className="text-base"
            style={{ fontFamily: selectedFontData?.family }}
          >
            {previewText}
          </span>
          <span className="text-light-textMuted dark:text-dark-textMuted">
            {selectedFontData?.name} • {selectedFontData?.style}
          </span>
          {selectedFontData?.badge && (
            <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded">
              {selectedFontData.badge}
            </span>
          )}
          {selectedFontData?.recommendedFor === 'feminine' && (
            <span className="text-xs px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded">
              ✨ Girl Pets
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-light-textMuted dark:text-dark-textMuted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-lg shadow-lg dark:shadow-card-dark max-h-96 overflow-y-auto">
            {AVAILABLE_FONTS.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => handleSelect(font.id)}
                className={`w-full px-4 py-3 text-left hover:bg-light-surface dark:hover:bg-dark-surfaceHover transition-colors border-b border-light-border dark:border-dark-border last:border-b-0 ${
                  selectedFont === font.id ? 'bg-light-surface dark:bg-dark-surfaceHover' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div
                      className="bg-light-tagBg dark:bg-dark-tagBg text-light-text dark:text-dark-text text-lg mb-1 px-2 py-1 rounded"
                      style={{ fontFamily: font.family }}
                    >
                      {previewText}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                        {font.name}
                      </span>
                      <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
                        {font.style}
                      </span>
                      {font.badge && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded">
                          {font.badge}
                        </span>
                      )}
                      {font.recommendedFor === 'feminine' && (
                        <span className="text-xs px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded">
                          ✨ Girl Pets
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedFont === font.id && (
                    <div className="ml-3 text-light-primary dark:text-dark-primary">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FontDropdown;

