const express = require('express');

const resetpasswordController = require('../controller/forgotpassword');


const router = express.Router();



router.post('/password/forgotpassword', resetpasswordController.forgotpassword)

router.post('/resetpassword/:resetId', resetpasswordController.resetpassword)

router.get('/check-password-link/:resetId', resetpasswordController.updatepassword)

module.exports = router;