// importing pkges
let app= require('./../App/app');
let mongoose= require('mongoose');
let dotenv= require('dotenv');
dotenv.config({path:'config.env'});



//connecting the db
mongoose.connect("mongodb://localhost:27017/E-commerenceDatebase"
).then ((connection)=>{
   //console.log(connection);
   console.log("Successful connection to mongoDB")
}).catch((err)=>{
   console.log("connection error: "+err);
});


// creating a server
//let port =process.env.port;
app.listen(4000,()=>{
    console.log("Server is connected ");

})
