let asyncErrorHandler= (fn)=>{
    return(request,response, next)=>{
        fn(request,response, next).catch(error=>
            next(error));
        }
    };

module.exports=asyncErrorHandler;
//matnesh el catch ashan deh hya el htkhlke trohy leh middleware func