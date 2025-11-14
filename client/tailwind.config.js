/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
          950: '#051e3e',
        },
        accent: {
          emerald: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          slate: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(3, 105, 161, 0.05) 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
