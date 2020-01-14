const express = require('express');
/**
 * @param _unscr DEpendencia de underscore para poder utilizar validaciones multiples
 */
const _unscr = require('underscore');
/**
 * @param verificaToken proceso para determinar que el token enviado en los headers sea válido
 */
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
/**
 * @param Producto esquema de base de datos Mongoose
 */
let Producto = require('../models/producto');
/**
 * OBTENER TODOS LOS PRODUCTOS
 */
app.get('/productos', verificaToken, (req, res) => {
    //Trae todo los productos
    //populate: debe de cargar la info del usuario y la categoria
    //paginado
    Producto.find({disponible: true})
        .sort('precio')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error interno del servidor al cargar todas las categorias'
                    }
                })
            }
            res.json({
                ok: true,
                productos
            })
        });
});

/**
 * OBTENER UN PRODUCTO POR ID
 */
app.get('/productos/:id', verificaToken, (req, res) => {
    //Populate usuario y categoria
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error interno del servidor al buscar un producto por ID'
                }
            })
        }
        if (!productoDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error, este producto no existe'
                    }
                })
            }
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');
});

/**
 * CREAR UN PRODUCTO
 */
app.post('/productos', verificaToken, (req, res) => {
    //grabar el id de la categoria
    //grabar el id del usuario
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error interno del servidor, al crear producto'
                }
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al guardar un nuevo producto'
                }
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

/**
 * ACTUALIZAR UN PRODUCTO
 */
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria
    let id = req.params.id;
    let body = _unscr.pick(req.body, ['nombre', 'precio', 'descripcion', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error interno al actualizar producto'
                }
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado en la base de datos'
                }
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    });
})

/**
 * ELIMINAR UN PRODUCTO
 */
app.delete('/productos/:id', verificaToken, (req, res) => {
    //Cambiar el estado a falso
    let id = req.params.id;
    let cambioDisponible = {
        disponible: false
    }
    Producto.findOneAndUpdate(id, cambioDisponible, {new: true, useFindAndModify: true}, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Erro interno al eliminar producto por ID'
                }
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: 'Este producto no se encuentra en la base de datos'
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

module.exports = app;