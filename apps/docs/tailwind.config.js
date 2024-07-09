const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("node:path");
const { typographyStyles } = require("./typography");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    join(
      __dirname,
      "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html,mdx}",
    ),
    "../../packages/react/src/**/*.{jsx,tsx}",
    "../../node_modules/@rafty/**/**/*.js",

    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    typography: typographyStyles,
    extend: {
      colors: {
        primary: colors.sky,
      },
      boxShadow: {
        glow: "0 0 4px rgb(0 0 0 / 0.1)",
      },
      maxWidth: {
        lg: "33rem",
        "2xl": "40rem",
        "3xl": "50rem",
        "5xl": "66rem",
      },
      opacity: {
        1: "0.01",
        2.5: "0.025",
        7.5: "0.075",
        15: "0.15",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@rafty/plugin")],
};
