/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAF9F6', // Warm ivory / soft off-white
          subtle: '#F4F5F7',  // Very light cool gray
          muted: '#EBF0F5',   // Subtle blue-gray
          card: '#FFFFFF',    // Crisp white for elevated card surfaces
          hover: '#F8FAFC',
          border: '#E2E8F0',  // Crisp subtle border
          borderLight: '#EDF2F7',
        },
        brand: {
          DEFAULT: '#4F46E5', // Indigo primary
          hover: '#4338CA',
          light: '#EEF2FF',
          blue: '#2563EB',    // Electric blue
          blueLight: '#EFF6FF',
          violet: '#7C3AED',  // Violet / purple secondary
          violetHover: '#6D28D9',
          violetLight: '#F5F3FF',
        },
        accent: {
          coral: '#F43F5E',
          coralLight: '#FFF1F2',
          amber: '#F59E0B',
          amberLight: '#FFFBEB',
          cyan: '#0EA5E9',
          cyanLight: '#F0F9FF',
        },
        ink: {
          primary: '#0F172A',   // Deep navy for primary text
          secondary: '#334155', // Slate gray for secondary text
          muted: '#64748B',     // Muted gray for tertiary text
          faint: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 20px 35px -10px rgba(79, 70, 229, 0.14), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'brand': '0 10px 25px -5px rgba(79, 70, 229, 0.35)',
        'glass': '0 8px 30px 0 rgba(15, 23, 42, 0.05)',
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
