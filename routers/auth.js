const express = require('express')
const authModule = require('../modules/auth')
const { validateAccessToken } = require('../modules/auth')


const authRouter = new express.Router()

authRouter.post('/', authModule.createUser)

authRouter.get('/verifyEmail:token', authModule.verifyEmail)
authRouter.put('/', authModule.update)

authRouter.get('/enter-key', authModule.EnterKey)

authRouter.get('/', authModule.logIn)


module.exports = authRouter