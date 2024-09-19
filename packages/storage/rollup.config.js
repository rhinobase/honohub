const { withNx } = require("@nx/rollup/with-nx");
const url = require("@rollup/plugin-url");
const svg = require("@svgr/rollup");

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
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    plugins: [
      svg({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      url({
        limit: 10000, // 10kB
      }),
    ],
  },
);
