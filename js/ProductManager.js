const fs = require('fs');

class ProductManager{

    constructor(path){
        console.log("el path del archivo: "+path)
        this.path = path
        this.format = "utf-8"
    }

    camposVacios = (tittle, description, price, thumbnail, code, stock) => {
        return (
          tittle.trim().length === 0 ||
          description.trim().length === 0 ||
          price.trim().length === 0 ||
          thumbnail.trim().length === 0 ||
          code.trim().length === 0 ||
          stock.trim().length === 0
        );
      };

    async existeCode(code){

        let productos = await this.getProducts()

        if (productos.length == 0) {
            return false;
        }   

        for (let i = 0; i < productos.length; i++) {
            const p = productos[i];
            if (p.code == code) {
                return true;
            }
        }
    }

    async addProduct(tittle, description, price, thumbnail, code, stock){

        if (this.camposVacios(tittle, description, price, thumbnail, code, stock)) {
            console.log("campos invalidos")
        }
        if(await this.existeCode(code)){
            console.log("El codigo "+code+" es invalido para el producto "+tittle)
        }
        else{
            const id = await this.getNextId();
            const producto = {
                id,
                tittle,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            this.getProducts()
            .then(products => {
                products.push(producto)
                return products
            }).then(productNew => fs.promises.writeFile(this.path, JSON.stringify(productNew)))
        }
    }

    async updateProduct(id, tittle, description, price, thumbnail, code, stock){

        let productos = await this.getProducts()
        console.log("log antes del update");
        console.log(productos);

        if(this.existeCode(code)){
            return console.log("El codigo ya existe");
        }

        for (let i = 0; i < productos.length; i++) {
            const p = productos[i];

            if (p.id == id) {
                p.tittle=tittle;
                p.description=description;
                p.price=price;
                p.thumbnail=thumbnail;
                p.code=code;
                p.stock=stock;
                i=productos.length;
            } 
            
        }
        console.log("log despues del update");
        console.log(productos);
        fs.promises.writeFile(this.path, JSON.stringify(productos))
        
    }

    async deleteProduct(id){

        let productos = await this.getProducts()
        const filterProductos = await productos.filter((p) => p.id !== id)

        console.log("log antes del delete");
        console.log(productos);

        fs.promises.writeFile(this.path, JSON.stringify(filterProductos))

        console.log("log despues del delete");
        console.log(filterProductos);

    }

    getProducts = async() => {
        return fs.promises.readFile(this.path ,this.format)
        .then(content => JSON.parse(content))
        .catch(e => {
            console.log('ERROR', e)
            return []
        })
    }

    async getProductById(id){

        let productos = await this.getProducts()

        for (let i = 0; i < productos.length; i++) {
            const p = productos[i];

            if (p.id == id) {
                return p;
            } 
        }
        
        console.log("Product not found");
        
    }

    async getNextId(){

        let products = await this.getProducts();
        const count = products.length;


        if (count > 0) {
            const lastProduct = products[count-1]
            const id = lastProduct.id + 1;
            return id;
        }else{
            return 1;
        }
    }
}
module.exports = { ProductManager };