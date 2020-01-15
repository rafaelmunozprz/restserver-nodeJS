const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg ,(req, res) => {
    let tipo = req.params.tipo;

    let imagen = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);

    //Si el archivo existe que regrese la imagen 
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else { //Si el archivo NO existe mandar imagen por defecto
        let noImagenPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagenPath);
    }


})

module.exports = app;