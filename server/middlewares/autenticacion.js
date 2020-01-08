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

module.exports = {
    verificaToken: verificaToken,
    verificaRol: verificaRol
}