let express= require('express');
let authController= require('./../Controller/authController');
let addressController= require('./../Controller/addressController');
let addressValidator= require('../Validators/addressValidator');

let adressRoute= express.Router();


adressRoute.route('/addUserAddress').post(
    authController.protectRoute,
    authController.checkAuthorization('user'),
    addressValidator.addAddressValidator,
    addressController.addAddressDetails

)
adressRoute.route('/getAllAddressOfUser').get(
    authController.protectRoute,
    authController.checkAuthorization('user'),
    addressController.getAddressForUser

)
adressRoute.route('/removeAddress/:addressID').delete(
    authController.protectRoute,
    authController.checkAuthorization('user'),
    addressValidator.deleteValidator,
    addressController.removeAddress

)





module.exports=adressRoute;