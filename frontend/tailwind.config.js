module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "accent-color": "var(--accent-color)",
        "ldark-color": "var(--ldark-color)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}