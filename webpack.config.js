const path = require('path');
const outputPath = path.resolve(__dirname, "dist");
const HtmlWebpackPlugin = require('html-webpack-plugin'); //ここを追加
const MODE = "development";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

module.exports = {
  mode: MODE,
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: `${outputPath}`
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        // 対象となるファイルの拡張子
        test: /\.css/,
        // ローダー名
        use: [
          // linkタグに出力する機能
          "style-loader",
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップを有効にする
              sourceMap: enabledSourceMap
            }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    contentBase: `${outputPath}/`, //エントリーポイントを指定
    open: true, // ブラウザを自動で開くか否か
    hot: true, // 開発中にCSSとかを変更した時、リロードせずに更新するか否か
    watchContentBase: true // 変更した時自動でリロードされるか否か
  },
  plugins: [
    // new UglifyJSPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};