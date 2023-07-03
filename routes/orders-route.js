const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/orders-controller");

router.get("/", ordersController.getOrders);
router.post("/", ordersController.postOrders);
router.get("/:orderId", ordersController.getIdOrders);
router.delete("/:orderId", ordersController.deleteOrders);

module.exports = router;
