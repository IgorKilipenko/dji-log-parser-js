import express from 'express';
import path from 'path';
import cors from 'cors';

const PORT = 7705;
const PUBLIC_PATH = DIR + '/dist';

console.log('DIR: ' + DIR)

const app = express();

app.use(cors());
const isDevelopment =
    process.env.NODE_ENV && process.env.NODE_ENV.trim() !== 'production';

console.log('WEBPACK_MODE :' + process.env.NODE_ENV);
console.log(typeof process.env.NODE_ENV);
console.log('isDevelopment :' + isDevelopment);

if (isDevelopment) {
    const webpack = require('webpack');
    const webpackConfig = require('../../webpack.config.dev.babel');
    webpackConfig.mode = 'development';
    const compiler = webpack(webpackConfig);
    console.log(webpackConfig.output);
    console.log(webpackConfig.entry);
    app.use(
        require('webpack-dev-middleware')(compiler, {
            contentBase: './dist',
            host: 'loclahost',
            hot: true,
            stats: {
                colors: true
            },
            publicPath: webpackConfig.output.publicPath
        })
    );
    app.use(
        require('webpack-hot-middleware')(compiler, {
            publicPath: webpackConfig.output.publicPath,
            //path: '/__webpack_hmr',
        })
    );
    app.use('*', (req, res, next) => {
        const filename = path.resolve(compiler.outputPath, 'index.html');
        compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) {
                return next(err);
            }
            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        });
    });
} else {
    app.use(express.static(PUBLIC_PATH));
}

//app.use(express.static(PUBLIC_PATH));

app.all('*', function(req, res) {
    res.sendFile(path.resolve(PUBLIC_PATH, 'index.html'));
});

app.listen(PORT, function() {
    console.log('Listening on port ' + PORT + '...');
});
