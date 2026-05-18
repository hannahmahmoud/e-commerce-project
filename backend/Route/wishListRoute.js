let express= require('express');
let authController= require('./../Controller/authController');
let wishListContoller= require('./../Controller/wishListContoller');
let wishListValidator= require('../Validators/wishListValidator');

let wishListRoute= express.Router();


wishListRoute.route('/addProductToWishList').post(
    authController.protectRoute,
    authController.checkAuthorization('user'),
    wishListValidator.addProductValidator,
    wishListContoller.addProductToWishList

)
wishListRoute.route('/getAllProductsfromWishList').get(
    authController.protectRoute,
    authController.checkAuthorization('user'),
    wishListContoller.getWishListProductsForUser

)
wishListRoute.route('/removeProductfromWishList/:productID').delete(
    authController.protectRoute,
    authController.checkAuthorization('user'),
    wishListValidator.deleteValidator,
    wishListContoller.removeProductToWishList

)





module.exports=wishListRoute;