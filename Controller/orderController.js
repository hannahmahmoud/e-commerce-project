let express= require('express');
let stripe= require('stripe')('sk_test_51PzPRJP5n2sLonwyLK7qmsudQInr4PrWTFVOAAGPB3Tr3F8lujeFUhSYeagY09hTjb05FgfkWqiNI1hkb0WhEGK900ejqWAX8W')
let asyncHandler= require('./../Utlis/asyncHandlerFunc');
let customError= require('./../Utlis/customError');
let orderModel= require('./../Model/order');
let shoppingCartModel= require('./../Model/shoppingCart');
let productModel = require('./../Model/product')
let apiFeatures= require('./../Utlis/apiFeatures')

let app=express();
//access request body
app.use(express.json());

//desc: create a order using cash as payement method
//routr:Post /order/:cartID
//access: protectedRoute +users

exports.createCashOrder= asyncHandler(async (request, response, next)=>{
    let totalPrice;
    //1- get the cart using the CartID
    let foundCart= await shoppingCartModel.findById(request.params.cartID);
    if (!foundCart)
        return next(new customError('cart is NOT FOUND',404))
    console.log(foundCart);
    //2-get totalprice and check if there is a coupon
    if(foundCart.totalPriceAfterDiscount)
      totalPrice=  foundCart.totalPriceAfterDiscount+ request.body.shippingPrice+request.body.taxPrice;  
    else
    totalPrice= foundCart.totalPrice+ request.body.shippingPrice+request.body.taxPrice; 

    //3- create an order
    let newOrder= await orderModel.create({
        user:request.foundUser._id,
        cartItems:foundCart.cartItems,
        totalPrice:totalPrice,
        shippingPrice:request.body.shippingPrice,
        taxPrice: request.body.taxPrice

    });
    if (!newOrder)
        return next(new customError('order is not created',400))
    //4- update quantity and sold in product model khali balek product is an array
    let bulkOperations = foundCart.cartItems.map(item => ({
        updateOne: { 
            filter: { _id: item.product },
            update: { 
                $inc: {
                    quantity: -item.quantity,
                    quantityOfSoldProduct: +item.quantity
                }
            }
        }}))
     await productModel.bulkWrite(bulkOperations,{})
    
 
//5- clear the cart based on cartId
await shoppingCartModel.findByIdAndDelete(request.params.cartID);

//send response to frontend
response.status(200).json({
    status:'Success',
    order:newOrder
})
})

//desc: get all orders
//routr:Post /order/:cartID
//access: protectedRoute +admin
exports.getAllorders= asyncHandler(async (request, response, next)=>{
    let apiFeature= new apiFeatures(orderModel.find(), request.query).
    filter()
    .sort()
    .pagination()
    .fields();
    let allOrders= await apiFeature.query;
    
    response.status(200).json({
        status:'success',
        orders:allOrders
    })
})

//desc: get user orders
//routr:Post /order/:cartID
//access: protectedRoute +user

exports.getOrder=asyncHandler(async (request, response, next)=>{
    let foundOrders= await orderModel.findOne({user:request.foundUser._id});
    if (!foundOrders)
        return next(new customError('no orders are found',404));
    response.status(200).json({
        status:'success',
        orders:foundOrders
    })
})
//desc: update order is paid 
//routr:Post /order/isPaid/:orderId
//access: protectedRoute +admin
exports.updateOrderIsPaid= asyncHandler(async(request, response, next)=>{
    let updatedOrder= await orderModel.findByIdAndUpdate(request.params.orderId,{
        isPaid:true,
        paidAt:Date.now()
    }, {new:true,
        runValidators:true
    })
    if (!updatedOrder)
        return next(new customError('order NOT FOUND'),404);
    response.status(200).json({
        status:'success',
        updatedOrder:updatedOrder
    })

})

//desc: update order is deleveried  
//routr:Post /order/isDelivered/:orderId
//access: protectedRoute +admin
exports.updateOrderIsDelivered= asyncHandler(async(request, response, next)=>{
    let updatedOrder= await orderModel.findByIdAndUpdate(request.params.orderId,{
        isDelivered:true,
        deliveredAt:Date.now()
    }, {new:true,
        runValidators:true
    })
    if(!updatedOrder)
    return next(new customError('order NOT FOUND'),404);
    response.status(200).json({
        status:'success',
        updatedOrder:updatedOrder
    })

})


//desc: create a checkout-session to send total price foe the user 
//routr:Post /order/checkout-session/:cartID
//access: protectedRoute +user

exports.checkoutSession= asyncHandler(async (request, response, next)=>{
    //1- get the total price of the cart 
    let totalPrice;
    let foundCart= await shoppingCartModel.findById(request.params.cartID);
    if (!foundCart)
        return next(new customError('cart is NOT FOUND',404))
    console.log(foundCart);
    //  -get totalprice and check if there is a coupon
    if(foundCart.totalPriceAfterDiscount)
      totalPrice=  foundCart.totalPriceAfterDiscount
    else
    totalPrice= foundCart.totalPrice 

    //2- create chechout-session

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price_data: {
                currency: 'egp', // Ensure this is a valid currency code for your Stripe account
                product_data: {
                    name: request.foundUser.name, // Replace with actual product name
                },
                unit_amount: totalPrice * 100, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
         success_url:request.protocol+'://'+request.get('host')+'/services/order/',
         cancel_url : request.protocol+'://'+request.get('host')+'/services/cart',
        customer_email:request.foundUser.email,
        client_reference_id: request.params.cartId
      });
    //sends back a response
      response.status(200).json({
        status:200,
        session:session
      })
    });

