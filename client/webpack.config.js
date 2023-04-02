const path = require("path")
const webpack = require("webpack")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"
const prod = process.env.NODE_ENV === "production"

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(c|sa|sc)ss$/,
        include: __dirname + "/src",
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: () => [postcssPresetEnv({ stage: 0 })],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|j?g|svg|gif)?$/,
        use: "file-loader?name=./assets/images/[name].[ext]",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    sourceMapFilename: "bundle.js.map",
    publicPath: "/",
  },
  devtool: prod ? undefined : "eval-source-map",
  devServer: {
    compress: true,
    port: process.env.FRONTEND_PORT || 3000,
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      "process.env.BACKEND_URL": JSON.stringify(BACKEND_URL),
    }),
  ],
}
