const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Official Vision Spark Brand Colors extracted from logo
        vsNavy: '#01155C',       // Deep Corporate Navy
        vsDarkNavy: '#030A1D',   // Rich Midnight Navy background
        vsCard: '#081436',       // Elevation card surface
        vsCardBorder: '#142966', // Subtle blue border
        vsBlue: '#0054FF',       // Vibrant Electric Blue
        vsBlueHover: '#0047E0',  // Hover Electric Blue
        vsOrange: '#FC5302',     // Spark Flame Orange
        vsOrangeHover: '#E04700',// Hover Flame Orange
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #01155C 0%, #0054FF 50%, #FC5302 100%)',
        'spark-gradient': 'linear-gradient(135deg, #FC5302 0%, #FF7B00 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0054FF 0%, #01155C 100%)',
        'navy-gradient': 'linear-gradient(180deg, #030A1D 0%, #081436 100%)',
      },
      boxShadow: {
        'spark-glow': '0 0 25px -5px rgba(252, 83, 2, 0.4)',
        'blue-glow': '0 0 25px -5px rgba(0, 84, 255, 0.4)',
        'card-glow': '0 10px 30px -10px rgba(1, 21, 92, 0.5)',
      },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    addVariablesForColors
  ],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}
