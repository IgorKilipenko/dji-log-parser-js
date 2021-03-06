import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import path from 'path';

//const host = 'localhost';
//const port = 3005;

const baseConfig = {
    entry: ['./src/server/index.js'],
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'bundle.server.js'
    },
    externals: [ /^(?!\.|\/).+/i, ],
    //mode: process.env.
    target: 'node',
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: [/node_modules/]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[hash:base64:5]__[local]',
                            minimize: false
                        }
                    },
                    { loader: 'postcss-loader' }
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 1000000,
                    name: '[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.svg$/,
                use: [
                    { loader: require.resolve('@svgr/webpack') },
                    {
                        loader: require.resolve('url-loader'),
                        options: {
                            /*limit: 1000000,*/
                            name: '[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: require.resolve('file-loader'),
                options: {
                    name: '[name].[ext]',
                    outputPath: __dirname + 'fonts/'
                }
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: { postcss: [precss, autoprefixer] }
        }),
        new webpack.DefinePlugin({
            HOST: JSON.stringify('localhost'),
            PORT: JSON.stringify(7705),
            DIR: JSON.stringify(__dirname)
        })
    ]
};

module.exports = baseConfig;
