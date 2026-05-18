let  mongoose= require('mongoose');

let orderSchema= new mongoose.Schema({
    user:{ 
        type: mongoose.Schema.ObjectId,
        required:[true, 'An order must have a user '],
        ref:'user'

    },
   cartItems:[
        {
        product:{
            type:mongoose.Schema.ObjectId,
            ref:'product'
               },
        quantity: Number,
        price:Number,
        color:String,
       }
],
shippingPrice:{
    type:Number,
    default:0

},
taxPrice:{
    type:Number,
    default:0

},
totalPrice:Number,
paymentMethod:{
    type:String,
    enum:['cash', 'card'],
    required:[true, 'payment method is a required field'],
    default: 'cash'
},
isPaid: {
    type:Boolean,
    default:false
},
paidAt:Date,
isDelivered:{
    type:Boolean,
    default:false
},
    deliveredAt:Date




},{timestamps:true});
 

orderSchema.pre(/^find/,function(next){

    this.populate({
        path:'user',
        select:"name"
    })
    .populate({
        path:'cartItems.product',
        select:'title'
    })
next();
})
let orderModel= mongoose.model('order',orderSchema);
module.exports=orderModel;