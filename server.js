const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require("body-parser");

// cors
const cors = require("cors");
app.use(cors())
// var corsOptions = {
//   origin: "*", // Reemplazar con dominio
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

require('dotenv').config()

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

app.use("/api/user", authRoute)
app.use("/api/admin", verifyToken, admin);




//Conexion a la base de datos
// const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tqjntpj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
   const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tqjntpj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const option = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(uri, option)
.then(()=>{
    console.log('Conexión exitosa a la DB');
})
.catch(e=>console.log(e))

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log('Server run in port: ',PORT);
})


