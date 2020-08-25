const express = require('express')
const productsRouter = require('./product')
const productFlashSaleRouter = require('./productFlashSale')
const categoryRouter = require('./categories')
const authRouter = require('./auth')

const router = new express.Router()

router.use('/api/sign-in', authRouter)
router.use('/api/product', productsRouter)
router.use('/api/categories', categoryRouter)
router.use('/api/productFlashSale', productFlashSaleRouter)



module.exports = router