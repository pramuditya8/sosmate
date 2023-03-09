'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User);
      Post.belongsToMany(models.Tag, {
        through: models.PostTag,
      });
    }

    static searchPost(title){
      return Post.findAll({
        include: [sequelize.models.User, sequelize.models.Tag],
        order: [["createdAt", "desc"]],
        where: { 
          title: {[Op.iLike]: `%${title ? title : ""}%`} 
        }
      })
      .then(data => {
        return data
      })
    }


  }
  Post.init({
    title: DataTypes.STRING,
    caption: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};