const { withNx } = require("@nx/rollup/with-nx");
const url = require("@rollup/plugin-url");
const svg = require("@svgr/rollup");
const preserveDirectives = require("rollup-plugin-preserve-directives");
const terser = require("@rollup/plugin-terser");

module.exports = withNx(
  {
    main: "./src/index.ts",
    outputPath: "../../dist/packages/storage",
    tsConfig: "./tsconfig.lib.json",
    compiler: "swc",
    external: ["react", "react-dom", "react/jsx-runtime"],
    format: ["esm"],
    assets: [{ input: ".", output: ".", glob: "README.md" }],
  },
  {
    output: { preserveModules: true },
    plugins: [
      svg({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      url({
        limit: 10000, // 10kB
      }),
      preserveDirectives.default(), // For preserving "use client" directives
      terser(), // For minification
    ],
  },
);
