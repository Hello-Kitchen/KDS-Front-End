/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      height: {
        'lh': '5%',
        'lf': '10%',
        'lb': '85%',
        'pos-button': '11%',
      },
      writingMode: {
        'tb-rl': 'vertical-rl',
      },
      rotate: {
        '-180': '-180deg',
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
        'kitchen-green': '#62B73A',
        'kitchen-red': '#D91604',
        'kitchen-beige': '#D98282',
      }
    },
  },
  /**
   * Safelist is used to force the colors to be in the final css file to be used in dynamic classes
   */
  safelist: [
    'text-kitchen-green',
    'text-kitchen-red',
    'text-kitchen-blue',
    'bg-kitchen-green',
    'bg-kitchen-red',
    'bg-kitchen-blue',
  ],
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
