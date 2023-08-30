/* Este código define un esquema Mongoose para un objeto de usuario en una base de datos MongoDB. */
const mongoose = require('mongoose')

/* El código `const userChema = mongoose.Schema({` define un esquema Mongoose para un objeto de usuario
en una base de datos MongoDB. Está creando una nueva instancia de la clase `Schema` proporcionada
por la biblioteca Mongoose. El esquema define la estructura y propiedades del objeto de usuario,
incluidos los tipos de datos, los campos obligatorios y cualquier regla de validación adicional. */
const userChema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:255
    },
    email:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    date:{
        type:Date,
        default:Date.now
    }

})

/* `module.exports = mongoose.model('User', userChema)` está exportando el modelo Mongoose para el
esquema de usuario. */
module.exports = mongoose.model('User', userChema)