const { User } = require("../models")
const bcrypt = require("bcryptjs")

class UserController {

  static userLoginForm(req, res) {
    const { error } = req.query
    res.render("auth/login", { error })
  }

  static userLoginPost(req, res) {
    const { email, password } = req.body
    User.findOne({ where: { email } })
      .then(user => {
        const error = "Email or Password Invalid"

        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password); // true or false

          if (isValidPassword) {
            req.session.UserId = user.id;
            req.session.username = user.username;
            req.session.role = user.role; // set session di controller
            req.session.isLogin = true

            if (user.role == "Admin") {
              res.redirect('/admin')
            } else {
              return res.redirect(`/home`)
            }

          } else {
            return res.redirect(`/login?error=${error}`)
          }


        } else {

          return res.redirect(`/login?error=${error}`)
        }
      })
      .catch(err => {
        if (err.name == "SequelizeValidationError") {
          const message = err.errors.map(el => {
            return el.message
          })
          res.send(message)
        }
      })
  }

  static userRegisterForm(req, res) {
    const { errors } = req.query
    res.render("auth/register", { errors })
  }

  static userRegisterPost(req, res) {
    console.log(req.body)
    const { username, email, password, role } = req.body

    User.create({ username, email, password, role })
      .then(data => {
        res.redirect("/login")
      })
      .catch(err => {
        if (err.name == "SequelizeValidationError") {
          const message = err.errors.map(el => el.message)
          res.redirect(`/register?errors=${message}`)
        } else {
          res.send(err)
        }
      })
  }

  static getLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/login");
      }
    });
  }
}

module.exports = UserController