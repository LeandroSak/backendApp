const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IoServer } = require('socket.io');
const mongoConnect = require ('./database/mongoDB/connect')
const {getStoreConfig} = require('./src/session-config')
const indexRoutes = require('./src/routes/index-routes')
const logger = require("./src/logger/logger.js")

require('dotenv').config();

const cont = require("./storage/contenedor")
const contenedor = new cont()

const mess = require("./storage/messages")
const messa = new mess()

const app = express();
const http = new HttpServer(app)
const io = new IoServer(http)

const compression = require("compression");
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))
app.set('view engine', 'ejs');
mongoConnect();

const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(session({
    store: MongoStore.create(getStoreConfig()),
    secret: 'secreto',
    cookie:{
        maxAge: 10 * 60 * 1000
    }   ,
    resave: true,
    saveUninitialized: true
}))

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./database/mongoDB/models/user-model')
const md5 = require('md5')

passport.use('login', new LocalStrategy(async (username, password, done) =>{
    const userData = await UserModel.findOne({username,password:md5(password)});
    if(!userData){
        return done(null,false);
    }
    done(null, userData);
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done)=>{
    const userData = await UserModel.findOne({username});
    if(userData){
        return done(null,false);
    }
    const stageUser = new UserModel({
        username,
        password:md5(password)
    });
    const newUser = await stageUser.save();
    done(null,newUser);
}));

passport.serializeUser((user,done)=>{
    done(null,user._id);
});

passport.deserializeUser(async(id,done) =>{
    const userData = await UserModel.findById(id);
    done(null,userData);
});

app.use(passport.initialize());
app.use(passport.session());



app.use(indexRoutes);


io.on('connection', async (socket) => {
    const products = await contenedor.getAll();
    const messages = await messa.getAll();
    logger.log("info", "Nuevo cliente conectado")
    socket.emit('UPDATE_MESSAGE_DATA', messages)
    socket.emit('UPDATE_PRODUCTS_DATA', products)
    socket.on('NEW_MESSAGE_TO_SERVER', async data => {
        await messa.save(data)
        io.sockets.emit('NEW_MESSAGE_FROM_SERVER', data);
    })
    socket.on('NEW_PRODUCT_TO_SERVER', async data => {
        await contenedor.save(data)
        io.sockets.emit('NEW_PRODUCT_FROM_SERVER', data);
    })

})

module.exports = http;