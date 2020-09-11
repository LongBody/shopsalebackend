const userProfileModel = require('./model')
const { signToken, verifyToken, SECRET_STRING } = require('./jwt')
let crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const { Console } = require('console');

const handler = {
    async createUser(req, res, next) {

        let { email, password, firstName, lastName } = req.query

        let passwordHash = hashMd5(password)

        let user = {
            email: email,
            password: passwordHash,
            fullName: lastName + firstName,
            roles: ['user'],
            verify: false
        }


        let checkEmail = await userProfileModel.find({ email: user.email })
        if (checkEmail) {
            res.json({
                message: "Email has been register or maybe not correct"
            })
        } else {

            let userPayload = user
            userPayload.accessToken = signToken(user)

            let item = await userProfileModel.create(user)
            let verifyUrl = "https://shopsale.herokuapp.com/api/sign-in/verifyEmail" + userPayload.accessToken

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'shopsalevn11@gmail.com',
                    pass: 'lasvegasbody30112k'
                }
            });

            jwt.sign(item._id, SECRET_STRING, async(err) => {
                await transporter.sendMail({
                    from: 'shopsalevn11@gmail.com', // sender address
                    to: user.email, // list of receivers
                    subject: "Verify Email ✔ \n", // Subject line
                    html: `
                    <img src ="data:image/png;base64,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" />
                    <a  class="btn btn-success" href="${verifyUrl}"  role="button">Click to verify your email</a>`
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
            res.send("<div><h1>Your email has been verified</h1></div>")

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
            res.send(items[0]._id)

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