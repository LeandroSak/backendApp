const express = require('express');
const passport = require('passport');

const router = express.Router();

const logger = require("../../logger/logger.js")

router.get('/signin', async (req, res) => {
    if(req.isAuthenticated()){
        logger.log("info", "Usuario conectado");
        return res.redirect('/');
    }
    res.render('pages/signin');
})
router.post('/signinn', passport.authenticate('login', {failureRedirect: '/errorsignin'}), async (req, res) => {
    logger.log("info", "Usuario conectado");
    res.redirect('/')   
})

router.get('/logout', async (req, res,) => {
    try {
        const name = req.user.username
        req.logout(err => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                })
            }
            logger.log("info", "Usuario desconectado");
            res.render('pages/logout', { name: name })
        });
    } catch (error) {
        logger.log("error", error.message);
        res.status(400).json({
            response: "error",
            error: error.message
            
        })
    }
})

router.get('/signup', async (req, res) => {
    if(req.isAuthenticated()){
        logger.log("info", "Usuario conectado");
        return res.redirect('/');
    }
    res.render('pages/signup');
})

router.post('/signupp', passport.authenticate('signup',{failureRedirect: '/errorsignup'}),async (_req,res)=>{
    logger.log("info", "Usuario registrado");
    res.redirect('/')
})

router.get('/errorsignin', async (_req, res) =>{
    logger.log("warn", "Error al iniciar sesion");
    res.render('pages/error', {message: "User Error SignIn"});
})

router.get('/errorsignup', async (_req, res) =>{
    logger.log("warn", "Error al registrarse");
    res.render('pages/error', {message: "User Error SignUp"});
})


module.exports = router;