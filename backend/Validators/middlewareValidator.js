const { validationResult } = require("express-validator")

middlewareValidator=(request,response ,next)=>{
    let error= validationResult(request);
    if (error.isEmpty())
        next();
    else{
    response.status(400).json({
        status:'Error',
        Message:error.array()
    })
    }
}
module.exports=middlewareValidator;