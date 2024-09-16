//importing pkgs
let asyncErrorHandler= require('./../Utlis/asyncHandlerFunc');
let express= require('express');
let couponModel= require('./../Model/coupon');
let apiFeatures= require('./../Utlis/apiFeatures');
const { default: slugify } = require('slugify');

let app= express();


//using mdiddleware to read the request body
app.use(express.json())


exports.getAllCoupons=asyncErrorHandler(async(request, response, next)=>{
     apiFeature= new apiFeatures(couponModel.find(),request.query)
     .filter()
     .sort()
     .fields()
     .pagination();
     let allcoupons= await apiFeature.query;

     response.status(200).json({
        status:"Sucess",
        count:allcoupons.length,
        data: {
            coupons:allcoupons
        }

     })

})
//DELETE //:id
exports.deleteCoupon=asyncErrorHandler(async(request, response, next)=>{

    let deleteCoupon= await couponModel.findByIdAndDelete(request.params.id);
    response.status(204).json({
        status: 'Success',
        data: null
    })
})


exports.getCoupon=asyncErrorHandler(async(request, response, next)=>{
    let foundCoupon= await couponModel.findById(request.params.id);
    if (!foundCoupon)
    {
        let error =new Error('this id is not found!')
        next(error);
    }
    response.status(200).json({
        status:"Success",
        data:{
            Coupon: foundCoupon
        }
    })





})

exports.updateCoupon= asyncErrorHandler(async(request, response,next)=>{
    let foundCoupon= await couponModel.findByIdAndUpdate(request.params.id,request.body,{runValidators:true, new:true});
    response.status(200).json({
        status:'Success',
        UpdatedCoupon: foundCoupon
    })

})
//POST - createCategory
exports.createNewCoupon= asyncErrorHandler(async(request, response, next)=>{
    let newCoupon= await couponModel.create(request.body);
    response.status(201).json({
        status:'Success',
        newCoupon: newCoupon
    })

})