#!/usr/bin/env node

const { program } = require('commander');
const { existsSync, readdirSync, lstatSync, renameSync } = require('fs');
const { randomString, countDirectory, convert, encryptFile, decryptFile } = require('./lib/util');
const { join } = require('path');
const { encryptDirectory } = require('./lib/encrypt');
const { decryptDirectory } = require('./lib/decrypt');

program
    .command("encrypt <path> [key]")
    .alias("e")
    .description("Encrypts a directory.")
    .action((path, key) => {

        if (key === undefined) {
            key = randomString(32)
            console.log("Your Security Key is: " + key);
            console.log("You need this key to decrypt any data! If you lose this key, you also lose all your data!")
        }
        if (key.length === 32) {
            if (existsSync(path)) {
                console.log("Path to encrypt: " + path);
                process.env.EXEC_PATH = path;

                const directories = readdirSync(process.env.EXEC_PATH);

                let fileCount = countDirectory(process.env.EXEC_PATH);

                console.log("Total files to encrypt: " + fileCount)


                directories.forEach(x => {
                    if (lstatSync(join(process.env.EXEC_PATH, x)).isDirectory()) {
                        encryptDirectory(join(process.env.EXEC_PATH, x))
                        renameSync(join(process.env.EXEC_PATH, x), join(process.env.EXEC_PATH, convert("utf-8", "hex", x)))
                    } else {
                        console.log("encrypting file " + join(process.env.EXEC_PATH, x) + "...");

                        encryptFile(join(process.env.EXEC_PATH, x), join(process.env.EXEC_PATH, x), key)
                        renameSync(join(process.env.EXEC_PATH, x), join(process.env.EXEC_PATH, convert("utf-8", "hex", x)))
                    }
                })

            } else {
                console.log("The path does not exists!")
            }
        } else {
            console.log("The key needs to be exactly 32 characters long!")
        }
    })

program
    .command("decrypt <path> [key]")
    .alias("d")
    .description("Decrypts a directory.")
    .action((path, secKey) => {
        if (existsSync(path)) {

            console.log("Path to decrypt: " + path);
            process.env.EXEC_PATH = path;

            const readline = require('readline');

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })

            let key;

            if (secKey === undefined) {
                getKey();
            } else {
                if (secKey.length === 32) {
                    key = secKey;
                    decrypt();
                } else {
                    console.log("The key needs to be exactly 32 characters long!")
                }
            }

            function getKey() {
                rl.question("What is the Security Key? ", (answer) => {
                    key = answer;
                    decrypt();
                })
            }


            function decrypt() {

                let fileCount = countDirectory(process.env.EXEC_PATH);

                console.log("Total files to decrypt: " + fileCount)

                const directories = readdirSync(process.env.EXEC_PATH);

                directories.forEach(x => {
                    if (lstatSync(join(process.env.EXEC_PATH, x)).isDirectory()) {
                        decryptDirectory(join(process.env.EXEC_PATH, x))
                        renameSync(join(process.env.EXEC_PATH, x), join(process.env.EXEC_PATH, convert("hex", "utf-8", x)))
                    } else {
                        console.log("decrypting file " + join(process.env.EXEC_PATH, x) + "...");

                        decryptFile(join(process.env.EXEC_PATH, x), join(process.env.EXEC_PATH, x), key)
                        renameSync(join(process.env.EXEC_PATH, x), join(process.env.EXEC_PATH, convert("hex", "utf-8", x)))
                    }
                })

                rl.close();
                process.exit(0);
            }
        } else {
            console.log("The path does not exists!")
        }

    })


program.parse(process.argv);


