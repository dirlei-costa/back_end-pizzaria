-- refactoring pra inglês

show tables;

DROP TABLE products;

CREATE TABLE
    IF NOT EXISTS products (
        productId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(45),
        price FLOAT,
        descriptionProduct VARCHAR(500)
    );

CREATE TABLE
    IF NOT EXISTS orders (
        orderId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        productId INT,
        quantity INT,
        FOREIGN KEY (productId) REFERENCES products (productId)
    );

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE
    IF NOT EXISTS users (
        userId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100),
        password VARCHAR(100)
    );

ALTER TABLE orders
ADD
    CONSTRAINT orders_ibfk_1 FOREIGN KEY (productId) REFERENCES products (productId);

ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1;