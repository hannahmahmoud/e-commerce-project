//importing pkgs
let mongoose= require('mongoose');
 
//creating a schema
let subCategorySchema= new mongoose.Schema({
    name:{
        type:String,
        minlength:[3,'The min length of name is 3 characters!, Please provide a name from 3 to 32 characters'],
        maxlength:[32,'The max length of name is 32 characters!, Please provide a name from 3 to 32 characters'],
        required: true,
        unique:true
    }, 
    slug:{
        type:String,
        lowecase:true
    },
    //identifying parnet and children relationship
    category:{
        //dah m3anh eny bakhod id alr mowgod 3ndy category model b7oto hena ba 3ndy zy masln low 
        //category asmha dress fah fe sub- category 3ndy masln beach dress, souire dress, sports dress
        //fah ana ba7ot el id bat3 el category el belong liha el sub category
        type: mongoose.Schema.ObjectId,
        //asm collection 
        ref:"Category", 
        required:[true,' A subCategory must have w parnet (category), please provide one!']
    }
}, 
{
timestamps: true,
strictPopulate:false
})

let subCategoryModel= mongoose.model('subCategory',subCategorySchema);
module.exports=subCategoryModel;