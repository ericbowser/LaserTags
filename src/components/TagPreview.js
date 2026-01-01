import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateQrCodeUrl, encodeQrCodeText } from '../utils/qrCodeUtils';
import { Move, RotateCcw, Type, Palette } from 'lucide-react';
import { getFontById, DEFAULT_FONT } from '../config/fonts';
import { TAG_DESIGN_PRESETS, applyShapeAdjustments } from '../utils/tagDesignPresets';

// Import accessory SVGs
import cleanPaw from '../assets/Materials/Accessories/clean_paw.svg';
import superCleanPaw from '../assets/Materials/Accessories/super_clean_paw.svg';
import simpleHeart from '../assets/Materials/Accessories/simple_heart.svg';
import facetedHeart from '../assets/Materials/Accessories/faceted_heart.svg';
import bonePaw from '../assets/Materials/Accessories/bone_paw.svg';

// Accessory definitions with imported SVGs
const ACCESSORY_ASSETS = {
  'paw_print': cleanPaw,
  'paw_clean': superCleanPaw,
  'heart': simpleHeart,
  'heart_faceted': facetedHeart,
  'bone_paw': bonePaw,
};

/**
 * Unified TagPreview Component
 * Merges TagPreview + EnhancedTagPreview functionality
 * 
 * Features:
 * - Font selection via selectedFont prop (from FontDropdown)
 * - Design presets via selectedDesign prop (optional)
 * - Text case toggle (title/uppercase)
 * - Dark mode support
 * - Accessory/decoration rendering
 * - QR code positioning and dragging
 * - Two-sided flip animation
 */
