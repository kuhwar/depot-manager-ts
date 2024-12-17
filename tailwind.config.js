/** @type {import('tailwindcss').Config} */
module.exports = {
  mode:"jit",
  purge: [
    './public/**/*.html',
    './views/**/*.hbs',
  ],
  content: ['./views/**/*.hbs'],
  theme: {
    extend: {},
  },
  plugins: [],
}

