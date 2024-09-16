let express= require('express');
let userModel= require('./../Model/user');
let asynchandlerfunc= require('./../Utlis/asyncHandlerFunc');


let app= express();
app.use(express.json());
exports.getallusers=asynchandlerfunc(async(request, response, next)=>{
    let foundUser= await userModel.find();
      console.log ("...");
    response.status(200).json({
      status:"Success",
      count:foundUser.length,
      data:{
      users:foundUser
      }
    })
  
  })
  
  exports.updatePassword= asynchandlerfunc( async (request, response, next)=>{
      // get user info
      //ana alr bb3t protect route middle func abl deh w func deh feh request.foundUser= foundUser
      let foundUser= await userModel.findOne(request.foundUser._id).select('+password');
      if (!foundUser){
        let error= new customError("user is not found!",400);
        next(error);
      }
      let currentPassword= request.body.currentPassword;
      //compare the current with password db
      if(!(await foundUser.comparePasswordwithDB(currentPassword,foundUser.password))){
     
        let error= new customError("the current password you entered does not match your password",400);
        next(error);
      }
    
      // updating the password with the new password
      try{
      foundUser.password=request.body.NewPassword;
      foundUser.confirmPassword=request.body.confirmNewPassword;
      foundUser.passwordChangedAt= Date.now();
      await foundUser.save();
      
    
    // sending response to the user 
      response.status(200).json({
        status:"success",
        message: "your password is updated Successfully"
      })
      
      }
      catch(error){
        next(error);
      }
    
     } )
     
  exports.updateUser=asynchandlerfunc (async (request, response, next)=>{
      //chech if the user try to change the password, confrim password, role
      if (request.body.password||request.body.confirmPassword||request.body.role){
           let error= new customError('This request cannot update your password or your role; it can only update name, email, etc..',400);
           next(error);
  
      }
      let updateUser= await userModel.findByIdAndUpdate(request.foundUser._id,request.body,{runValidators: true, new : true})
      updateUser.__v=undefined;
      //momken a3ml kda 
      // let foundUser= await userModel.findOne(request.foundUser._id);
      // if (request.body.name)
      //     foundUser.name=request.body.name;
      // if (request.body.email)
      //     foundUser.email=request.body.email;
      // if (request.body.photo)
      //     foundUser.photo= request.body.photo;
      // try {
      //  await foundUser.save({validateBeforeSave: false});
  
      // }
      // catch(error){
      //     next(error);
      // }
  response.status(200).json({
      status: "Sucess",
      Message: "Your info is updated succesfully!",
      user: updateUser
  })
  })
  exports.deleteUser= asynchandlerfunc( async(request, response, next)=>{
    let foundUser=  await userModel.findByIdAndUpdate(request.foundUser._id,{active: false})
    response.status(204).json({
      status:"Success",
      data: null
    })
  
  })