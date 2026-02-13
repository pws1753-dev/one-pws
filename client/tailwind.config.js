/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#D4292B',
        ink: '#0F0F0F',
        charcoal: '#1C1C1C',
        ash: '#F8F8F8',
        graphite: '#222222',
        steel: '#9E9E9E',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 60px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
