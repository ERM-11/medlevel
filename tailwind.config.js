/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff0f6',
          100: '#ffe0ee',
          200: '#ffb3d4',
          300: '#ff80b5',
          400: '#ff4d96',
          500: '#FF6B9D',
          600: '#e6457a',
          700: '#cc2060',
          800: '#99154a',
          900: '#660e32',
        },
        teal: {
          400: '#4FC3F7',
          500: '#29B6F6',
          600: '#039BE5',
        },
      },
    },
  },
  plugins: [],
}
