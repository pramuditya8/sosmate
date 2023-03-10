const express = require('express')
const Controller = require('../controllers/controller')
const UserController = require('../controllers/UserController')
const router = express.Router()


const multer = require("multer")
const path = require("path")

//////////////////////////////////////
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage: storage})
///////////////////////////////////////

router.get("/", Controller.landingPage); //Landing Page

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
  // req.session.UserId = 6
  // req.session.role = "User"
  // req.session.isLogin = true
  res.locals.UserId = req.session.UserId;
  res.locals.role = req.session.role;
  res.locals.isLogin = req.session.isLogin;

  if (!req.session.isLogin) {
    const error = `Please Login First`;
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
});

router.get("/home", Controller.home)

router.get("/upload", Controller.addPostingan);
router.post("/upload", upload.single("image"), Controller.saveAddPosting);

router.get("/edit/:id", Controller.updatePost);
router.post("/edit/:id", upload.single("image"), Controller.saveUpdate);

router.get("/likes/:id", Controller.totalLikes);

function isAdmin(req, res, next){
  // req.session.isLogin = true
  // req.session.role = "Admin"
  res.locals.UserId = req.session.UserId;
  res.locals.role = req.session.role;
  res.locals.isLogin = req.session.isLogin;
  if (req.session.role === "Admin") {
    
    next();
  }else{
    res.redirect("/home")
  }
  
}

router.get("/admin", isAdmin, Controller.homeAdmin)
router.get("/admin/deleteUser/:id", isAdmin, Controller.deleteUser)





module.exports = router
