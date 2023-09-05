const jwt = require('jsonwebtoken')

/**
 * La función `verifyToken` comprueba si un token está presente en el encabezado de la solicitud y
 * verifica su validez utilizando una clave secreta.
 * @param req - El parámetro `req` es el objeto de solicitud que contiene información sobre la
 * solicitud HTTP entrante, como encabezados, parámetros de consulta y cuerpo de la solicitud.
 * @param res - El parámetro `res` es el objeto de respuesta que se utiliza para enviar una respuesta
 * al cliente. Contiene métodos y propiedades que le permiten controlar la respuesta, como configurar
 * el código de estado, enviar datos JSON o redirigir al cliente a otra URL.
 * @param next - El parámetro "siguiente" es una función de devolución de llamada que se utiliza para
 * pasar el control a la siguiente función de middleware en el ciclo de solicitud-respuesta.
 * Normalmente se utiliza para pasar a la siguiente función de middleware o al controlador de ruta
 * final.
 * @returns La función `verifyToken` no devuelve nada. Es una función de middleware que se utiliza para
 * verificar la autenticidad de un token en una solicitud HTTP. Llama a la función `next()` para pasar
 * al siguiente middleware o devuelve una respuesta de error usando `res.status().json()`.
 */
const verifyToken = (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token)return res.status(401).json({error:'Acceso denegado'})

    try {
        const verificar = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verificar
        next()     
        
    } catch (error) {
        res.status(400).json({error:'Token no es valido'})
        
    }
}


module.exports = verifyToken