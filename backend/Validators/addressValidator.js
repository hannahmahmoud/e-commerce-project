let {check}= require('express-validator');
let middlewarValidator= require('./middlewareValidator');


exports.addAddressValidator=[
    check('details').notEmpty().withMessage('Please provide the details field inorder to get an accurate info'),

    check('city').notEmpty().withMessage('Please provide the city field inorder to get an accurate info'),
    
    check('postalCode').notEmpty().withMessage('Please provide an postalCOde')
    .isNumeric().withMessage('postal code must be a number!'),

       middlewarValidator
]
    
    

exports.deleteValidator=[
    check('addressID').notEmpty().withMessage('Please provide a ID')
    .isMongoId().withMessage('Invalid ID!'),
    middlewarValidator
    
]
