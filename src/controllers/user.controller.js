const Role = require("../models/Role");
const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { name, username, email, password, roles } = req.body;

    //Verificar que se proporcione un campo "roles" en la solicitud
    let rolesToAssign =[]
    if(roles && roles.length >0){
      //Buscar roles existentes en la db
      const rolesFound = await Role.find({ name: { $in: roles } });
      //Verificar que existan todos los roles proporcionados
      if(rolesFound.length !== roles.length){
        return res.status(400).json({message:'Uno o mas roles no existen'})      
      }

      //Asignar roles encontrados
      rolesToAssign=rolesFound.map((role)=>role._id)
    }else{
      //si no se proporcionan roles asignar el rol 'user' por defecto
      const defaultRole = await Role.findOne({name:"user"})
      if(!defaultRole){
        return res.status(500).json({message:"No se pudo encontrar el rol 'user' por defecto."})
      }
      rolesToAssign=[defaultRole._id]
    }

   
    // creating a new User
    const user = new User({
      name,
      username,
      email,
      password,
      roles: rolesToAssign
    });

    // encrypting password
    user.password = await User.encryptPassword(user.password);

    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      name:savedUser.name,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createUser };
