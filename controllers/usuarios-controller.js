const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postUsuario = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [req.body.email],
      (error, results) => {
        if (results.length > 0) {
          res.status(409).send({
            mensagem: "Usuário já cadastrado!",
          });
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }
            conn.query(
              `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
              [req.body.email, hash],
              (error, results) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }
                response = {
                  mensagem: "Usuário criado com suscesso!",
                  usuarioCriado: {
                    id_usuario: results.insertId,
                    email: req.body.email,
                  },
                };
                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
};

exports.postLogin = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    conn.query(query, [req.body.email], (error, results, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error: error });
      }
      if (results.length < 1) {
        return res.status(401).send({ mensagem: "Falha na autenticação!" });
      }
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) {
          return res.status(401).send({ mensagem: "Falha na autenticação!" });
        }
        if (result) {
          const token = jwt.sign(
            {
              id_usuario: results[0].id_usuario,
              email: results[0].email,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          return res
            .status(200)
            .send({ mensagem: "Autenticação com sucesso!", token: token });
        }
        return res.status(401).send({ mensagem: "Falha na autenticação!" });
      });
    });
  });
};

exports.patchProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `UPDATE produtos
       SET nome       =?,
           preco      =?
    WHERE id_produto  =?`,
      [req.body.nome, req.body.preco, req.body.id_produto],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Produto atualizado com sucesso!",
          produtoAtualizado: {
            id_produto: req.body.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: "GET",
              descricao: "Retorna detalhes de um produto específico!",
              url: "http://localhost:3000/produtos/" + req.body.id_produto,
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
};

exports.deleteProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "DELETE FROM produtos WHERE id_produto = ?;",
      [req.body.id_produto],
      (error, result, fields) => {
        conn.release;
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Produto excluído com sucesso!",
          request: {
            tipo: "POST",
            descricao: "insere um produto",
            url: "http//:localhost:3000/produtos",
            body: {
              nome: "String",
              preco: "Number",
            },
          },
        };

        return res.status(202).send(response);
      }
    );
  });
};
