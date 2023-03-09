const { Post, User, Profile } = require("../models") 
const { formatTags } = require("../helpers/helper")

class Controller {
  static home(req, res) {
    let { title, error } = req.query;

    // Post.findAll({
    //   include: User,
    //   order: [["createdAt", "desc"]],
    // })
    //   .then(data => {
    //     // console.log(data)
    //     // res.send(data)
    //     res.render("home/home", { data });
    //   })
    //   .catch(err => {
    //     // console.log(err)
    //     res.send(err);
    //   });

    Post.searchPost(title)
      .then(data => {
        // res.send(data)
        res.render("home/home", { data, formatTags });
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


}



module.exports = Controller
