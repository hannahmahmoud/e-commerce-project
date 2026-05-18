const mongoose = require('mongoose');
let reviewModel=require('./review')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'The min length of title is 3 characters!'],
        maxlength: [32, 'The max length of title is 32 characters!'],
        unique:true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'The min length of description is 10 characters!'],
        maxlength: [1000, 'The max length of description is 100 characters!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    discountPrice: Number,
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    },
    quantityOfSoldProduct: {
        type: Number,
        default: 0
    },
    photo: String,
    coverPhoto: {
        type: String,
        required: [true, 'Cover photo is required'],
        unique: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'The min rating is 1'],
        max: [5, 'The max rating is 5']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
        required: [true, 'Brand is required']
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true
    },
    subCategory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory',
        required: [true, 'subCategory is required']
    }],
    ratingAverage: {
        type: Number,
        min: [1, 'The min rating is 1'],
        max: [5, 'The max rating is 5']
    },
    ratingQuantity: {
        type: Number,
        default: 0
    }
}, { timestamps: true ,
    strictPopulate:false,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
productSchema.virtual('reviews',{
    ref:'review',
    foreignField:'product',
    localField:'_id'
    });
    
productSchema.pre(/^find/,function(){
    this.populate({
        path:'category',
        select:'name'
    }).populate({
        path:'brand',
        select:'name'
    }).populate({
        path:'subCategory',
        select:'name'
    })
   // next();

})


const Product = mongoose.model('product', productSchema);

module.exports = Product;