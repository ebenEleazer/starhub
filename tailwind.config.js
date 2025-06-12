/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // flattened keys
        "space-dark": "#0b0f2b",    // main background
        "space-accent": "#5a5df0",  // highlight
        "space-light": "#d1d5db",   // light text
      },
      backgroundImage: {
        galaxy: "url('/galaxy.jpg')",
      },
      fontFamily: {
        futuristic: ["'Orbitron'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 10px #5a5df0",
      },
    },
  },
  plugins: [],
};