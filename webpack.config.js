const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter(x => { return ['bin'].indexOf(x) === -1 })
    .forEach(mod => { nodeModules[mod] = 'commonjs ' + mod });

module.exports = [

    // Client JavaScript
    {
        devtool: 'source-map',
        entry: path.join(__dirname, 'src', 'app', 'js', 'app.js'),
        output: {
            path: path.join(__dirname, 'dist', 'app', 'js'),
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: [
                        path.join(__dirname, 'dist'),
                        path.join(__dirname, 'src', 'app', 'css')
                    ],
                    loader: ['babel-loader']
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false },
                mangle: true,
                sourcemap: false,
                beautify: false,
                dead_code: true
            })
        ]
    },

    // Server JavaScript
    {
        devtool: 'source-map',
        entry: path.join(__dirname, 'src', 'server', 'config.js'),
        target: 'node',
        node: {
            __dirname: true
        },
        externals: nodeModules,
        output: {
            path: path.join(__dirname, 'dist', 'server'),
            filename: 'cor-server.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: [
                        path.join(__dirname, 'dist')
                    ],
                    loader: ['babel-loader']
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.ProvidePlugin({
                React: 'react',
                ReactDOM: 'react-dom'
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    }
]