const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成一个HTML文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");// 这个插件将CSS提取到单独的文件中。它为每个包含CSS的JS文件创建一个CSS文件。它支持按需加载CSS和SourceMaps。// 它构建在新的webpack v5特性之上，需要webpack 5才能工作。
// 打包后地---静态资源址/dist/static
const STATIC_SOURCE_PATH = 'static'
module.exports = {
    target: 'web',
    // 
    mode: 'development',
    // 将编译后的代码映射回原始源代码。
    // 如果一个错误来自于 b.js，source map 就会明确的告诉你
    // 开发环境，追求重新构建速度，同时也要高度还原代码，可选：eval-source-map或eval-cheap-module-source-map，这二者可以自己抉择，后者速度更快、生成的包体积更小，但无法进行行内调试。
    // 生产环境，又要安全，又要高还原度，不在乎打包速度，那么可选source-map与hidden-source-map。
    devtool: 'eval-cheap-module-source-map',
    //
    entry: {
        main: './src/main.js',
        other: './src/other.js'
    },
    // 
    output: {
        path: resolve(__dirname, 'dist'), // output 目录对应一个绝对路径
        filename: STATIC_SOURCE_PATH + '/js/[name].[contenthash].bundle.js', // 此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
        clean: true // 在每次构建前清理 /dist 文件夹
    },
    // 
    module: {
        rules: [
            // ********************************** css 处理 **********************************************
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,// 将CSS提取到单独的文件中
                    // 'style-loader', // 通过注入一个<style>标签将CSS添加到DOM中
                    'css-loader',
                    'sass-loader'
                ]
            },

            // ********************************** assets module 静态资源处理 **********************************************
            // 1.图片资源
            // {
            //     test: /\.(jpg|png|gif)$/,
            //     loader: 'url-loader',
            //     options: {
            //         limit: 10 * 1024, // 将内联文件作为数据URL的字节限制
            //         // mimetype: 'extname',// default = 'extname' // 为文件指定MIME类型(否则将从文件扩展名推断) 
            //         // fallback: 'file-loader', // default = 'file-loader' // 当文件大于限制时为文件指定加载器(以字节为单位) 
            //         outputPath: 'static', // 指定输出目录
            //         esModule: false,
            //     }
            // },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset',// webpack 将按照默认条件，自动地在 resource 和 inline 之间进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型。// 可以通过在 webpack 配置的 module rule 层级中，设置 Rule.parser.dataUrlCondition.maxSize 选项来修改此条件：
                parser: {
                    dataUrlCondition: {
                        maxSize: 2 * 1024 // (10kb) // 如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中
                    }
                },
                generator: {
                    filename: STATIC_SOURCE_PATH + '/img/[contenthash][ext]', // 资源名称
                },
            },

            // 2.html 中url引入图片资源处理
            // {
            //     test: /\.html$/,
            //     loader: 'html-loader',
            //     options: {
            //         esModule: false,
            //     }
            // },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },

            // 3.字体资源
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf)$/i,
            //     type: 'asset/resource',
            // },

            // 4.other-file 其他文件的处理
            // {
            //     exclude: /\.(js|css|html|scss|png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/,
            //     loader: 'file-loader',
            //     options: {
            //         outputPath: 'static',
            //         name: '[hash:10].[ext]',
            //     }
            // },
        ]
    },
    // 
    plugins: [
        new MiniCssExtractPlugin({ // 将CSS提取到单独的文件中
            filename: STATIC_SOURCE_PATH + '/css/[contenthash].css', // 该选项确定每个输出CSS文件的名称。
            // chunkFilename: '', // 此选项确定非入口块文件的名称。
        }),
        new HtmlWebpackPlugin({
            title: '包子 TOOLS', // 要用于生成的HTML文档的标题 
            filename: 'index.html', // 要向其写入HTML的文件。 默认为index.html。 你也可以在这里指定一个子目录(例如:assets/admin.html)。 占位符将被条目名称替换。 也可以是一个函数，例如(entryName) => entryName + '.html'。 
            template: './src/index.html', // 模板的Webpack相对或绝对路径。 默认情况下，它将使用src/index。
            // publicPath: 'auto', // 用于脚本和链接标记的publicPath
            favicon: './assets/icon.png', // 将给定的favicon路径添加到输出HTML 
            // meta: '', // 允许注入元标签。 例如meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'} 
            // minify: true // true if mode is 'production', otherwise false
        }),
    ],
    // 
    optimization: {
        runtimeChunk: 'single',
    },
    // webpack-dev-server 提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
    devServer: {
        // static: join(__dirname, "dist/static"), // 废弃： contentBase: join(__dirname, "dist"), // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。// devServer.publicPath 将用于确定应该从哪里提供 bundle，并且此选项优先。
        // publicPath: '/js/',// 此路径下的打包文件可在浏览器中访问。// 假设服务器运行在 http://localhost:8080 并且 output.filename 被设置为 bundle.js。默认 publicPath 是 "/"，所以你的包(bundle)可以通过 http://localhost:8080/bundle.js 访问。
        compress: true, // 一切服务都启用gzip 压缩：
        port: 9000,
        hot: false, // 开启热模块替换
        open: true// 当打开被启用时，开发服务器将打开浏览器。
    },
}