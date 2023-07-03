const express = require("express");
const router = express.Router();

const UsuariosController = require("../controllers/usuarios-controller");

router.post("/cadastro", UsuariosController.postUsuario);
router.post("/login", UsuariosController.postLogin);

module.exports = router;
