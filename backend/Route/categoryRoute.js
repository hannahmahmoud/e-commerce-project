let express=require('express');
let categoryController= require('./../Controller/categoryController');
let validationController= require('../Validators/categoryValidator');
let subCategoryRoute= require('./subCategoryRoute');
let authController=require('./../Controller/authController')
let imageController= require('./../Controller/imageController');



let categoryRoute= express.Router({mergeParams:true});
//using this middle ware for nested route 
//low galek el resource dah roh leh route dah
categoryRoute.use('/:categoryId/subCategory',subCategoryRoute);



categoryRoute.route('/')
.post(
    authController.protectRoute,
    authController.checkAuthorization('admin'),
    imageController.uploadImage('photo'),
    categoryController.resize,
    validationController.validateRequestBody,
    categoryController.createNewCategory
)
.get(categoryController.getAllCategories);

categoryRoute.route('/:id')
.get(validationController.getIDValidator,
    categoryController.getCategory)
.delete(authController.protectRoute,authController.checkAuthorization('admin'),
validationController.deleteValidator,
    categoryController.deleteCategory);


module.exports=categoryRoute;
