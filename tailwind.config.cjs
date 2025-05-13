/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0a0a0a",        // Near black
        secondary: "#d1d1d1",      // Light gray
        tertiary: "#1a1a1a",       // Dark gray
        "black-100": "#0f0f0f",    // Very dark gray
        "black-200": "#050505",    // Darker black
        "white-100": "#f0f0f0",    // Off-white
      },
      boxShadow: {
        card: "0px 35px 120px -15px #1a1a1a",  // Dark gray shadow
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};