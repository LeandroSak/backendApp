const {faker} = require('@faker-js/faker');

class randomFaker {
    constructor(){}

    getRandomMock(){
        let cant = 5;
        const responseArray = [];
        for (let i = 0; i<cant; i++){
            responseArray.push({
                nombre:faker.commerce.productName(),
                precio:faker.commerce.price(),
                url:faker.image.business()
            });
        }
        return responseArray;
    }
}

module.exports =  randomFaker;