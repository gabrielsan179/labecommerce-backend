-- Active: 1674660923746@@127.0.0.1@3306

DROP TABLE users;

DROP TABLE products;

DROP TABLE purchases;

DROP TABLE purchases_products;

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        createdAT TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
    );

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        imageUrl TEXT
    );

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL,
        paid INTEGER DEFAULT(0) NOT NULL,
        FOREIGN KEY (buyer) REFERENCES users (id)
    );

CREATE TABLE
    purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    );

INSERT INTO
    users (id, name, email, password)
VALUES (
        "u001",
        "Gabriel",
        "gabi@labe.com",
        "g123456"
    ), (
        "u002",
        "Larissa",
        "lari@labe.com",
        "l123456"
    ), (
        "u003",
        "Rute",
        "rute@labe.com",
        "r123456"
    );

INSERT INTO
    users (id, name, email, password)
VALUES (
        "u004",
        "David",
        "david@labe.com",
        "d123456"
    );

INSERT INTO
    products (id, name, price, description, imageUrl)
VALUES (
        "p001",
        "bola de futebol campo",
        40.00,
        "futebol",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrQz_9xCwDcnYG6_FI5hmkxAjwghhJ4zyt3A&usqp=CAU"
    ), (
        "p002",
        "bola de futvolei",
        60.00,
        "futvolei",
        "https://decathlonpro.vtexassets.com/arquivos/ids/2809510/bola-de-futevolei-mikasa1.jpg?v=637620346053670000"
    ), (
        "p003",
        "bola de basquete",
        50.00,
        "basquete",
        "https://sportset.com.br/wp-content/uploads/2022/06/20253c3a27624bf71dbcc4c5624fff88.jpeg"
    ), (
        "p004",
        "chuteira de futebol campo",
        110.00,
        "futebol",
        "https://cf.shopee.com.br/file/f76d05886eb43f0160db776dac4d88c8"
    ), (
        "p005",
        "rede de futvolei",
        100.00,
        "futvolei",
        "https://cdn.awsli.com.br/600x450/523/523243/produto/33335941/86cd0cf0a1.jpg"
    );

INSERT INTO
    products (id, name, price, description, imageUrl)
VALUES (
        "p006",
        "bola de volei",
        40.00,
        "volei",
        "https://http2.mlstatic.com/D_NQ_NP_895421-MLB43579688600_092020-O.jpg"
    ), (
        "p007",
        "bola de handebol",
        50.00,
        "handebol",
        "https://m.media-amazon.com/images/I/71R9YNn0KWL._SL1500_.jpg"
    ), (
        "p008",
        "cesta de basquete infantil",
        50.00,
        "basquete",
        "https://carrefourbr.vtexassets.com/arquivos/ids/11056733/15670617309214.jpg?v=637418420754830000"
    ), (
        "p009",
        "luva de goleiro",
        110.00,
        "futebol",
        "https://images.tcdn.com.br/img/img_prod/642898/luva_goleiro_three_stars_fox_profissional_543_1_20201214204459.jpeg"
    ), (
        "p010",
        "rede de volei de praia",
        300.00,
        "volei",
        "https://static.netshoes.com.br/produtos/rede-volei-de-praia-profissional-850-m-4-faixas/60/DOF-0007-060/DOF-0007-060_zoom1.jpg?ts=1594071974"
    ), (
        "p011",
        "bola de futebol society",
        40.00,
        "futebol",
        "https://static.netshoes.com.br/produtos/bola-de-futebol-society-penalty-lider-xxi/14/D23-5983-114/D23-5983-114_zoom1.jpg?ts=1610987342&ims=544x"
    ), (
        "p012",
        "tornozeleira",
        60.00,
        "futvolei",
        "https://m.media-amazon.com/images/I/51V-80-8nUL._AC_SX425_.jpg"
    ), (
        "p013",
        "tenis de basquete",
        250.00,
        "basquete",
        "https://cf.shopee.com.br/file/2564397fe4cfcf6a74ae4cffec18cb66"
    ), (
        "p014",
        "chuteira de futebol society",
        110.00,
        "futebol",
        "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/879/205/products/71acf08d1-5fb7c5555fb45a436b16497023360305-1024-1024.jpeg"
    ), (
        "p015",
        "rede de volei de quadra",
        300.00,
        "volei",
        "https://nobreredes.com.br/wp-content/uploads/2020/06/rede-de-quadra-de-v%C3%B4lei.jpg"
    ), (
        "p016",
        "bola de futebol futsal",
        40.00,
        "futebol",
        "https://cambuci.vteximg.com.br/arquivos/ids/451894/bola-futsal-furia-521314-1970-1.jpg?v=637819391031000000"
    ), (
        "p017",
        "camisa de time",
        150.00,
        "futebol",
        "https://http2.mlstatic.com/D_NQ_NP_612014-MLB52025511388_102022-O.jpg"
    ), (
        "p018",
        "camisa de time",
        150.00,
        "basquete",
        "https://cf.shopee.com.br/file/0b7c8c2f3840e535745ac01e7b669e49"
    ), (
        "p019",
        "chuteira de futebol futsal",
        120.00,
        "futebol",
        "https://cf.shopee.com.br/file/15beca18fa07047a6daffe14f2da6803"
    ), (
        "p020",
        "rede do gol",
        100.00,
        "futebol",
        "https://static.hbt.triider.com.br/photos/project/medium/rede-de-gol-personalizada-980079.jpg"
    ), (
        "p021",
        "raquete de tenis",
        160.00,
        "tenis",
        "https://estatico.raquetemania.com.br/produtos/3508/3508_1.jpg"
    );

INSERT INTO
    purchases (id, buyer, total_price)
VALUES 
    ("P01", "u001", 250), 
    ("P02", "u001", 200), 
    ("P03", "u002", 150), 
    ("P04", "u002", 180), 
    ("P05", "u003", 400), 
    ("P06", "u003", 500);

INSERT INTO
    purchases_products (purchase_id, product_id, quantity)
VALUES 
    ("P01", "p013", 1), 
    ("P02", "p017", 1), 
    ("P02", "p007", 1), 
    ("P03", "p008", 3), 
    ("P04", "p011", 3), 
    ("P04", "p012", 1), 
    ("P05", "p020", 4), 
    ("P06", "p005", 5);

UPDATE users SET email = "lala@labe.com" WHERE id = "u002";

UPDATE products SET name = "rede para gol" WHERE id="p020";

UPDATE purchases SET paid = 1 WHERE id = "P03";

UPDATE purchases
SET delivered_at = DATETIME('now', 'localtime')
WHERE id = "P03";

DELETE FROM users WHERE id = "u004";

DELETE FROM products WHERE id = "p021";

SELECT * FROM users;

SELECT * FROM users ORDER BY email ASC;

SELECT * FROM products;

SELECT * FROM products WHERE name LIKE "%bola%";

SELECT * FROM products WHERE id = "p019";

SELECT * FROM products ORDER BY price ASC LIMIT 0, 20;

SELECT *
FROM products
WHERE price >= 50 AND price <= 150
ORDER BY price ASC;

SELECT * FROM purchases;

SELECT * FROM purchases_products;

SELECT *
FROM purchases
INNER JOIN users 
ON users.id = buyer
WHERE users.id = "u002";

SELECT 
    products.id,
    products.name,
    products.price,
    products.description,
    products.imageUrl,
    purchases_products.quantity
FROM purchases
    INNER JOIN purchases_products ON purchases_products.purchase_id = purchases.id
    INNER JOIN products ON purchases_products.product_id = products.id
    WHERE purchase_id = "P02";