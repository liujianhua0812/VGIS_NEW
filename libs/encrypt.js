let crypto = require('crypto');

function generateNoncestr (len) {
    function rand_int(min, max) {
        return Math.floor(parseFloat(min) + Math.random() * parseFloat(max - min));
    }
    let alphabet = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let result = [];
    for(let i = 0; i < len; i++) {
        result.push(alphabet.charAt(rand_int(0, alphabet.length - 1)));
    }
    return result.join('');
}

exports.generateMD5 = function (obj) {
    let hash = crypto.createHash('md5');
    let nonce_str = generateNoncestr(6);
    hash.update(JSON.stringify(obj));
    return hash.digest("hex");
}

exports.generateNoncestr = generateNoncestr;

exports.encryptPassword = function (plain) {
    let hash = crypto.createHash('md5');
    let nonce_str = generateNoncestr(6);
    hash.update(nonce_str + plain);
    return `md5$${nonce_str}$${hash.digest("hex")}`;
};

exports.validateConfirmPassword = function (new_password, confirm_password) {
    return new_password === confirm_password;
};

exports.validatePassword = (encrypted_password, input) => {
    let datas = encrypted_password.split('$');
    let hash = crypto.createHash('md5');
    hash.update(datas[1] + input);
    let encrypted = hash.digest('hex')
    return encrypted === datas[2];
};

exports.generateSignature = (data, appkey, client_secret) => {
    let _data = Object.entries(data)
    _data.sort((e1, e2) => {
        return e1[0].localeCompare(e2[0])
    })

    let plain = `${_data.map(item => `${item[0]}${item[1]}`).join("")}appkey${appkey}${client_secret}`.toString()

    let md5 = crypto.createHash("md5")
    md5.update(plain)
    return md5.digest("hex").toUpperCase()
}