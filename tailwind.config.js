/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        "warm": {
          "800": "#111112",
          "600": '#6A6962',
          "400": "#E5E1D8",
          "200": '#FAF9F8',
        },
        "pink": {
          "800": "#E3837D",
          "600": '#F59797',
          "400": "#F6A29C",
          "200": '#FABAA4',
        },
        "teal": {
          "800": "#16565A",
          "600": '#91D2C9',
          "400": "#9FD6CD",
          "200": '#B6DFD8',
        },
      },
      fontFamily: {
        'sans': ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
        'serif': ['Fraunces', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}

