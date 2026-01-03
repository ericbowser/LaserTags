import QRCode from 'qrcode';

/**
 * Generates a QR code SVG string for engraving
 * Uses the qrcode package to generate SVG directly
 * @param {string} url - The URL to encode in the QR code
 * @param {number} size - Size in pixels (default: 512)
 * @param {number} marginSize - Margin/quiet zone size (default: 4)
 * @returns {Promise<string>} SVG string
 */
export const generateQrCodeSVG = async (url, size = 512, marginSize = 4) => {
  try {
    const svgString = await QRCode.toString(url, {
      type: 'svg',
      width: size,
      margin: marginSize,
      errorCorrectionLevel: 'H', // High error correction
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return svgString;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    return '';
  }
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

/**
 * Encodes text lines into a format suitable for QR code encoding
 * Combines up to 3 lines of text into a single string
 * @param {string} line1 - First line of text
 * @param {string} line2 - Second line of text (optional)
 * @param {string} line3 - Third line of text (optional)
 * @returns {string} Encoded text string for QR code
 */
export const encodeQrCodeText = (line1, line2 = '', line3 = '') => {
  const lines = [line1, line2, line3].filter(line => line && line.trim());
  // Join lines with newlines for readability when scanned
  return lines.join('\n');
};
