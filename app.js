const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const productRoute = require("./routes/products-route");
const orderRoute = require("./routes/orders-route");
const userRoute = require("./routes/user-route");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false })); //apenas dados simples
app.use(bodyParser.json()); //somente dados json

app.use((req, res, next) => {
  res.header("Acess-Control-Allow-origin", "*");
  res.header(
    "Acess-Control-Allow-Header",
    "Origin",
    "X-Requrested-with",
    "Content-Type",
    "Accept",
    "Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/users", userRoute);

app.use((req, res, next) => {
  const erro = new Error("Não encontrado!");
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});

module.exports = app;
