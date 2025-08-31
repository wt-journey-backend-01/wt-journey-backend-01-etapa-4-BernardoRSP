const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/auth/register", authController.registrarUsuario);
router.post("/auth/login", authController.logarUsuario);
router.delete("/users/:id", authMiddleware, authController.deletarUsuario);
router.post("/auth/logout", authController.deslogarUsuario);
router.get("/users/me", authMiddleware, authController.exibirUsuario);

module.exports = router;
