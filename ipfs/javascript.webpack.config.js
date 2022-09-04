const path = require( "path" );

module.exports = {
    entry: "./src/javascript/scripts.js",
    target: "web",
    output: {
        path: path.resolve( path.join( __dirname, "build", "js" ) ),
        filename: "scripts.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ "@babel/preset-env" ]
                    }
                }
            }
        ]
    }
}