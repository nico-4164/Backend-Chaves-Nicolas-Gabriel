import mongoose from "mongoose";
import { productModel } from "./src/models/productos.model.js";
import { Long } from "mongodb";

const enviromente = async()=>{
    await mongoose.connect('mongodb+srv://nicolaschaves1991:iYm9g3zcwk40HyyF@coderhousebackend.uunghaj.mongodb.net/?retryWrites=true&w=majority')
    let productos = await productModel.aggregate([
      {
        //stage 1 los ordeno por categoria pc
        $match:{category:"PC"}
      },
      {
        //stage 2,
        $sort: {price: -1}
      },
      {
        $group: {_id: "$tittle", stockTotal:{$sum:"$stock"}} 
      }
    ])

    console.log(productos);
}

enviromente();