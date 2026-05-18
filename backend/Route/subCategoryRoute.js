//importing pkgs
let express= require('express');
let subCategoryController= require ('./../Controller/subCategoryController');
let subCategoryValidator= require('../Validators/subCategoryValidator');

 let subCategoryRouter= express.Router({mergeParams:true});
 
 

 subCategoryRouter.route('/').post
 (subCategoryController.setCategoryIDToBody,subCategoryValidator.createValidator, 
   subCategoryController.createNewSubCategory)
 .get(subCategoryController.getAllSubCategories);

 subCategoryRouter.route('/specific')
    .get(subCategoryController.getAllSubCategoriesforSpecficCategory);


 subCategoryRouter.route('/:id')
 .get(subCategoryValidator.getIDValidator,subCategoryController.getSubCategory)
 .delete(subCategoryValidator.deleteValidator,subCategoryController.deleteSubCategory)
 



module.exports=subCategoryRouter;

