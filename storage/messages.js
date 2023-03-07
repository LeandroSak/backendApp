const fs = require('fs')
const { schema, normalize } = require('normalizr');


class Message {
    constructor() {

    }
    async save(objeto) {

        try {
            let data = await fs.promises.readFile(`./storage/mensajes.json`)
            let messageJason = JSON.parse(data)
            messageJason.mensajes.push({
                author: {
                    email: objeto.email,
                    nombre: objeto.nombre,
                    apellido: objeto.apellido,
                    edad: objeto.edad,
                    alias: objeto.alias,
                    
                },
                time: objeto.time,
                text: objeto.texto
            })
            await fs.promises.writeFile("./storage/mensajes.json", JSON.stringify(messageJason, null, 2))
            return
        } catch {
            console.error(error)
        }
    }

    async getAll() {
        try {
            const data = await fs.promises.readFile(`./storage/mensajes.json`)
            let dataMensajes = JSON.parse(data)
            const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });
            const schemaMensaje = new schema.Entity('mensajes', {
                mensajes: 
                    [{author:schemaAuthor}]
            })
            const dataNorm = normalize(dataMensajes, schemaMensaje);
            return dataNorm
        } catch (error) {
            console.error(error)
        }
    }

}

module.exports = Message