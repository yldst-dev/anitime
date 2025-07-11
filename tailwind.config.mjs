/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Blue - Material 3 Blue)
        'primary': '#1565C0',           // 톤 40 - Deep Blue
        'on-primary': '#FFFFFF',        // 톤 100
        'primary-container': '#D1E4FF', // 톤 90 - Light Blue
        'on-primary-container': '#001A41', // 톤 10 - Dark Blue

        // Secondary Colors (Blue Variant)
        'secondary': '#546E7A',         // 톤 40 - Blue Grey
        'on-secondary': '#FFFFFF',      // 톤 100
        'secondary-container': '#CFE4FF', // 톤 90 - Light Blue Grey
        'on-secondary-container': '#0F1419', // 톤 10 - Dark Blue Grey

        // Tertiary Colors (Cyan Accent)
        'tertiary': '#006C51',          // 톤 40 - Teal
        'on-tertiary': '#FFFFFF',       // 톤 100
        'tertiary-container': '#89F8D2', // 톤 90 - Light Teal
        'on-tertiary-container': '#002117', // 톤 10 - Dark Teal

        // Surface Colors (Neutral)
        'surface': '#FFFBFE',           // 톤 99
        'surface-dim': '#DDD8DD',       // 톤 87
        'surface-bright': '#FFFBFE',    // 톤 99
        'surface-container': '#F3EDF7', // 톤 94
        'surface-container-low': '#F7F2FA', // 톤 96
        'surface-container-high': '#ECE6F0', // 톤 92
        'surface-container-highest': '#E6E0E9', // 톤 90
        'on-surface': '#1C1B1F',       // 톤 10
        'on-surface-variant': '#49454F', // 톤 30

        // Outline Colors
        'outline': '#79747E',           // 톤 50
        'outline-variant': '#CAC4D0',   // 톤 80

        // Error Colors (Red)
        'error': '#BA1A1A',            // 톤 40
        'on-error': '#FFFFFF',         // 톤 100
        'error-container': '#FFDAD6',  // 톤 90
        'on-error-container': '#410002', // 톤 10

        // Status Colors for Anime
        'anime-new': '#006C51',        // Tertiary - 신작
        'anime-completed': '#546E7A',   // Secondary - 완결
        'anime-cancelled': '#BA1A1A',  // Error - 결방
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '28px',
        'full-expressive': '50%',
      },
      animation: {
        'shape-morph': 'shape-morph 2s ease-out infinite',
        'material-motion': 'material-motion 0.3s cubic-bezier(0.2, 0, 0, 1)',
        'loading-indicator': 'loading-indicator 2s ease-in-out infinite',
      },
      keyframes: {
        'shape-morph': {
          '0%, 100%': { 
            borderRadius: '12px',
            transform: 'scale(1) rotate(0deg)'
          },
          '25%': { 
            borderRadius: '50%',
            transform: 'scale(1.1) rotate(90deg)'
          },
          '50%': { 
            borderRadius: '20px',
            transform: 'scale(1.2) rotate(180deg)'
          },
          '75%': { 
            borderRadius: '8px',
            transform: 'scale(1.1) rotate(270deg)'
          },
        },
        'material-motion': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'loading-indicator': {
          '0%': { 
            borderRadius: '12px',
            transform: 'scale(1) rotate(0deg)'
          },
          '14%': { 
            borderRadius: '50%',
            transform: 'scale(1.2) rotate(51deg)'
          },
          '28%': { 
            borderRadius: '20px',
            transform: 'scale(1) rotate(102deg)'
          },
          '42%': { 
            borderRadius: '8px',
            transform: 'scale(1.2) rotate(153deg)'
          },
          '57%': { 
            borderRadius: '16px',
            transform: 'scale(1) rotate(204deg)'
          },
          '71%': { 
            borderRadius: '28px',
            transform: 'scale(1.2) rotate(255deg)'
          },
          '85%': { 
            borderRadius: '4px',
            transform: 'scale(1) rotate(306deg)'
          },
          '100%': { 
            borderRadius: '12px',
            transform: 'scale(1) rotate(357deg)'
          },
        },
      },
      fontFamily: {
        'pretendard': [
          'Pretendard', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Apple SD Gothic Neo', 
          'Noto Sans KR', 
          'Roboto', 
          'Segoe UI', 
          'Malgun Gothic', 
          'Apple Color Emoji', 
          'Segoe UI Emoji', 
          'Segoe UI Symbol', 
          'sans-serif'
        ],
        'roboto': ['Roboto', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'material-1': '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'material-2': '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'material-3': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)',
        'material-4': '0 2px 3px 0 rgba(0, 0, 0, 0.3), 0 6px 10px 4px rgba(0, 0, 0, 0.15)',
        'material-5': '0 4px 4px 0 rgba(0, 0, 0, 0.3), 0 8px 12px 6px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}