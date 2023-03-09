const { where } = require("sequelize");
const { Post, User } = require("../models") 

class Controller {
  static home(req, res) {

    Post.findAll({
      include: User,
      order: [["createdAt", "desc"]],
    })
      .then(data => {
        // console.log(data)
        // res.send(data)
        res.render("home/home", { data });
      })
      .catch(err => {
        // console.log(err)
        res.send(err);
      });
  }

  static profile(req, res) {
    res.render("profile");
  }

  static addPostingan(req, res) {
    const id = req.session.UserId
    const { errors } = req.query;
    // console.log(req.session, ">>>>>>>");

    User.findByPk(id)
      .then((users) => {
        res.render("home/addPostingan", { users, errors });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static saveAddPosting(req, res) {
    const { title, caption, imageUrl } = req.body;
    const id = req.session.UserId;

    Post.create({ title, caption, imageUrl, UserId: id })
      .then(() => {
        res.redirect("/home");
      })
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          const message = err.errors.map(el => el.message);
          res.redirect(`upload?errors=${message}`)
        } else {
          res.send(err)
        }
      });
  }

  static updatePost(req, res) {
    const { errors } = req.query;
    const id = req.params.id;
    Post.findByPk(id)
      .then((post) => {
        res.render("home/editPostingan", { post, errors });
      })
      .catch((err) => {
        res.send(err);
      })
  }

  static saveUpdate(req, res) {
    const { title, caption, imageUrl } = req.body;
    const id = req.params.id
    Post.update({ title, caption, imageUrl, UserId: id }, {
      where: {
        id
      }
    })
      .then(() => {
        res.redirect("/home");
      })
      .catch(err => {
        if (err.name === "SequelizeValidationError") {
          const message = err.errors.map(el => el.message);
          res.send(message)
        } else {
          res.send(err)
        }
      })
  }
}

module.exports = Controller
