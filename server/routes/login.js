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
})

module.exports = app;