const TagPreview = ({ 
  material, 
  orderType, 
  formData, 
  qrCodePosition = { x: 50, y: 50 },
  onQrPositionChange,
  side1Config = {},
  side2Config = {},
  qrCodeSide = 2,
  qrCodeText = { line1: '', line2: '', line3: '' },
  selectedFont = null,
  selectedDesign = null,
  textCase = 'title',
  onTextCaseChange = null,
  accessories = [], // Array of { side, type, position_x, position_y, size }
  className = ''
}) => {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentSide, setCurrentSide] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);

  // Generate QR code value from text or URL
  useEffect(() => {
    if (orderType === 'database') {
      if (qrCodeText?.line1 || qrCodeText?.line2 || qrCodeText?.line3) {
        const encodedText = encodeQrCodeText(
          qrCodeText.line1 || '',
          qrCodeText.line2 || '',
          qrCodeText.line3 || ''
        );
        setQrCodeValue(encodedText);
      } else if (formData?.userid) {
        const url = generateQrCodeUrl(formData.userid);
        setQrCodeValue(url);
      }
    }
  }, [orderType, formData?.userid, qrCodeText]);

  // Normalize shape value to handle inconsistent naming
  // MaterialSelection sends: 'bone', 'rect', 'circ', 'tri', 'hex'
  // We normalize to: 'bone', 'rect', 'circle', 'tri', 'hex'
  const normalizeShape = (shape) => {
    const shapeMap = {
      'circ': 'circle',
      'rectangle': 'rect',
      'triangle': 'tri',
      'hexagon': 'hex'
    };
    return shapeMap[shape] || shape;
  };

  const normalizedShape = normalizeShape(material?.shape);

  const handleMouseDown = (e) => {
    if (orderType !== 'database' || currentSide !== qrCodeSide || !qrCodeValue) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - qrCodePosition.x,
      y: e.clientY - rect.top - qrCodePosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || orderType !== 'database' || currentSide !== qrCodeSide || !qrCodeValue) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(10, Math.min(90, ((e.clientX - rect.left - dragStart.x) / rect.width) * 100));
    const newY = Math.max(10, Math.min(90, ((e.clientY - rect.top - dragStart.y) / rect.height) * 100));
    
    if (onQrPositionChange) {
      onQrPositionChange({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleSide = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSide(currentSide === 1 ? 2 : 1);
      setIsFlipping(false);
    }, 250);
  };

  // Get font style - prioritize selectedFont prop, fallback to design preset
  const getFontStyle = (fontId) => {
    // First try the explicitly selected font
    if (fontId || selectedFont) {
      const font = getFontById(fontId || selectedFont);
      if (font) {
        return {
          fontFamily: font.family,
          fontWeight: font.style === 'Bold' || font.style === 'Statement' ? '700' : 
                      font.style === 'Modern' ? '600' : '400',
          fontStyle: font.style === 'Elegant' ? 'italic' : 'normal',
          letterSpacing: font.style === 'Retro' ? '0.1em' : '0.02em'
        };
      }
    }
    
    // Fallback to design preset if available
    if (selectedDesign) {
      const appliedDesign = applyShapeAdjustments(selectedDesign, normalizedShape);
      return {
        fontFamily: appliedDesign.fontFamily,
        fontWeight: appliedDesign.fontWeight || '600',
        fontStyle: appliedDesign.fontStyle || 'normal',
        letterSpacing: appliedDesign.letterSpacing || '0.02em'
      };
    }
    
    // Ultimate fallback to default font
    const defaultFont = DEFAULT_FONT;
    return {
      fontFamily: defaultFont.family,
      fontWeight: '600',
      fontStyle: 'normal',
      letterSpacing: '0.02em'
    };
  };

  // Get tag placeholder background style
  const getTagPlaceholderStyle = () => {
    const staticBgColor = '#d1d5db';
    const staticBorderColor = '#9ca3af';
    
    return {
      background: staticBgColor,
      border: `2px solid ${staticBorderColor}`,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.15)'
    };
  };

  // Get tag dimensions based on normalized shape
  const getTagDimensions = () => {
    const baseSize = 200;
    switch (normalizedShape) {
      case 'bone':
        return { width: baseSize * 1.2, height: baseSize * 0.8 };
      case 'tri':
        return { width: baseSize, height: baseSize * 0.9 };
      case 'rect':
        return { width: baseSize * 1.3, height: baseSize * 0.6 };
      case 'hex':
        return { width: baseSize, height: baseSize };
      case 'circle':
      default:
        return { width: baseSize, height: baseSize };
    }
  };

  // Get clip path based on normalized shape
  const getClipPath = () => {
    switch (normalizedShape) {
      case 'tri':
        return 'polygon(50% 0%, 0% 100%, 100% 100%)';
      case 'circle':
        return 'circle(50%)';
      case 'hex':
        return 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      default:
        return 'none';
    }
  };

  const dimensions = getTagDimensions();
  const showQrCode = orderType === 'database' && qrCodeValue && currentSide === qrCodeSide;
  const staticTextColor = '#1f2937';

  // Format text based on textCase setting
  const formatText = (text, caseType) => {
    if (!text) return '';
    if (caseType === 'uppercase') {
      return text.toUpperCase();
    }
    // Title case: capitalize first letter of each word
    return text.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Render accessories for a given side
  const renderAccessories = (side) => {
    const sideAccessories = accessories.filter(acc => acc.side === side);
    
    return sideAccessories.map((accessory, idx) => {
      const svgSrc = ACCESSORY_ASSETS[accessory.type];
      if (!svgSrc) return null;
      
      return (
        <img
          key={`accessory-${side}-${idx}`}
          src={svgSrc}
          alt={accessory.type}
          className="absolute pointer-events-none"
          style={{
            left: `${accessory.position_x || 50}%`,
            top: `${accessory.position_y || 50}%`,
            transform: 'translate(-50%, -50%)',
            width: `${accessory.size || 24}px`,
            height: `${accessory.size || 24}px`,
            opacity: 0.8
          }}
        />
      );
    });
  };

  // Render decorations from design preset
  const renderDecorations = (position, side) => {
    if (!selectedDesign?.decorations) return null;
    
    return selectedDesign.decorations
      .filter(decoration => decoration.position === position)
      .map((decoration, idx) => {
        switch (decoration.type) {
          case 'line':
            return (
              <div
                key={`deco-${side}-${idx}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: position.includes('name') ? '60%' : '80%',
                  height: decoration.width,
                  backgroundColor: decoration.color,
                  ...(position === 'under-name' && { top: '60%' }),
                  ...(position === 'above-name' && { top: '25%' })
                }}
              />
            );
          case 'border':
            if (position === 'around-text') {
              return (
                <div
                  key={`deco-${side}-${idx}`}
                  style={{
                    position: 'absolute',
                    inset: '10px',
                    border: `${decoration.width} ${decoration.style} ${decoration.color}`,
                    borderRadius: '4px',
                    pointerEvents: 'none'
                  }}
                />
              );
            }
            return null;
          case 'icon':
            const iconContent = decoration.style === 'paw' ? '🐾' : 
                               decoration.style === 'tree' ? '🌲' : 
                               decoration.style === 'star' ? '⭐' : '●';
            return (
              <div
                key={`deco-${side}-${idx}`}
                style={{
                  position: 'absolute',
                  color: decoration.color,
                  fontSize: decoration.size || '14px',
                  ...(position === 'left-of-name' && { left: '10%', top: '45%' }),
                  ...(position === 'right-of-name' && { right: '10%', top: '45%' }),
                  ...(position === 'above-name' && { left: '50%', top: '25%', transform: 'translateX(-50%)' })
                }}
              >
                {iconContent}
              </div>
            );
          case 'flourish':
            return (
              <div
                key={`deco-${side}-${idx}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: decoration.color,
                  fontSize: '12px',
                  ...(position === 'above-name' && { top: '20%' }),
                  ...(position === 'below-name' && { bottom: '20%' })
                }}
              >
                ◈
              </div>
            );
          default:
            return null;
        }
      });
  };

  const renderSideContent = (sideNum) => {
    const config = sideNum === 1 ? side1Config : side2Config;
    const isQrCodeSide = orderType === 'database' && qrCodeSide === sideNum;
    
    // If this side has QR code, don't render text content
    if (isQrCodeSide) {
      return null;
    }
    
    const fontId = config?.fontId || selectedFont || DEFAULT_FONT.id;
    const line1 = config?.line1 || '';
    const line2 = config?.line2 || '';
    const line3 = config?.line3 || '';
    
    if (!line1 && !line2 && !line3) return null;
    
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center z-10">
        {/* Design preset decorations */}
        {renderDecorations('background', sideNum)}
        {renderDecorations('around-text', sideNum)}
        {renderDecorations('above-name', sideNum)}
        
        {line1 && (
          <div 
            className="font-bold mb-1 drop-shadow-lg"
            style={{
              ...getFontStyle(fontId),
              fontSize: 'clamp(1.25rem, 7vw, 2.5rem)',
              color: staticTextColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.2), 0 0 2px rgba(255,255,255,0.5)',
              lineHeight: '1.2',
            }}
          >
            {formatText(line1, textCase)}
          </div>
        )}
        
        {renderDecorations('under-name', sideNum)}
        
        {line2 && (
          <div 
            className="font-semibold mb-1 drop-shadow-md"
            style={{
              ...getFontStyle(fontId),
              fontSize: sideNum === 1 ? 'clamp(1rem, 5.5vw, 2rem)' : 'clamp(0.875rem, 4.5vw, 1.5rem)',
              color: staticTextColor,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              lineHeight: '1.2',
            }}
          >
            {formatText(line2, textCase)}
          </div>
        )}
        {line3 && (
          <div 
            className="drop-shadow-md"
            style={{
              ...getFontStyle(fontId),
              fontSize: sideNum === 1 ? 'clamp(0.875rem, 4.5vw, 1.5rem)' : 'clamp(0.75rem, 4vw, 1.25rem)',
              color: staticTextColor,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              lineHeight: '1.2',
            }}
          >
            {formatText(line3, textCase)}
          </div>
        )}
        
        {renderDecorations('below-name', sideNum)}
        
        {/* Render accessories for this side */}
        {renderAccessories(sideNum)}
      </div>
    );
  };

  const renderQrCode = (sideNum) => {
    if (orderType !== 'database' || !qrCodeValue || qrCodeSide !== sideNum) {
      return null;
    }
    
    return (
      <div
        className="absolute cursor-move group z-20"
        style={{
          left: `${qrCodePosition.x}%`,
          top: `${qrCodePosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="bg-white dark:bg-gray-800 p-1 rounded shadow-lg dark:shadow-xl border-2 border-gray-300 dark:border-gray-600 group-hover:border-red-500 dark:group-hover:border-coral-500 transition-colors">
          <QRCodeSVG
            value={qrCodeValue}
            size={60}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap border border-gray-700 dark:border-gray-600">
              <Move className="w-3 h-3" />
              Drag to position
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-dark-surface rounded-xl shadow-lg dark:shadow-card-dark p-4 border border-light-border dark:border-dark-border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-light-text dark:text-dark-text">Tag Preview</h3>
          {selectedDesign && (
            <span className="inline-flex items-center gap-1 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
              <Palette className="w-3 h-3" />
              {selectedDesign.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onTextCaseChange && (
            <button
              onClick={() => {
                const newCase = textCase === 'title' ? 'uppercase' : 'title';
                onTextCaseChange(newCase);
              }}
              className="flex items-center gap-1 text-xs text-light-textMuted dark:text-dark-textMuted hover:text-light-primary dark:hover:text-dark-primary transition-colors px-2 py-1 rounded hover:bg-light-surface dark:hover:bg-dark-surfaceHover"
              title={textCase === 'title' ? 'Switch to ALL CAPS' : 'Switch to Title Case'}
            >
              <Type className="w-3 h-3" />
              <span>{textCase === 'title' ? 'Title' : 'ALL CAPS'}</span>
            </button>
          )}
          <button
            onClick={toggleSide}
            className="flex items-center gap-1 text-xs text-light-primary dark:text-dark-primary hover:text-light-primaryHover dark:hover:text-dark-primaryHover transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Flip Tag</span>
          </button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div
          className="relative"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            perspective: '1000px',
          }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: currentSide === 2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Side 1 - Front */}
            <div 
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                clipPath: getClipPath(),
                borderRadius: normalizedShape === 'circle' ? '50%' : '8px',
                ...getTagPlaceholderStyle()
              }}
              onMouseMove={qrCodeSide === 1 ? handleMouseMove : undefined}
              onMouseUp={qrCodeSide === 1 ? handleMouseUp : undefined}
              onMouseLeave={qrCodeSide === 1 ? handleMouseUp : undefined}
            >
              {renderSideContent(1)}
              {renderQrCode(1)}
              
              {/* Engravable area indicator */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 dark:border-gray-500 opacity-20 dark:opacity-30 pointer-events-none" />
            </div>

            {/* Side 2 - Back */}
            <div 
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                clipPath: getClipPath(),
                borderRadius: normalizedShape === 'circle' ? '50%' : '8px',
                ...getTagPlaceholderStyle()
              }}
              onMouseMove={qrCodeSide === 2 ? handleMouseMove : undefined}
              onMouseUp={qrCodeSide === 2 ? handleMouseUp : undefined}
              onMouseLeave={qrCodeSide === 2 ? handleMouseUp : undefined}
            >
              {renderSideContent(2)}
              {renderQrCode(2)}
              
              {/* Engravable area indicator */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 dark:border-gray-500 opacity-30 dark:opacity-40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className={`text-xs ${currentSide === 1 ? 'font-bold text-light-primary dark:text-dark-primary' : 'text-gray-500 dark:text-gray-400'}`}>
          Side 1: {orderType === 'database' && qrCodeSide === 1 ? 'QR Code' : 'Text'}
        </div>
        <div className="text-gray-400 dark:text-gray-600">|</div>
        <div className={`text-xs ${currentSide === 2 ? 'font-bold text-light-primary dark:text-dark-primary' : 'text-gray-500 dark:text-gray-400'}`}>
          Side 2: {orderType === 'database' && qrCodeSide === 2 ? 'QR Code' : 'Text'}
        </div>
      </div>
      
      {selectedDesign && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Style: <strong>{selectedDesign.name}</strong> • {selectedDesign.description}
          </p>
        </div>
      )}
      
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        {showQrCode && currentSide === qrCodeSide
          ? "Drag the QR code to position it on your tag. The QR code encodes the text you entered."
          : orderType === 'database'
          ? `Click 'Flip Tag' to see both sides. QR code will appear on Side ${qrCodeSide}.`
          : "Click 'Flip Tag' to see both sides"}
      </p>
    </div>
  );
};

export default TagPreview;
