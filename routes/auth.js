const router = require("express").Router();
//Modelo
const User = require("../models/User");

const Joi = require("@hapi/joi");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./validate-token");

//Validar Login
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});


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
