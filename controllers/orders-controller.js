const mysql = require("../mysql");

exports.getOrders = async (req, res, next) => {
  try {
    const query = `SELECT orders.orderId,
                          orders.quantity,
                          products.productId,
                          products.name,
                          products.price
                      FROM orders
                    INNER JOIN products
                      ON products.productId = orders.productId;`;
    const result = await mysql.execute(query);
    const response = {
      orders: result.map((order) => {
        return {
          orderId: order.orderId,
          quantity: order.quantity,
          product: {
            productId: order.productId,
            name: order.name,
            price: order.price,
          },
          request: {
            type: "GET",
            description: "Retorna detalhes de um produto específico!",
            url: process.env.URL_API + "orders/" + order.orderId,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postOrders = async (req, res, next) => {
  try {
    const queryProduct = "SELECT * FROM products WHERE productId = ?;";
    const resultProduct = await mysql.execute(queryProduct, [
      req.body.productId,
    ]);

    if (resultProduct.length == 0) {
      return res.status(404).send({ message: "Produto não encontrado!" });
    }

    const queryOrder = "INSERT INTO orders (productId, quantity) VALUES (?,?)";
    const resultOrder = await mysql.execute(queryOrder, [
      req.body.productId,
      req.body.quantity,
    ]);

    const response = {
      message: "Pedido inserido com sucesso!",
      createdOrder: {
        orderId: resultOrder.insertId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        request: {
          type: "GET",
          description: "Retorna todos os pedidos!",
          url: process.env.URL_API + "orders",
        },
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getIdOrders = async (req, res, next) => {
  try {
    const query = "SELECT * FROM orders WHERE orderId = ?;";
    const result = await mysql.execute(query, [req.params.orderId]);

    if (result.length === 0) {
      return res.status(400).send({
        message: "Não foi encontrado pedido com este ID!",
      });
    }
    const response = {
      order: {
        productId: result[0].productId,
        orderId: result[0].orderId,
        quantity: result[0].quantity,
        request: {
          type: "GET",
          description: "Retorna todos os pedidos!",
          url: process.env.URL_API + "orders",
        },
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteOrders = async (req, res, next) => {
  try {
    const query = `DELETE FROM orders WHERE orderId = ?`;
    await mysql.execute(query, [req.params.orderId]);
    const response = {
      message: "Pedido excluído com sucesso!",
      request: {
        type: "POST",
        description: "insere um pedido.",
        url: process.env.URL_API + "orders",
        body: {
          productId: "Number",
          quantity: "Number",
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
