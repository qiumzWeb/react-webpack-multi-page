var path = require('path')
var fs = require('fs')
var config = require('../config')
var utils = require('./utils')
var glob = require('glob')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

var isProd = process.env.NODE_ENV === 'production'
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var projectRoot = path.resolve(__dirname, '../')
var srcDir = path.resolve(__dirname, '../src')
var entries = utils.getEntries(srcDir + '/views/**/*.js')
var libs=path.resolve(__dirname, '../static/js/lib')
entries['flexible'] = path.resolve(__dirname, libs+'/flexible/flexible.js')
var autoprefixerConf = autoprefixer({ browsers: ['last 2 versions','Android >= 4.0','iOS >= 6'] });

module.exports = {
    entry: entries,

    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'images': path.resolve(__dirname, '../src/assets/images'),
            'js': path.resolve(__dirname, '../src/assets/js'),
            'components': path.resolve(__dirname, '../src/components'),
            'scss': path.resolve(__dirname, '../src/assets/scss')
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader:'babel-loader',
                exclude: /node_modules/
                // loaders: utils.cssLoaders({ sourceMap: useCssSourceMap })
            },
            {
                test: /\.jsx?$/, // test 去判断是否为.js或.jsx,是的话就是进行es6和jsx的编译
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1024,
                    name: 'user-defined'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.css$/,
                loader: isProd
                  ? ExtractTextPlugin.extract({
                      loader: 'css-loader',
                      fallback: 'react-style-loader'
                    })
                  : ['react-style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                loader: isProd
                  ? ExtractTextPlugin.extract({
                      loader: ['css-loader', 'sass-loader'],
                      fallback: 'react-style-loader'
                    })
                  : ['react-style-loader','css-loader','sass-loader']
            }
        ]
    },
    plugins:[]
    }
var pages = utils.getEntries('./src/views/**/*.html',1);
var echartsFlag;
for (var pathname in pages) {
  // 生成html相关配置
  echartsFlag = 0;
  var conf = {
    filename: pathname + '.html', // html文件输出路径
    template: pages[pathname],   // 模板路径
    // inject: true,                // js插入位置
    minify: {
      //压缩设置
      //removeComments: true,
      //collapseWhitespace: true,
      //removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'manual'
  };
  if (pathname in module.exports.entry) {
    var template = fs.readFileSync(module.exports.entry[pathname].replace(".html",".js"), 'utf-8');
    
    if(template.indexOf("needEchart")>-1){
        echartsFlag = 1;
    }
    conf.inject = {
        head: ['manifest','flexible','base'],
        body: ['vendor','echarts' , pathname]   
    };
    if(echartsFlag){//需要echarts引入逻辑修改
        conf.chunks = ['manifest','flexible','vendor','echarts', 'base',pathname];
    }else{
        conf.chunks = ['manifest','flexible', 'vendor', 'base',pathname];
    }
    conf.hash = false;
  }
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}

