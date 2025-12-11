/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bank-primary': '#7C6E66', // Shadow Cliff
        'bank-accent': '#F6B430',   // NYC Taxi
        'bank-red': '#D01A2A',      // Splatter Movie
      },
    },
  },
  plugins: [],
}

