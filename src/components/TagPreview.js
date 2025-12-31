import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateQrCodeUrl } from '../utils/qrCodeUtils';
import { Move, RotateCcw, Type } from 'lucide-react';
import { getFontById, DEFAULT_FONT } from '../config/fonts';

const TagPreview = ({ 
  material, 
  orderType, 
  formData, 
  qrCodePosition = { x: 50, y: 50 },
  onQrPositionChange,
  side1Config = {},
  side2Config = {},
  qrCodeSide = 2, // Which side the QR code is on (1 or 2)
  selectedFont = null, // Font ID from fonts.js
  textCase = 'title', // 'title' or 'uppercase'
  onTextCaseChange = null // Callback for text case changes
}) => {
  const [qrUrl, setQrUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentSide, setCurrentSide] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);

  // Generate QR code URL for database orders
  useEffect(() => {
    if (orderType === 'database' && formData?.userid) {
      const url = generateQrCodeUrl(formData.userid);
      setQrUrl(url);
    }
  }, [orderType, formData?.userid]);

  const handleMouseDown = (e) => {
    if (orderType !== 'database' || currentSide !== qrCodeSide) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - qrCodePosition.x,
      y: e.clientY - rect.top - qrCodePosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || orderType !== 'database' || currentSide !== qrCodeSide) return;
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
    if (isFlipping) return; // Prevent rapid clicking
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSide(currentSide === 1 ? 2 : 1);
      setIsFlipping(false);
    }, 250); // Half of animation duration
  };

  // Get font style based on selected font from fonts.js
  const getFontStyle = (fontId) => {
    const font = fontId ? getFontById(fontId) : DEFAULT_FONT;
    if (!font) return {};
    
    return {
      fontFamily: font.family,
      // Apply appropriate styling based on font style
      fontWeight: font.style === 'Bold' || font.style === 'Statement' ? '700' : 
                  font.style === 'Modern' ? '600' : '400',
      fontStyle: font.style === 'Elegant' ? 'italic' : 'normal',
      letterSpacing: font.style === 'Retro' ? '0.1em' : '0.02em'
    };
  };

  // Get tag placeholder background style - static color for both dark and light modes
  const getTagPlaceholderStyle = () => {
    // Use a neutral gray that works well in both dark and light modes
    const staticBgColor = '#d1d5db'; // Light gray - visible in both modes
    const staticBorderColor = '#9ca3af'; // Medium gray border
    
    return {
      background: staticBgColor,
      border: `2px solid ${staticBorderColor}`,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.15)'
    };
  };

  // Get tag dimensions based on material shape
  const getTagDimensions = () => {
    const baseSize = 200;
    switch (material?.shape) {
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

  const dimensions = getTagDimensions();
  const showQrCode = orderType === 'database' && qrUrl && currentSide === qrCodeSide;

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

  const renderSide1 = () => {
    // Side 1: Up to 3 lines of text
    const fontId = selectedFont || side1Config?.fontId || DEFAULT_FONT.id;
    const staticTextColor = '#1f2937'; // Dark gray - high contrast on light gray background
    
    const line1 = side1Config?.line1 || '';
    const line2 = side1Config?.line2 || '';
    const line3 = side1Config?.line3 || '';
    
    if (!line1 && !line2 && !line3) return null;
    
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center z-10">
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
        {line2 && (
          <div 
            className="font-semibold mb-1 drop-shadow-md"
            style={{
              ...getFontStyle(fontId),
              fontSize: 'clamp(1rem, 5.5vw, 2rem)',
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
              fontSize: 'clamp(0.875rem, 4.5vw, 1.5rem)',
              color: staticTextColor,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              lineHeight: '1.2',
            }}
          >
            {formatText(line3, textCase)}
          </div>
        )}
      </div>
    );
  };

  const renderSide2 = () => {
    // Side 2: Up to 3 lines of text (or QR code for database orders)
    const fontId = selectedFont || side2Config?.fontId || DEFAULT_FONT.id;
    const staticTextColor = '#1f2937'; // Dark gray - high contrast on light gray background
    
    const line1 = side2Config?.line1 || '';
    const line2 = side2Config?.line2 || '';
    const line3 = side2Config?.line3 || '';
    
    // For database orders, show QR code if on side 2, otherwise show text lines
    if (orderType === 'database' && qrCodeSide === 2) {
      // QR code will be rendered separately, but we can show text if provided
      if (!line1 && !line2 && !line3) return null;
    }
    
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center z-10">
        {line1 && (
          <div 
            className="font-semibold mb-1 drop-shadow-md"
            style={{
              ...getFontStyle(fontId),
              fontSize: 'clamp(1rem, 5.5vw, 2rem)',
              color: staticTextColor,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              lineHeight: '1.2',
            }}
          >
            {formatText(line1, textCase)}
          </div>
        )}
        {line2 && (
          <div 
            className="mb-1 drop-shadow-md"
            style={{
              ...getFontStyle(fontId),
              fontSize: 'clamp(0.875rem, 4.5vw, 1.5rem)',
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
              fontSize: 'clamp(0.75rem, 4vw, 1.25rem)',
              color: staticTextColor,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              lineHeight: '1.2',
            }}
          >
            {formatText(line3, textCase)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg dark:shadow-card-dark p-4 border border-light-border dark:border-dark-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-light-text dark:text-dark-text">Tag Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newCase = textCase === 'title' ? 'uppercase' : 'title';
              if (onTextCaseChange) onTextCaseChange(newCase);
            }}
            className="flex items-center gap-1 text-xs text-light-textMuted dark:text-dark-textMuted hover:text-light-primary dark:hover:text-dark-primary transition-colors px-2 py-1 rounded hover:bg-light-surface dark:hover:bg-dark-surfaceHover"
            title={textCase === 'title' ? 'Switch to ALL CAPS' : 'Switch to Title Case'}
          >
            <Type className="w-3 h-3" />
            <span>{textCase === 'title' ? 'Title' : 'ALL CAPS'}</span>
          </button>
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
            {/* Side 1 - Front (Pet Name) */}
            <div 
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                clipPath: material?.shape === 'tri' 
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  : material?.shape === 'circle'
                  ? 'circle(50%)'
                  : material?.shape === 'hex'
                  ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  : 'none',
                borderRadius: material?.shape === 'circle' ? '50%' : '8px',
                ...getTagPlaceholderStyle()
              }}
            >
              {renderSide1()}
              {/* Engravable area indicator */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 dark:border-gray-500 opacity-20 dark:opacity-30 pointer-events-none" />
            </div>

            {/* Side 2 - Back (Address/QR Code) */}
            <div 
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                clipPath: material?.shape === 'tri' 
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  : material?.shape === 'circle'
                  ? 'circle(50%)'
                  : material?.shape === 'hex'
                  ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  : 'none',
                borderRadius: material?.shape === 'circle' ? '50%' : '8px',
                ...getTagPlaceholderStyle()
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {renderSide2()}
              
              {/* QR Code - draggable for database orders */}
              {orderType === 'database' && qrUrl && qrCodeSide === 2 && (
                <div
                  className="absolute cursor-move group"
                  style={{
                    left: `${qrCodePosition.x}%`,
                    top: `${qrCodePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <div className="bg-white dark:bg-gray-800 p-1 rounded shadow-lg dark:shadow-xl border-2 border-gray-300 dark:border-gray-600 group-hover:border-red-500 dark:group-hover:border-coral-500 transition-colors">
                    <QRCodeSVG
                      value={qrUrl}
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
              )}
              
              {/* Engravable area indicator */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 dark:border-gray-500 opacity-30 dark:opacity-40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className={`text-xs ${currentSide === 1 ? 'font-bold text-light-primary dark:text-dark-primary' : 'text-gray-500 dark:text-gray-400'}`}>
          Side 1: Pet Name
        </div>
        <div className="text-gray-400 dark:text-gray-600">|</div>
        <div className={`text-xs ${currentSide === 2 ? 'font-bold text-light-primary dark:text-dark-primary' : 'text-gray-500 dark:text-gray-400'}`}>
          Side 2: {orderType === 'database' ? 'QR Code/Address' : 'Text'}
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
        {showQrCode && currentSide === qrCodeSide
          ? "Drag the QR code to position it on your tag"
          : "Click 'Flip Tag' to see both sides"}
      </p>
    </div>
  );
};

export default TagPreview;

