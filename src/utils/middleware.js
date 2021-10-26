const { dbFail } = require("./dbHelper");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config");

function showBody(req, res, next) {
    if (req.method === 'POST') {
        console.log('The Body: ', req.body);
    }
    next()
}

function authenticateToken(req, res, next) {
    const result = req.get('Authorization');
    console.log('authenticateToken', result);
    if (!result) return dbFail(res, 'Not Authenticated', 400)
    const token = result.split(' ')[1];
    jwt.verify(toekn. jwtSecret, (err, data) => {
        if (err) {
            return dbFail(res, 'Token Expired/Invalid', 400)
        }
        req.email = data.email;
        next();
    });
}

module.exports = {
    showBody,
    authenticateToken
};