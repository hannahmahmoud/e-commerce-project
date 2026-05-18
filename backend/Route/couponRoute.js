let express= require('express');
let couponController= require('./../Controller/couponController');
let couponValidator= require('../Validators/couponValidators');
let authController= require('./../Controller/authController');




let couponRoute= express.Router();


couponRoute.route('/createCoupon')
.post( 
    authController.protectRoute,
    authController.checkAuthorization('admin')
    ,couponValidator.createValidator
    ,couponController.createNewCoupon
);

couponRoute.route('/')
.get( 
    authController.protectRoute,
    authController.checkAuthorization('admin'),
    couponController.getAllCoupons
);


couponRoute.route('/deleteCoupon/:id')
.delete( 
    authController.protectRoute,
    authController.checkAuthorization('admin'),
    couponValidator.deleteValidator,
    couponController.deleteCoupon
);


couponRoute.route('/getCoupon/:id')
.get( 
        authController.protectRoute,
        authController.checkAuthorization('admin','user'),
        couponController.getCoupon
   );
 
couponRoute.route('/updateCoupon/:id')
.patch( 
        authController.protectRoute,
        authController.checkAuthorization('admin'),
        couponValidator.patchValidator,
        couponController.updateCoupon
   );


module.exports=couponRoute;
