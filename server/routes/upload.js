const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

/**
 * @param Usuario variable que importa el esquema de "Usuario"
 */
const Usuario = require('../models/usuario');
/**
 * @param Producto variable que importa el esquema de "Producto"
 */
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    /**
     * @param tipo variable usada para detectar el tipo de "imagen" que se subirá, puede ser usuario o producto
     */
    let tipo = req.params.tipo;

    /**
     * @param id variable que contiene el id del usuario que ha subido la imagen
     */
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivos para subir'
            }
        })
    }

    //VALIDAR TIPO
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {

    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    //EXTENSIIONES PERMITIDAS
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones válidas son ' + extensionesPermitidas.join(', ')
            }
        })
    }

    //Cambiar nombre al archivo
    /**
     * @param nombreArchivo variable con el nombre enviado por id mas la deteccion de la extencion del archivo ${id}-${new Date().getMilliseconds()}.${extension}
     */
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        /* res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        }) */
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
            default:
                res.json({
                    ok: false,
                    err: {
                        message: 'Tipo no permitido'
                    }
                })
                break;

        }
    })
});

/**
 * 
 * @param {*} id variable que contiene el Id del usuario
 * @param {*} res variable que contiene la respuesta del servidor
 * @param {*} nombreArchivo variable con el nombre que se guardará en la base de datos
 */
function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            //Evita que en caso de mandar un archivo que no exista no se guarde la imagen en el servidor
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error interno al buscar un usuario'
                }
            });
        }
        if (!usuarioDB) {
            //Evita que en caso de mandar un archivo que no exista no se guarde la imagen en el servidor
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no encontrado en la base de datos'
                }
            })
        }
        //BUSCAMOS Y BORRAMOS LA IMAGEN EN CASO DE EXISTIR EN EL DIRECTORIO
        borrarArchivo(usuarioDB.img, 'usuarios');

        //GUARDA LA  IMAGEN 
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })
}

/**
 * 
 * @param {*} id variable que contiene el id del producto
 * @param {*} res variable que contiene la respuesa del servidor
 * @param {*} nombreArchivo variable que contiene el nombre del archivo (id del producto)
 */
function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            //Evita que en caso de mandar un archivo que no exista no se guarde la imagen en el servidor
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error interno al buscar un producto'
                }
            });
        }
        if (!productoDB) {
            //Evita que en caso de mandar un archivo que no exista no se guarde la imagen en el servidor
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no encontrado en la base de datos'
                }
            })
        }
        //BUSCAMOS Y BORRAMOS LA IMAGEN EN CASO DE EXISTIR EN EL DIRECTORIO
        borrarArchivo(productoDB.img, 'productos');

        //GUARDA LA  IMAGEN 
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

/**
 * 
 * @param {*} nombreImagen nombre de la imagen que se guardará en la base de datos (id del usuario)
 * @param {*} tipo tipo de imagen que definirá la carpeta (usuarios o productos)
 */
function borrarArchivo(nombreImagen, tipo) {
    //BUSCAMOS QUE LA IMAGEN NO EXISTA YA
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //fs.existsSync() -> Regresa una true si existe y no false si no existe
    if (fs.existsSync(pathImagen)) {
        //fs.unlinkSync() -> Elimina un archivo
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;