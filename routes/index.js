const express = require('express')
const Controller = require('../controllers/controller')
const UserController = require('../controllers/UserController')
const router = express.Router()

// router.get("/", Controller.beranda); //Landing Page
function checkLogin(req, res, next){
  // req.session.isLogin = true
  console.log(req.session.isLogin)
  if (req.session.isLogin === true) {
    
    res.redirect("/home")
  }else{
    next();
  }
  
}

router.get("/register", checkLogin, UserController.userRegisterForm)
router.post("/register", checkLogin, UserController.userRegisterPost)

router.get("/login", checkLogin, UserController.userLoginForm)
router.post("/login", checkLogin, UserController.userLoginPost)

router.get("/logout", UserController.getLogout)

router.use(function (req, res, next) {
  // req.session.isLogin = true
  console.log(req.session.isLogin);
  if (!req.session.isLogin) {
    const error = `Please Login First`;
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
});

router.get("/home", Controller.home)

router.get("/upload", Controller.addPostingan);
router.post("/upload", Controller.saveAddPosting);

router.get("/edit/:id", Controller.updatePost);
router.post("/edit/:id", Controller.saveUpdate);


module.exports = router
