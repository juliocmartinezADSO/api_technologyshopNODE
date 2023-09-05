const mongoose = require('mongoose')

//Conexion a la base de datos
// const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tqjntpj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tqjntpj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const option = { useNewUrlParser: true, useUnifiedTopology: true };

/* El código `mongoose.connect(uri, opción)` establece una conexión a la base de datos MongoDB
utilizando el URI y las opciones proporcionados. Devuelve una promesa que se resuelve cuando la
conexión se realiza correctamente. */
mongoose
  .connect(uri, option)
  .then(() => {
    console.log("Conexión exitosa a la DB");
  })
  .catch((e) => console.log(e));