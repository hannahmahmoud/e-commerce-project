// importing pkgs
let express= require('express');
let authController= require('./../Controller/authController');
let userController= require('./../Controller/userController');
let userValidator= require('../Validators/userValidator')

//creating a route
let userRoute= express.Router();

userRoute.route('/getAllUsers')
.get(
    authController.protectRoute,
    authController.checkAuthorization('admin'),
    userController.getallusers
    );

userRoute.route('/updatePassword')
.patch(
    authController.protectRoute,
    userValidator.paswordUpdateValidator,
    userController.updatePassword
    );
    
userRoute.route('/updateUser')
.patch(
    authController.protectRoute,
    userValidator.userUpdateValidator,
    userController.updateUser
    );

userRoute.route('/deleteUser')
    .delete(
        authController.protectRoute,
        userController.deleteUser
        );

module.exports= userRoute;

