//importing pkgs
let categoryRoute= require('./categoryRoute');
let subCategoryRoute= require('./subCategoryRoute');
let brandRoute= require('./../Route/brandRoute');
let productRoute= require('./productRoute');
let authRoute = require('./authRoute');
let userRoute= require('./userRoute');
let reviewRoute= require('./reviewRoute');
let wishListRoute= require('./wishListRoute');
let addressRoute= require('./addressRoute');
let couponRoute= require('./couponRoute');
let shoppingCartRoute= require('./shoppingCartRoute')
let orderRoute= require('./orderRoute');

mountingRoute= (app)=>{
app.use('/services/categoryServices',categoryRoute);
app.use('/services/subCategoryServices',subCategoryRoute)
app.use('/services/brandServices',brandRoute);
app.use('/services/products',productRoute);
app.use('/services/users',authRoute);
app.use('/servics/users',userRoute);
app.use('/servics/reviews',reviewRoute);
app.use('/servics/wishList',wishListRoute);
app.use('/servics/users/address',addressRoute);
app.use('/servics/coupons',couponRoute);
app.use('/servics/cart',shoppingCartRoute);
app.use('/servics/order',orderRoute)

}
module.exports=mountingRoute;