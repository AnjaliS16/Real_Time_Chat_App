const express = require('express')

const router = express.Router()

const auth = require('../middleware/auth')
const messageControllers = require('../controller/message')
const upload = require('../util/multer')


router.post('/message/add-message', auth, messageControllers.addMessage)
router.get('/message/get-messages/:groupId', auth, messageControllers.getMessages)
router.post('/message/upload-file/:groupId', auth, upload.single('file'), messageControllers.uploadFile)

module.exports = router;