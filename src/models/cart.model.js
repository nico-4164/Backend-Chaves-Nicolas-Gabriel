import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = 'cart';

const carttSchema =  new mongoose.Schema({
    "productsQuantity":Number,
    "productsPrice":Number,
    "products": [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: {
          type: Number
        }
      }]
})

carttSchema.plugin(mongoosePaginate);
export const cartModel = mongoose.model(cartCollection,carttSchema);
