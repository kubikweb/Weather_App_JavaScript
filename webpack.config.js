const path = require("path");
const Html = require("html-webpack-plugin");
const MiniCSS = require("mini-css-extract-plugin");
const Compression = require("compression-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = function(env, argv) {
  const config = {};
  const isProd = argv.mode === 'production';
  const isDev = !isProd;
  
  config.entry = `./src/app.js`;
  config.output = {
    filename: isDev ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: '/Weather_App_JavaScript/',
    assetModuleFilename: 'images/[name].[hash][ext]',
    clean: true,
  };

  config.devtool = isProd ? false : "source-map";

  config.module = {};
  config.module.rules = [];

  const js = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          [
            "@babel/preset-env"
          ]
        ]
      }
    }
  };
  config.module.rules.push(js);

  const scss = {
    test: /\.scss$/,
    use: [
      isProd ? MiniCSS.loader : "style-loader",
      {
        loader: "css-loader",
        options: {
          sourceMap: isProd ? false : true
        }
      },
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [
              require("autoprefixer")
            ]
          }
        }
      },
      "sass-loader"
    ]
  };

  config.module.rules.push(scss);

  const images = {
    test: /\.(jpg|jpeg|gif|png|svg|csv)$/,
    type: 'asset/resource',
    generator: {
      filename: 'images/[name][ext]'
    }
  };
  config.module.rules.push(images);

  const fonts = {
    test: /\.(eot|ttf|woff|woff2)$/,
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[name][ext]'
    }
  };

  config.module.rules.push(fonts);

  config.plugins = [];

  config.plugins.push(
    new Html({
      filename: "index.html",
      template: `./index.html`,
      minify: isProd
    })
  );

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        { 
          from: "src/images", 
          to: "images",
          noErrorOnMissing: true
        }
      ]
    })
  );

  if (isProd) {
    config.plugins.push(new MiniCSS({ filename: "app.[contenthash].css" }));

    config.plugins.push(
      new Compression({
        threshold: 0,
        minRatio: 0.8
      })
    );
  }

  if (isDev) {
    config.devServer = {
      port: 8080,
      hot: true,
      historyApiFallback: true
    };
  }

  return config;
};
