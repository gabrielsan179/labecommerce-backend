-- Active: 1674660923746@@127.0.0.1@3306
CREATE TABLE users (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL
);
DROP TABLE users;
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
INSERT INTO products (id, name, price, category)
VALUES
("p001", "bola de futebol campo", 40.00, "futebol"),
("p002", "bola de futvolei", 60.00, "futvolei"),
("p003", "bola de basquete", 50.00, "basquete"),
("p004", "chuteira de futebol campo", 110.00, "futebol"),
("p005", "rede de futvolei", 100.00, "futvolei");
SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM products
WHERE name LIKE "%bola%";
INSERT INTO users (id, email, password)
VALUES 
    ("u004", "david@labe.com", "d123456");
INSERT INTO products (id, name, price, category)
VALUES
("p006", "bola de volei", 40.00, "volei"),
("p007", "bola de handebol", 50.00, "handebol"),
("p008", "cesta de basquete infantil", 50.00, "basquete"),
("p009", "luva de goleiro", 110.00, "futebol"),
("p010", "rede de volei de praia", 300.00, "volei"),   
("p011", "bola de futebol society", 40.00, "futebol"),
("p012", "tornozeleira", 60.00, "futvolei"),
("p013", "tenis de basquete", 250.00, "basquete"),
("p014", "chuteira de futebol society", 110.00, "futebol"),
("p015", "rede de volei de quadra", 300.00, "volei"),
("p016", "bola de futebol futsal", 40.00, "futebol"),
("p017", "camisa de time", 150.00, "futebol"),
("p018", "camisa de time", 150.00, "basquete"),
("p019", "chuteira de futebol futsal", 120.00, "futebol"),
("p020", "rede do gol", 100.00, "futebol"),
("p021", "raquete de tenis", 160.00, "tenis");
SELECT * FROM products
WHERE id = "p019";
DELETE FROM users
WHERE id = "u004";
DELETE FROM products
WHERE id = "p021";
UPDATE users
SET email = "lala@labe.com"
WHERE id = "u002";
UPDATE products
SET name = "rede para gol"
WHERE id="p020";
SELECT * FROM users
ORDER BY email ASC;
SELECT * FROM products
ORDER BY price ASC
LIMIT 0, 20;
SELECT * FROM products
WHERE price >= 50 AND price <= 150
ORDER BY price ASC;
