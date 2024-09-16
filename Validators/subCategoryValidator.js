//importing pkgs
let {check}=require('express-validator');
let middlewareValidator= require('./middlewareValidator');

exports.createValidator=[
    check('name')
    .notEmpty().withMessage('Name is a required field!')
    .isLength({
        min:3
    }).withMessage('Minimun length of name field is 3, Please provide a name with this requiement!')
    .isLength({
        max:32
    }).withMessage("Maximum length of name field is 32, Please provide a name with this requiement!"),
  
    check('category').notEmpty().withMessage('A subCategory must have w parnet (category), please provide one!')
    .isMongoId().withMessage('Invalid ID for the category!'),
    middlewareValidator
    
]
exports.getIDValidator=[
    check('id').isMongoId().withMessage('Invalid ID!'),
    middlewareValidator
]

exports.deleteValidator=[
        check('id').isMongoId().withMessage('Invalid ID!'),
        middlewareValidator]