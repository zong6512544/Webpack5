const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 读取html模板
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css到单独的一个文件中
module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            // 1.处理css
            {
                test: /\.css$/,
                use: [
                    // 'style-loader', // html内注入style
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            // 2.处理scss
            {
                test: /\.scss$/,
                use: [
                    // 'style-loader', // html内注入style
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            // 3.处理图片资源
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    name: '[hash:10].[ext]',
                    esModule: false
                }
            },
            // 4.处理html中的图片path
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    esModule: false
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/bundle.css',
        }),
    ],
    mode: 'development',
    // devServer
    // 启动devServer指令：npx webpack serve
    devServer: {
        // 告诉服务器从哪个目录中提供内容
        contentBase: resolve(__dirname, 'build'),
        // 启动gzip压缩
        compress: true,
        // 指定要监听请求的端口号
        port: 3000,
        // 自动打开浏览器
        open: true
    }
}