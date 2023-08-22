const express = require("express");
const bodyParser = require("body-parser");

const { ProductManager } = require("../js/ProductManager.js");

const productManager = new ProductManager("archivos/productos.json");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/product', (req, res) => {
    res.send("Hola a todos, pero ahora desde express");
});

app.get('/products', async (req, res) => {
    let productLimit = req.query.limit;
    console.log(productLimit);
    let list = [];
    
    try {
        const productos = await productManager.getProducts();
        
        if (!productLimit || productLimit >= productos.length) {
            console.log("entró en el if");
            console.log(productos);
            res.send({ productos });
        } else {
            for (let i = 0; i < productLimit; i++) {
                const element = productos[i];
                list.push(element);
            }
            console.log(list);
            res.send({ productos: list });
        }
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;

        const productos = await productManager.getProducts();

        if (!pid) {
            console.log("entró en el if");
            res.send({ productos });
        } else {
            let produto = productos.find(p => p.id === parseInt(pid, 10));

            if (!produto) return res.send({ error: "el producto no existe" });

            res.send(produto);
        }
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});


app.listen(8080, () => console.log("Servidor arriba en el puerto 8080"));
