const mysql = require("../mysql");

exports.getProducts = async (req, res, next) => {
  try {
    const result = await mysql.execute("SELECT * FROM products;");
    const response = {
      length: result.length,
      products: result.map((prod) => {
        return {
          productId: prod.productId,
          productImage: prod.productImage,
          name: prod.name,
          price: prod.price,
          descriptionProduct: prod.descriptionProduct,
          request: {
            type: "GET",
            description: "Retorna detalhes de um produto específico!",
            url: process.env.URL_API + "products/" + prod.productId,
          },
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postProducts = async (req, res, next) => {
  try {
    console.log(req.file);
    const query =
      "INSERT INTO products (productImage, name, price, descriptionProduct ) VALUES (?,?,?,?)";
    const result = await mysql.execute(query, [
      req.file.path,
      req.body.name,
      req.body.price,
      req.body.descriptionProduct,
    ]);

    const response = {
      message: "Produto inserido com sucesso!",
      createdProduct: {
        productId: result.insertId,
        productImage: req.file.path,
        name: req.body.name,
        price: req.body.price,
        descriptionProduct: req.body.descriptionProduct,
        request: {
          type: "GET",
          description: "Retorna todos os produtos!",
          url: process.env.URL_API + "products",
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
        productImage: result[0].productImage,
        name: result[0].name,
        price: result[0].price,
        descriptionProduct: result[0].descriptionProduct,
        request: {
          type: "GET",
          description: "Retorna todos os produtos!",
          url: process.env.URL_API + "products",
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
                        descriptionProduct =?
                WHERE productId   =?`;
    await mysql.execute(query, [
      req.body.name,
      req.body.price,
      req.body.descriptionProduct,
      req.params.productId,
    ]);
    const response = {
      message: "Produto alterado com sucesso!",
      updatedProduct: {
        productId: req.params.productId,
        name: req.body.name,
        price: req.body.price,
        descriptionProduct: req.body.descriptionProduct,
      },
      request: {
        type: "GET",
        description: "Retorna os detalhes de um produto específico!",
        url: process.env.URL_API + "products/" + req.params.productId,
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
        url: process.env.URL_API + "products",
        body: {
          name: "String",
          price: "Number",
          descriptionProduct: "String",
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
