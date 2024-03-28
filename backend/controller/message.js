const { fn, Sequelize, col, Op, DATE } = require('sequelize');
const sequelize = require('../util/database')
const Message = require('../model/message')
const User = require('../model/user');
const Group = require('../model/group');
const Member = require('../model/member');
const S3services = require('../services/s3Services')

exports.addMessage = async (req, res) => {
    try {
        const groupId = req.body.groupId;

        const message = req.body.message;
        const group = await Group.findByPk(groupId)
       
        const user = await group.getUsers({ where: { id: req.user.id } })
        const member = user[0].member
       

        const result = await member.createMessage({ message, groupId })
        return res.json(result)


    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}

exports.getMessages = async (req, res) => {
    try {
        const id = req.params.groupId;
        const messageId = req.query.messageId || 0
        const group = await Group.findByPk(id)
        const member = await req.user.getGroups({ where: { id } })
        if (member.length == 0) {
            return res.status(401).json({ msg: "unauthorized access" })
        }
        // return res.json(member)
        const result = await group.getMessages({
            where: {
                id: {
                    [Op.gt]: messageId
                }
            }
        });

        return res.json({ success: true, messages: result, id: member[0].member.id })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })

    }
}

exports.uploadFile = async (req, res) => {
    try {
        const fileName = new Date() + req.file.originalname
        const mimeType = req.file.mimetype
        const fileData = req.file.buffer
        console.log(fileData, 'fileData>>>>')
        console.log(mimeType, 'mimeType>>>>>')
        console.log('line 61')
        //console.log(S3services.uploadToS3,'uploadToS3>>>>>>')
        const data = await S3services.uploadToS3(fileData, fileName)
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId)
        const user = await group.getUsers({ where: { id: req.user.id } })
        const member = user[0].member

        const message = await member.createMessage({ message: data.Location, type: mimeType, groupId })
        return res.json(message)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })

    }
}
