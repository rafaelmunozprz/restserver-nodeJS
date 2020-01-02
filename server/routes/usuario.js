const express = require('express');
/**
 * @param bcrypt dependencia para poder encriptar la contraseña
 */
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', (req, res)=>{
    res.json('get Usuario')
})

app.post('/usuario', (req, res)=>{
    let body = req.body;
    let usuario = new Usuario({
        "nombre": body.nombre,
        "email": body.email,
        "password": bcrypt.hashSync(body.password, 10),
        "role": body.role
    });
    usuario.save((err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //La constraseña del usuario ya ha sido grabada, pero en la respuesta no es necesario mostrarla
        usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})

app.put('/usuario/:id', (req, res)=>{
    let id = req.params.id;
    res.json({
        id
    })
})

app.delete('/usuario', (req, res)=>{
    res.json('delete Usuario')
})

module.exports = app ;