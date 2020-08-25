const express = require('express')
const productHandlers = require('../modules/productFlashSale')

const productRouter = new express.Router()

productRouter.get('/', productHandlers.findMany)

productRouter.get('/:id', productHandlers.findOne)

productRouter.post('/', productHandlers.create)

module.exports = productRouter