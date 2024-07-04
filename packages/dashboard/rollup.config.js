const { withNx } = require("@nx/rollup/with-nx");
const url = require("@rollup/plugin-url");
const svg = require("@svgr/rollup");
const postcss = require("rollup-plugin-postcss");

module.exports = withNx(
  {
    main: "./src/index.ts",
    outputPath: "../../dist/packages/dashboard",
    tsConfig: "./tsconfig.lib.json",
    compiler: "swc",
    external: ["react", "react-dom", "react/jsx-runtime"],
    format: ["esm"],
    assets: [{ input: ".", output: ".", glob: "README.md" }],
  },
  {
    plugins: [
      svg({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      url({
        limit: 10000, // 10kB
      }),
      postcss({
        config: {
          path: "./postcss.config.js",
        },
        extensions: [".css"],
        minimize: true,
        extract: true,
        inject: {
          insertAt: "top",
        },
      }),
    ],
  },
);
