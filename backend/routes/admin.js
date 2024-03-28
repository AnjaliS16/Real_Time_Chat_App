const express = require('express')

const router = express.Router()
const auth = require('../middleware/auth')
const adminControllers = require('../controller/admin')

router.post('/admin/remove-member/:groupId', auth, adminControllers.removeMember)

router.post('/admin/make-admin/:groupId', auth, adminControllers.makeAdmin)

router.post('/admin/remove-admin/:groupId', auth, adminControllers.removeAdmin)
router.post('/admin/show-users/:groupId', auth, adminControllers.showUser)
router.post('/admin/add-user/:groupId', auth, adminControllers.addUser)

module.exports = router;