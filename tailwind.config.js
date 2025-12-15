/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6', // Teal
        secondary: '#F97316', // Orange
        navy: '#0F172A', // Navy
        background: '#F8FAFC', // Light Background
        border: '#E5E7EB',
      },
      boxShadow: {
        'novax': '0 8px 24px rgba(15, 23, 42, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
