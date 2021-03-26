module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: 'Helvetica, Roboto, sans-serif',
    },
    extend: {
      colors: {
        dark: {
          1: '#121212',
          2: '#1e1e1e',
        },
        accent: {
          1: '#4caf50',
          2: '#58cc5c',
        },
        buy: {
          1: '#4caf50',
        },
        sell: {
          1: '#cf6679',
        },
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover', 'group-focus'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
