/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors:{
        glass : "rgba(255,255,255,0.25)",
        primary : "#223671",
        active : "#198cf0"
      },
      backgroundImage: {
        'hero-pattern': "url('https://www.wallpaperflare.com/white-ceramic-mug-near-eyeglasses-with-black-frames-and-gray-laptop-computer-on-brown-table-wallpaper-zgbgu')",
      }
    },
  },
  plugins: [],
}


