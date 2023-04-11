const User = require('../models/user')
const jsonwebtoken = require('jsonwebtoken')
const JWT_SECRET = "IamAGoodBoy"

const validation = async (req, res, next) => {
    const { authorization } = req.headers
    //authorization === Bearer ewefwegwrherhe
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in" })
    }
    const token = authorization.replace("Bearer ", "")
    const data = jsonwebtoken.verify(token, JWT_SECRET)
    if (!data) {
        return res.status(401).json({ error: "you must be logged in" })
    }

    const { _id } = data
    const userdata = await User.findById(_id)
    req.user = userdata
    next()

}

module.exports = validation;