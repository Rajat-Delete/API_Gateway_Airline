const express =  require('express');
const router= express.Router();
const {UserController} = require('../../controllers');
const {AuthMiddlewares} = require('../../middlewares');
router.post('/signup' , AuthMiddlewares.validateAuthRequest ,UserController.signUp);
router.post('/signin' , AuthMiddlewares.validateAuthRequest ,UserController.signIn);


module.exports = router;