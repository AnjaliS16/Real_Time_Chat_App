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

const socketAuthenticate = async(socket, next) => {
    console.log('demo')
    const token = socket.handshake.auth.token


    console.log(token,'token from soket.io>>>>>>>>>>>>>>>>>>.');
    
    if(token){

 
    const data = jwt.verify(token,  process.env.JWTSECRETKEY)
    const user = await User.findByPk(data.userId)
    socket.user = user
    next()
    }else{
        next(new Error("token not found"))
    }
}

module.exports = authenticate,socketAuthenticate;