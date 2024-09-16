let express= require('express');
let authController= require('./../Controller/authController');
let orderController= require('./../Controller/orderController');

let orderRoute= express.Router();


orderRoute.route('/createOrder/:cartID').
post(
    authController.protectRoute,
    authController.checkAuthorization('user', 'admin'),
    orderController.createCashOrder
)

orderRoute.route('/getAllorders').
get(
    authController.protectRoute,
    authController.checkAuthorization( 'admin'),
    orderController.getAllorders
)
orderRoute.route('/getorders').
get(
    authController.protectRoute,
    authController.checkAuthorization( 'user','admin'),
    orderController.getOrder
)

orderRoute.route('/isPaid/:orderId').
patch(
    authController.protectRoute,
    authController.checkAuthorization( 'admin'),
    orderController.updateOrderIsPaid
);

orderRoute.route('/isDelivered/:orderId').
patch(
    authController.protectRoute,
    authController.checkAuthorization( 'admin'),
    orderController.updateOrderIsDelivered
);



orderRoute.route('/checkout-session/:cartID').
post(
    authController.protectRoute,
    authController.checkAuthorization( 'user'),
    orderController.checkoutSession
);


module.exports=orderRoute;