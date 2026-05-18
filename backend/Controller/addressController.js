let express= require('express');
let userModel= require('./../Model/user');
let asynchandlerfunc= require('./../Utlis/asyncHandlerFunc');
let customError= require('./../Utlis/customError');

let app= express();
app.use(express.json());

exports.addAddressDetails= asynchandlerfunc(async (request, response, next)=>{
    let updatedAddress= await userModel.findByIdAndUpdate(request.foundUser._id,{
        // $addToSet ht add el product Id if doe not exit only
        $addToSet:{address: request.body}
        
    },{new:true}
)
response.status(200).json({
    status:'Success',
    updatedAddress:updatedAddress
})
})

exports.removeAddress= asynchandlerfunc(async (request, response, next)=>{
    let deletedAddress= await userModel.findByIdAndUpdate(request.foundUser._id,{
        // $pull ht remove el product Id if doe not exit only
        $pull:{address:{ _id: request.params.addressID}}
        
    },{new:true}
)
response.status(204).json({
    status:'Success',
    deletedAddress:deletedAddress
})
})

exports.getAddressForUser= asynchandlerfunc(async(request, response, next)=>{
    let allAddresses= await userModel.findById(request.foundUser._id);
    
    response.status(200).json({
        status:'Success',
        Address: allAddresses.address
    })
})