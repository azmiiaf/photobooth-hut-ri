/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'merah-merdeka': '#9c1c20', // Lebih gelap/kalem, tidak menyala
        'putih-kalem': '#f4f4f4',
        'teks-gelap': '#1a1a1a',
        white: '#ffffff',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
