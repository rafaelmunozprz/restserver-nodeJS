/**
 * @param express variable de la dependencia express
 */
const express = require('express');

/**
 * @param bcrypt variable para la dependencia bcrypt (usada para la encruptación de información)
 */
const bcrypt = require('bcrypt');

/**
 * @param jwt variable con la dependencia de jsonwebtoken para encriptar la url
 */
const jwt = require('jsonwebtoken');

/**
 * Funcion para verificar el cliente con Google
 * @param client variable de entorno para verificar el token cuando es ingresado con Google
 */
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


/**
 * @param Usuario variable del modelo de base de datos para el Usuario
 */
const Usuario = require('../models/usuario');

/**
 * @param app variable que contiene las funcionalidades de la dependencia "express"
 */
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrecta"
                }
            })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrecta"
                }
            })
        }
        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })
});

/**
 * Configuraciones de Google
 * LAS FUNCIONES ASYNC SIEMPRE DEBEN DE REGRESAR UNA PROMESA
 */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
/**
 * ============================================
 * ============================================
 * PARA PODER TRABAJAR CON UNA FUNCION
 * ASINCRONA SE DEBE DE ESPERAR LA FUNCION 
 * ASYNC.
 * PARA PODER TRABAJAR LA RESPUESTA SE DEBE 
 * USAR AWAIT PARA ESPERAR LA RESPUESTA
 * ============================================
 * ============================================
 */
app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    //Se ejecuta la funcion verificar, para determinar el si el token es válido
    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (usuarioDB) {
            //EN CASO DE QUE YA SE HAYA EUTENTICADO CON CREDENCIALES NORMALES
            if (usuarioDB === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            } else { //EN CASO DE QUE NUNCA SE HAYA REGISTRADO CON CREDENCIALES NORMALES, CREAR USUARIO DE BASE DE DATOS CON STATUS GOOGLE VERDADERO
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        }else{
            //SI EL USUARIO NO EXISTE EN NUESTRA BASE DE DATOS
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});

module.exports = app;
