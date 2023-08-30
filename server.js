/* Estas líneas de código importan e inicializan los módulos necesarios para crear un servidor web
usando Express.js e interactuar con una base de datos MongoDB usando Mongoose. */
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require("body-parser");

// cors
/* El código `const cors = require("cors")` importa el módulo `cors`, que se utiliza para habilitar el
intercambio de recursos entre orígenes (CORS) en el servidor Express.js. */
const cors = require("cors");
app.use(cors())


/* `require('dotenv').config()` es un método utilizado para cargar variables de entorno desde un
archivo `.env` en el proceso Node.js. El archivo `.env` normalmente contiene información
confidencial, como credenciales de bases de datos, claves API y otras variables de configuración. Al
usar `dotenv`, estas variables se pueden almacenar en un archivo separado y cargar en la aplicación
en tiempo de ejecución, lo que facilita la administración y protección de la información
confidencial. */
require('dotenv').config()

/* El código `app.use(bodyparser.urlencoded({ extended: false }));` y `app.use(bodyparser.json());` son
funciones de middleware que analizan los cuerpos de las solicitudes entrantes en diferentes
formatos. */
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


app.get('/', (req,res)=>{
    res.json({
        message:'Ruta exitosa'
    })
})
//Import route
const authRoute = require('./routes/auth')
const verifyToken = require('./routes/validate-token')
const admin = require('./routes/admin')
//Register 

/* El código `app.use("/api/user", authRoute)` y `app.use("/api/admin", verificarToken, admin)` están
configurando rutas para la aplicación. */
app.use("/api/user", authRoute)
app.use("/api/admin", verifyToken, admin);




//Conexion a la base de datos
// const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tqjntpj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
   const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tqjntpj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const option = { useNewUrlParser: true, useUnifiedTopology: true };

/* El código `mongoose.connect(uri, opción)` establece una conexión a la base de datos MongoDB
utilizando el URI y las opciones proporcionados. Devuelve una promesa que se resuelve cuando la
conexión se realiza correctamente. */
mongoose.connect(uri, option)
.then(()=>{
    console.log('Conexión exitosa a la DB');
})
.catch(e=>console.log(e))

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log('Server run in port: ',PORT);
})


