const fs = require('fs');
const crypto = require('crypto');
const {join} = require('path')

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function encrypt(text, key) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

function decrypt(hash, key) {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'));
    const decrpyted = decipher.update(Buffer.from(hash.content, "hex")) + decipher.final();
    return decrpyted;
};

function encryptFile(path, output = path, key) {
    const content = fs.readFileSync(path);
    fs.writeFileSync(output, JSON.stringify(encrypt(content, key)))
}

function decryptFile(path, output = path, key) {
    const hash = JSON.parse(fs.readFileSync(path));
    fs.writeFileSync(output, decrypt(hash, key))
}

const convert = (from, to, text) => Buffer.from(text, from).toString(to)

function countDirectory(path) {
    let retVal = 0;
    const entries = fs.readdirSync(path);

    entries.forEach(e => {
        if(e != "encryption"){
            if (fs.lstatSync(join(path, e)).isFile()) {
                retVal++;
            } else {
                retVal += countDirectory(join(path, e));
            }
        }
    })
    return retVal;
}

module.exports = {
    randomString,
    decryptFile,
    encryptFile,
    decrypt,
    encrypt,
    convert,
    countDirectory
}