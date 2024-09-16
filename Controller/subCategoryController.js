//importing pkgs
let express= require('express');
let subCategoryModel= require('./../Model/subCategory');
let apiFeatures= require('./../Utlis/apiFeatures');
let asyncErrorHandler= require('./../Utlis/asyncHandlerFunc');
let slugify= require('slugify');
let categoryModel= require('./../Model/category')
let customError= require('./../Utlis/customError')



let app= express();

//using this middleware to enable to read the request body
app.use(express.json());



exports.getAllSubCategories=asyncErrorHandler(async(request, response, next)=>{
   
    
    apiFeature= new apiFeatures(subCategoryModel.find(),request.query)
    .pagination().populate('category','name');

    let allSubCategories= await apiFeature.query;
    response.status(200).json({
       status:"Sucess",
       count:allSubCategories.length,
       data: {
           category:allSubCategories
       }

    })
})

exports.getAllSubCategoriesforSpecficCategory=asyncErrorHandler(async(request, response, next)=>{
    

    let foundSubCategories= await subCategoryModel.find({category: request.params.categoryId});
    if (!foundSubCategories)
    {
        let error= new customError('This is invalid Category ID');
        next(error);
    }
    response.status(200).json({
        status:'Success',
        count:foundSubCategories.length,
        subCategories: {
            foundSubCategories
        }
    })
})

exports.deleteSubCategory=asyncErrorHandler(async(request, response, next)=>{

    let deleteSubCategory= await subCategoryModel.findByIdAndDelete(request.params.id);
    response.status(204).json({
        status: 'Success',
        data: null
    })
})


exports.getSubCategory=asyncErrorHandler(async(request, response, next)=>{
    let foundSubCategory= await subCategoryModel.findById(request.params.id);
    let category=await categoryModel.findById(foundSubCategory.category);
    if (!foundSubCategory)
    {
        let error =new Error('this id is not found!')
        next(error);
    }
    response.status(200).json({
        status:"Success",
        data:{
            Subcategory: foundSubCategory,
            categoryName:category.name

        }
    })





})
exports.setCategoryIDToBody=(request, response, next)=>{
    
    if (!request.body.category)
    {
        if (request.params.categoryId)
            request.body.category= request.params.categoryId;
        else 
        {
            let error= new customError('No category is given!')
            next(error);
        }
    }
    next();

}

//POST / new subCategory
exports.createNewSubCategory= asyncErrorHandler(async(request, response, next)=>{

  
    let newCategory= await subCategoryModel.create({
        name:request.body.name, 
        slug: slugify(request.body.name),
        category: request.body.category
    });
    response.status(201).json({
        status:'Success',
        newCategory: newCategory
    })

})
