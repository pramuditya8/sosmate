const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()

router.get("/register", UserController.userRegisterForm)
router.post("/register", UserController.userRegisterPost)

router.get("/login", UserController.userLoginForm)
router.post("/login", UserController.userLoginPost)

module.exports = router
