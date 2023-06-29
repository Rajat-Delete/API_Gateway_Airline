'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
const {ServerConfig} = require('../config');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
            this.belongsToMany(models.Role ,{through: 'User_Roles', as : 'role'});
    }
  }
  user.init({
    email: {
     type: DataTypes.STRING,
     allowNull : false,
     unique : true,
        validate : {
          isEmail : true
        }
    },
    password: {
     type: DataTypes.STRING,
     allowNull : false,
     validate : {
        len : [3,50]
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.beforeCreate(function encrypt(user){
    console.log('user object before encryption',user);
    //We have to pass password and the Salt for unique encrytpion hash
    const encryptedPassword = bcrypt.hashSync(user.password , +ServerConfig.SALT_ROUNDS);//ServerConfig.SALT_ROUNDS was a string so we have converted it into number by +
    user.password = encryptedPassword;
    console.log('user object after encryption',user);
  })

  return user;
};