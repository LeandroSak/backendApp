const getMongoConfig = () => {
    return {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}

const getStoreConfig = () =>{
    const MONGO_URI = "mongodb+srv://admin:T4dFkHXFQi4khLef@proyectoecommerce.tndeuz1.mongodb.net/session?retryWrites=true&w=majority";
    return {
        mongoUrl : MONGO_URI,
        mongoOptions : getMongoConfig()
    }
};

module.exports = {
    getMongoConfig,
    getStoreConfig
}