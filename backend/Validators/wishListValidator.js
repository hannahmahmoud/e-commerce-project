let {check}= require('express-validator');
let middlewarValidator= require('./middlewareValidator');


exports.addProductValidator=[
    check('productID').notEmpty().withMessage('Please provide a product ID')
    .isMongoId().withMessage('Invalid ID!'),
    middlewarValidator
]
    
    

exports.deleteValidator=[
    check('productID').notEmpty().withMessage('Please provide a product ID')
    .isMongoId().withMessage('Invalid ID!'),
    middlewarValidator
    
]
