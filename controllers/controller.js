const { Post, User, Profile, Tag } = require("../models") 
const { getTimeSince } = require("../helpers/helper")
const fs = require("fs")

class Controller {
  static landingPage(req, res) {
    res.render('home/landingPage')
  }

  static home(req, res) {
    let { title, error } = req.query;
    Post.searchPost(title)
      .then(data => {
        // res.send(data)
        res.render("home/home", { data, getTimeSince });
      })
      .catch(err => {
        res.send(err)
      })
  }

  static homeAdmin(req, res){
    const {id} = req.params
    let result = {}

    User.findAll({
      order: [["createdAt", "desc"]],
      where: {role: "User"}
    })
      .then(data => {
        // console.log(data)
        // res.send(data)
        result.data = data
        return User.userStatistic()
      })
      .then(data => {
        const activeUser = data[0].dataValues.countUser
        // res.send(result.data)
        res.render("home/homeAdmin", { data:result.data, activeUser });
      })
      .catch(err => {
        // console.log(err)
        res.send(err);
      });

  }

  static deleteUser(req, res){
    const { id } = req.params

    User.destroy({
      where:{id}
    })
    .then(data => {
      User.destroy
      res.redirect("/admin")
    })
    .catch(err => {
      res.send(err)
    })
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
    let image = ""
    if (req.file) {
      image = req.file.filename
    }
    const { title, caption, imageUrl } = req.body;
    const id = req.session.UserId;

    Post.create({ title, caption, imageUrl:image, UserId: id, likes: 0 })
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
    console.log(req.body)
    const { title, caption, imageUrl } = req.body;
    const id = req.params.id

    let image = ""
    if (req.file) {
      image = req.file.filename
    }else{
      image = imageUrl
    }


    Post.update({ title, caption, imageUrl:image, UserId: req.session.UserId }, {
      where: {
        id
      }
    })
      .then((data) => {
        if (req.file) {
          fs.unlinkSync("./images/"+imageUrl);
        }

        res.redirect("/home");
      })
      .catch(err => {
        if (err.name === "SequelizeValidationError") {
          const message = err.errors.map(el => el.message);
          res.redirect(`/edit/${id}?errors=${message}`)
        } else {
          res.send(err)
        }
      })
  }

  static totalLikes(req, res) {
    const id = req.params.id
    Post.increment("likes", {
      where: { id },
    })
      .then(() => {
        res.redirect("/home");
      })
      .catch((err) => {
        res.send(err);
      });
  }
}



module.exports = Controller
