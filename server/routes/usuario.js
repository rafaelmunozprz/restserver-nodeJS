const express = require('express');
/**
 * @param bcrypt dependencia para poder encriptar la contraseña
 */
const bcrypt = require('bcrypt');
/**
 * @param _unscr DEpendencia de underscore para poder utilizar validaciones multiples
 */
const _unscr = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', (req, res) => {

    /** 
     * @param desde variable que ingresa desde URL para saber el número de elemento desde donde será aplicado el QUERY (Obligatorio que sea un número)
     * 
     */
    let desde = req.query.desde || 0;
    desde = Number(desde);

    /**
     * @param limite Variable que es ingresada desde URL para determinar el número de registros que serán mostrador en cada QUERY
     */
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Usuario.find({condicion},'nombre email role estadao google img' (ESTO PUEDE SER OPCIONAL Y ES PARA HACER UN FILTRO DE LO QUE IRA EN EL RETORNO))
    //Usuario.find({},'nombre email role estadao google img') -> TRAE TODOS LOS REGISTROS
    Usuario.find({ estado: true }, 'nombre email role estadao google img') // -> TRAE SOLO LOS REGISTROS CON ESTADO TREUE
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            //Usuario.count({ estado: true }, (err, conteo) => { -> CUENTA TODOS LOS USUARIOS DEL QUERY
            Usuario.count({ estado: true }, (err, conteo) => { //-> CUANTA TODOS LOS USUARIOS CON ESTADO TRUE
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            });
        });
})

app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        "nombre": body.nombre,
        "email": body.email,
        "password": bcrypt.hashSync(body.password, 10),
        "role": body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
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

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    //_unscr.pick(todo_el_conjunto, [el_nombre_de_los_parametros_permitidos])
    let body = _unscr.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
})

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // Se valida que el usuario haya sido encontrado dentro de la base de datos
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    }) */
    let cambiaEstado = {
        estado: false
    }
    Usuario.findOneAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioCambiado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuarioCambiado: usuarioCambiado
        })
    });
})

module.exports = app;