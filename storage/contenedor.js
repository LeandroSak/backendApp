const fs = require('fs')


class Contenedor {
    constructor() {

    }
    async save(objeto) {

        try {
            let data = await fs.promises.readFile(`./storage/productos.txt`, 'utf-8')
            let produJason = JSON.parse(data)
            const ultimo = produJason[produJason.length - 1]
            produJason.push({ title: objeto.title, price: objeto.price, id: ultimo.id + 1, url: objeto.url })
            await fs.promises.writeFile("./storage/productos.txt", JSON.stringify(produJason, null, 2))
            return ultimo.id + 1
        } catch {
            console.error(error)
        }
    }

    async getById(id) {
        try {
            let data = await fs.promises.readFile(`./storage/productos.txt`, 'utf-8')
            let produJason = JSON.parse(data)
            let product = produJason.find((element) => element.id == id)
            if (product) {
                return product
            } else {
                return null
            }
        } catch {
            console.error(error)
        }
    }
    async getAll() {
        let file = await fs.promises.readFile(`./storage/productos.txt`, 'utf-8')
            .then(data => {
                let jsonData = JSON.parse(data)
                return jsonData
            })
            .catch(error => console.log(error))
        return file
    }

    async deleteById(id) {
        try {
            let data = await fs.promises.readFile(`./storage/productos.txt`, 'utf-8')
            let produJason = JSON.parse(data)
            let product = produJason.find((element) => element.id == id)
            if (product) {
                produJason.splice(produJason.findIndex((element) => element.id == product.id), 1)
                await fs.promises.writeFile("./storage/productos.txt", JSON.stringify(produJason, null, 2))
                return id
            } else {
                return null
            }

        } catch {
            console.error(error)
        }
    }

    async putById(id, prop) {
        try {
            let data = await fs.promises.readFile(`./storage/productos.txt`, 'utf-8')
            data = JSON.parse(data)
            let product = data.find((element) => element.id == id)
            if (product) {
                product = {
                    ...product,
                    ...prop
                }
                data = data.map(prod => {
                    if (prod.id == product.id) {
                        prod = product
                    }
                    return prod
                })
                data = JSON.stringify(data, null, 2)
                await fs.promises.writeFile(`./storage/productos.txt`, data)
                return product
            } else {
                return null
            }
        } catch (error) {
            console.error(error)
        }
    }

    deletAll() {
        fs.readFile("./storage/productos.txt", "utf-8", (error, data) => {
            if (error) {
                throw new Error(error)
            } else {
                let produJason = []
                fs.writeFile("./storage/productos.txt", JSON.stringify(produJason, null, 2), error => {
                    if (error) {
                        throw new Error(error)
                    } else {
                        console.log("listo productos eliminados")
                    }
                })
            }
        })
    }
}

module.exports = Contenedor