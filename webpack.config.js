const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = (env) => {
    return {
        mode: env.development ? 'development' : 'production',
        entry: './src/index.tsx',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: 'auto',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                    enforce: 'pre',
                },
                {
                    test: /\.css$/i,
                    use: 'css-loader',
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                      '@mui/styled-engine': '@mui/styled-engine-sc'
        },
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Development',
                template: './src/index.html',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'src/lists', to: 'lists' },
                ],
            }),
        ],
        devtool: 'inline-source-map',
        devServer: {
            'static': { directory: './dist' },
        },
    }
}