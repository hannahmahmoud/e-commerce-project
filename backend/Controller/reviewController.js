//importing pkgs
let express=require('express');
let mongoose= require('mongoose');
let asyncHandler= require('./../Utlis/asyncHandlerFunc');
let reviewModel= require('./../Model/review');
let apiFeatures= require('./../Utlis/apiFeatures');
let customError= require('./../Utlis/customError')

let app= express();

//using this middleware to enable the request body
app.use(express.json());

exports.setRequestBody=(request, response, next)=>{
    if(request.params.productID)
     {  request.body.product=request.params.productID;
    return next();}
    else { 
        if (request.body.product)
            return next();
        return next(new customError('no product id is provided!'),400);
    }
}

exports.getAllReviews=asyncHandler(async(request, response, next)=>{
    apiFeature= new apiFeatures(reviewModel.find(),request.query)
    .filter()
    .sort()
    .fields()
    .pagination();
    let allReviews= await apiFeature.query;
    response.status(200).json({
       status:"Sucess",
       count:allReviews.length,
       data: {
           reviews:allReviews
       }

    })

})
//DELETE //:id
exports.deleteReview=asyncHandler(async(request, response, next)=>{

   let deleteReview= await reviewModel.findByIdAndDelete(request.params.id);
   response.status(204).json({
       status: 'Success',
       data: null
   })
})


exports.getReview=asyncHandler(async(request, response, next)=>{
   let foundReview= await reviewModel.findById(request.params.id);
   if (!foundReview)
   {
       let error =new Error('this id is not found!')
       next(error);
   }
   response.status(200).json({
       status:"Success",
       data:{
           category: foundReview
       }
   })





})
//POST - createCategory
exports.createNewReview= asyncHandler(async(request, response, next)=>{
  
   let newReview= await reviewModel.create(request.body);
    try{
        newReview.user= request.foundUser._id;
        console.log( newReview);
         await  newReview.save({validateBeforeSave:false});
   response.status(201).json({
       status:'Success',
       newRiview: newReview
   })}
   catch(error){
    next(error)
   }
    
   

})
exports.updateReview= asyncHandler(async(request, response, next)=>{
   
    let updatedReview= await reviewModel.findByIdAndUpdate(request.params.id,request.body, {runValidators:true,new:true})
    response.status(200).json({
        status:'Success',
        updatedData: updatedReview
    })
})

exports.getAllReviewsforSpecficUser=asyncHandler(async(request,response,next)=>{
let allReviews= await reviewModel.find({product:request.params.productID});
console.log(allReviews);
response.status(200).json({
    status:'success',
    reviews:allReviews

})
});
exports.aggregation=asyncHandler(async(request, response, next)=>{
    
    const { productID } = request.params;
    let objectId =  new mongoose.Types.ObjectId(productID);
    
    let aggregation= await reviewModel.aggregate([
        {$match: { product: objectId}

        },
        {$group:{
            _id: '$product',
            avgRating: {$avg:'$rating'},
            reviewsCount: { $sum: 1 },
            
                    
        }

        }
])
 response.status(200).json({
    status:'Success',
    stats: aggregation
 })
})