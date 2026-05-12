/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(148,163,184,0.08), 0 20px 80px rgba(59,130,246,0.12)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at center, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
