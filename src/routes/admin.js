/* El código `const router = require('express').Router()` está creando una nueva instancia de Express
Router. La función `Router()` es una función de middleware incorporada en Express que le permite
crear controladores de ruta modulares y montables. Proporciona métodos para definir rutas y manejar
solicitudes HTTP para esas rutas. */
const router = require('express').Router()
/* El código `router.get('/', (req,res)=>{...})` define un controlador de ruta para la solicitud GET a
la URL raíz ("/"). */

router.get('/', (req,res)=>{
    res.json({
        error:null,
        data:{
            title:'Mi ruta protegida',
            user:req.user
        }
    })
})


module.exports=router