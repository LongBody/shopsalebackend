const mongoose = require('mongoose')
const Schema = mongoose.Schema


// String, Number, Boolean, Date, Object, Array , ObjectId



const productSchema = new Schema({
    bio: String,
    price: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    categories: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true
    },
    quantity: Number,
    brand: String,
    star: Number

})



// productSchema.index({ title: 'text', categories: 'text', bio: "text" }, function(err, data) {
//     console.log(err);
//     console.log(data);
// })

module.exports = productSchema