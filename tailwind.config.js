/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0b0f2b",
          accent: "#5a5df0",
          light: "#d1d5db",
        },
      },
      backgroundImage: {
        galaxy: "url('/galaxy.jpeg')",
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
