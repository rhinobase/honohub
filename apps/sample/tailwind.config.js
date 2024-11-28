const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    join(
      __dirname,
      "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}",
    ),
    "../../node_modules/@rafty/ui/**/*.js",
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@rafty/plugin")],
};
