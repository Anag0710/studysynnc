/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // Include all files in src directory
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4f46e5', // Indigo-600 for light mode
          dark: '#818cf8', // Indigo-400 for dark mode
          DEFAULT: 'var(--primary-color)',
        },
        secondary: {
          light: '#a5b4fc', // Indigo-300 for light mode
          dark: '#c7d2fe', // Indigo-200 for dark mode
          DEFAULT: 'var(--secondary-color)',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.5s ease-in-out',
        'slide-in-left': 'slideInLeft 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.5s ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
        'grow': 'grow 1s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        grow: {
          '0%': { transform: 'scale(0.9)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      transitionProperty: {
        'height': 'height',
      }
    },
  },
  plugins: [],
}