const express = require("express");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cors = require("cors");
const { createRoles, createAdmin } = require("./libs/initialSetup");
const dotenv = require("dotenv")
const app = express();

//Configuracion inicial de roles y administrador
createRoles();
createAdmin();

//Configuracion de las variables de entorno
dotenv.config()

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Importar rutas
const authRoute = require("./routes/auth.routes");
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/order.routes");
const usersRoutes = require("./routes/user.routes");

// Configurar las rutas de la aplicación
app.use("/api/auth/", authRoute);
app.use("/api/", usersRoutes);
app.use("/api/", productsRoutes);
app.use("/api/", ordersRoutes);

//Conexion a la base de datos
require("./database");

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server run in port: ", PORT);
});

const moment = require("moment-timezone");
