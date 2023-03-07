const mongoose = require('mongoose');
const {getMongoConfig} = require('./../../src/session-config')
const logger = require("../../src/logger/logger.js")

const connectionMongo = async () => {
    const MONGO_URI = "mongodb+srv://admin:T4dFkHXFQi4khLef@proyectoecommerce.tndeuz1.mongodb.net/entregable?retryWrites=true&w=majority";
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, getMongoConfig()).then(()=>{
        logger.log("info", "Conectado a Mongo")
    }).catch(err=>{
        logger.log("error", err.message)
        process.exit();
    });
    
}

module.exports = connectionMongo;