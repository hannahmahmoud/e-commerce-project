let {check}= require('express-validator');
let middlewareValidator= require('./middlewareValidator');
const customError = require('./../Utlis/customError');

exports.userUpdateValidator=(request, response, next)=>{
    if (Object.keys(request.body).length===0)
    {
        let error= new customError('The request body is empty !',400);
       return next(error);
    }
    return next();
}



exports.paswordUpdateValidator=[
   check('NewPassword').notEmpty().withMessage('No password provided!')
   .isLength({min:8}).withMessage('Please provide a password at least 8 chars'),

   check('currentPassword').notEmpty().withMessage('No current password provided!')
   .isLength({min:8}).withMessage('Please provide a password at least 8 chars'),
   

   check('confirmNewPassword').notEmpty().withMessage('No confirmNewPassword provided!')
   .isLength({min:8}).withMessage('Please provide a password at least 8 chars'),
   middlewareValidator
]