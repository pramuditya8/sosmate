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

    showStatus() {
      if (this.likes <= 10) return "Beginner";
      if (this.likes > 10) return "Entertaiment";
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Title cannot be Null`,
        },
        notEmpty: {
          msg: `Title cannot be Empty`,
        },
        isMinimalChar(value) {
          if (value.length < 5) {
            throw new Error("Title Minimum 5 huruf/kata");
          }
        },
      },
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Caption cannot be Null`,
        },
        notEmpty: {
          msg: `Caption cannot be Empty`,
        },
        isMinimalChar(value) {
          if (value.length < 5) {
            throw new Error("Caption Minimum 5 huruf/kata");
          }
        },
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Image cannot be Null`,
        },
        notEmpty: {
          msg: `Image cannot be Empty`,
        },
        isMinimalChar(value) {
          if (value.length < 5) {
            throw new Error("Image Url Minimum 5 huruf/kata");
          }
        },
      },
    },
    likes: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  Post.beforeCreate((post, option) => {
    post.likes = 0;
    post.dislikes = 0;
  });
  return Post;
};