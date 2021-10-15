
# encrypt-folder

This project can encrypt whole directories using AES 256 (aes-256-ctr)

## Disclaimer
The developers of encrypt-folder assume no liability for data loss or any form of damage. Each user is responsible for proper use. It is not possible to decrypt encrypted files without the security key. 
**Attention:** You cannot encrypt any binary files like images, executables or disk images. If you encrypt binary files they will break.

## Installation

Install encrypt-folder with npm

```bash
  npm install -g encrypt-folder
```
    
## Usage/Examples

### CLI Usage

`encrypt-folder --help` Displays all options

`encrypt-folder encrypt <path> [key]` Encrypts a directory

`encrypt-folder decrypt <path> [key]` Decrypts a direcotry


### Use in your own project

```javascript
const {util, encrypt, decrypt} = require('encrypt-folder');

// generate a key
const key = util.randomString(32)

// encrypt a string
const encrypted = util.encrypt(text, key)

// decrypt a string
const decrypted = util.decrypt(encrypted, key)

// encrypt a file
util.encryptFile("path/to/file", "path/to/output", key)

// decrypt a file
util.decryptFile("path/to/encrypted/file", "path/to/decrypted/output", key)

// encrypt a directory
encrypt.encryptDirectory("path/to/directory", key)

// decrypt a directory
decrypt.decryptDirectory("path/to/encrypted/directory", key)

```
## Authors

- [@mctzock](https://www.github.com/mctzock)

  
## Support

For support, join my discord @ https://discord.gg/YEHzrWVTp6

  