/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scans App.tsx, Dashboard.tsx, etc.
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',  // Optional: Custom blue for admin theme
      },
    },
  },
  plugins: [],
};