/* Este código implementa un sistema de autenticación de usuarios utilizando Express.js y MongoDB.
Define varias rutas para el registro de usuarios, el inicio de sesión y la actualización de
contraseñas. */
const router = require("express").Router();

//Modelo
const User = require("../models/User");

const Joi = require("@hapi/joi");

/* La línea `const bcrypt = require("bcrypt");` está importando la biblioteca bcrypt para usar sus
funciones para comparación y hash de contraseñas. Bcrypt es una biblioteca popular para realizar
hash de contraseñas de forma segura en JavaScript. */
const bcrypt = require("bcrypt");
/* La línea `const jwt = require("jsonwebtoken");` está importando la biblioteca `jsonwebtoken`. Esta
biblioteca se utiliza para generar y verificar tokens web JSON (JWT). Los JWT son un medio compacto
y seguro para URL de representar reclamos entre dos partes. En este código, la biblioteca
`jsonwebtoken` se utiliza para generar un token con fines de autenticación. */
const jwt = require("jsonwebtoken");
/* La línea `const verificarToken = require("./validate-token");` está importando la función
`verifyToken` desde el archivo `validate-token.js`. Esta función se utiliza como middleware para
verificar la autenticidad de un token antes de permitir el acceso a determinadas rutas. Comprueba si
el token proporcionado en el encabezado de la solicitud es válido y no ha caducado. Si el token es
válido, el usuario puede acceder a la ruta protegida. Si el token no es válido o ha caducado, se le
niega el acceso al usuario. */
const verifyToken = require("./validate-token");

//Validar Login
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});


/* El bloque de código `router.post("/login", async (req, res) => {... })` define una ruta para el
inicio de sesión del usuario. Cuando se realiza una solicitud POST al punto final "/login", se
ejecuta el código dentro de la función del controlador de ruta. */
router.post("/login", async (req, res) => {
  try {
    //Validaciones
    const { error } = schemaLogin.validate(req.body);
    error && res.status(400).json({ error: error.details[0].message });
    //Validar email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Usuario no existe" });
    }

    //Validar password
    const passwordValida = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // !passwordValida && res.status(400).json({ error: true, message: "Contraseña invalida" });
    if (!passwordValida) {
      return res
        .status(400)
        .json({ error: true, message: "Contraseña invalida" });
    }
    //Token
    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.TOKEN_SECRET
    );

    return res.header("auth-token", token).json({
      error: null,
      data: { token },
      mensaje:'Autenticación satisfactoria'
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Error en el servidor" });
  }
});

//Validar registro
const schemaRegister = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

//Registro de usuarios
/* El bloque de código `router.post("/register", async (req, res) => {...})` define una ruta para el
registro del usuario. Cuando se realiza una solicitud POST al punto final "/register", se ejecuta el
código dentro de la función del controlador de ruta. */
router.post("/register", async (req, res) => {
  //Validaciones
  const { error } = schemaRegister.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //Validar email que sea unico
  const existeEmail = await User.findOne({ email: req.body.email });
  if (existeEmail) {
    return res.status(400).json({
      error: true,
      message: "Email ya registrado",
    });
  }
  //Verificar que no se repita una contraseña, esto es locooo

  //Encriptar password
  const bcrypt = require("bcrypt");
  const saltos = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, saltos);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: password,
  });

  try {
    const userDB = await user.save();
    res.json({
      mensaje: "Registro de usuario exitoso",
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

//Actualizar password
// Ruta para actualizar la contraseña
/* El bloque de código que proporcionó está implementando una ruta para actualizar la contraseña del
usuario. */
const schemaUpdatePassword = Joi.object({
  oldPassword: Joi.string().min(6).max(1024).required(),
  newPassword: Joi.string().min(6).max(1024).required(),
});
router.put("/update-password", verifyToken, async (req, res) => {
  try {
    // Validaciones
    const { error } = schemaUpdatePassword.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Obtener el usuario actual
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: true, message: "Usuario no encontrado" });
    }

    // Validar contraseña anterior
    const passwordValida = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!passwordValida) {
      return res.status(400).json({ error: true, message: "Contraseña anterior incorrecta" });
    }

    // Encriptar nueva contraseña
    const saltos = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(req.body.newPassword, saltos);

    // Actualizar la contraseña en la base de datos
    user.password = newPasswordHash;
    await user.save();

    return res.json({
      error: null,
      message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: "Error en el servidor"});
  }
});


module.exports = router;
