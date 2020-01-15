/**
 * @param express variable de la dependencia express
 */
const express = require('express');

/**
 * @param app variable que contiene las funcionalidades de la dependencia "express"
 */
const app = express();

/**
 * Lista de rutas que pueden tener acceso
 */
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;