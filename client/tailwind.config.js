/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#0f172a",
        accent: "#22C55E",
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
