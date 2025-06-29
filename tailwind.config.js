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
        // Custom palette from design
        palette: {
          // Main colors
          dark: '#2A2A2A',
          'dark-light': '#3A3A3A',
          yellow: '#F4E76E',
          'yellow-bright': '#F9ED7A',
          purple: '#C8A8E9',
          'purple-dark': '#A688C7',
          coral: '#FF8A65',
          'coral-light': '#FFB74D',
          white: '#FFFFFF',
          
          // Background variations
          'bg-dark': '#1A1A1A',
          'bg-purple': '#C8A8E9',
          'bg-yellow': '#F4E76E',
          'bg-coral': '#FF8A65',
          
          // Button variations
          'btn-purple-light': '#E1C9F0',
          'btn-purple': '#A688C7',
          'btn-yellow-light': '#F9ED7A',
          'btn-yellow': '#E6D55A',
          'btn-gray': '#8A8A8A',
          'btn-gray-dark': '#6A6A6A',
          
          // Text colors
          'text-light': '#F5F5F5',
          'text-purple': '#C8A8E9',
          'text-yellow': '#F4E76E',
        },
        primary: {
          50: '#F3F0FF',
          100: '#E1C9F0',
          200: '#C8A8E9',
          300: '#A688C7',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3C1A78',
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