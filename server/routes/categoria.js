const express = require('express');

let {verificaToken} = require('../middlewares/autenticacion');

let app = express();

let Catergoria = require('../models/categoria');

/**
 * GET TODAS LAS CATEGORIAS
 */
app.get('/categoria', (req,res)=>{

});

/**
 * GET SOLO UN ID
 */
app.get('/categoria/:id', (req, res)=>{
    Catergoria.findById();
});

/**
 * POST: CREAR CATERGORIA
 */
app.post('/categoria', (req,res)=>{
    //regresa lan ueva categoria
    //req.usuario.id -> el id del usuario que creo la categoria

});

/**
 * PUT: Actualizar datos de la categoria
 */
app.put('/categoria/:id', (req,res)=>{
    //

});

/**
 * DELETE: Solo permitido por un ADMIN-ROLE
 * ELIMINAR REGISTRO
 */
app.delete('/categoria/:id', (req,res)=>{

});

module.exports = app;