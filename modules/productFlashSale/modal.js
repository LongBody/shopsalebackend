const mongoose = require('mongoose')
const productSchema = require('./schema')

const MODEL_NAME = 'productFlashSale'
const COLLECTION_NAME = 'productFlashSale'


const modelProduct = mongoose.model(MODEL_NAME, productSchema, COLLECTION_NAME)

module.exports = modelProduct