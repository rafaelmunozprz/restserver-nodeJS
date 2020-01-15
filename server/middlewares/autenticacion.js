const jwt = require('jsonwebtoken');
/**
 * VERIFICAR TOKEN
 */
let verificaToken = ( req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
    //next();
}

/**
 * Verifica el rol para operaciones PUT y POST
 * @param verificaRol Funcion que verifica que solo un ADMIN-ROL pueda modificar información
 */
let verificaRol = (req,res,next)=>{
    let usuario = req.usuario;
    if(usuario.role === 'ADMIN-ROLE'){
        next();
    }else{
        return res.json({
            ok: false,
            err: {
                message: "Rol sin privilegios"
            }
        })
    }    
}

/**
 * 
 * @param {*} req variable que solicita todos los datos de la cabecera
 * @param {*} res respuesta del servidor
 * @param {*} next permite seguir ejectuando el codigo si todo ha ido bien
 */
let verificaTokenImg = (req,res,next)=>{
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken: verificaToken,
    verificaRol: verificaRol,
    verificaTokenImg: verificaTokenImg
}