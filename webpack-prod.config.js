const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const FRONTEND_ROOT = path.resolve(__dirname);
console.log("FRONTEND_ROOT = ", FRONTEND_ROOT);


const ENTRIES_FOLDER_PATH = "./scripts-src/modules";
const ENTRIES = fs.readdirSync(ENTRIES_FOLDER_PATH);

const ENTRY = {};
for (const filename of ENTRIES) {
    const path = `${ENTRIES_FOLDER_PATH}/${filename}`;
    ENTRY[path.substring(0, path.lastIndexOf('.'))] = path;
}



console.log("Building frontend...\n");

console.log("Modules:");
for (const [name, built] of Object.entries(ENTRY)) {
    const localName = name.startsWith(FRONTEND_ROOT) ? name.substring(FRONTEND_ROOT.length + 1) : name;
    const localBuilt = built.startsWith(FRONTEND_ROOT) ? built.substring(FRONTEND_ROOT.length + 1) : built;

    console.log(`   - ${localName} -> ${localBuilt}`);
}

module.exports = {
    entry: ENTRY,
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader', include: [path.resolve(__dirname, 'scripts-src')] },
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
    mode: "production"
}