const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const utils = {};

utils.resolveStaticPath = function (path) {
    return 'hmui/static' + path;
};

utils.getIPAdress = function () {
    let interfaces = require('os').networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
};

const env = {
    NODE_ENV: `"${process.env.NODE_ENV}"`
};

module.exports = {
    entry: {
        hmui: './main.js'
    },
    output: {
        path: path.resolve(__dirname, './output'),
        publicPath: '/',
        filename: utils.resolveStaticPath('/js/[name]_[chunkhash:7].js'),
        chunkFilename: utils.resolveStaticPath('/js/[name]_[chunkhash:7].js')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // vue-loader options go here
                    loaders: {
                        // 'less': 'vue-style-loader!css-loader?-autoprefixer!postcss-loader!less-loader'
                        less: [
                            'vue-style-loader',
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins() {
                                        return [autoprefixer];
                                    }
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {}
                            }
                        ]
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)$/,
                // use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
                use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: 'css-loader',
                            options: {
                                modules: false
                            },
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                plugins() {
                                    return [autoprefixer];
                                }
                            }
                        }, {
                            loader: 'less-loader',
                            options: {}
                        }]
                    }
                )
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: '3000',
                    name: utils.resolveStaticPath('/img/[name]_[hash:7].[ext]')
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.resolveStaticPath('/fonts/[name]_[hash:7].[ext]')
                }
            }
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh/),
        new webpack.LoaderOptionsPlugin({
            minimize: isProduction,
            options: {
                context: __dirname,
                postcss: [autoprefixer]
            }
        }),
        new webpack.ProvidePlugin({
            $: 'zepto-hh'
        }),
        new ExtractTextPlugin({
            filename: utils.resolveStaticPath('/css/[name]_[chunkhash:7].css'),
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: isProduction,
                collapseWhitespace: isProduction,
                removeAttributeQuotes: isProduction,
                minifyCSS: isProduction
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
                );
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            filename: utils.resolveStaticPath('/js/manifest_[hash:7].js'),
            chunks: ['vendor']
        }),
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: ['node_modules'],
        alias: {
            'vue$': 'vue/dist/vue',
            'vue-router$': 'vue-router/dist/vue-router',
            'videojs': 'video.js/dist',
        }
    },
    externals: {
    },
    devServer: {
        host: utils.getIPAdress(),
        historyApiFallback: {
            rewrites: [{
                from: /\/hmui/,
                to: '/index.html'
            }]
        },
        overlay: {
            errors: true
        },
        compress: true,
        noInfo: true
    },
    devtool: '#source-map'
};
