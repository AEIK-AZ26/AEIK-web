/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#201A3F',
        canvas: '#F7F6FC',
        hero: '#F5F4FF',
        deep: '#3E3171',
        brand: {
          50: '#F3F1FF',
          100: '#EAE6FE',
          200: '#D9D2FD',
          300: '#BFB3FB',
          400: '#9C8AF8',
          500: '#7C67F7',
          600: '#6552F5', // Main primary purple
          700: '#5340E0',
          800: '#4332B8',
          900: '#332785',
          dark: '#201A3F',
          darker: '#29213F',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
