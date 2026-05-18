let express= require('express');
let brandController= require('./../Controller/brandController');
let brandValidator= require('../Validators/brandValidator');
let authController= require('./../Controller/authController');
let imageController= require('./../Controller/imageController');



let brandRouter= express.Router();


brandRouter.route('/')
.get(authController.protectRoute,
    brandController.getAllBrand)
.post(
    authController.protectRoute,
    authController.checkAuthorization('admin'),
    imageController.uploadImage('photo'),
    brandController.resize,
    brandValidator.createValidator
    ,brandController.createNewBrand);


brandRouter.route('/:id').get(
    brandValidator.getValidator,
    brandController.getBrand)
.delete(
    authController.protectRoute,
    authController.checkAuthorization('admin'),
    brandValidator.deleteValidator,
    brandController.deleteBrand);

module.exports=brandRouter;
