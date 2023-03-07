const socket = io();
let products = [];
let messages = [];

function sendNewMessage(){
    const texto = document.querySelector('#message').value;
    const email = document.querySelector('#userEmail').value;
    const nombre = document.querySelector('#nombre').value;
    const apellido = document.querySelector('#apellido').value;
    const edad = document.querySelector('#edad').value;
    const alias = document.querySelector('#alias').value;
    const time = new Date().toLocaleString();
    if(!message || !userEmail){
        return
    }
    const messageObject = {
        nombre,
        apellido,
        email,
        edad,
        alias,
        texto,
        time
    }
    socket.emit('NEW_MESSAGE_TO_SERVER', messageObject)
    document.querySelector('#message').value = '';
}

function updateMessage(data) {
    let messageToHtml = '';
    const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
    const schemaMensaje = new normalizr.schema.Entity('mensajes', {
        mensajes: [{
            author: schemaAuthor,
        }]
    })
    const entitiess = data.entities;
    const deNormData = normalizr.denormalize(data.result, schemaMensaje, entitiess)
    deNormData.mensajes.forEach(element => {
        messageToHtml = messageToHtml + `<li ><strong>${element.author.email}</strong>, <font color="brown">[${element.time}]</font> : <font id="texto">${element.text}</font> </li>`
    })
    document.querySelector('#messageList').innerHTML = messageToHtml;
}



socket.on('UPDATE_MESSAGE_DATA', (data) =>{
    messages = data;
  
    updateMessage(data)
   
});


socket.on('NEW_MESSAGE_FROM_SERVER', (data) =>{
    updateMessage(messages)
});

socket.on('NEW_PRODUCT_FROM_SERVER', (data) =>{
    products.push(data);
    
});

