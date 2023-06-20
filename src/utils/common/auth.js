const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ServerConfig} = require('../../config');

function comparePassword(plainpassword , hashpassword){
    try {
       return bcrypt.compareSync(plainpassword, hashpassword);
    } catch (error) {
        
    }
}

function createJWTToken(input){
    try {
        return jwt.sign(input ,ServerConfig.JWT_SECRET , {expiresIn : ServerConfig.JWT_EXPIRY} );
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function verifyToken(token){
    try {
        return jwt.verify(token ,ServerConfig.JWT_SECRET);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    comparePassword,
    createJWTToken,
    verifyToken
}