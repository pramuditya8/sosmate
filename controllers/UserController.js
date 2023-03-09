const { User } = require("../models")
const bcrypt = require("bcryptjs")

class UserController {

  static userLoginForm(req, res){
    res.render("auth/login")
  }

  static userLoginPost(req, res){
    const {email, password} = req.body
    User.findOne({where: {email:email}})
    .then(user => {
      const error = "Email or Password Invalid"

      if(user){
        const isValidPassword = bcrypt.compareSync(password, user.password); // true or false

        if(isValidPassword){
          req.session.UserId = user.id;
          req.session.username = user.username;
          req.session.role = user.role; // set session di controller
          req.session.isLogin = true

          return res.redirect(`/home`)
        }else{
          return res.redirect(`/login?error=${error}`)
        }


      }else{
        return res.redirect(`/login?error=${error}`)
      }
    })
    .catch(err =>{
      console.log("test")
      res.send(err)
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