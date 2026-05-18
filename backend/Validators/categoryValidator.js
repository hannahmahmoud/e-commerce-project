//importing pkgs
let express= require('express');
let { check }= require('express-validator');
let middlewareValidator= require('./middlewareValidator');


let app= express();
//using this middle ware to access the request body
 app.use(express.json())

exports.validateRequestBody=(request, response, next)=>{
    if (Object.keys(request.body).length===0)
    {
        response.status(400).json({
            Status: "Fail",
            Message:"Request body is empty!"
        })
    }
    next();
}
exports.getIDValidator=[
    check('id').isMongoId().withMessage('Invalid ID!'),
    middlewareValidator
    
]
exports.createValidator=[
    check('name')
    .notEmpty().withMessage('Name is a required field!')
    .isLength({
        min:3
    }).withMessage('Minimun length of name field is 3, Please provide a name with this requiement!')
    .isLength({
        max:32
    }).withMessage("Maximum length of name field is 32, Please provide a name with this requiement!"),
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
