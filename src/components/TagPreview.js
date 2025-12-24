import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateQrCodeUrl } from '../utils/qrCodeUtils';
import { Move, RotateCcw } from 'lucide-react';

const TagPreview = ({ 
  material, 
  orderType, 
  formData, 
  qrCodePosition = { x: 50, y: 50 },
  onQrPositionChange,
  side1Config = {},
  side2Config = {},
  qrCodeSide = 2 // Which side the QR code is on (1 or 2)
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

  // Get font style based on font selection
  // Using fonts optimized for laser engraving readability
  const getFontStyle = (fontType) => {
    switch (fontType) {
      case 'bold':
        // Bebas Neue - Bold, all-caps, high visibility for engravings
        return { 
          fontFamily: '"Bebas Neue", "Arial Black", Arial, sans-serif',
          fontWeight: '400',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        };
      case 'elegant':
        // Playfair Display - Elegant serif, sophisticated for formal tags
        return { 
          fontFamily: '"Playfair Display", "Garamond", "Times New Roman", serif',
          fontWeight: '600',
          fontStyle: 'italic',
          letterSpacing: '0.02em'
        };
      case 'playful':
        // Quicksand - Modern, friendly, geometric sans-serif
        return { 
          fontFamily: '"Quicksand", "Century Gothic", "Verdana", sans-serif',
          fontWeight: '700',
          letterSpacing: '0.03em'
        };
      default:
        return {};
    }
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

  const renderSide1 = () => {
    // Side 1: Pet name with custom font
    const petName = formData?.petname || side1Config?.petName || '';
    const fontType = side1Config?.fontType || 'bold';
    
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
        {petName && (
          <div 
            className="text-xl font-bold text-gray-800"
            style={getFontStyle(fontType)}
          >
            {petName}
          </div>
        )}
      </div>
    );
  };

  const renderSide2 = () => {
    // Side 2: Address, QR code, or other text
    if (orderType === 'database' && qrCodeSide === 2) {
      // Show address text if provided
      const addressText = side2Config?.addressText || '';
      return (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
          {addressText && (
            <div className="text-xs text-gray-600 mb-2">
              {addressText}
            </div>
          )}
        </div>
      );
    } else if (orderType === 'engrave') {
      // Show engraving lines
      return (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
          {side2Config?.line1 && (
            <div className="text-base font-semibold text-gray-800 mb-1">
              {side2Config.line1}
            </div>
          )}
          {side2Config?.line2 && (
            <div className="text-sm text-gray-700 mb-1">
              {side2Config.line2}
            </div>
          )}
          {side2Config?.line3 && (
            <div className="text-xs text-gray-600">
              {side2Config.line3}
            </div>
          )}
        </div>
      );
    } else {
      // Show address or other info
      const addressText = side2Config?.addressText || '';
      return (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
          {addressText && (
            <div className="text-xs text-gray-600">
              {addressText}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-800">Tag Preview</h3>
        <button
          onClick={toggleSide}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Flip Tag</span>
        </button>
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
              className="absolute inset-0 border-2 border-gray-400 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 shadow-md"
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
              }}
            >
              {renderSide1()}
              {/* Engravable area indicator */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 opacity-40 pointer-events-none" />
            </div>

            {/* Side 2 - Back (Address/QR Code) */}
            <div 
              className="absolute inset-0 border-2 border-gray-400 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 shadow-md"
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
                  <div className="bg-white p-1 rounded shadow-lg border-2 border-gray-300 group-hover:border-red-500 transition-colors">
                    <QRCodeSVG
                      value={qrUrl}
                      size={60}
                      level="H"
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap">
                        <Move className="w-3 h-3" />
                        Drag to position
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Engravable area indicator */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 opacity-40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className={`text-xs ${currentSide === 1 ? 'font-bold text-indigo-600' : 'text-gray-400'}`}>
          Side 1: Pet Name
        </div>
        <div className="text-gray-300">|</div>
        <div className={`text-xs ${currentSide === 2 ? 'font-bold text-indigo-600' : 'text-gray-400'}`}>
          Side 2: {orderType === 'database' ? 'QR Code/Address' : 'Text'}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {showQrCode && currentSide === qrCodeSide
          ? "Drag the QR code to position it on your tag"
          : "Click 'Flip Tag' to see both sides"}
      </p>
    </div>
  );
};

export default TagPreview;

