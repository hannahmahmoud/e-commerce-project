//importing pkgs
let asyncErrorHandler= require('./../Utlis/asyncHandlerFunc');
let express= require('express');
let categoryModel= require('./../Model/category');
let apiFeatures= require('./../Utlis/apiFeatures')
let multer= require('multer');
let path = require('path');
const fs = require('fs');
const customError = require('../Utlis/customError');
let sharp= require('sharp');
//1- storing images in diskStorage bs hena mafesh buffer
// let storage= multer.diskStorage({
//     destination: function (req, file, callback) {
//         //null y3ny m3ndesh error w b3d kdaa destination  
//         //zy upload= multer({'dest':'uploads/category'})
//         callback(null, 'uploads/category')
//     },
//     filename: function (req, file, callback) {
//         let extension= file.mimetype.split('/')[1];
//         //filename category
//       const filename = 'category'+Date.now()+ '.' +extension;
//       callback(null, filename)
//     }
//   })
//2- h3mlha ana mermoryStorage ashana ana m7taga el buffer ashan a3ml resize leh sora
const storage = multer.memoryStorage()

let fileFilter=function(req, file, callback){
      // Accept only images
      const allowedTypes = /jpeg|jpg|png|gif/;
      //path.extname is a method from the Node.js path module that extracts the file extension from a file path.
      //originalname is a property provided by the multer
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
  
      if (mimetype && extname) {
          return callback(null, true);
      } else {
          callback(new customError('Only images are allowed',400), false);
      }
  };

let app= express();
let upload= multer({
    storage:storage,
    fileFilter:fileFilter
}
);

//using mdiddleware to read the request body
app.use(express.json())

exports.resize = asyncErrorHandler(async function(request, response, next) {
    // 1. If no image was uploaded, just move to the next step
    if (!request.file) {
        return next();
    }

    // 2. Set the filename and where to save it
    let filename = 'category' + '-' + Date.now() + '.jpeg';
    let outputPath = 'uploads/category/';

    // 3. Automatically create the folder if it does not exist
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // 4. Resize and save the image using Sharp
    await sharp(request.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(outputPath + filename);

    // 5. Save the filename to the request body so it goes into the database
    request.body.photo = filename;
    
    // 6. Move to the next middleware (createNewCategory)
    next();
});

exports.uploadImage=  upload.single('photo'),



exports.getAllCategories=asyncErrorHandler(async(request, response, next)=>{
     apiFeature= new apiFeatures(categoryModel.find(),request.query)
     .filter()
     .sort()
     .fields()
     .pagination();
     let allCategories= await apiFeature.query;
     response.status(200).json({
        status:"Sucess",
        count:allCategories.length,
        data: {
            category:allCategories
        }

     })

})
//DELETE //:id
exports.deleteCategory=asyncErrorHandler(async(request, response, next)=>{

    let deleteUser= await categoryModel.findByIdAndDelete(request.params.id);
    response.status(204).json({
        status: 'Success',
        data: null
    })
})


exports.getCategory=asyncErrorHandler(async(request, response, next)=>{
    let foundCategory= await categoryModel.findById(request.params.id);
    if (!foundCategory)
    {
        let error =new Error('this id is not found!')
        next(error);
    }
    response.status(200).json({
        status:"Success",
        data:{
            category: foundCategory
        }
    })





})
//POST - createCategory
exports.createNewCategory= asyncErrorHandler(async(request, response, next)=>{
    let newCategory= await categoryModel.create(request.body);
    response.status(201).json({
        status:'Success',
        newCategory: newCategory
    })

})