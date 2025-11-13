/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],           // ativa modo escuro via classe
  content: [
    "./app/**/*.{ts,tsx}",       // App Router
    "./components/**/*.{ts,tsx}",// componentes
  ],
  theme: {
    extend: {
        colors: {
        brand: "#1da1f2",
        },
        fontFamily: {
        sans: ["Inter", "sans-serif"],
        },
    },
    },
    plugins: [require("tailwindcss-animate")],
};
