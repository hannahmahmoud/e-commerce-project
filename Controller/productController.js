//importing pkgs
let asyncErrorHandler= require('./../Utlis/asyncHandlerFunc');
let express= require('express');
let productModel= require('./../Model/product');
let apiFeatures= require('./../Utlis/apiFeatures')
let sharp= require('sharp');

let app= express();


//using mdiddleware to read the request body
app.use(express.json())

exports.resize= asyncErrorHandler(async function(request, file, next){
    let extension= request.file.mimetype.split('/')[1];
     let fileName='product-'+ Date.now()+'.'+extension;
     await sharp(request.file.buffer)
     .resize(600,600)
     .toFormat('jpeg')
     .toFile('uploads/product/'+fileName);
     
     request.body.photo=fileName;
      next();
 
 
 })


exports.getAllProducts=asyncErrorHandler(async(request, response, next)=>{
     apiFeature= new apiFeatures(productModel.find(),request.query)
     .filter()
     .sort()
     .fields()
     .pagination()
     .populate('reviews', 'title rating -_id');
     
      

     let allProducts= await apiFeature.query;
     response.status(200).json({
        status:"Sucess",
        count:allProducts.length,
        data: {
            products :allProducts
        }

     })

})
//DELETE //:id
exports.deleteProduct=asyncErrorHandler(async(request, response, next)=>{

    let deleteProduct= await productModel.findByIdAndDelete(request.params.id);
    response.status(204).json({
        status: 'Success',
        data: null
    })
})


exports.getProduct=asyncErrorHandler(async(request, response, next)=>{
    let foundProduct= await productModel.findById(request.params.id).populate({
        path:'reviews',
        select:'title rating'
     });
    if (!foundProduct)
    {
        let error =new Error('this id is not found!')
        next(error);
    }
    response.status(200).json({
        status:"Success",
        data:{
            product: foundProduct
        }
    })





})
//POST - createCategory
exports.createNewProduct= asyncErrorHandler(async(request, response, next)=>{
    let newProduct= await productModel.create(request.body);
    response.status(201).json({
        status:'Success',
        newProduct: newProduct
    })

})