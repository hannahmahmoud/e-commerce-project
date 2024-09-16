let express= require('express');
let shoppingCartController= require('./../Controller/shoppingCartController');
let authController= require('./../Controller/authController');
let shoppingCartRoute= express.Router();


shoppingCartRoute.route('/addProduct').post(
    authController.protectRoute,
    authController.checkAuthorization('user','admin'),
    shoppingCartController.addProductTocart  
)

shoppingCartRoute.route('/getCart').get(
    authController.protectRoute,
    authController.checkAuthorization('user','admin'),
    shoppingCartController.getCart  
)


shoppingCartRoute.route('/deleteCart').delete(
    authController.protectRoute,
    authController.checkAuthorization('user','admin'),
    shoppingCartController.clearCart  
)
shoppingCartRoute.route('/applyCoupon').patch(
    authController.protectRoute,
    authController.checkAuthorization('user','admin'),
    shoppingCartController.applyCoupon  
)
shoppingCartRoute.route('/updateQuantity/:productID').patch(
    authController.protectRoute,
    authController.checkAuthorization('user','admin'),
    shoppingCartController.updateQuantity  
)

shoppingCartRoute.route('/deleteProduct/:id').delete(
    authController.protectRoute,
    authController.checkAuthorization('user','admin'),
    shoppingCartController.removeSpecficProduct  
)
module.exports=shoppingCartRoute;