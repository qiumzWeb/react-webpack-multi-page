var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var utils = require('./utils')
var config = require('../config')
var baseWebpackConfig = require('./webpack.base.conf')
var env = config.build.env;


var webpackConfig = merge(baseWebpackConfig, {
    // module: {
    //     loaders: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true })
    // },
    devtool: config.build.productionSourceMap ? '#source-map' : false,

    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].js?[chunkhash]'),
        chunkFilename: utils.assetsPath('js/[id].js')
    },

    // vue: {
    //     loaders: utils.cssLoaders({
    //         sourceMap: config.build.productionSourceMap,
    //         extract: true
    //     })
    // },

    plugins: [
        // http://vuejs.github.io/vue-loader/workflow/production.html
        // new webpack.DefinePlugin({
        //     'process.env': env
        // }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),   
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                properties: false,
                warnings: false
            },
            sourceMap: false
        }),
        // 有时候build出来的<script>依赖关系会乱，先注释
        new webpack.optimize.OccurrenceOrderPlugin(),

        // extract css into its own file
        new ExtractTextPlugin(utils.assetsPath('css/[name].css?[contenthash]')),


        // common css into base.css
        new webpack.optimize.CommonsChunkPlugin({
            name: ['base'],// 为公共模块起一个名称
            minChunks: function (module, count) {
                return module.resource && (/\.js$/.test(module.resource) && (module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0 || 
                        module.resource.indexOf('assets') >-1)
                    ) || (/\.scss$|\.css$/.test(module.resource) && count > 5) || count>=10
            }
        }),
        
        // split vendor js and UI framework into its own file
        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'],// 为公共模块起一个名称
            chunks:['base'],
            minChunks: function (module, count) {
                var jsReg = /\.js$/.test(module.resource) &&
                    ((module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0 || 
                        module.resource.indexOf('assets') >-1)
                    );
                return (
                    module.resource && jsReg
                )
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({
            names: ["echarts"],
            chunks:['vendor'],
            minChunks : function (module, count) {
                var jsReg = /\.js$/.test(module.resource) && (module.resource.indexOf('echarts') !==-1 || module.resource.indexOf('zrender')!==-1 )
                return (
                    module.resource && jsReg
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["manifest"],
            minChunks: Infinity
        })
    ]
})

// if (config.build.productionGzip) {
//     var CompressionWebpackPlugin = require('compression-webpack-plugin')
//     webpackConfig.plugins.push(
//         new CompressionWebpackPlugin({
//             asset: '[path].gz[query]',
//             algorithm: 'gzip',
//             test: new RegExp(
//                 '\\.(' +
//                 config.build.productionGzipExtensions.join('|') +
//                 ')$'
//             ),
//             threshold: 10240,
//             minRatio: 0.8
//         })
//     )
// }

module.exports = webpackConfig
