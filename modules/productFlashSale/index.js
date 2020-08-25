const productModel = require('./modal')



const handler = {
    async findMany(req, res, next) {
        try {
            let { pageIndex, pageSize, sortBy, sort, search = '', field = '' } = req.query
            console.log(search)

            pageSize = parseInt(pageSize)
            pageIndex = parseInt(pageIndex)

            let limit = pageSize
            let skip = (pageIndex - 1) * pageSize
            let sortInfo = `${sort == 'desc' ? '-' : ''}${sortBy}`

            // let fieldsArr = field.split(',').map(field => field.trim())

            if (pageIndex && search) {
                let items = await productModel.find({ categories: search }).skip(skip).limit(limit)
                res.json(items)
            } else if (search) {
                let items = await productModel.find({
                    categories: search
                })
                res.json(items)

            } else if (pageIndex) {
                let items = await productModel.find({}).skip(skip).limit(limit).sort(sortInfo)
                res.json(items)
            } else {
                let items = await productModel.find({}).sort(sortInfo)
                res.json(items)
            }

        } catch (error) {
            next(error)
        }

    },


    async findOne(req, res, next) {
        try {
            console.log(req.params)
            let id = req.params.id
            console.log(id)
            let item = await productModel.findById(id)
            console.log(item)
            res.json(item)
        } catch (error) {
            next(error)
        }

    },
    async create(req, res, next) {
        try {
            let data = req.body
            console.log(data)
            let item = await productModel.create(data) // { _id: '', title, description }
            res.json(item)
        } catch (err) {
            next(err)
        }
    },

}

module.exports = handler