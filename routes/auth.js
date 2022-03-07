const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const Joi = require("@hapi/joi");
const schemaRegister = Joi.object({
  name: Joi.string().min(3).max(250).required(),
  email: Joi.string().min(6).max(250).required().email(),
  password: Joi.string().min(6).max(250).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(250).required().email(),
  password: Joi.string().min(6).max(250).required(),
});

// LOGIN
router.post("/login", async (req, res) => {
  const { error } = schemaLogin.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ error: true, mensaje: "Usuario no registrado" });

  const passValidado = await bcrypt.compare(req.body.password, user.password);
  if (!passValidado)
    return res
      .status(400)
      .json({ error: true, mensaje: "Usuario no registrado" });

  res.json({
    error: null,
    mensaje: "Bienvenido",
  });
});

// REGISTER
router.post("/register", async (req, res) => {
  // Validación de usuario
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  // Validar email repetido
  const existeEmail = await User.findOne({ email: req.body.email });
  if (existeEmail)
    return res.status(400).json({
      error: true,
      mensaje: "email ya registrado",
    });

  // Bcrypt
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
      error: null,
      data: userDB,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
