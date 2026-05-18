let express= require('express');
let reviewController= require('./../Controller/reviewController');
let reviewValidator= require('../Validators/reviewValidator');
let authController= require('./../Controller/authController');


let reviewRouter= express.Router({mergeParams:true});




reviewRouter.route('/').post
(
    authController.protectRoute,
    reviewController.setRequestBody,
    reviewValidator.createValidator,
    reviewController.createNewReview
    
);
reviewRouter.route('/specfic').get
( 
    authController.protectRoute,
    reviewController.getAllReviewsforSpecficUser

);

reviewRouter.route('/getAllReviews').get
( 
    authController.protectRoute,
    reviewController.getAllReviews

);
reviewRouter.route('/getReview/:id').get
(
    authController.protectRoute,
    reviewValidator.getIDValidator,
    reviewController.getReview

    
);
reviewRouter.route('/deleteRiview/:id').delete
(
    authController.protectRoute,
    authController.checkAuthorization('admin'),
    reviewValidator.validateProductID,
    reviewValidator.deleteValidator,
    reviewController.deleteReview

    

);

reviewRouter.route('/stats/:productID').get
(
    authController.protectRoute,
    authController.checkAuthorization('user'),
    reviewController.aggregation


);
reviewRouter.route('/updateRiview/:id').patch
(
    authController.protectRoute,
    reviewValidator.patchValidator,
    reviewValidator.reviewUserValidator,
    reviewController.updateReview
    
);

module.exports= reviewRouter;