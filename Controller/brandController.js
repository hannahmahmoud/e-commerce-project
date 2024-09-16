//importing pkgs
let asyncErrorHandler= require('./../Utlis/asyncHandlerFunc');
let express= require('express');
let brandModel= require('./../Model/brand');
let apiFeatures= require('./../Utlis/apiFeatures');
const { default: slugify } = require('slugify');
let multer= require('multer');
let path= require('path');
let sharp= require('sharp');
const customError = require('../Utlis/customError');



exports.resize= asyncErrorHandler(async function(request, file, next){
   let extension= request.file.mimetype.split('/')[1];
    let fileName='brand-'+ Date.now()+'.'+extension;
    await sharp(request.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .toFile('uploads/brand/'+fileName);
    
    request.body.photo=fileName;
     next();


})
let app= express();


//using mdiddleware to read the request body
app.use(express.json())


exports.getAllBrand=asyncErrorHandler(async(request, response, next)=>{
     apiFeature= new apiFeatures(brandModel.find(),request.query)
     .filter()
     .sort()
     .fields()
     .pagination();
     let allbrands= await apiFeature.query;
     response.status(200).json({
        status:"Sucess",
        count:allbrands.length,
        data: {
            brands:allbrands
        }

     })

})
//DELETE //:id
exports.deleteBrand=asyncErrorHandler(async(request, response, next)=>{

    let deleteUser= await brandModel.findByIdAndDelete(request.params.id);
    response.status(204).json({
        status: 'Success',
        data: null
    })
})


exports.getBrand=asyncErrorHandler(async(request, response, next)=>{
    let foundBrand= await brandModel.findById(request.params.id);
    if (!foundBrand)
    {
        let error =new Error('this id is not found!')
        next(error);
    }
    response.status(200).json({
        status:"Success",
        data:{
            category: foundBrand
        }
    })





})
//POST - createCategory
exports.createNewBrand= asyncErrorHandler(async(request, response, next)=>{
    let newBrand= await brandModel.create({
        name:request.body.name,
        slug:slugify(request.body.name),
        photo:request.body.photo

    }
);
    response.status(201).json({
        status:'Success',
        newCategory: newBrand
    })

})