const { Post, User } = require("../models") 

class Controller {
  static home(req, res) {
    let { search, error } = req.query;

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
}

module.exports = Controller
