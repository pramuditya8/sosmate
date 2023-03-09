const { User } = require("../models")
const bcrypt = require("bcryptjs")

class UserController {

  static userLoginForm(req, res){
    res.render("auth/login")
  }

  static userLoginPost(req, res){
    const {email, password} = req.body
    User.findOne({where: {email}})
    .then(user => {
      if(user){
        const isValidPassword = bcrypt.compareSync(password, user.password)

        const error = "Email or Password Invalid"
        return isValidPassword ? res.redirect("/") : res.redirect(`/login?error=${error}`)
      }
    })
  }

  static userRegisterForm(req, res){
    res.render("auth/register")
  }

  static userRegisterPost(req, res){
    const { username, email, password } = req.body

    User.create({username, email, password, role: "user"})
    .then(data => {
      res.redirect("/login")
    })
  }

  
}

module.exports = UserController