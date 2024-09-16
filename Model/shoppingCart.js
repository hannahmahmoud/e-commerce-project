let mongoose= require('mongoose');

let shoppingCartSchema= new mongoose.Schema({
    cartItems:[
        {
        product:{
            type:mongoose.Schema.ObjectId,
            ref:'product'
               },
        quantity: Number,
        price:Number,
        color:String,
       },
],
totalPrice: Number,
totalPriceAfterDiscount:Number,

user:{
    type: mongoose.Schema.ObjectId,
    ref:'user'
}


},{timestamps:true});
let shoppingCartModel= mongoose.model('shopping cart',shoppingCartSchema);
module.exports= shoppingCartModel;