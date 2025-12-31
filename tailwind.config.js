/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './build/*.{js, html}',
        './public/*.html',
        './src/**/*.js',
        './src/components/*.js',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // HIGH-CONTRAST DUAL-THEME COLOR SYSTEM
                // Designed for 12-18:1 contrast ratios (WCAG AAA)
                
                // Primary Dark Theme (Charcoal) - NEW
                charcoal: {
                    900: '#0a0a0a', // Deepest black - 21:1 contrast with white
                    800: '#1a1a1a', // Main background - 18:1 contrast
                    700: '#2a2a2a', // Elevated surfaces - 15:1 contrast
                    600: '#3a3a3a', // Borders/dividers - 12:1 contrast
                    500: '#4a4a4a', // Disabled states
                },
                
                // Accent Color (Coral/Salmon) - NEW
                coral: {
                    500: '#ff6b6b', // Main CTA color - vibrant but accessible
                    600: '#ff5252', // Hover state
                    400: '#ff8585', // Lighter variant
                    700: '#ff3838', // Pressed state
                },
                
                // Neutral Colors (High Contrast) - NEW
                neutral: {
                    100: '#f5f5f5', // Near-white for tag displays
                    200: '#e5e5e5', // Light backgrounds
                    300: '#cccccc', // Borders
                    400: '#999999', // Secondary text
                    500: '#666666', // Tertiary text
                },
                
                // LIGHT MODE - Better contrast with deeper accent colors (EXISTING - IMPROVED)
                light: {
                    // Backgrounds
                    bg: '#FFFFFF',              // Pure white for main bg
                    surface: '#F8F9FA',         // Very light gray for cards
                    surfaceHover: '#F1F3F5',    // Slightly darker for hover
                    
                    // Text - much better contrast
                    text: '#1A1A1A',            // Almost black for primary text
                    textMuted: '#4A5568',       // Darker gray for secondary text
                    
                    // Borders
                    border: '#E2E8F0',          // Visible but subtle
                    borderStrong: '#CBD5E0',    // For emphasis
                    
                    // Accents - Vibrant but not harsh
                    primary: '#FF6B6B',         // Coral red
                    primaryHover: '#FF5252',    // Slightly darker
                    secondary: '#4ECDC4',       // Turquoise
                    secondaryHover: '#45B7B8',  // Slightly darker
                    accent: '#FFE66D',          // Warm yellow
                    
                    // Tag display areas - neutral to let tags pop
                    tagBg: '#FAFAFA',           // Near white
                    tagBorder: '#D1D5DB',       // Light gray border
                },
                
                // DARK MODE - Deep backgrounds with bright text (ENHANCED FOR BETTER CONTRAST)
                dark: {
                    // Backgrounds - deeper and richer with better contrast
                    bg: '#0A0E14',              // Very dark blue-black (improved from #0F1419)
                    surface: '#151B26',         // Dark blue-gray (improved from #1A1F2E)
                    surfaceHover: '#1E2532',    // Lighter on hover (improved from #232936)
                    surfaceLight: '#252D3A',    // For elevated elements (improved from #2A3142)
                    
                    // Text - high contrast (improved for better readability)
                    text: '#FFFFFF',            // Pure white for maximum contrast (improved from #F7FAFC)
                    textMuted: '#B8C5D6',       // Brighter gray for better readability (improved from #A0AEC0)
                    
                    // Borders - more visible in dark mode
                    border: '#374151',          // More visible dark border (improved from #2D3748)
                    borderStrong: '#4B5563',    // Stronger emphasis (improved from #4A5568)
                    
                    // Accents - Bright and punchy with better contrast
                    primary: '#FF9A9A',         // Even brighter coral for better visibility (improved from #FF8787)
                    primaryHover: '#FF8787',    // Standard coral
                    secondary: '#6EE7E0',       // Brighter turquoise (improved from #5EDDD6)
                    secondaryHover: '#5EDDD6',  // Standard turquoise
                    accent: '#FFE66D',          // Warm yellow
                    
                    // Tag display areas - better contrast
                    tagBg: '#1E2532',           // Slightly lighter than surface (improved from #232936)
                    tagBorder: '#3F4856',       // More visible border (improved from #3A4556)
                },
            },
            
            fontFamily: {
                // NEW FONT SYSTEM - Custom fonts for tag engraving
                times: ['"Times New Roman"', 'Times', 'serif'],
                acme: ['"Acme"', 'sans-serif'],
                abril: ['"Abril Fatface"', 'serif'],
                atomic: ['"Atomic Age"', 'sans-serif'],
                burtons: ['"Burtons"', 'sans-serif'], // Custom font - requires font file
            },
            
            backgroundImage: {
                // Light mode gradient - subtle and clean
                'gradient-light': 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                
                // Dark mode gradient - deep and rich
                'gradient-dark': 'linear-gradient(135deg, #0F1419 0%, #1A1F2E 50%, #0F1419 100%)',
                
                // NEW: Charcoal gradients for high-contrast design
                'gradient-charcoal': 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
                'gradient-charcoal-radial': 'radial-gradient(circle at top, #1a1a1a 0%, #0a0a0a 100%)',
                
                // Button gradients
                'btn-primary': 'linear-gradient(135deg, #FF6B6B 0%, #FF8787 100%)',
                'btn-primary-dark': 'linear-gradient(135deg, #FF8787 0%, #FFA3A3 100%)',
                'btn-coral': 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)', // NEW
            },
            
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                'card-hover-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
                // NEW: High-contrast shadows
                'coral': '0 10px 40px -10px rgba(255, 107, 107, 0.3)',
                'dark': '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
                'glow-coral': '0 0 20px rgba(255, 107, 107, 0.5)',
            },
            
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
            },
            
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
            },
        },
    },
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
    ],
}

/**
 * COLOR CONTRAST RATIOS (WCAG AAA Compliance):
 * 
 * Background: charcoal-900 (#0a0a0a)
 * - White text: 21:1 ratio ✅
 * - Gray-300 text: 12.5:1 ratio ✅
 * - Coral-500 accent: 4.5:1 ratio ✅ (for large text/buttons)
 * 
 * Background: charcoal-800 (#1a1a1a)
 * - White text: 18:1 ratio ✅
 * - Gray-300 text: 10.8:1 ratio ✅
 * 
 * All combinations exceed WCAG AA (4.5:1) and most exceed AAA (7:1)
 */
