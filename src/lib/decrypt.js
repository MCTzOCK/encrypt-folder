const { lstatSync, readdirSync, renameSync } = require('fs');
const { join } = require('path');
const { decryptFile, convert } = require('./util')

function decryptDirectory(path, key) {
    const files = readdirSync(path);

    files.forEach(f => {

        if (lstatSync(join(path, f)).isFile()) {
            console.log("decrypting file " + join(path, f) + "...");
            
            decryptFile(join(path, f), join(path, f), key)

            renameSync(join(path, f), join(path, convert("hex", "utf-8", f)))
        } else {
            decryptDirectory(join(path, f));
        }
    })
}

module.exports = { decryptDirectory }