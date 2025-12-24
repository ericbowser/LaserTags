import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateQrCodeUrl } from '../utils/qrCodeUtils';
import { Move, RotateCcw, Palette, Download } from 'lucide-react';
import { applyShapeAdjustments } from '../utils/tagDesignPresets';

const EnhancedTagPreview = ({ 
  material, 
  orderType, 
  formData, 
  qrCodePosition = { x: 50, y: 50 },
  onQrPositionChange,
  side1Config = {},
  side2Config = {},
  qrCodeSide = 2,
  selectedDesign = null, // New: Custom design preset
  className = ''
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
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSide(currentSide === 1 ? 2 : 1);
      setIsFlipping(false);
    }, 250);
  };

  // Apply design preset or use default styling
  const getAppliedDesign = () => {
    if (!selectedDesign) {
      // Return default design
      return {
        fontFamily: '"Arial", sans-serif',
        fontSize: {
          petName: '18px',
          line1: '14px',
          line2: '12px',
          line3: '10px'
        },
        fontWeight: '600',
        textAlign: 'center',
        colors: {
          text: '#1f2937',
          accent: '#4f46e5',
          background: 'transparent'
        },
        decorations: [],
        qrCodeStyle: {
          size: 60,
          backgroundColor: '#ffffff',
          foregroundColor: '#000000'
        }
      };
    }
    
    // Apply shape adjustments to the selected design
    return applyShapeAdjustments(selectedDesign, material?.shape);
  };

  const appliedDesign = getAppliedDesign();

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

  // Render decorative elements
  const renderDecorations = (position) => {
    return appliedDesign.decorations
      ?.filter(decoration => decoration.position === position)
      .map((decoration, idx) => {
        switch (decoration.type) {
          case 'line':
            return (
              <div
                key={idx}
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
                  key={idx}
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
                key={idx}
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
                key={idx}
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

  const renderSide1 = () => {
    const petName = formData?.petname || side1Config?.petName || 'BUDDY';
    
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center relative">
        {/* Background decorations */}
        {renderDecorations('background')}
        {renderDecorations('around-text')}
        
        {/* Above name decorations */}
        {renderDecorations('above-name')}
        {renderDecorations('flourish-above')}
        
        {/* Pet name with applied design */}
        {petName && (
          <div className="relative flex items-center justify-center">
            {renderDecorations('left-of-name')}
            
            <div 
              style={{
                fontFamily: appliedDesign.fontFamily,
                fontSize: appliedDesign.fontSize.petName,
                fontWeight: appliedDesign.fontWeight,
                fontStyle: appliedDesign.fontStyle,
                color: appliedDesign.colors.text,
                textAlign: appliedDesign.textAlign,
                textTransform: appliedDesign.textTransform,
                letterSpacing: appliedDesign.letterSpacing,
                lineHeight: 1.2
              }}
            >
              {petName}
            </div>
            
            {renderDecorations('right-of-name')}
          </div>
        )}
        
        {/* Under name decorations */}
        {renderDecorations('under-name')}
        {renderDecorations('below-name')}
        {renderDecorations('flourish-below')}
      </div>
    );
  };

  const renderSide2 = () => {
    if (orderType === 'database' && qrCodeSide === 2) {
      const addressText = side2Config?.addressText || '';
      return (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center relative">
          {renderDecorations('background')}
          {addressText && (
            <div 
              style={{
                fontFamily: appliedDesign.fontFamily,
                fontSize: appliedDesign.fontSize.line1,
                color: appliedDesign.colors.text,
                textAlign: appliedDesign.textAlign,
                marginBottom: '8px'
              }}
            >
              {addressText}
            </div>
          )}
        </div>
      );
    } else if (orderType === 'engrave') {
      return (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center relative">
          {renderDecorations('background')}
          
          {side2Config?.line1 && (
            <div 
              style={{
                fontFamily: appliedDesign.fontFamily,
                fontSize: appliedDesign.fontSize.line1,
                fontWeight: appliedDesign.fontWeight,
                color: appliedDesign.colors.text,
                textAlign: appliedDesign.textAlign,
                marginBottom: appliedDesign.lineSpacing || '4px'
              }}
            >
              {side2Config.line1}
            </div>
          )}
          
          {side2Config?.line2 && (
            <div 
              style={{
                fontFamily: appliedDesign.fontFamily,
                fontSize: appliedDesign.fontSize.line2,
                color: appliedDesign.colors.text,
                textAlign: appliedDesign.textAlign,
                marginBottom: appliedDesign.lineSpacing || '4px'
              }}
            >
              {side2Config.line2}
            </div>
          )}
          
          {side2Config?.line3 && (
            <div 
              style={{
                fontFamily: appliedDesign.fontFamily,
                fontSize: appliedDesign.fontSize.line3,
                color: appliedDesign.colors.text,
                textAlign: appliedDesign.textAlign
              }}
            >
              {side2Config.line3}
            </div>
          )}
        </div>
      );
    } else {
      const addressText = side2Config?.addressText || '';
      return (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center relative">
          {renderDecorations('background')}
          {addressText && (
            <div 
              style={{
                fontFamily: appliedDesign.fontFamily,
                fontSize: appliedDesign.fontSize.line1,
                color: appliedDesign.colors.text,
                textAlign: appliedDesign.textAlign
              }}
            >
              {addressText}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-800">Tag Preview</h3>
            {selectedDesign && (
              <span className="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                <Palette className="w-3 h-3" />
                {selectedDesign.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSide}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
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
                className="absolute inset-0 border-2 border-gray-400 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 shadow-md overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  backgroundColor: appliedDesign.colors.background !== 'transparent' ? appliedDesign.colors.background : undefined,
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
                
                {/* Around tag decorations */}
                {renderDecorations('around-tag')}
                
                {/* Engravable area indicator */}
                <div className="absolute inset-0 border-2 border-dashed border-gray-400 opacity-20 pointer-events-none" />
              </div>

              {/* Side 2 - Back (Address/QR Code) */}
              <div 
                className="absolute inset-0 border-2 border-gray-400 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 shadow-md overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: appliedDesign.colors.background !== 'transparent' ? appliedDesign.colors.background : undefined,
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
                        size={appliedDesign.qrCodeStyle?.size || 60}
                        level="H"
                        bgColor={appliedDesign.qrCodeStyle?.backgroundColor || "#FFFFFF"}
                        fgColor={appliedDesign.qrCodeStyle?.foregroundColor || "#000000"}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap">
                          <Move className="w-3 h-3" />
                          Drag to position
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Around tag decorations */}
                {renderDecorations('around-tag')}
                
                {/* Engravable area indicator */}
                <div className="absolute inset-0 border-2 border-dashed border-gray-400 opacity-20 pointer-events-none" />
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
        
        {selectedDesign && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Style: <strong>{selectedDesign.name}</strong> • {selectedDesign.description}
            </p>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          {showQrCode && currentSide === qrCodeSide
            ? "Drag the QR code to position it on your tag"
            : "Click 'Flip Tag' to see both sides"}
        </p>
      </div>
    </div>
  );
};

export default EnhancedTagPreview;
