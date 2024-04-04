/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#252525',
        'secondary-color': '#8c8c8c',
        'tertiary-color': '#FCFCFC',
      },

    }
  },
  plugins: [],
}