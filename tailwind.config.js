/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        'fade-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(100%)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'fade-out-right': {
          '0%': {
            opacity: '1',
            transform: 'translateX(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(100%)'
          }
        }
      },
      animation: {
        'fade-in-right': 'fade-in-right 0.5s ease-out',
        'fade-out-right': 'fade-out-right 0.5s ease-out'
      }
    },
    colors:{
      'cute_purple':{
        100: '#573280',
        200: '#9D8DF1',
        300: '#B8CDF8'
      },
      'black': '#000',
      'white': '#FFF',
      'red':{
        600: '#dc2626'
      },
      'gray':{
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280'
      },
      'shadow': 'shadow'
    },
  },
  plugins: [],
}

