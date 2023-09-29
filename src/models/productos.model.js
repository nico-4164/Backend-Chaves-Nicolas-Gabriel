import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products';

const productSchema =  new mongoose.Schema({
    "tittle": {type: String,index: true},
    "description":String,
    "code":String,
    "price": Number,
    "status": Boolean,
    "stock": Number,
    "category":String
})

productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productsCollection,productSchema);
