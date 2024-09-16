let globalMiddlewareErrorHandler=(error, request, response,next)=>{
     error.statusCode=error.statusCode||500;
     error.status=error.status||'Error';
     response.status( error.statusCode).json({
        status:error.status,
        errorStackTrace:error.errorStackTrace,
        Message: error.message,
        error:{error},
        errorName: error.name
       
     }) 

}
module.exports=globalMiddlewareErrorHandler;