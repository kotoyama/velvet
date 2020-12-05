import merge from "webpack-merge";
import baseWebpackConfig from "./webpack.base.conf";

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  plugins: [],
});

export default new Promise((resolve) => {
  resolve(buildWebpackConfig);
});
