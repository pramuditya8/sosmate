'use strict';

const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile);
      User.hasMany(models.Post);
    }

    get formatDateCreated(){
      return this.createdAt?.toISOString().split('T')[0]
    }

    static userStatistic(){
      return User.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('role')), "countUser"],
        ],
        where: {role: "User"}
      })
      .then(data => {
        return data
      })
    }

    

  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Username cannot be Null`,
        },
        notEmpty: {
          msg: `Username cannot be Empty`,
        },
        notSpace(value) {
          if (value.includes(" ")) {
            throw new Error("Username tidak boleh menggunakan spasi");
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: `Email cannot be Null`,
        },
        notEmpty: {
          msg: `Email cannot be Empty`,
        },
        isEmail: {
          args:false,
          msg: "Email format is not Valid"
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Password cannot be Null`,
        },
        notEmpty: {
          msg: `Password cannot be Empty`,
        },
        isPasswordError() {
          if (this.password.length < 8) {
            throw new Error("Password Minimum 8 huruf/kata");
          }
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Role cannot be Null`,
        },
        notEmpty: {
          msg: `Role cannot be Empty`,
        },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, options) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash
  });

  return User;
};