const express = require('express')
const Controller = require('../controllers/controller')
const UserController = require('../controllers/UserController')
const router = express.Router()

// router.get("/", Controller.beranda); //Landing Page


router.get("/register", UserController.userRegisterForm)
router.post("/register", UserController.userRegisterPost)

router.get("/login", UserController.userLoginForm)
router.post("/login", UserController.userLoginPost)

router.use(function (req, res, next) {
  console.log(req.session);
  if (req.session.isLogin === true) {
    next();
  } else {
    const error = `Please Login First`;
    res.redirect(`/login?error=${error}`);
  }
});

// router.get("/home", Controller.home)


module.exports = router
