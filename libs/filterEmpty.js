
module.exports = function truncate (body) {
    for(let key in body) {
        if (body[key] === " ") {
            body[key] = "";
        }
        else if (body[key] instanceof Object) {
            truncate(body[key]);
        }
    }
};