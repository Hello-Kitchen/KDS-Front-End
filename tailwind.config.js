/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    colors: {
      'white': '#FFFFFF',
      'black': '#000000',
      'kitchen-blue': '#499CA6',
      'kitchen-yellow': '#F2E5A2',
      'kitchen-orange': '#F2762E',
      'kitchen-red': '#D91604',
      'kitchen-beige': '#D98282',
    },
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
      }
    },
  },
  plugins: [],
}
