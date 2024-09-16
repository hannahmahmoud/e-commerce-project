let express= require('express');
let shoppingCartModel= require('./../Model/shoppingCart');
let asynchandlerfunc= require('./../Utlis/asyncHandlerFunc');
let productModel= require('./../Model/product')
let customError= require('./../Utlis/customError');
let couponModel = require('./../Model/coupon')



let app =express();
app.use(express.json());

exports.addProductTocart=asynchandlerfunc(async(request, response, next)=>{
  //get the product details
  let foundProduct= await productModel.findById(request.body.productID);
  if (!foundProduct)
  {
    let error= new customError('this product is NOT FOUND',404);
    return next(error);
  }
    //1- check if the user have cart or not
    let foundCart= await shoppingCartModel.findOne({user: request.foundUser._id})
    if(!foundCart){
        //then the user does not have a cart yet hence we're going to create one
        foundCart= await shoppingCartModel.create({
            cartItems:{
                product:request.body.productID,
                quantity: request.body.quantity, 
                price:foundProduct.price,
                color: request.body.color
            },
            user:request.foundUser._id

        });}
      //check if the product is alr in the cart with same color 
      //if  yes increase the quantity 
      //else add the product as a new product
      else{
        const itemIndex = foundCart.cartItems.findIndex(item => 
            item.product.toString() === request.body.productID && item.color === request.body.color
        );
        
    console.log(itemIndex);
        if (itemIndex>-1)
        {
            foundCart.cartItems[itemIndex].quantity+=request.body.quantity;
        }
        else{
            foundCart.cartItems.push({
                product:request.body.productID,
                quantity:request.body.quantity,
                price:foundProduct.price,
                color: request.body.color,

            })
        }
        //calculate the total price
        let totalPrice=0;
        foundCart.cartItems.forEach(item=>
            totalPrice+= (item.quantity*item.price)
        )
        foundCart.totalPrice=totalPrice;
       try{
       await  foundCart.save()
       console.log(foundCart);
       console.log(foundCart.totalPrice);

       } 
       catch(error){
        next(error);
       }
    
    
    } 
    response.status(200).json({
        status:'Success',
        data:{
            foundCart
        }
     })
    })

exports.getCart= asynchandlerfunc(async(request, response,next)=>{
   let cart= await shoppingCartModel.findOne({user:request.foundUser._id})
   if (!cart) {
    let error= new customError(' cart is empty',404)
    return next(error);
   }
    response.status(200).json({
       status:"Sucess",
       count:cart.cartItems.length,
       data: {
           data:cart
       }

    })

    
})
exports.removeSpecficProduct= asynchandlerfunc(async(request,response,next)=>{
    let cart= await shoppingCartModel.findOneAndDelete({user:request.foundUser._id},
        {
         cartItems:{_id:request.params.id}
        },{new: true}    
    )
    console.log(cart)
    let totalPrice=0;
    cart.cartItems.forEach(item=>
            totalPrice+= (item.quantity*item.price)
        )
        cart.totalPrice=totalPrice;
       try{
       await  cart.save()
       } 
       catch(error){
        next(error);
       }
       response.status(204).json({
        status:'Success',
        data: cart
       })
})
exports.clearCart= asynchandlerfunc(async (request, response,next )=>{
    let cart= await shoppingCartModel.findOneAndDelete({user:request.foundUser._id} )
    response.status(204).json({
        status:'Success',
        data:null
    })

})
exports.updateQuantity= asynchandlerfunc(async(request, response, next)=>{
    //check if the user have a cart!
    let foundCart= await shoppingCartModel.findOne({user:request.foundUser._id});
    if(!foundCart){
      return  next(new customError('no cart',404));
    }
    //search if product is found in the cart
    let index= foundCart.cartItems.findIndex(item => 
        item.product.toString() === request.params.productID)
if (index>-1){
    //product is found
    //updating quantity and price
    foundCart.cartItems[index].quantity= request.body.quantity;
    let totalPrice=0;
    foundCart.cartItems.forEach(item=>{
        totalPrice+=(item.price*item.quantity)
    })
    foundCart.totalPrice=totalPrice;
    try {
        await foundCart.save();
    }
    catch(error){
        return next(error)
    }
}
else{
    //product is not found
    return next(new customError('product is NOT FOUND!'),404)
}
response.status(200).json({
    status:'success',
    updatedCart:foundCart
})
})
exports.applyCoupon = asynchandlerfunc(async (request, response, next) => {
    const foundCoupon = await couponModel.findOne({ name: request.body.name });
    if (!foundCoupon) {
        return next(new customError('Coupon not found', 404));
    }

    if (new Date(foundCoupon.expire) < Date.now()) {
        return next(new customError('Coupon is expired', 403));
    }

    const foundCart = await shoppingCartModel.findOne({ user: request.foundUser._id });
    if (!foundCart) {
        return next(new customError('Cart not found', 404));
    }

    const discountAmount = foundCart.totalPrice * (foundCoupon.discount / 100);
    foundCart.totalPriceAfterDiscount -= discountAmount;

    await foundCart.save();

    response.status(200).json({
        status: 'Success',
        updatedData: foundCart
    });
});