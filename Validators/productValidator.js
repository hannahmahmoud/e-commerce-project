
 //importing pkgs
let express= require('express');
let { check }= require('express-validator');
let middlewareValidator= require('./middlewareValidator');
let categoryModel= require('./../Model/category');
let subCategoryModel= require('./../Model/subCategory');
let brandModel= require('./../Model/brand');
const customError = require('./../Utlis/customError');


let app= express();
//using this middle ware to access the request body
 app.use(express.json())

exports.validateCategoryID=async(request, response, next)=>{
    let foundCategory= await categoryModel.findById(request.body.category);
    if (!foundCategory)
    {
        let error = new customError('category is NOT FOUND!',404);
        next(error)
    }
    else
    { request.category=foundCategory
    next();
}}
exports.validateSubategoryID=async(request, response, next)=>{
    let foundSubCategory= await subCategoryModel.findById(request.body.subCategory);
    if (!foundSubCategory)
    {
        let error = new customError('subCategory is NOT FOUND!',404);
        next(error)
    }
    else
    { //foundSubCategory.category=JSON.stringify(foundSubCategory.category)
        
        console.log(typeof(foundSubCategory.category));
        console.log(typeof(request.category.id));
      if (foundSubCategory.category==request.category.id)
      
       next();
    else {
        let error = new customError('this subCategory does not belong to this category!',404);
        next(error)
    }
}}
exports.validateBrandID=async(request, response, next)=>{
    let foundCategory= await brandModel.findById(request.body.brand);
    if (!foundCategory)
    {
        let error = new customError('brand is NOT FOUND!',404);
        next(error)
    }
    else
    next();
}
exports.getIDValidator=[
    check('id').isMongoId().withMessage('Invalid ID!'),
    middlewareValidator
    
]
exports.createValidator=[
    check('title')
    .notEmpty().withMessage('title is a required field!')
    .isLength({ min:3}).withMessage('Minimun length of title field is 3, Please provide a title with this requiement!')
    .isLength({ max:32}).withMessage("Maximum length of title field is 32, Please provide a title with this requiement!"),


    check('description')
    .notEmpty().withMessage('title is a required field!')
    .isLength({ min:10}).withMessage('Minimun length of description field is 10, Please provide a description with this requiement!')
    .isLength({ max:1000 }).withMessage("Maximum length of description field is 1000, Please provide a description with this requiement!"),
    
    check('price')
    .notEmpty().withMessage('price is a required field!')
    .isNumeric().withMessage('price must be number!'),

    check('quantity')
    .notEmpty().withMessage('quantity of the product is required field!')
    .isNumeric().withMessage('quantity must be number!'),

    check('coverPhoto')
    .notEmpty().withMessage('Cover Photo of the product is required field!'),

    check('rating').notEmpty().withMessage('rating is a required field!')
    .isLength({ min:1}).withMessage('Minimun length of rating field is 1, Please provide a rating with this requiement!')
    .isLength({ max:5}).withMessage("Maximum length of title field is 5, Please provide a rating with this requiement!")
    .isNumeric().withMessage('rating must be number!'),
    
    check('category')
    .notEmpty()
    .isMongoId().withMessage('category Id is invalid!'),
    
    check('brand')
    .notEmpty()
    .isMongoId().withMessage('category Id is invalid!'),

    check('subCategory')
    .notEmpty()
    .isMongoId().withMessage('category Id is invalid!'),
   
    check('color')
    .notEmpty()
    .withMessage('color of the product is required field!'),
    
    check('ratingAvgerage').notEmpty().withMessage('ratingAvgerage is a required field!')
    .isLength({min:1}).withMessage('Minimun length of rating field is 1, Please provide a ratingAvgerage with this requiement!')
    .isLength({ max:5}).withMessage("Maximum length of title field is 5, Please provide a ratingAvgerage with this requiement!")
    .isNumeric().withMessage('ratingAvgerage must be number!'),

    
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
