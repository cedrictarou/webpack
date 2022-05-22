const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const loader = require('sass-loader');

// 'production' か 'development' を指定
const MODE = 'development';

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === 'development';

module.exports = {
  mode: MODE,
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: `./src/javascripts/index.js`,

  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: 'javascripts/main.js',
  },
  devServer: {
    static: 'dist',
    open: true,
  },
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2021 を ES5 に変換
                '@babel/preset-env',
              ],
            },
          },
        ],
      },
      // CSSファイルの読み込み
      // Sassファイルの読み込みとコンパイル
      {
        test: /\.scss/, // 対象となるファイルの拡張子
        use: [
          // CSSファイルを書き出すオプションを有効にする
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするための機能
          {
            loader: 'css-loader',
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpg|jpeg|svg)$/,
        // 画像をBase64として取り込む
        type: 'asset/inline',
        use: [
          {
            loader: 'image-webpack-loader',
          },
        ],
      },
      {
        test: /\.ejs$/,
        use: ['html-loader', 'ejs-plain-loader'],
      },
    ],
  },
  // ES5(IE11等)向けの指定
  target: ['web', 'es5'],
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/main.css',
    }),
    new HTMLWebpackPlugin({
      filename: './index.html',
      template: './src/templates/index.ejs',
    }),
    new CleanWebpackPlugin(),
  ],
};
