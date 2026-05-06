// importing pkges
const express= require('express');
const morgan= require('morgan');
const globalMiddleware=require('../Controller/GlobalMiddlewareErrorHandler');
const mountingRoute= require('./../Route/index')
const limiter= require('./../Security/rateLimit');
const hpp= require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
//const xss = require('xss-clean');
const helmet= require('helmet');




let app= express();

app.use(helmet());
// Apply the rate limiting middleware to all requests.
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
//using middleware func
// to enable the request body
app.use(express.json({limit:'20kb'}))
// To remove data using these defaults:
//app.use(mongoSanitize());
// to enable the morgan 
app.use(morgan('dev'));
//rate limitng middleware
app.use('/services',limiter)
//hpp middlware
//app.use(hpp());
// make sure this comes before any routes
//app.use(xss())
// Routes
mountingRoute(app);


//app.all('/:path*', (request, response, next) => {
 //   let error = new Error('This Page is not found!');
  //  next(error);
//})

//using global middleware error handler func
app.use(globalMiddleware);

 
module.exports= app;
