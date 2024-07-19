/** @type {import('tailwindcss').Config} */

// const hironicColors = require('./styles/hironic/hironic-colors')

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screen: {
      md: '768px'
    },
    extend: {
      colors: {
        "background-rgb": "#BBBBBB"
        // hironic: hironicColors,
        // use colors only specified
      },
    },
  },
  plugins: [],
};
