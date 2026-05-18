//importing pkgs
let express= require('express');
let productController= require('./../Controller/productController');
let productValidator= require('../Validators/productValidator')
let authController= require('./../Controller/authController');
let reviewRoute= require('./../Route/reviewRoute');

let productRouter= express.Router();
productRouter.use('/:productID/reviews',reviewRoute)

productRouter.route('/')
.get(authController.protectRoute,productController.getAllProducts)

.post(authController.protectRoute,
    authController.checkAuthorization('admin'),
    productValidator.createValidator
    ,productValidator.validateCategoryID
    ,productValidator.validateSubategoryID
    ,productValidator.validateBrandID
    ,productController.createNewProduct
    );


productRouter.route('/:id')
.get(authController.protectRoute,
    productValidator.getIDValidator
    ,productController.getProduct
    )
.delete(authController.protectRoute, authController.checkAuthorization('admin'),
    productValidator.deleteValidator,
    productController.deleteProduct
       );

       
module.exports=productRouter;