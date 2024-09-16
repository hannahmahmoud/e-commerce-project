let mongoose= require('mongoose');

let brandSchema= new mongoose.Schema({
    name:{
        type:String,
        minlength:[3,'The min length of name is 3 characters!, Please provide a name from 3 to 32 characters'],
        maxlength:[32,'The max length of name is 32 characters!, Please provide a name from 3 to 32 characters'],
        required: true,
        unique:true
    }, 
    photo: String,
    slug:{
        type:String,
        lowecase:true
    }
},
{
    timestamps:true
});
let brandModel= mongoose.model('Brand',brandSchema);
module.exports=brandModel;