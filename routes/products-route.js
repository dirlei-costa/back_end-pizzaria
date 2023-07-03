const express = require("express");
const login = require("../middleware/login");
const router = express.Router();

const ProductsController = require("../controllers/products-controller");

router.get("/", ProductsController.getProducts);
router.post("/", login.required, ProductsController.postProducts);
router.get("/:productId", ProductsController.getIdProducts);
router.put("/:productId", login.required, ProductsController.putProducts);
router.delete("/:productId", login.required, ProductsController.deleteProducts);

module.exports = router;
