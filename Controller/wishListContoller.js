let express= require('express');
let userModel= require('./../Model/user');
let asynchandlerfunc= require('./../Utlis/asyncHandlerFunc');
let customError= require('./../Utlis/customError');

let app= express();
app.use(express.json());

exports.addProductToWishList= asynchandlerfunc(async (request, response, next)=>{
    let updatedWishList= await userModel.findByIdAndUpdate(request.foundUser._id,{
        // $addToSet ht add el product Id if doe not exit only
        $addToSet:{wishList: request.body.productID}
        
    },{new:true}
)
response.status(200).json({
    status:'Success',
    updatedWishList:updatedWishList
})
})

exports.removeProductToWishList= asynchandlerfunc(async (request, response, next)=>{
    let updatedWishList= await userModel.findByIdAndUpdate(request.foundUser._id,{
        // $pull ht remove el product Id if doe not exit only
        $pull:{wishList: request.params.productID}
        
    },{new:true}
)
response.status(204).json({
    status:'Success',
    updatedWishList:updatedWishList
})
})

exports.getWishListProductsForUser= asynchandlerfunc(async(request, response, next)=>{
    let UserWishList= await userModel.findById(request.foundUser._id);
    
    response.status(200).json({
        status:'Success',
        products: UserWishList.wishList
    })
})