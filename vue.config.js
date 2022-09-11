const path = require('path')
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

const resolve = dir => {
  return path.join(__dirname, dir)
}
// 项目部署基础
const BASE_URL = process.env.NODE_ENV === 'production' ? './' : './';
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
module.exports = {
  // 输出文件目录
  outputDir: 'web',
  assetsDir: 'static',
  indexPath: 'index.html',
  filenameHashing: false,
  productionSourceMap: false,

  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  configureWebpack: config => {
    const plugins = [];
    if (IS_PROD){
      plugins.push(
          new CompressionWebpackPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: productionGzipExtensions,
            threshold: 10240,
            minRatio: 0.8
          })
      );
      config.plugins = [...config.plugins, ...plugins];
      config.optimization = {
        splitChunks:{
          cacheGroups:{
            common:{
              name:"chunk-common",
              chunks:"initial",
              minChunks:2,
              maxInitialRequests:5,
              minSize:0,
              priority:1,
              reuseExistingChunk:true,
              enforce:true
            },
            vendors:{
              name:"chunk-vendors",
              test:/[\\/]node_modules[\\/]/,
              chunks:"initial",
              priority:2,
              reuseExistingChunk:true,
              enforce:true
            },
            elementUI:{
              name:"chunk-elementui",
              test:/[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks:"all",
              priority:3,
              reuseExistingChunk:true,
              enforce:true
            },
          }
        }
      };
    }
  },
  chainWebpack: config => {
    if (IS_PROD) {
      config.optimization.delete("splitChunks");
    }
    //别名，如import test from '_c/test'; import config from "@/config";
    config.resolve.alias
        .set('@', resolve('src'))
        .set('_c', resolve('src/components'));
  },
  css: {
    extract: true,
    sourceMap: false,//打包时不生成.map文件
  },
}
