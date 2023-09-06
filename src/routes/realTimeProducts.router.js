import {ProductManager} from '../public/js/ProductManager.js';
import express from 'express'

const router = express.Router();
const productManager= new ProductManager("./src/public/archivos/productos.json");

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts',{products})
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
})


export default router;