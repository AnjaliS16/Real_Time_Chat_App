const express = require('express')

const router = express.Router()

const auth = require('../middleware/auth')
const groupController = require('../controller/group')

router.post('/group/create', auth, groupController.createNewGroup)
router.get('/group/get-groups', auth, groupController.getGroups)
router.get('/group/join-group/:groupId', auth, groupController.joinGroup)
router.get('/group/all-users/:groupId', auth, groupController.getUsers)
router.get('/group/other-users', auth, groupController.getOtherUsers)



module.exports = router;