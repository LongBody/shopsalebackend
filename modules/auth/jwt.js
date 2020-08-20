const jwt = require('jsonwebtoken')

require('dotenv').config()
const SECRET_STRING = process.env.SECRET_STRING

function signToken(payload) {
    let token = jwt.sign(payload, SECRET_STRING)
    return token
}

function verifyToken(token) {
    let payload = jwt.verify(token, SECRET_STRING)
    return payload
}

module.exports = {
    signToken,
    verifyToken
}