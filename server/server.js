require('./config/config');
const express = require('express');
const app = express();
const color = require('colors');

/**
 * Conexion a mongoose
 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cafe',(error)=>{
    if(error) throw Error;
    console.log('Base de datos ONLINE'.green);
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 * Archivo usuario importado al server
 */
app.use(require('./routes/usuario'));

app.listen(process.env.PORT, ()=>{
    console.log('Escuchado puerto: ', process.env.PORT);
});