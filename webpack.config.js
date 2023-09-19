const path = require('path');

module.exports = {
    entry: './script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, ''), // Serve files from the '' directory
        },
        compress: true, // Enable gzip compression
        port: 3000, // Choose a port (can be any available port)
        hot: true, // Enable hot module replacement (HMR)
        open: ['/?account=illumination'], // Specify the URL(s) to open

    },
    watch: true, // Enable watch mode

};
