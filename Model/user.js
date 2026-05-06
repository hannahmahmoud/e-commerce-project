//importing pkgs
let mongoose= require('mongoose');
const validator = require('validator');
let bcrypt= require('bcryptjs');
let crypto= require('crypto');

let userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'name is a required field, please provide one!'],
        trim:true
    },
    email:{
        type:String,
        required:[true, 'email is a required field, please provide one!'],
        validate: [validator.isEmail,'please provide a valid email!'],
        unique:true
    },
    password:{
        type:String,
        minlength:[8,'min length is 8 chars'],
        select: false
        
    },
    confirmPassword:{
        type: String,
        required: [true, "confrim password is a required field!"],
        minlength:[8,'min length is 8 characters'],
        validate:{
            validator: function(value){
                return value==this.password;
            },
            message :"Confrim Password and Password does not match!"
        },
        select: false
    },
    photo:{
        type: String
    },
    passwordChangedAt: Date,
    
    role:{
        type:String,
        enum:['user', 'admin'],
        default: 'user'
    },
    active:{
        type :Boolean,
        default: true,
        select: false

    },
    resetPasswordtoken: String,
    resetPasswordTokenExpire: Date,

    wishList:[{
        type: mongoose.Schema.ObjectId,
        ref:'product'
    }],
address:[    
{
    id:{type: mongoose.Schema.Types.ObjectId},
    details: String,
    city:String,
    postalCode:{
        type:Number,
        required:[true, 'Postal code is a required field']
    
    },
    phone:{
        type:Number,
        required:[true, 'phone is a required field']
    },
    streetName:String

}
]

});
userSchema.pre('save',async function(
   // next
){
    if (!this.isModified('password'))
        return next();
    this.password=await bcrypt.hash(this.password,12);
    this.confirmPassword= undefined;
  //  next();
})
userSchema.pre(/^find/,function(
    //next
){
    this.find({active:{$ne:false}})
    //next();

})

userSchema.methods.comparePasswordwithDB= async function(password, passwordDb)
{
   return await bcrypt.compare(password,passwordDb)
}
userSchema.methods.isPasswordNotChanged= async function (jwtstamps){
    if (this.passwordChangedAt== undefined)
        return true;
    let passwordChangedAt= (this.passwordChangedAt.getTime())*1/1000;
    return passwordChangedAt>jwtstamps;



}
userSchema.methods.resetPasswordToken= function(){
    // creating a reset token to send to user
    let resettoken = crypto.randomBytes(32).toString('hex');
    //encrypting the resettoken and save it in db
    this.resetPasswordtoken=crypto.createHash('sha256').update(resettoken).digest('hex');
    //setting the expire date of the this token after 10 mins
    this.resetPasswordTokenExpire= Date.now()+10*60*1000;
    console.log(  this.resetPasswordTokenExpire)
    // returning the unhashed token for the user to access it 
    return resettoken;
}
let userModel=mongoose.model('user',userSchema);
module.exports=userModel


