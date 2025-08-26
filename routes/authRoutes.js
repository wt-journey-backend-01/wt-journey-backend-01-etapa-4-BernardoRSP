const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

router.post("/register", authController.registrarUsuario);
router.post("/login", authController.logarUsuario);
router.delete("/users/:id", authController.deletarUsuario);
router.post("/logout", authController.deslogarUsuario);

module.exports = router;
