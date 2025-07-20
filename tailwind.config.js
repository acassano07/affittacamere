/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './{pages,components,hooks,utils}/**/*.{js,ts,jsx,tsx}',
    './App.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};