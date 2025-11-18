import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Generates a QR code SVG string for engraving
 * Uses a temporary DOM element to render and extract the SVG
 * @param {string} url - The URL to encode in the QR code
 * @param {number} size - Size in pixels (default: 512)
 * @param {number} marginSize - Margin/quiet zone size (default: 4)
 * @returns {Promise<string>} SVG string
 */
export const generateQrCodeSVG = async (url, size = 512, marginSize = 4) => {
  return new Promise((resolve) => {
    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);

    // Create React element
    const qrElement = React.createElement(QRCodeSVG, {
      value: url,
      size: size,
      level: 'H', // High error correction
      marginSize: marginSize,
      bgColor: '#FFFFFF',
      fgColor: '#000000',
      includeMargin: true,
    });

    // Render to DOM
    const root = createRoot(tempDiv);
    root.render(qrElement);

    // Wait for render, then extract SVG
    setTimeout(() => {
      const svgElement = tempDiv.querySelector('svg');
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        document.body.removeChild(tempDiv);
        resolve(svgString);
      } else {
        document.body.removeChild(tempDiv);
        resolve('');
      }
    }, 100);
  });
};

/**
 * Generates a QR code URL for a given userid
 * @param {string} userid - The user ID
 * @returns {string} Full URL for the QR code
 */
export const generateQrCodeUrl = (userid) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/contact/${userid}`;
};

