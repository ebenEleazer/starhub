/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "space-dark": "#0b0f2b",
        "space-accent": "#5a5df0",
        "space-light": "#d1d5db",
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