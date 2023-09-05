const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user.controller");
const {signUp} = require("../controllers/auth.controller")
const { verifyToken, isAdmin, checkRolesExisted, isModerator, checkDuplicateUsernameOrEmail } = require("../middlewares");

router.post("/", [verifyToken, isAdmin, checkDuplicateUsernameOrEmail], signUp);


module.exports = router;
