
 //importing pkgs
 let express= require('express');
 let { check }= require('express-validator');
 let middlewareValidator= require('./middlewareValidator');
 let productModel= require('./../Model/product');
 let userModel= require('./../Model/user');
 const customError = require('./../Utlis/customError');
 let reviewModel= require('./../Model/review')
 
 
 
 let app= express();
 //using this middle ware to access the request body
  app.use(express.json())
 
 exports.validateProductID=async(request, response, next)=>{
     let foundProduct= await productModel.findById(request.body.product);
     if (!foundProduct)
     {
         let error = new customError('product is NOT FOUND!',404);
        return  next(error)
     }
    
     return next();
 }
 exports.validateUserID=async(request, response, next)=>{
     let foundUser= await userModel.findById(request.body.user);
     if (!foundSubCategory)
     {
         let error = new customError('user is NOT FOUND!',404);
        return next(error);
     }
     return next();
     
 }

 exports.getIDValidator=[
     check('id').isMongoId().withMessage('Invalid ID!'),
     middlewareValidator
     
 ]
 exports.createValidator=[
     check('title').optional()
     .isLength({ min:3}).withMessage('Minimun length of title field is 3, Please provide a title with this requiement!')
     .isLength({ max:32}).withMessage("Maximum length of title field is 32, Please provide a title with this requiement!"),
 
 
     
 
     check('rating').notEmpty().withMessage('rating is a required field!')
     .isFloat({min:1,max:5}).withMessage('Minimun length of rating field is 1 and Maximum length of title field is 5.Please provide a rating with this requiement!'),
    
     
     check('product')
     .notEmpty().withMessage('no product id is provided!')
     .isMongoId().withMessage('product Id is invalid!'),
     
    //  check('user')
    //  .notEmpty()
    //  .isMongoId().withMessage('user Id is invalid!'),
 
     middlewareValidator
     
 ]
 
 exports.deleteValidator=[
     check('id').isMongoId().withMessage('Invalid ID!'),
     middlewareValidator
     
 ]
 exports.patchValidator=[
    
     check('id').isMongoId().withMessage('Invalid ID!'),
    

     middlewareValidator
     
 ]
 exports.reviewUserValidator=async(request, response, next)=>{
    let foundReview=await reviewModel.findById(request.params.id);
    let reviewUserId=foundReview.user._id.toString();//el ktb el review
    let userId=request.foundUser._id.toString();// el behwl y3ml edit the review
    
  if (reviewUserId!==userId)
  {
      let error= new customError('Access denied!',403);
      return next(error)
  }
  next();
 }
 