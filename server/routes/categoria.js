const express = require('express');

let { verificaToken, verificaRol } = require('../middlewares/autenticacion');

let app = express();

const _unscr = require('underscore');

let Categoria = require('../models/categoria');

/**
 * GET: MOSTRARS TODAS LAS CATEGORIAS
 * ====================================
 * ES NECESARIO ESTAR HACER LOG IN
 * ====================================
 */
app.get('/categoria', verificaToken, (req, res) => {

});

/**
 * GET SOLO UN ID
 */
app.get('/categoria/:id', verificaToken, (req, res) => {
    Catergoria.findById();
});

/**
 * POST: CREAR CATERGORIA
 */
app.post('/categoria', verificaToken, (req, res) => {
    //regresa lan ueva categoria
    //req.usuario.id -> el id del usuario que creo la categoria
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            //ERROR 500 - ERRRO INTERNO DEL SERVIDOR
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear la cetegoria'
                }
            });
        }
        res.json({
            ok: false,
            categoria: categoriaDB
        })
    });

});

/**
 * PUT: Actualizar datos de la categoria
 */
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _unscr.pick(req.body, ['descripcion']);
    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, { descCategoria }, {new: true, runValidators: true});
});

/**
 * DELETE: Solo permitido por un ADMIN-ROLE
 * ELIMINAR REGISTRO
 */
app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {

});

module.exports = app;