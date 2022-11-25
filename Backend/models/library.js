const mongoose = require("mongoose");

const schema=mongoose.Schema
const librarySchema=new schema({
    title:{
        type:String,
    required:true
},
author:{
    type:String,
    required:true
},
publication:{
    type:String,
    required:true
},
noPages:{
    type:String,
    required:true
}

})
let libraryData=mongoose.model('bookDetail',librarySchema)
module.exports=libraryData