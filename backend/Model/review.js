let mongoose= require('mongoose');

let reviewSchema= new mongoose.Schema({


    title:{
        type:String,
        required:[true,'Title is a required field']
    },
    rating:{
        type:Number,
        min:[1,'Minimum rating 1! Please provide a rating from 1 to 5.'],
        max:[5,'Maximun rating 5! Please provide a rating from 1 to 5.'],
        required:[true, 'rating is a required field'],
    },
   product:{
    required:[true, 'product is a required field'],
    type: mongoose.Schema.ObjectId,
    ref:'product'
   },
   user:{
    type: mongoose.Schema.ObjectId,
    ref:'user'

   }

},{
    timestamps:true,
});

reviewSchema.pre(/^find/,function(){
    this.
    // populate({
    //     path:'product',
    //     select:'title'
    // }).
    populate({
        path:'user',
        select:'name'
    }).populate({
       path:'product',
       select:"title" 
    })
    //next();
})

let reviewModel = mongoose.model('review',reviewSchema);
module.exports=reviewModel;

