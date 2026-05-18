let mongoose= require('mongoose');

let couponSchema= new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'name is required field'],
        trim: true,
        unique:true
    },
    discount:
    { type:Number,
     required:[true, 'discount is a required field']

    },
    expire:{
        type:Date,
        required:[true, 'expire is required field']
    }

},{
    timestamps:true
})

let couponModel = mongoose.model('coupon',couponSchema);
module.exports= couponModel;