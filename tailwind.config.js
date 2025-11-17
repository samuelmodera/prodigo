/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'figtree': ['Figtree', 'sans-serif'],
        'lexend': ['Lexend', 'sans-serif'],
        'cormorant': ['Cormorant Garamond', 'serif'],
      },
      colors: {
        'dark': '#38342f',
        'dark-60': 'rgba(45, 48, 48, 0.6)',
        'bg-light': '#f6f3f1',
      },
    },
  },
  plugins: [],
}

