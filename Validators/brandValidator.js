let {check}= require('express-validator');
let middlewarValidator= require('./middlewareValidator');

exports.getValidator=[
    check('id').isMongoId().withMessage('InValid ID!'),
    middlewarValidator
]
exports.createValidator=[
    check('name').notEmpty().withMessage('Please provide a name for the brand!')
    .isLength({max:32}).withMessage('The maxlength  name of field is 32 char! Please provide a name with required length!')
    .isLength({min:3}).withMessage('The min length of name field is 3 char! Please provide a name with required length!')
    ,middlewareValidator
    
]

exports.deleteValidator=[
    check('id').isMongoId().withMessage('Invalid ID!'),
    middlewareValidator
    
]
exports.patchValidator=[
    check('id').isMongoId().withMessage('Invalid ID!'),
    middlewareValidator
]