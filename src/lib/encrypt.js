
const { readdirSync, lstatSync, renameSync } = require('fs');
const { encryptFile, convert } = require('./util')
const { join } = require('path')

function encryptDirectory(path, key) {
    const files = readdirSync(path);

    files.forEach(f => {

        if (lstatSync(join(path, f)).isFile()) {
            console.log("encrypting file " + join(path, f) + "...");

            encryptFile(join(path, f), join(path, f), key)

            renameSync(join(path, f), join(path, convert("utf-8", "hex", f)))
        } else {
            encryptDirectory(join(path, f));
        }
    })
}

module.exports = { encryptDirectory };