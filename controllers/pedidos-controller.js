const mysql = require("../mysql").pool;

exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT pedidos.id_pedido,
              pedidos.quantidade,
              produtos.id_produto,
              produtos.nome,
              produtos.preco
          FROM pedidos
        INNER JOIN produtos
          ON produtos.id_produto = pedidos.id_produto;`,

      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          pedidos: result.map((pedido) => {
            return {
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome,
                preco: pedido.preco,
              },
              id_pedido: pedido.id_pedido,
              quantidade: pedido.quantidade,
              request: {
                tipo: "GET",
                descricao: "Retorna detalhes de um pedido específico!",
                url: "http://localhost:3000/pedidos/" + pedido.id_pedido,
              },
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
};
exports.postPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM produtos WHERE id_produto = ?",
      [req.body.id_produto],
      (error, result, field) => {
        if (error) {
          res.status(500).send({ error: error });
        }
        if (result.length === 0) {
          return res.status(404).send({
            mensagem: "Produto não encontrado!",
          });
        }
        conn.query(
          "INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)",
          [req.body.id_produto, req.body.quantidade],
          (error, result, field) => {
            conn.release();
            if (error) {
              return res.status(500).send({ error: error });
            }
            const response = {
              mensagem: "Pedido inserido com sucesso!",
              pedidoCriado: {
                id_produto: req.body.id_produto,
                id_pedido: result.id_pedido,
                quantidade: req.body.quantidade,
                request: {
                  tipo: "GET",
                  descricao: "Retorna todos os pedidos!",
                  url: "http://localhost:3000/pedidos",
                },
              },
            };
            return res.status(201).send(response);
          }
        );
      }
    );
  });
};
exports.getIdPedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM pedidos WHERE id_pedido = ?;",
      [req.params.id_pedido],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length === 0) {
          return res.status(400).send({
            mensagem: "Não foi encontrado pedido com este ID!",
          });
        }
        const response = {
          pedido: {
            id_produto: result[0].id_produto,
            id_pedido: result[0].id_pedido,
            quantidade: result[0].quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os pedidos!",
              url: "http://localhost:3000/pedidos",
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
};
exports.deletePedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "DELETE FROM pedidos WHERE id_pedido = ?;",
      [req.body.id_pedido],
      (error, result, fields) => {
        conn.release;
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Pedido excluído com sucesso!",
          request: {
            tipo: "POST",
            descricao: "insere um pedido",
            url: "http//:localhost:3000/pedidos",
            body: {
              id_produto: "Number",
              quantidade: "Number",
            },
          },
        };

        return res.status(202).send(response);
      }
    );
  });
};
