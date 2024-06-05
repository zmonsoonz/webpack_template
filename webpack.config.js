//импортим все нужные плагины
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = (env) => {

    const isDev = env.mode === 'development'; // проверка на дев мод
    const isProd = !isDev; // проверка на прод мод

    return {    

        mode: env.mode ?? 'development', //задает мод сборка или разработка

        entry: path.resolve(__dirname, 'src', 'js', 'index.js'), //путь до входного файла, добавляет бабель

        output: {
            filename: '[name].[contenthash].js', //название выходного файла (name - берет имя входного файла, 
                                                //contenthash - добавляет в название хэш содержимого, 
                                                //чтобы не менять файл, если внутри ничего не поменялось)
            path: path.resolve(__dirname, 'build'), //путь до выходного файла
            assetModuleFilename: "assets/[hash][ext]",
            clean: true //чистит директорию от лишних файлов
        },

        module: { //меняет файлы для сборки
            rules: [
                
                {
                    test: /\.html$/i,
                    loader: "html-loader", // добавляем html loader чтобы заимпортить в js
                }, 

                {
                    test: /\.(c|sa|sc)ss$/i, // выбираем все файлы css, scss, sass
                    use: [
                      // Creates `style` nodes from JS strings
                      isDev ? "style-loader" : MiniCssExtractPlugin.loader, // в дев сборке используем обычный style loader
                      // Translates CSS into CommonJS
                      "css-loader",
                      {
                        loader: "postcss-loader", // добавляем post-css для добавления вендорных префиксов
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')]
                            }
                        }
                      },
                      // Compiles Sass to CSS
                      "sass-loader",
                    ],
                },

                {
                    test: /\.woff2?$/i, //подгрузка шрифтов в сборку
                    type: "asset/resource",
                    generator: {
                        filename: 'fonts/[name][ext]'
                    }
                },

                {
                    test: /\.(jpe?g|png|gif|webp|svg)$/i, // подгрузка минимизированных картинок в сборку
                    use: [
                        {
                            loader: 'image-webpack-loader',

                            options: {
                                mozjpeg: {
                                progressive: true,
                                },

                                optipng: {
                                enabled: false,
                                },

                                pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                                },

                                gifsicle: {
                                interlaced: false,
                                },
                                
                                webp: {
                                quality: 75
                                }
                            }
                        }
                    ],
                    type: "asset/resource"
                },

                {
                    test: /\.(?:js|mjs|cjs)$/, //добавляем бабель для поддержки js во всех браузерах
                    exclude: /node_modules/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          ['@babel/preset-env', { targets: "defaults" }]
                        ]
                      }
                    }
                },
            ]
        },

        plugins: [
            new webpack.ProgressPlugin(), //плагин показывает прогресс сборки (не рекомендуется ипользовать)
            new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
            //плагин подгружает html в build
            !isDev && new MiniCssExtractPlugin() //добавляет css файлы в сборку
        ],

        devtool: isDev && 'inline-source-map', //соурс мап для отслеживания ошибок

        devServer: isDev ? { // пересобирает проект при изменениях
            port: env.port ?? 3000,
            open: true,
            hot: true,
        } : undefined,
    }
}