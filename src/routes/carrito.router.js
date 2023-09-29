import { Router } from 'express';
import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/productos.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find();
        res.send({ result: 'success', payload: carts });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const product = req.body;
    const productToAdd = {
        totalItems: Number,
        totalPrice: Number,
        products: []
    };

    if (!product) {
        return res.send({ status: "error", error: "valores incompletos" });
    }

    const cart = await cartModel.updateOne({ _id: cid }, productToAdd);
    res.send({ status: "success", payload: cart });
});

router.post("/", async (req, res) => {
    const product = req.body;
    const productToAdd = {
        totalItems: 1,
        totalPrice: 1,
        products: product
    };

    if (!product) {
        return res.send({ status: "error", error: req.body });
    }

    const cart = await cartModel.create(productToAdd);
    res.send({ status: "success", payload: cart });
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const { pid } = req.params;

    try {
        const product = await productModel.findOne({ _id: pid });

        if (!product) {
            return res.send({ status: "error", error: "Producto no encontrado" });
        }

        const productToAdd = {
            totalItems: 1,
            totalPrice: 1,
            products: [product]
        };

        const cart = await cartModel.updateOne({ _id: cid }, productToAdd);
        res.send({ status: "success", payload: cart });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.delete('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.deleteOne({ _id: cid });
        res.send({ status: "success", payload: cart });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.delete("/carts/:cid/products/:pid", async (req, res) => {
    const { pid, cid } = req.params;

    try {
        const result = await productModel.deleteOne({ _id: pid, products: pid });
        res.send({ status: "success", payload: result });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

export default router;
