const { join } = require("node:path");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    join(__dirname, "src/**/*!(*.stories|*.spec).{ts,tsx}"),
    "./node_modules/@rafty/**/*.js",
  ],
  theme: {
    borderRadius: {
      none: "0px",
      sm: "0px",
      base: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
    },
    extend: {
      colors: {
        primary: colors.sky,
      },
    },
  },
  plugins: [require("@rafty/plugin")],
};
