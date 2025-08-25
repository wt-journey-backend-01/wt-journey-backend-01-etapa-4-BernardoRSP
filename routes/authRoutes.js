const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

router.post("/auth/register", authController.registrarUsuario);
router.post("/auth/login", authController.logarUsuario);
router.delete("/users/:id", authController.deletarUsuario);
router.post("/auth/logout", authController.deslogarUsuario);

module.exports = router;
