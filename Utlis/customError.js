class customError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode= statusCode;
        this.status= this.statusCode>=400&& this.statusCode<500?"Fail":"Error";
        this.operational= true;// to be send to the production
        Error.captureStackTrace(this,this.constructor);

    }

}
 module.exports=customError;