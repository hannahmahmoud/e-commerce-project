let multer= require('multer');
let path= require('path');
const customError = require('../Utlis/customError');

fileFilter= function (request, file,callback){
    let allowedTypes=/jpeg|jpg|png|gif/;
    let extname= allowedTypes.test(path.extname(file.originalname).toLowerCase());
    let mimetype= allowedTypes.test(file.mimetype);
    if (mimetype&&extname)
        callback(null, true)
    else 
    callback(new customError('only images is allowed!',400),false)


}
let storage= multer.memoryStorage();

 let upload= multer({
    storage:storage,
    fileFilter:fileFilter
})

exports.uploadImage=function(fieldName){
    return upload.single(fieldName)};

    exports.uploadImages= function (arrayOfFields){
        return upload.fields(arrayOfFields)
    }