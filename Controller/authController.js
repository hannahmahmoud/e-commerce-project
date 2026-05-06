let express= require('express');
let userModel= require('./../Model/user');
let asynchandlerfunc= require('./../Utlis/asyncHandlerFunc');
let customError= require('./../Utlis/customError');
let jwt = require('jsonwebtoken');
let util= require('util');
let sendEmail= require('./../Utlis/Email');
let crypto= require('crypto');
let app =express();

//using this middleware to access the request body
 app.use(express.json());

 exports.singup= asynchandlerfunc( async(request, response,next)=>{
    let newUser= await userModel.create(request.body);
    newUser.password=undefined;
    newUser.role= undefined;
    newUser.active= undefined;
    newUser.__v= undefined;
    
    response.status(201).json({
       status:'Success',
        userData: newUser
    })  
 })

 exports.login= asynchandlerfunc(async(request,response, next)=>{
   //check if email and passsword exits in db
   let foundUser= await userModel.findOne({email:request.body.email}).select('+password');
   if (!foundUser){
      let error= new customError('incorrect email!');
      return next(error);
   }
  let isMatch= await foundUser.comparePasswordwithDB(request.body.password,foundUser.password);
  if (!isMatch) 
   {
   let error= new customError('Incorrect password!');
   return next(error);
   }
   
   //create a token
   let token = jwt.sign({foundUser},'9e4d9f0a2cb5d3c7a3de1e22f7f9461c4d8e4b82f7b540b4d6a4a1bc4c6e88a2');
   //passing the token in cookies
   response.cookie('token',token,{
      maxAge:10000000000,
      httpOnly:true
   })
   response.status(200).json({
      status:'Success',
      token:token
   })
   
 })

 exports.protectRoute=asynchandlerfunc(async (request, response, next)=>{
   //read the token checks if it exits
   let token= request.headers.authorization;
   if(!token)
   {
      let error= new customError('TOKEN is NOT FOUND',404)
      return next(error);
   }
   if(token.startsWith('Bearer'))
   {
      token= token.split(' ');
      [,token]=token;
   }

   //verify the token
   let decodedToken=await  util.promisify(jwt.verify)(token,'9e4d9f0a2cb5d3c7a3de1e22f7f9461c4d8e4b82f7b540b4d6a4a1bc4c6e88a2');
   //validate the token belong to this specfic user
   let foundUser= await userModel.findById({_id: decodedToken.foundUser._id});

   if (!foundUser)
   {
      let error= new customError('User is NOT FOUND',404)
      return next(error);
   }
   //check if the password is changed
   if (foundUser.isPasswordNotChanged(decodedToken.iat))
   {
      request.foundUser= foundUser;
      //console.log(request.foundUser);
      return next();
   }
   let error= new customError('password has changed plz login in again',400)
   return next(error);


 })
 
 exports.checkAuthorization=(...role)=>{
   // ... role ashana msh lazm admin bs momken hagat tanyia 
   return(request,response,next)=>{
      //awl role deh parameter, w b3dan fe protected route ana 3mlt
      //request.foundUser= foundUser fah ana kda ba m3aya el access leh founduser dah bara func bt3t el protected func
      if(!(role.includes(request.foundUser.role)))
      {
         let error= new customError(' you dont have the perimission to do this action',403);
         next(error);

      }
      return next();
   }

 }

 exports.forgetPassword=asynchandlerfunc(async(request,response, next)=>{
   //check if the email is a valid email
   let foundUser= await userModel.findOne({email:request.body.email});
   if (!foundUser){
      let error= new customError('Incorrect Email!',404);
     return next(error);
   }

   //genrating a random token
   let resetToken= foundUser.resetPasswordToken();
   await foundUser.save({validateBeforeSave:false});
   //creating the options for the send email func 
   let URL= request.protocol+'://'+request.get('host')+'/resetPassword/'+resetToken;
   let subject='RESET PASSWORD REQUEST';
   let message='Please open this link to reset your password\n' + URL;
   //sending email
   try{
  sendEmail({
   email:foundUser.email,
   subject:subject,
   text:message
  })
  request.foundUser= foundUser;
  response.status(200).json({
   status:"Success",
   message: "URL was sent to the email"

 })
   }
   catch(error){
      
      foundUser.resetPasswordToken=undefined
    foundUser.resetPasswordTokenExpire= undefined
    return next(error)
   }

 })

 exports.resetPassword=asynchandlerfunc(async(request, response, next)=>{
   //check and validate the token 
   let hashedToken= crypto.createHash('sha256').update(request.params.token).digest('hex')
   //search for the user by the token
   let foundUser= await userModel.findOne({resetPasswordtoken:hashedToken});
   if (!foundUser){
      let error= new customError('User Not FOUND!',404);
      return next(error);
   }
   console.log(foundUser.resetPasswordTokenExpire)

   //check the expire Date of token
   if (Date.now()>foundUser.resetPasswordTokenExpire)
   {   let error= new customError('token is expired',403);
      return next(error);

   }

   //saving the new password of the user
   try {
      foundUser.password= request.body.password;
      foundUser.confrimPassword=request.body.password;
      foundUser.resetPasswordToken= undefined;
      foundUser.resetPasswordTokenExpire= undefined;
      foundUser.save({validateBeforeSave:false})

      response.status(200).json({
         status:'Success',
         Message: 'your password is reset!'
      })
   }
   catch(error){
     return next(error);    

   }


 })
