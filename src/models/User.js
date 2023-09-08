  /* Este código define un esquema Mongoose para un objeto de usuario en una base de datos MongoDB. */
  const { Schema, model } = require("mongoose");
  const bcrypt = require("bcrypt");
  const moment = require("moment-timezone"); // Importa moment-timezone
  //Zona horaria de colombia
  moment.tz.setDefault("America/Bogota")



  /* El código `const userChema = mongoose.Schema({` define un esquema Mongoose para un objeto de usuario
  en una base de datos MongoDB. Está creando una nueva instancia de la clase `Schema` proporcionada
  por la biblioteca Mongoose. El esquema define la estructura y propiedades del objeto de usuario,
  incluidos los tipos de datos, los campos obligatorios y cualquier regla de validación adicional. */
  const userSchema = Schema(
    {
      name: {
        type: String,
        required: true,
        min: 3,
        max: 255,
      },
      username: {
        type: String,
        unique: true,
      },

      email: {
        type: String,
        unique: true,
        required: true,
        min: 6,
        max: 255,
      },
      password: {
        type: String,
        required: true,
        min: 6,
        max: 255,
      },
      date: {
        type: Date,
        default: ()=>moment().format(),
      },
      roles: [
        {
          ref: "Role",
          type: Schema.Types.ObjectId,
        },
      ],
    }
    ,
    {
      timestamps: true,
      versionKey: false,
    }
  );

  //Encriptar password
  userSchema.statics.encryptPassword = async (password) => {
    const saltos = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltos);
  };

  //Comparar password
  userSchema.statics.comparePassword = async (password, recivedPassword) => {
    return await bcrypt.compare(password, recivedPassword);
  };

  /* `module.exports = mongoose.model('User', userChema)` está exportando el modelo Mongoose para el
  esquema de usuario. */
  module.exports = model("User", userSchema);
