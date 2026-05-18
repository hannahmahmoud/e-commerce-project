let express= require('express');
let shoppingCartModel= require('./../Model/shoppingCart');
let asynchandlerfunc= require('./../Utlis/asyncHandlerFunc');
let productModel= require('./../Model/product')
let customError= require('./../Utlis/customError');
let couponModel = require('./../Model/coupon')

let app = express();
app.use(express.json());

function calcTotal(cartItems) {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

exports.addProductTocart = asynchandlerfunc(async (request, response, next) => {
    let foundProduct = await productModel.findById(request.body.productID);
    if (!foundProduct) {
        return next(new customError('this product is NOT FOUND', 404));
    }

    const itemPrice = foundProduct.discountPrice || foundProduct.price;

    let foundCart = await shoppingCartModel.findOne({ user: request.foundUser._id });

    if (!foundCart) {
        foundCart = await shoppingCartModel.create({
            cartItems: [{
                product: request.body.productID,
                quantity: Number(request.body.quantity),
                price: itemPrice,
                color: request.body.color
            }],
            totalPrice: itemPrice * Number(request.body.quantity),
            user: request.foundUser._id
        });
    } else {
        const itemIndex = foundCart.cartItems.findIndex(item =>
            item.product.toString() === request.body.productID &&
            item.color === request.body.color
        );

        if (itemIndex > -1) {
            foundCart.cartItems[itemIndex].quantity += Number(request.body.quantity);
        } else {
            foundCart.cartItems.push({
                product: request.body.productID,
                quantity: Number(request.body.quantity),
                price: itemPrice,
                color: request.body.color,
            });
        }

        foundCart.totalPrice = calcTotal(foundCart.cartItems);

        try {
            await foundCart.save();
        } catch (error) {
            return next(error);
        }
    }

    response.status(200).json({
        status: 'Success',
        data: { foundCart }
    });
});

exports.getCart = asynchandlerfunc(async (request, response, next) => {
    let cart = await shoppingCartModel.findOne({ user: request.foundUser._id });
    if (!cart) {
        return next(new customError('cart is empty', 404));
    }
    response.status(200).json({
        status: 'Sucess',
        count: cart.cartItems.length,
        data: { data: cart }
    });
});

exports.removeSpecficProduct = asynchandlerfunc(async (request, response, next) => {
    let cart = await shoppingCartModel.findOne({ user: request.foundUser._id });
    if (!cart) return next(new customError('cart not found', 404));

    cart.cartItems = cart.cartItems.filter(
        item => item._id.toString() !== request.params.id
    );

    cart.totalPrice = calcTotal(cart.cartItems);

    try {
        await cart.save();
    } catch (error) {
        return next(error);
    }

    response.status(204).json({
        status: 'Success',
        data: null
    });
});

exports.clearCart = asynchandlerfunc(async (request, response, next) => {
    await shoppingCartModel.findOneAndDelete({ user: request.foundUser._id });
    response.status(204).json({
        status: 'Success',
        data: null
    });
});

exports.updateQuantity = asynchandlerfunc(async (request, response, next) => {
    let foundCart = await shoppingCartModel.findOne({ user: request.foundUser._id });
    if (!foundCart) {
        return next(new customError('no cart', 404));
    }

    let index = foundCart.cartItems.findIndex(item =>
        item.product.toString() === request.params.productID
    );

    if (index > -1) {
        foundCart.cartItems[index].quantity = Number(request.body.quantity);
        foundCart.totalPrice = calcTotal(foundCart.cartItems);
        try {
            await foundCart.save();
        } catch (error) {
            return next(error);
        }
    } else {
        return next(new customError('product is NOT FOUND!', 404));
    }

    response.status(200).json({
        status: 'success',
        updatedCart: foundCart
    });
});

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
    foundCart.totalPriceAfterDiscount = foundCart.totalPrice - discountAmount;

    await foundCart.save();

    response.status(200).json({
        status: 'Success',
        updatedData: foundCart
    });
});