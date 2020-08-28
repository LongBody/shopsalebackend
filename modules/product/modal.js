const mongoose = require('mongoose')
const productSchema = require('./schema')

const MODEL_NAME = 'products'
const COLLECTION_NAME = 'products'


const modelProducts = mongoose.model(MODEL_NAME, productSchema, COLLECTION_NAME)

console.log(modelProducts)

// modelProduct.countDocuments()
// modelProduct.find()
// modelProduct.findOne()
// modelProduct.create()
// modelProduct.findByIdAndUpdate()
// modelProduct.findByIdAndRemove()


// modelProduct.collection.dropIndex("categories_text", function(err, data) {
//     console.log(err);
//     console.log(data)
// })

// modelProduct.ensureIndexes(function(err) {
//     if (err)
//         console.log(err);
//     else
//         console.log('create profile index successfully');
// });



// modelProduct.collection.createIndex({ title: 'text', categories: 'text' }, function(err, data) {
//     console.log(err);
//     console.log(data);
// })

module.exports = modelProducts