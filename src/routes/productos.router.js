import { Router } from 'express';
import { productModel } from '../models/productos.model.js';
import express from 'express'

const router = Router();

router.get('/', async (req, res) => {
    let { price, limit } = req.query;

    limit = parseInt(limit) || 10;
    price = parseInt(price) || 1;

    try {
        const products = await productModel.aggregate([
            { $limit: limit },
            { $sort: { price: price } }
        ]);
        res.render('products',{products})
        //res.send({ result: 'success', payload: products });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.get('/category/:query', async (req, res) => {
    let query = req.params.query;
    let { price, limit } = req.query;

    limit = parseInt(limit) || 10;
    price = parseInt(price) || 1;

    try {
        const products = await productModel.aggregate([
            { $match: { category: query } },
            { $limit: limit },
            { $sort: { price: price } }
        ]);

        res.send({ result: 'success', payload: products });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.get('/:page', async (req, res) => {
    let page = parseInt(req.params.page);

    try {
        const products = await productModel.paginate({}, { page, limit: 5, lean: true });

        products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/productos/page=${products.prevPage}` : "";
        products.nextPage = products.hasNextPage ? `http://localhost:8080/api/productos/page=${products.nextPage}` : "";
        products.isValid = !(page <= 0 || page > products.totalPages);

        res.send({ result: 'success', payload: products });
    } catch (error) {
        console.log("No se pudo conectar a mongoose: " + error);
    }
});

router.post("/", async (req, res) => {
    const { tittle, description, code, price, status, stock, category } = req.body;

    if (!tittle || !description || !code || !price || !status || !stock || !category) {
        return res.send({ status: "error", error: req.body });
    }

    const result = await productModel.create({ tittle, description, code, status, stock, category });
    res.send({ status: "success", payload: result });
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const productToReplace = req.body;

    if (!productToReplace.tittle || !productToReplace.description || !productToReplace.code || !productToReplace.price || !productToReplace.stock || !productToReplace.category) {
        return res.send({ status: "error", error: "valores incompletos" });
    }

    const result = await productModel.updateOne({ _id: pid }, productToReplace);
    res.send({ status: "success", payload: result });
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    const result = await productModel.deleteOne({ _id: pid });
    res.send({ status: "success", payload: result });
});

export default router;
