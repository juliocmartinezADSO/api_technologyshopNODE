const { Schema, model } = require("mongoose");

const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

const Role = model("Role", roleSchema);
module.exports = Role;
