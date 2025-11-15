/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  theme: {
    extend: {
      colors: {
        'custom-blue-1': '#0D0D0D',
        'custom-blue-2': '#1A1A1A'
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to bottom, #0D0D0D, #1A1A1A)'
      }
    }
  }
}
