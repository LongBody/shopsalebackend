const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productFlashSaleSchema = new Schema({
    bio: String,
    price: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    brand: String,
    star: Number,
    sale: Number

})

module.exports = productFlashSaleSchema