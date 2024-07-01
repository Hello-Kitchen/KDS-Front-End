/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      height: {
        'lh': '7%',
        'lf': '13%',
        'lb': '80%',
        'pos-button': '11%',
      },
      width: {
        'etat': '4%'
      },
      fontSize: {
        '24px': '24px',
        '20px': '20px',
        'etat': '12px'
      },
      colors: {
        'kitchen-blue': '#499CA6',
        'kitchen-yellow': '#F2E5A2',
        'kitchen-orange': '#F2762E',
        'kitchen-red': '#D91604',
        'kitchen-beige': '#D98282',
      }
    },
  },
  plugins: [],
}
