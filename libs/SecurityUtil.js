const crypto = require('crypto');

exports.rsaPublicEncrypt = (pubKey, message) => {
    const encrypted = crypto.publicEncrypt(pubKey, Buffer.from(message, "utf8"));
    return encrypted.toString("hex");
}

exports.rsaPrivateDecrypt = (priKet, encrypted) => {
    const decrypted = crypto.privateDecrypt(priKet, Buffer.from(encrypted, "hex"));
    return decrypted.toString("utf8");
}

exports.generateKeyPair = async (modulusLength) => {
    const {publicKey, privateKey} = await crypto.generateKeyPairSync('rsa', {
        modulusLength: modulusLength, // 模数长度，一般选择 2048 或以上
        publicKeyEncoding: {
            type: 'spki', // 公钥编码格式
            format: 'pem' // 公钥输出格式
        },
        privateKeyEncoding: {
            type: 'pkcs8', // 私钥编码格式
            format: 'pem', // 私钥输出格式
            // cipher: 'aes-256-cbc', // 加密算法，可选
            // passphrase: 'vgis' // 加密密码，可选
        }
    });

    return {publicKey, privateKey}
}

