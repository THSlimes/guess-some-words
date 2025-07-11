const path = require('path');
const fs = require('fs');
const childProcess = require("node:child_process");
const webpack = require('webpack');

const FRONTEND_ROOT = path.resolve(__dirname);

const ENTRIES_FOLDER_PATH = "./scripts-src/modules";

const ENTRIES = fs.readdirSync(ENTRIES_FOLDER_PATH);

const ENTRY = {};
for (const filename of ENTRIES) {
    const fullPath = `${ENTRIES_FOLDER_PATH}/${filename}`;
    ENTRY[fullPath.substring(0, fullPath.lastIndexOf('.'))] = fullPath;
}

console.log(ENTRY);




console.log("Starting frontend webserver...");

console.log("Modules:");
for (const [name, built] of Object.entries(ENTRY)) {
    const localName = name.startsWith(FRONTEND_ROOT) ? name.substring(FRONTEND_ROOT.length + 1) : name;
    const localBuilt = built.startsWith(FRONTEND_ROOT) ? built.substring(FRONTEND_ROOT.length + 1) : built;

    console.log(`   - ${localName} -> ${localBuilt}`);
}

const out = {
    entry: ENTRY,
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader', include: [path.join(FRONTEND_ROOT, 'scripts-src')] },
        ]
    },
    cache: {
        type: 'filesystem'
    },
    output: {
        filename: (pathData, assetInfo) => {
            const fullPath = pathData.chunk.name;

            return `${fullPath.substring(fullPath.lastIndexOf('/') + 1)}.js`;
        },
        path: path.join(FRONTEND_ROOT, "scripts"),
        publicPath: "/scripts/"
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    mode: "development",
    devServer: {
        liveReload: true,
        port: 8080,
        devMiddleware: {
            writeToDisk: true
        },
        static: {
            directory: FRONTEND_ROOT
        }
    }
}
module.exports = out;


// setting up live sass compiler
const STYLES_SRC_PATH = path.join(FRONTEND_ROOT, "styles-src");
const STYLES_OUT_PATH = path.join(FRONTEND_ROOT, "styles");

const sassProcess = childProcess.exec(`sass "${STYLES_SRC_PATH}":"${STYLES_OUT_PATH}" --style compressed --watch`);
sassProcess.on("message", (code, signal) => {
    console.log(code);
});