/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          navy:   "#003049",
          red:    "#d62828",
          orange: "#f77f00",
          gold:   "#fcbf49",
          cream:  "#eae2b7",
        },
      },
    },
  },
  plugins: [],
};
