const { join } = require("node:path");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    join(__dirname, "src/**/*!(*.stories|*.spec).{ts,tsx}"),
    "../../node_modules/@rafty/**/*.js",
    "./node_modules/@rafty/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.sky,
      },
    },
  },
  plugins: [require("@rafty/plugin")],
};
