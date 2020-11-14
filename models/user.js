'use strict';
const {
  Model
} = require('sequelize');

const { hashPassword } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    username: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    role: DataTypes.STRING,
    password: DataTypes.STRING,
    StoreId: DataTypes.INTEGER
  }, {
    hooks:{
      beforeCreate(user){
        if(user.password){
          user.password = hashPassword(user.password)
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};