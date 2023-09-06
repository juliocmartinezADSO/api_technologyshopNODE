const User = require("../models/User");
const router = require("express").Router();

const { signUp, signIn } = require("../controllers/auth.controller");
const {checkExistedEmailOrUsername, checkRolesExisted} = require('../middlewares')

router.post('/signup',checkExistedEmailOrUsername, checkRolesExisted, signUp)
router.post('/signin', signIn)

module.exports = router;