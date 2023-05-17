/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['"Roboto Serif"', "serif"]
      }
    },
  },
  daisyui: {
    themes: [
      {
        gallis: {
        
       
 "primary": "#a03bcc",
          
 "secondary": "#c23ce8",
          
 "accent": "#f97063",
          
 "neutral": "#21313B",
          
 "base-100": "#E5EAF0",
          
 "info": "#4269D7",
          
 "success": "#1D9A8A",
          
 "warning": "#A26511",
          
 "error": "#EF1F53",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
