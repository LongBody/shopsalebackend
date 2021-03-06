const userProfileModel = require('./model')
const { signToken, verifyToken, SECRET_STRING } = require('./jwt')
let crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const { Console } = require('console');
require('dotenv').config()
const passwordDOTENV = process.env.PASSWORD_EMAIL

const handler = {
    async createUser(req, res, next) {

        let { email, password, firstName, lastName } = req.query

        let passwordHash = hashMd5(password)


        let checkEmail = await userProfileModel.find({ email: email })
        console.log(checkEmail)
        if (checkEmail.length !== 0) {
            res.json({
                message: "Email has been register or maybe not correct"
            })
        } else {

            let user = {
                email: email,
                password: passwordHash,
                fullName: firstName + " " + lastName,
                roles: ['user'],
                verify: false
            }


            let userPayload = user
            userPayload.accessToken = signToken(user)

            let item = await userProfileModel.create(user)
            let verifyUrl = "https://shopsale.herokuapp.com/api/sign-in/verifyEmail" + userPayload.accessToken



            console.log(password)
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'shopsalevn11@gmail.com',
                    pass: passwordDOTENV
                }
            });

            jwt.sign(item._id, SECRET_STRING, async(err) => {
                await transporter.sendMail({
                    from: 'shopsalevn11@gmail.com', // sender address
                    to: user.email, // list of receivers
                    subject: "Verify Email ✔ \n", // Subject line
                    html: `<a  class="btn btn-success" href="${verifyUrl}"  role="button">Click to verify your email</a>`
                });
            })



            res.json({
                item,
                message: "You have register Successfully (Check Your Email)"
            })
        }


    },
    async logIn(req, res, next) {
        try {
            let { email, password } = req.query

            let hashPassword = hashMd5(password)
            if (!email) {
                throw new Error("Missing email")
            }
            if (!password) {
                throw new Error("Missing password")
            }

            let user = await userProfileModel.findOne({
                email: String(email).toLowerCase().trim()
            })


            if (user.verify === false) {
                res.json({ message: "You need verify your email" })
                throw new Error("You need verify your email")
            }

            if (hashPassword != user.password) {
                res.json({ message: "Your email or password is incorrect" })
                throw new Error("Wrong email or password")
            }
            if (!user) {
                res.json({ message: "Your email or password is incorrect" })
                throw new Error("Wrong email or password")
            }

            user.password = ""

            res.json(user)


        } catch (error) {
            next(error)
        }

    },

    async verifyEmail(req, res, next) {
        console.log("verify")

        try {
            console.log(req.params.token)
            let userVerify = verifyToken(req.params.token)

            let user = await userProfileModel.findOne({
                email: String(userVerify.email).toLowerCase().trim()
            })

            let id = user._id

            if (!id) {
                throw new Error(`Require 'id' to update!`)
            }

            let item = await userProfileModel.findByIdAndUpdate(id, { verify: true, }, )

            console.log(item)
            res.send("<div><h3>Your email has been verified</h3></div>")

        } catch (err) {
            next(err)
        }
    },


    async updateLocationAndPhone(req, res, next) {

        try {

            let { id, location, phone } = req.query
            if (!id) {
                throw new Error(`Require 'id' to update!`)
            }

            let item = await userProfileModel.findByIdAndUpdate(id, { location: location, phone: phone }, { new: true })

            item.password = ""

            res.send(item)

        } catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            let data = req.body
            let id = req.query.id

            if (!id) {
                throw new Error(`Require 'id' to update!`)
            }

            let item = await userProfileModel.findByIdAndUpdate(
                id, { productCart: data }, { new: true }
            )



            res.json(item)


        } catch (err) {
            next(err)
        }
    },

    async EnterKey(req, res, next) {
        try {
            let key = req.query.keyAdmin

            console.log(key)

            let items = await userProfileModel.find({ keyAdmin: key })

            // if (items.length === 0) {
            //     res.json({ message: "You enter incorrect key of account Admin" })
            //     throw new Error("You enter incorrect key of account Admin")
            // }

            res.json(items)

        } catch (err) {
            next(err)
        }
    },

    async getCartUser(req, res, next) {
        try {
            let id = req.query.id

            let user = []

            console.log(typeof user)


            let items = await userProfileModel.find({ _id: id })

            console.log(typeof items[0].productCart)
            console.log(items)

            // if (items.length === 0) {
            //     res.json({ message: "You enter incorrect key of account Admin" })
            //     throw new Error("You enter incorrect key of account Admin")
            // }
            res.send(items[0])

        } catch (err) {
            next(err)
        }
    },

    async signWithGG(req, res, next) {
        try {
            let email = req.query.email

            let items = await userProfileModel.find({ email: email })

            // if (items.length === 0) {
            //     res.json({ message: "You enter incorrect key of account Admin" })
            //     throw new Error("You enter incorrect key of account Admin")
            // }

            let data = {
                id: items[0]._id,
                location: items[0].location,
                phone: items[0].phone
            }
            res.send(data)

        } catch (err) {
            next(err)
        }
    },


    async createUserGG(req, res, next) {

        let { email, name } = req.query

        let user = {
            email: email,
            fullName: name,
            password: "none",
            roles: ['user'],
            verify: true,
        }

        let item = await userProfileModel.create(user)

        res.json(item)
    },

    validateAccessToken(req, res, next) {
        try {
            let token = req.headers.authorization
            console.log(token)
            if (!token) {
                throw new Error('Missing token!')
            }
            let payload = verifyToken(token)
            req.user = payload
            next()
        } catch (err) {
            next(err)
        }
    }

}





function hashMd5(string) {
    return crypto.createHash('md5').update(string).digest("hex")
}

module.exports = handler