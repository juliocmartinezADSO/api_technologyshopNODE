const User = require("../models/User");
const Role = require("../models/Role");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Validar SignUp
const schemaRegister = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  username: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  roles: Joi.array(),
});

const signUp = async (req, res) => {
  //Validaciones
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //Validar username unico
  const existeUserName = await User.findOne({ username: req.body.username });
  if (existeUserName) {
    return res.status(400).json({
      error: true,
      message: "username ya existe",
    });
  }

  //Validar email unico
  const existeEmail = await User.findOne({ email: req.body.email });
  if (existeEmail) {
    return res.status(400).json({
      error: true,
      message: "Email ya existe",
    });
  }

  const { name, username, email, password, roles } = req.body;
  const newUser = new User({
    name,
    username,
    email,
    password: await User.encryptPassword(password),
  });

  try {
    if (roles && roles.length > 0) {
      if (roles.includes('user') && roles.length === 1) {
        // Si se envía solo el rol 'user', asignarlo
        const userRole = await Role.findOne({ name: 'user' });
        newUser.roles = [userRole._id];
      } else {
        // Si se envían otros roles además de 'user', mostrar un mensaje de error
        res.status(400).json({ error: "Solo se permite crear el rol 'user'" });
        return; // Detener la ejecución aquí
      }
    } else {
      // Si no se proporcionan roles, asignar 'user' por defecto
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }
    
    console.log(newUser);

    const savedUser = await newUser.save();
    // console.log(savedUser);
    //JSONWEBTOKEN
    const token = jwt.sign({ id: savedUser._id }, process.env.TOKEN_SECRET, {
      expiresIn: 3600, //1 horas
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Validar signIn
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

const signIn = async (req, res) => {
  //Validar datos de entrada
  const { error } = schemaLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //Validar que exista el email
  const user = await User.findOne({ email: req.body.email }).populate("roles");
  if (!user) {
    return res.status(400).json({ error: true, message: "Usuario no existe" });
  }

  //Validar password
  const passwordValida = await User.comparePassword(
    req.body.password,
    user.password
  );
  if (!passwordValida) {
    return res
      .status(401)
      .json({ token: null, message: "Credenciales incorrectas" });
  }
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: 3600, //1 hora
  });
  return res.json({ token });
};

module.exports = { signUp, signIn };
