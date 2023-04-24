const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
    return {
        mode: env.development ? "development" : "production",
        entry: "./src/index.tsx",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                    enforce: "pre"
                },
                {
                    test: /\.css$/i,
                    use: "css-loader"
                }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Development",
                template: "./src/index.html"
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {from: "src/lists", to: "lists"}
                ]
            })
        ],
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist"),
            publicPath: "auto"
        },
        devtool: "inline-source-map",
        devServer: {
            static: "./dist"
        },
    }
}