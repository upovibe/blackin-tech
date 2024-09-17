/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '50%': { opacity: 0 },
        },
      },
      animation: {
        blink: 'blink 1.2s step-end infinite',
      },
      colors: {
        slate: {
          600: '#64748b',
          700: '#475569',
          800: '#334155',
        },
      },
    },
  },
  plugins: [],
}
