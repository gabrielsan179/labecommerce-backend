-- Active: 1674660923746@@127.0.0.1@3306
CREATE TABLE users (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL
);
DROP TABLE users;
SELECT * FROM users;

INSERT INTO users (id, email, password)
VALUES 
    ("u001", "gabi@labe.com", "g123456"),
    ("u002", "lari@labe.com", "l123456"),
    ("u003", "rute@labe.com", "r123456");
CREATE TABLE products (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	name TEXT NOT NULL,
	price REAL NOT NULL,
	category TEXT NOT NULL
);
DROP TABLE products;
SELECT * FROM products;
INSERT INTO products (id, name, price, category)
VALUES
("p001", "bola de futebol", 40.00, "futebol"),
("p002", "bola de futvolei", 60.00, "futvolei"),
("p003", "bola de basquete", 50.00, "basquete"),
("p004", "chuteira de futebol", 110.00, "futebol"),
("p005", "rede de futvolei", 100.00, "futvolei")