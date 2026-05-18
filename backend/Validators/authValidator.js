
 //importing pkgs
 let express= require('express');
 let { check }= require('express-validator');
 let middlewareValidator= require('./middlewareValidator');

 
 
 let app= express();
 //using this middle ware to access the request body
app.use(express.json())
 

 
 exports.signup=[
     check('name')
     .notEmpty().withMessage('name is a required field!'),
    
     check('email')
     .notEmpty().withMessage('email is a required field!')
     .isEmail().withMessage('please enter a valid email!'),
     
     

 
     check('password').notEmpty().withMessage('password is a required field!')
     .isLength({ min:8}).withMessage('Minimun length of a password field is 8, Please provide a password with this requiement!'),

     check('confirmPassword').notEmpty().withMessage('password is a required field!')
     .isLength({ min:8}).withMessage('Minimun length of a password field is 8, Please provide a password with this requiement!'),
 
     middlewareValidator
     
 ]
 exports.login = [
    check('email')
        .notEmpty().withMessage('email is a required field!')
        .isEmail().withMessage('please enter a valid email!'),
    
    check('password')
        .notEmpty().withMessage('password is a required field!')
        .isLength({ min: 8 }).withMessage('Minimun length of a password field is 8, Please provide a password with this requiement!'),
    
    middlewareValidator
];
exports.forgetPasswordValidator=[
    check('email').notEmpty().withMessage('Please provide your email!')
    .isEmail().withMessage('Invalid Email!'),
    middlewareValidator
]
exports.resetPasswordValidator=[
    check('token').notEmpty().withMessage('NO Token is provided!'),

    check('password').notEmpty().withMessage('No password provided!')
    .isLength({min:8}).withMessage('Please provide a password with at least 8 chars'),

    check('confirmPassword').notEmpty().withMessage('No confirm password is provided!').
    isLength({min:8}).withMessage('Please provide a password with at least 8 chars'),
    
    middlewareValidator
]
 
 
 