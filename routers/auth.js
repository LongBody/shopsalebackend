const express = require('express')
const authModule = require('../modules/auth')
const { validateAccessToken } = require('../modules/auth')


const authRouter = new express.Router()

authRouter.post('/', authModule.createUser)

authRouter.get('/verifyEmail:token', authModule.verifyEmail)

authRouter.get('/update-location', authModule.updateLocationAndPhone)

authRouter.put('/', authModule.update)

authRouter.get('/enter-key', authModule.EnterKey)

authRouter.get('/', authModule.logIn)

authRouter.get('/get-cart', authModule.getCartUser)

authRouter.get('/google', authModule.signWithGG)

authRouter.post('/google-create-user', authModule.createUserGG)






module.exports = authRouter