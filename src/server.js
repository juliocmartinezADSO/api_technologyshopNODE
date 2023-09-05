/* Estas líneas de código importan e inicializan los módulos necesarios para crear un servidor web
usando Express.js e interactuar con una base de datos MongoDB usando Mongoose. */
const express = require("express");
const morgan = require('morgan')
const {createRoles, createAdmin} = require("./libs/initialSetup");
const app = express();
createRoles();
createAdmin();
const bodyparser = require("body-parser");

// cors
/* El código `const cors = require("cors")` importa el módulo `cors`, que se utiliza para habilitar el
intercambio de recursos entre orígenes (CORS) en el servidor Express.js. */
const cors = require("cors");
app.use(cors());

require("dotenv").config();
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.json({
    message: "Ruta exitosa",
  });
});
//Import route
const authRoute = require("./routes/auth.routes");
const verifyToken = require("./routes/validate-token");
const admin = require("./routes/admin");
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/orderController");
const usersRoutes= require("./routes/user.routes")
//Register

/* El código `app.use("/api/user", authRoute)` y `app.use("/api/admin", verificarToken, admin)` están
configurando rutas para la aplicación. */
app.use(productsRoutes);
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoutes)
// app.use(ordersRoutes);
// app.use("/api/admin", verifyToken, admin);

//Conexion a la base de datos
require("./database");

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server run in port: ", PORT);
});
