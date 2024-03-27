const jwt = require('jsonwebtoken')
require('dotenv').config();
const User = require('../model/user')


const authenticate = async (req, res, next) => {
    try {
        const token = req.headers['auth-token']
        const data = jwt.verify(token, process.env.JWTSECRETKEY)
        console.log(process.env.JWTSECRETKEY, '>>>>>>>>>>>>>>>>>jsontoken')
        const user = await User.findByPk(data.userId)
        console.log(user, '<<id from auth.js')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}

module.exports = authenticate;