let express= require('express');
let authController= require('./../Controller/authController');
let authValidator= require('../Validators/authValidator');
let productRoute= require('./../Route/productRoute');
let categoryRoute= require('./../Route/categoryRoute');
let subCategoryRoute= require('./../Route/subCategoryRoute');
let brandRoute= require('./../Route/brandRoute');


let authRouter= express.Router();
// authRouter.use ('/protected/products',productRoute);
// authRouter.use('/protected/servics/categories',categoryRoute);
// authRouter.use('/protected/servics/subCategories',subCategoryRoute);
// authRouter.use('/protected/servics/brands',brandRoute);
//authValidator.signup,

authRouter.route('/signup').post(authValidator.signup,authController.singup);
authRouter.route('/login').post(authValidator.login,authController.login);
authRouter.route('/forgetPassword').post(authValidator.forgetPasswordValidator,authController.forgetPassword)
authRouter.route('/resetPassword/:token').patch(authValidator.resetPasswordValidator,authController.resetPassword)



module.exports=authRouter;
