const mysql = require("../mysql");

exports.getProducts = async (req, res, next) => {
  try {
    const query = "SELECT * FROM products;";
    const result = await mysql.execute(query);

    const response = {
      length: result.length,
      products: result.map((prod) => {
        return {
          productId: prod.productId,
          name: prod.name,
          price: prod.price,
          request: {
            type: "GET",
            description: "Retorna detalhes de um produto específico!",
            url: "https:http://localhost:3000/products/" + prod.productId,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postProducts = (req, res, next) => {
  try {
    const query = "INSERT INTO products (name, price) VALUES (?,?)";
    const result = mysql.execute(query, [req.body.name, req.body.price]);

    const response = {
      message: "Produto inserido com sucesso!",
      createdProduct: {
        productId: result.insertId,
        name: req.body.name,
        price: req.body.price,
        request: {
          type: "GET",
          description: "Retorna todos os produtos!",
          url: "http://localhost:3000/products",
        },
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getIdProducts = async (req, res, next) => {
  try {
    const query = "SELECT * FROM products WHERE productId = ?;";
    const result = await mysql.execute(query, [req.params.productId]);
    if (result.length === 0) {
      return res.status(404).send({
        message: "Não foi encontrado produto com este ID!",
      });
    }
    const response = {
      product: {
        productId: result[0].productId,
        name: result[0].name,
        price: result[0].price,
        request: {
          type: "GET",
          description: "Retorna todos os produtos!",
          url: "http://localhost:3000/products",
        },
      },
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.putProducts = async (req, res, next) => {
  try {
    const query = `UPDATE products
                    SET name      =?,
                        price     =?
                WHERE productId   =?`;
    await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.params.productId,
    ]);
    const response = {
      message: "Produto alterado com sucesso!",
      request: {
        type: "GET",
        description: "Retorna os detalhes de um produto específico!",
        url: "http://localhost:3000/products/" + req.params.productId,
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteProducts = async (req, res, next) => {
  try {
    const query = "DELETE FROM products WHERE productId = ?;";
    await mysql.execute(query, [req.params.productId]);
    const response = {
      message: "Produto excluído com sucesso!",
      request: {
        type: "POST",
        description: "Adicionar um produto",
        url: "http//:localhost:3000/products",
        body: {
          name: "String",
          price: "Number",
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
