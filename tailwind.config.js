/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"]
      },
      colors: {
        brand: {
          pink: "#FF3B81",
          purple: "#7C3AED",
          dark: "#050816"
        }
      },
      boxShadow: {
        neon: "0 0 30px rgba(236, 72, 153, 0.6)"
      }
    }
  },
  plugins: []
};


