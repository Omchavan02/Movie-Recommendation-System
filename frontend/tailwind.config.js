/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#07090E',
          900: '#0B0E17',
          850: '#101420',
          800: '#161B2B',
          700: '#232A40',
          600: '#343E5C',
          500: '#4F5E85',
          accent: '#E5A65E',
          accentHover: '#F3B775',
          amberGlow: 'rgba(229, 166, 94, 0.15)',
          crimson: '#D9383A'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
