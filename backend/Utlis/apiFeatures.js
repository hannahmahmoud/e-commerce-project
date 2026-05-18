class apiFeatures{
  
  
    constructor(query, querystr){
        //query is the model.find() to retrive the data from the model
        //querystr os request.query
        this.query=query;
        this.querystr=querystr;
    }
    filter(){
        this.querystr=JSON.stringify(this.querystr);
        let requirments= this.querystr.replace(/\b(gte|gt|lte|lt,ne)\b/g,replacemnt=>'$'+replacemnt);
        requirments=JSON.parse(requirments);
        if (requirments.page)
            delete requirments.page;
        if (requirments.limit)
            delete requirments.limit;
        if (requirments.sort)
            delete requirments.sort;
        if (requirments.fields)
            delete requirments.fields
       
         this.query= this.query.find(requirments);
         return this;


    }
    pagination( ){
        let page=this.querystr.page*1||1;
        let limit= this.querystr.limit*1||10;
        let skip= (page-1)*limit;
        this.query= this.query.skip(skip).limit(limit);
        return this;

    }
   

    sort(){
             //el object el begli bekon string fah lazm a7wlo
            this.querystr=JSON.parse(this.querystr);
        if(this.querystr.sort){
            // fe url begli masln ?sort=rating,price bs el sort func m7ataga tkon kda rating  price
            // fah 3mlt split leh string eno ykon array b3dan 3malto join bs beh space el ana 3izaha
            const sortBy = this.querystr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else{
            this.query = this.query.sort('rating');
        }

        return this;
    }

    fields(){
        if (this.querystr.fields)
        {  
            let limitedFields=this.querystr.fields.split(',').join(' ');
            this.query=this.query.select(limitedFields);

        }
        else 
        this.query=this.query.select("-__v")
    return this;
        }

 populate(path, selection){
    this.query=this.query.populate({
    path:path,
    select: selection
    })
    return this;
 }

}
module.exports=apiFeatures