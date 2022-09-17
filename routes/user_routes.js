const express = require('express')
const router = express.Router()
const { login_user, register_user } = require('../controllers/user_controller')

router.post('/', register_user)
router.post('/login', login_user)

module.exports = router