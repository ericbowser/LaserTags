/**
 * Formats a phone number as (XXX) XXX-XXXX
 * @param {string} value - Raw phone number input
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (value) => {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  const phoneNumberLength = phoneNumber.length;
  
  if (phoneNumberLength < 4) {
    return phoneNumber;
  } else if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};

/**
 * Validates phone number format and area code
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validatePhoneNumber = (phoneNumber) => {
  // Remove formatting to get just digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Check if empty
  if (!digits || digits.length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Check if it's exactly 10 digits
  if (digits.length !== 10) {
    return { isValid: false, error: 'Phone number must be 10 digits' };
  }
  
  // Extract area code (first 3 digits)
  const areaCode = digits.slice(0, 3);
  
  // Validate area code: must be between 200-999 (excludes 000, 001, 010-019, 100-199, and invalid codes)
  const areaCodeNum = parseInt(areaCode, 10);
  
  // Area code cannot start with 0 or 1
  if (areaCode[0] === '0' || areaCode[0] === '1') {
    return { isValid: false, error: 'Area code cannot start with 0 or 1' };
  }
  
  // Area code must be between 200-999
  if (areaCodeNum < 200 || areaCodeNum > 999) {
    return { isValid: false, error: 'Invalid area code' };
  }
  
  // Validate exchange code (next 3 digits) - cannot start with 0 or 1
  const exchangeCode = digits.slice(3, 6);
  if (exchangeCode[0] === '0' || exchangeCode[0] === '1') {
    return { isValid: false, error: 'Exchange code cannot start with 0 or 1' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Gets the unformatted phone number (digits only)
 * @param {string} formattedPhone - Formatted phone number
 * @returns {string} Unformatted phone number
 */
export const getUnformattedPhone = (formattedPhone) => {
  return formattedPhone.replace(/\D/g, '');
};

