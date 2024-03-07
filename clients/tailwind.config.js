/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/src/assets/goodspace_img.jpg')",
        // 'footer-texture': "url('/img/footer-texture.png')",
      }
    }
  },
  plugins: [],
};
