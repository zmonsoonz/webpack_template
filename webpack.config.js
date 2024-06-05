const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = (env) => {

    const isDev = env.mode === 'development'; // проверка на дев мод
    const isProd = !isDev; // проверка на прод мод

    return {    

        mode: env.mode ?? 'development', //задает мод сборка или разработка

        entry: path.resolve(__dirname, 'src', 'index.js'), //путь до входного файла

        output: {
            filename: '[name].[contenthash].js', //название выходного файла (name - берет имя входного файла, 
                                                //contenthash - добавляет в название хэш содержимого, 
                                                //чтобы не менять файл, если внутри ничего не поменялось)
            path: path.resolve(__dirname, 'build'), //путь до выходного файла
            clean: true //чистит директорию от лишних файлов
        },
        module: { //меняет файлы для сборки
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                      // Creates `style` nodes from JS strings
                      isDev ? "style-loader" : MiniCssExtractPlugin.loader, // в дев сборке используем обычный style loader
                      // Translates CSS into CommonJS
                      "css-loader",
                      // Compiles Sass to CSS
                      "sass-loader",
                    ],
                },
            ]
        },
        plugins: [
            new webpack.ProgressPlugin(), //плагин показывает прогресс сборки (не рекомендуется ипользовать)
            new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html') }),
            //плагин подгружает html в build
            !isDev && new MiniCssExtractPlugin() //добавляет css файлы в сборку
        ],

        devtool: isDev && 'inline-source-map', //соурс мап для отслеживания ошибок

        devServer: isDev ? { // пересобирает проект при изменениях
            port: env.port ?? 3000,
            open: true,
        } : undefined,
    }
}