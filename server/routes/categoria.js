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
    Categoria.find({})
        //Sort nos permite ordenar la salida
        .sort('descripcion')
        //pupolate nos permite mostrar la informacion de los objectID (ESQUEMA) que se encuentren dentro del find
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return err.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error interno del servidor'
                    }
                })
            }
            res.json({
                ok: true,
                categorias
            });
        });
});

/**
 * GET SOLO UN ID
 */
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error interno al cargar categoria por ID'
                }
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada por ID'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
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
            ok: true,
            categoria: categoriaDB
        })
    });

});

/**
 * PUT: Actualizar datos de la categoria
 */
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error interno del servidor'
                }
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encotrada'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

/**
 * DELETE: Solo permitido por un ADMIN-ROLE
 * ELIMINAR REGISTRO
 */
app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    Categoria.findOneAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error interno del servidor'
                }
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    })
});

module.exports = app;