/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors: {
        // Exact colors from the palette image
        palette: {
          // Main colors from the palette
          'primary-black': '#1B1918',
          'medium-orchid': '#B082FF',
          'light-violet': '#DBC6FF',
          'ivory': '#FFFFF3',
          
          // Additional colors for UI elements
          yellow: '#F4E76E',
          'yellow-bright': '#F9ED7A',
          'yellow-dark': '#B8A832',
          coral: '#FF8A65',
          'coral-light': '#FFB74D',
          'coral-dark': '#E64A19',
          
          // Background variations
          'bg-dark': '#1B1918',
          'bg-darker': '#0F0E0D',
          'bg-light': '#2A2826',
          
          // Text colors
          'text-light': '#FFFFF3',
          'text-muted': '#B8B5B2',
          'text-accent': '#B082FF',
          
          // Button variations
          'btn-primary': '#B082FF',
          'btn-primary-hover': '#DBC6FF',
          'btn-secondary': '#F4E76E',
          'btn-accent': '#FF8A65',
        },
        primary: {
          50: '#F8F6FF',
          100: '#F0EBFF',
          200: '#E4D9FF',
          300: '#DBC6FF',
          400: '#C8A8FF',
          500: '#B082FF',
          600: '#9B5FFF',
          700: '#8A4AE6',
          800: '#7A3FCC',
          900: '#6B35B3',
        },
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#F9ED7A',
          300: '#F4E76E',
          400: '#E6D55A',
          500: '#D69E2E',
          600: '#B7791F',
          700: '#975A16',
          800: '#744210',
          900: '#5F370E',
        },
        accent: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFB74D',
          300: '#FF8A65',
          400: '#FF7043',
          500: '#FF5722',
          600: '#F4511E',
          700: '#E64A19',
          800: '#D84315',
          900: '#BF360C',
        }
      }
    },
  },
  plugins: [],
};