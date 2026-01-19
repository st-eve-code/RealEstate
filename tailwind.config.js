// const { keyframes, transform, animations } = require("framer-motion");

// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily:{
        'Custom': 'Custom',
        'Poppins':'Poppins'
      },
      keyframes:{
        "scroll": {
          "0%": {transform: "translateX(0)"},
          "100%": {transform: "translateX(calc(40% - 20px))"}
        },
      },
      animation:{
          "scroll": "scroll 20s linear infinite",
        },
    },
  },
  plugins: [],
};
