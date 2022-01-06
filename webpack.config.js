const path = require('path');
const fs = require("fs");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
//const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = (env) => {
  if (env.artserver == undefined || env.artserver == true){
    env.artserver = "http://localhost:3000";
  }
  console.log('server: ', env.artserver);

  let footer = '';
  if (fs.existsSync('./footer.html')){
    footer = fs.readFileSync('./footer.html');
  }

  return {
    entry: './src/index.js',
    output: {
      path: __dirname + '/public',
      filename: 'bundle.js'
    },
    module: {
      rules : [
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!(melonjs)\/).*/,
          use: {
              loader: 'swc-loader',
              options: {
                // presets: ['@babel/preset-env']
              }
          }
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader', options: { injectType: "singletonStyleTag", insert: "head" } },
            'css-loader'
          ]
        },
        {
          test: /\.ftl$/,
          use: "fluent-loader",
        },
      ]
    },
    plugins: [
      new webpack.EnvironmentPlugin(env),
      new HtmlWebpackPlugin({
          template: './src/index.html',
          hash: true,
          footer: footer,
      }),
    /*    new FaviconsWebpackPlugin({
          logo: './src/favicon/logo.png', // svg works too!
          mode: 'auto', // optional can be 'webapp', 'light' or 'auto' - 'auto' by default
          devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
          favicons: {
              appName: 'melonJS ES6 Boilerplate',
              appDescription: 'My melonJS ES6 Boilerplate Game',
              developerName: 'melonJS',
              developerURL: "http://www.melonjs.org", // prevent retrieving from the nearest package.json
              icons: {
                  coast: false,
                  yandex: false
              }
          }
      })*/
    ],
    resolve: {
      modules: [
        path.resolve('./src'),
        path.resolve('./node_modules')
      ]
    },
    devServer: {
      static: {
          directory: path.join(__dirname, 'data'),
          publicPath: '/data',
          watch: true,
      },
      compress: false,
      hot: true,
      port: 9000,
      open: true
    },
    watch: false
  };
};
