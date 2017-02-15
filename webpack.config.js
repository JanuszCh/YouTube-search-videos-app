var webpack = require('webpack');
module.exports = {
    entry: {
        app: './index.js',
        vendor: ['angular', 'angular-ui-router', 'angular-route', 'angular-animate']
    },
    output: {
        path: __dirname + '/dist/js',
        filename: 'app.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'external.js' })
    ],
    watch: true
};