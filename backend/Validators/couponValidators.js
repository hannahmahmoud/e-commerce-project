let {check}= require('express-validator');
let middlewarValidator= require('./middlewareValidator');

exports.getValidator=[
    check('id').isMongoId().withMessage('InValid ID!'),
    middlewarValidator
]
exports.createValidator=[
    check('name').notEmpty().withMessage('Please provide a name for the brand!')
    .isLength({max:50}).withMessage('The maxlength  name of field is 32 char! Please provide a name with required length!')
    .isLength({min:3}).withMessage('The min length of name field is 3 char! Please provide a name with required length!'),
   
    check('expire').notEmpty().withMessage('expires is a required field')
    .isDate().withMessage('Invalid Type, it must be a date type'),

    check('discount').notEmpty().withMessage('discount is a required field')
    .isNumeric().withMessage('discount must be a number!')
    
    ,middlewareValidator
    
]

exports.deleteValidator=[
    check('id').isMongoId().withMessage('Invalid ID!'),
    middlewareValidator
    
]
exports.patchValidator=[
    check('id').isMongoId().withMessage('Invalid ID!'),

    check('name').notEmpty().withMessage('Please provide a name for the brand!')
    .isLength({max:50}).withMessage('The maxlength  name of field is 32 char! Please provide a name with required length!')
    .isLength({min:3}).withMessage('The min length of name field is 3 char! Please provide a name with required length!'),
   
    check('expire').notEmpty().withMessage('expires is a required field')
    .isDate().withMessage('Invalid Type, it must be a date type'),

    check('discount').notEmpty().withMessage('discount is a required field')
    .isNumeric().withMessage('discount must be a number!'),

    middlewareValidator
]