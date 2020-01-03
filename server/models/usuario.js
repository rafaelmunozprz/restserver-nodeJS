const mongoose = require('mongoose');

/**
 * @param uniqueValidator constante que importa el verificador de error E11000 para determinar llaves unicas
 */
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

/**
 * @param rolesValidados variables con los únicos roles válidos para registrar un usuario en la base de datos
 * @param values Valors unicos que puede ingresar el usuario
 * @param message mensaje de error en caso de ingresar un usuario no valido
 */
let rolesValidados = {
    values: ['ADMIN-ROLE', 'USER-ROLE'],
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La constrasena es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidados
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

/**
 * Funcion diseñada para borrar del esquema la contraseña "ES MERAMENTE PARA IMPRESION"
 */
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});

module.exports = mongoose.model('Usuario', usuarioSchema);