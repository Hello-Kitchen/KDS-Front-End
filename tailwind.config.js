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
        'pos-button': '11%',
      },
      writingMode: {
        'tb-rl': 'vertical-rl',
      },
      rotate: {
        '-180': '-180deg',
      },
      height: {
        '85%': '85%',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.writing-mode-tb-rl': {
          writingMode: 'vertical-rl',
        },
        '.rotate-180': {
          transform: 'rotate(-180deg)',
        },
        '.border-l-2': {
          borderLeftWidth: '10px',
        },
        '.border-l': {
          borderLeftColor: 'kitchen-blue',
        },
      });
    },
  ],
}
