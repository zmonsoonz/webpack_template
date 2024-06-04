const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
module.exports = (env) => {

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

        plugins: [
            new webpack.ProgressPlugin(),
            new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html') }),
        ]
    }
}