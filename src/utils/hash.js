const bcrypt = require('bcrypt');

function hashValue(plainValue) {
    return bcrypt.hashSync(plainValue, 12);
}

function verifyHash() {}


module.exports = {
    hashValue,
    verifyHash
};