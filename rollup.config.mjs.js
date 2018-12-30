import typescript from "rollup-plugin-typescript2"
import sourcemaps from "rollup-plugin-sourcemaps"

export default {
  input: "./lib/simple-buffer-reader.ts",
  output: {
    file: "./lib/simple-buffer-reader.mjs",
    format: "es",
    sourcemap: true,
  },

  plugins: [
    typescript({
      tsconfig: "./lib/tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          module: "es2015",
          declaration: false,
        },
      },
    }),
    sourcemaps(),
  ],
}
