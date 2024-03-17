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
        active : "#198cf0",
        bgr1: "rgb(23, 123, 99)",
        bgr2: "rgb(98, 110, 123)",
        bgr3: "#18615B",        
      },
      screens: {
        'phone': '400px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
      },
      backgroundImage: {
        'hero-pattern': "url('https://www.wallpaperflare.com/white-ceramic-mug-near-eyeglasses-with-black-frames-and-gray-laptop-computer-on-brown-table-wallpaper-zgbgu')",
      }
    },
  },
  plugins: [],
}


