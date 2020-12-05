import { SourceMapDevToolPlugin } from "webpack";
import merge from "webpack-merge";
import baseWebpackConfig, { externals } from "./webpack.base.conf";

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: externals.paths.dist,
    historyApiFallback: true,
    port: 3000,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  plugins: [
    new SourceMapDevToolPlugin({
      filename: "[file].map",
    }),
  ],
});

export default new Promise((resolve) => {
  resolve(devWebpackConfig);
});
