const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const multer = require("multer");

const ProductsController = require("../controllers/products-controller");

const upload = multer({ dest: "uploads/" });

router.get("/", ProductsController.getProducts);
router.post(
  "/",
  login.required,
  upload.single("productImage"),
  ProductsController.postProducts
);
router.get("/:productId", ProductsController.getIdProducts);
router.put("/:productId", login.required, ProductsController.putProducts);
router.delete("/:productId", login.required, ProductsController.deleteProducts);

module.exports = router;
