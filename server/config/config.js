/**
 * ================================
 * PUERTO
 * ================================
 */
process.env.PORT = process.env.PORT || 6001;

/**
 * ENTORNO
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * VENCIMIENTO DEL TOKEN
 */
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/**
 * SEED DE AUTENTICACION
 */
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/**
 * GOOGLE CLIENT ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '92521692837-t8j0l6v1ljb88m1io68mn3b504alq1v3.apps.googleusercontent.com';
/**
 * BASE DE DATOS
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
