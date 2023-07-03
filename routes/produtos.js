const express = require("express");
const login = require("../middleware/login");
const router = express.Router();

const ProdutosController = require("../controllers/produtos-controller");

router.get("/", ProdutosController.getProdutos);
router.post("/", login.obrigatorio, ProdutosController.postProdutos);
router.get("/:id_produto", ProdutosController.getIdPedido);
router.patch("/", login.obrigatorio, ProdutosController.patchProdutos);
router.delete("/", login.obrigatorio, ProdutosController.deleteProdutos);

module.exports = router;
