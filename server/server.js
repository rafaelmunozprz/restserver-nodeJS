require('./config/config');
const express = require('express');
const app = express();
const color = require('colors');

/**
 * Conexion a mongoose
 */
const mongoose = require('mongoose');
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},(error)=>{
    if(error) throw Error;
    console.log('Base de datos ONLINE'.green);
});

/**
 * Al utulizar esta función es necesario usar el x-www-urlencoded en postman
 */
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