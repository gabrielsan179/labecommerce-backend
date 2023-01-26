import { db } from './database/knex';
import {
    getProductById,
    deleteUserById,
    deleteProductById,
    editUserById,
    editProductById,
    users,
    getUsertById,
    regexPassword,
    regexEmail
} from './database';
import { CATEGORY } from './types';
import express, { Request, Response } from 'express';
import cors from 'cors';

console.log("Aplicativo foi iniciado")

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/users', async (req: Request, res: Response) => {
    try {
        const allUsers = await db.raw(`
            SELECT * FROM users;
        `)
        res.status(200).send(allUsers)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/products', async (req: Request, res: Response) => {
    try {
        const allProducts = await db.raw(`
            SELECT * FROM products;
        `)
        res.status(200).send(allProducts)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/products/search', async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string
        if (!q) {
            res.status(404)
            throw new Error("'query params' não foi definida")
        }
        const productsByName = await db.raw(`
            SELECT * FROM products 
            WHERE LOWER(name) LIKE LOWER("%${q}%");
        `)
        res.status(200).send(productsByName)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const [product] = await db.raw(`
            SELECT * FROM products 
            WHERE id = "${id}";
        `)
        if (!product) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        res.status(200).send(product)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get('/users/:id/purchases', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const [userId] = await db.raw(`
            SELECT * FROM users 
            WHERE id = "${id}";
        `)
        if (!userId) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        const allPurchasesFromUserId = await db.raw(`
            SELECT * FROM purchases
            INNER JOIN users 
            ON users.id = buyer
            WHERE users.id = "${id}";
        `)
        res.status(200).send(allPurchasesFromUserId)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, email, name, password } = req.body
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        const [userId] = await db.raw(`
            SELECT * FROM users 
            WHERE id = "${id}";
        `)
        if (userId) {
            res.status(400)
            throw new Error("Já existe usuario com ID informada")
        }
        if (!name) {
            res.status(404)
            throw new Error("Name obrigatório para cadastro")
        }
        if (typeof name !== "string") {
            res.status(400)
            throw new Error("Name precisa ser uma string")
        }
        if (!email) {
            res.status(404)
            throw new Error("Email obrigatório para cadastro")
        }
        if (typeof email !== "string") {
            res.status(400)
            throw new Error("Email precisa ser uma string")
        }
        if (!email.match(regexEmail)) {
			throw new Error("Formato de email invalido")
		}
        const [userEmail] = await db.raw(`
            SELECT * FROM users 
            WHERE email = "${email}";
        `)
        if (userEmail) {
            res.status(400)
            throw new Error("Já existe usuario com email informada")
        }
        if (!password) {
            res.status(404)
            throw new Error("Password obrigatório para cadastro")
        }
        if (typeof password !== "string") {
            res.status(400)
            throw new Error("Password precisa ser uma string")
        }
        if (!password.match(regexPassword)) {
			throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}
        await db.raw(`
        INSERT INTO users (id, name, email, password)
        VALUES ("${id}", "${name}", "${email}", "${password}");
        `)
        res.status(201).send('Cadastro realizado com sucesso!')
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post('/products', async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imageUrl } = req.body
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        const [product] = await db.raw(`
            SELECT * FROM products 
            WHERE id = "${id}";
        `)
        if (product) {
            res.status(400);
            throw new Error("Já existe produto com ID informada");
        }
        if (!name) {
            res.status(404)
            throw new Error("Nome do produto obrigatório para cadastro")
        }
        if (typeof name !== "string") {
            res.status(400)
            throw new Error("Nome do produto precisa ser uma string")
        }
        if (!price) {
            res.status(404)
            throw new Error("Preço do produto obrigatório para cadastro")
        }
        if (typeof price !== "number") {
            res.status(400)
            throw new Error("Preço do produto precisa ser um number")
        }
        if (!description) {
            res.status(404)
            throw new Error("Descrição do produto obrigatório para cadastro")
        }
        if (typeof description !== "string") {
            res.status(400)
            throw new Error("Descrição do produto precisa ser uma string")
        }
        if (typeof imageUrl !== "string") {
            res.status(400)
            throw new Error("URL de imagem do produto precisa ser uma string")
        }
        await db.raw(`
        INSERT INTO products (id, name, price, description, imageUrl)
        VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}");
        `)
        res.status(201).send('Produto cadastrado com sucesso!')
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { id, buyer, total_price } = req.body
        if (!id) {
            res.status(404)
            throw new Error("ID obrigatória para cadastro")
        }
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("ID precisa ser uma string")
        }
        const purchase = await db.raw(`
            SELECT * FROM purchases 
            WHERE id = "${id}";
        `)
        if (purchase) {
            res.status(400);
            throw new Error("Já existe compra com ID informada");
        }
        if (!buyer) {
            res.status(404)
            throw new Error("ID do usuario obrigatória para compra")
        }
        if (typeof buyer !== "string") {
            res.status(400)
            throw new Error("ID do usuario precisa ser uma string")
        }
        const [userId] = await db.raw(`
            SELECT * FROM users 
            WHERE id = "${buyer}";
        `)
        if (!userId) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        if (!total_price) {
            res.status(404)
            throw new Error("Preço do produto obrigatório para cadastro")
        }
        if (typeof total_price !== "number") {
            res.status(400)
            throw new Error("Preço do produto precisa ser um number")
        }
        await db.raw(`
            INSERT INTO purchases (id, buyer, total_price)
            VALUES ("${id}", "${buyer}", ${total_price});
        `)
        res.status(201).send('Compra realizada com sucesso!')
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!getUsertById(id)) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        deleteUserById(id)
        res.status(200).send("Usuário desligado com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        if (!getProductById(id)) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        deleteProductById(id)
        res.status(200).send("Produto desligado com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const newEmail = req.body.email
        const newPassword = req.body.password
        if (!getUsertById(id)) {
            res.status(400)
            throw new Error("ID do usuario informada não foi encontrado")
        }
        if (typeof newEmail !== "string" && newEmail) {
            res.status(400)
            throw new Error("Email precisa ser uma string")
        }
        users.map((user) => {
            if (user.email === newEmail) {
                res.status(400);
                throw new Error("Já existe usuario com email informada");
            }
        })
        if (typeof newPassword !== "string" && newPassword) {
            res.status(400)
            throw new Error("Password precisa ser uma string")
        }
        editUserById(id, newEmail, newPassword)
        res.status(200).send("Cadastro atualizado com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const newName = req.body.name
        const newPrice = req.body.price as number | undefined
        const newCategory = req.body.category as CATEGORY | undefined
        if (!getProductById(id)) {
            res.status(400)
            throw new Error("ID do produto informada não foi encontrado")
        }
        if (typeof newName !== "string" && newName) {
            res.status(400)
            throw new Error("Nome do produto precisa ser uma string")
        }
        if (typeof newPrice !== "number" && newPrice) {
            res.status(400)
            throw new Error("Preço do produto precisa ser um number")
        }
        if (typeof newCategory !== "string") {
            res.status(400)
            throw new Error("Categoria do produto precisa ser uma string")
        }
        if (newCategory !== CATEGORY.FUTEBOL && newCategory !== CATEGORY.FUTVOLEI && newCategory !== CATEGORY.BASQUETE && newCategory) {
            res.status(400)
            throw new Error(`Categoria do produto invalida \nCategorias validas são:\n"${CATEGORY.FUTEBOL}"\n"${CATEGORY.FUTVOLEI}"\n"${CATEGORY.BASQUETE}"`)
        }
        editProductById(id, newName, newPrice, newCategory)
        res.status(200).send("Produto atualizado com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})