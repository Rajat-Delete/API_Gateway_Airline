const express =  require('express');
const router= express.Router();
const {UserController} = require('../../controllers');
const {AuthMiddlewares , RoleMiddlewares} = require('../../middlewares');
router.post('/signup' , AuthMiddlewares.validateAuthRequest ,UserController.signUp);
router.post('/signin' , AuthMiddlewares.validateAuthRequest ,UserController.signIn);
router.post('/role',AuthMiddlewares.checkAuth,AuthMiddlewares.isAdmin, UserController.addRoleToUserController);


module.exports = router;