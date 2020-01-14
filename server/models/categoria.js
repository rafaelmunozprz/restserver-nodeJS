const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @param categoriaSchema Esquema de base de datos para productos con Mongoose
 */
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcin del producto is necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);