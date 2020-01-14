const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload({useTempFiles: true}));

app.put('/upload', (req, res)=>{
    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivos para subir'
            }
        })
    }
    let archivo = req.files.archivo;

    archivo.mv('filename.jpg', (err)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
            
        }
        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        })
    })
});

module.exports = app;