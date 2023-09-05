const jwt = require("jsonwebtoken");
const Role = require("../models/Role");
const User = require("../models/User");
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    //Verificar Token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decoded.id;
    const user = await User.findById(req.userId, { password: 0 });
    console.log(user);
    if (!user) return res.status(404).json({ message: "no user found" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Unauthorized" });
  }
};

const isModerator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "moderator") {
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Require Moderator role" });
};
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Require Admin role" });
};

module.exports = { verifyToken, isModerator, isAdmin };
