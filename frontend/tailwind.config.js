/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9", // niebieski akcent
        secondary: "#1e293b", // ciemny szary
      },
    },
  },
  plugins: [],
};
