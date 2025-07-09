let clevernail = require('clevernails');

exports.process = function (input, output, size) {
    return new Promise((resolve, reject) => {
        return clevernail.process({
            input,
            output,
            size
        }, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};